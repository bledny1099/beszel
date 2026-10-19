package agent

import (
	"encoding/json"
	"fmt"
	"net"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"
)

// PreFlightSnapshot stores system state before applying package updates so broken upgrades can be automatically rolled back.
type PreFlightSnapshot struct {
	Timestamp     string            `json:"timestamp"`
	ExpectedPorts []int             `json:"expected_ports"`
	ActiveUnits   []string          `json:"active_units"`
	FailedUnits   []string          `json:"failed_units"`
	PackageVers   map[string]string `json:"package_versions"`
}

var validServiceNameRe = regexp.MustCompile(`^[a-zA-Z0-9_.@-]+$`)

// EnforceNoRestartPolicy ensures apt/dpkg and needrestart never automatically reboot the server or terminate active sessions during updates.
func (sc *SecurityCollector) EnforceNoRestartPolicy() {
	aptConf := `DPkg::Options {
   "--force-confdef";
   "--force-confold";
};
APT::Get::Assume-Yes "true";
`
	_ = os.WriteFile("/etc/apt/apt.conf.d/99-beszel-norestart", []byte(aptConf), 0644)

	if _, err := os.Stat("/etc/needrestart/conf.d"); err == nil {
		nrConf := "# Managed by Beszel Security Agent: list only, never auto-restart services or reboot\n$nrconf{restart} = 'l';\n$nrconf{kernelhints} = 0;\n"
		_ = os.WriteFile("/etc/needrestart/conf.d/99-beszel-norestart.conf", []byte(nrConf), 0644)
	}
}

// TakePreFlightSnapshot captures running systemd units, listening ports, and backs up cached .deb archives before an upgrade.
func (sc *SecurityCollector) TakePreFlightSnapshot(packages []string) (*PreFlightSnapshot, error) {
	_ = os.MkdirAll(sc.Config.StateDir, 0700)
	snap := &PreFlightSnapshot{
		Timestamp:     time.Now().UTC().Format(time.RFC3339),
		ExpectedPorts: sc.Config.ExpectedPorts,
		PackageVers:   make(map[string]string),
	}

	if len(snap.ExpectedPorts) == 0 {
		for _, p := range sc.collectOpenPorts() {
			if portNum, ok := p["port"].(int); ok && sc.isProtectedPort(portNum) {
				snap.ExpectedPorts = append(snap.ExpectedPorts, portNum)
			}
		}
	}

	if out, err := execCommand("systemctl list-units --type=service --state=failed --no-pager --no-legend 2>/dev/null"); err == nil {
		for _, line := range strings.Split(strings.TrimSpace(out), "\n") {
			fields := strings.Fields(line)
			if len(fields) > 0 {
				snap.FailedUnits = append(snap.FailedUnits, fields[0])
			}
		}
	}

	for _, pkg := range packages {
		if out, err := execCommand(fmt.Sprintf("dpkg-query -W -f='${Version}' %s 2>/dev/null", pkg)); err == nil && strings.TrimSpace(out) != "" {
			snap.PackageVers[pkg] = strings.TrimSpace(out)
		}
	}

	rollbackDir := filepath.Join(sc.Config.StateDir, "rollback-debs")
	_ = os.MkdirAll(rollbackDir, 0700)
	_, _ = execCommand(fmt.Sprintf("cp -f /var/cache/apt/archives/*.deb %s/ 2>/dev/null || true", rollbackDir))

	snapBytes, _ := json.MarshalIndent(snap, "", "  ")
	_ = os.WriteFile(filepath.Join(sc.Config.StateDir, "preflight-snapshot.json"), snapBytes, 0600)
	return snap, nil
}

// VerifyPostUpgrade checks config syntax, dpkg consistency, expected listening ports, and newly failed systemd units.
func (sc *SecurityCollector) VerifyPostUpgrade(snap *PreFlightSnapshot) (bool, []string) {
	failures := make([]string, 0)

	if _, err := execCommand("dpkg --audit"); err != nil {
		failures = append(failures, "dpkg --audit reported broken package state")
	}
	if _, err := execCommand("which sshd >/dev/null 2>&1 && sshd -t"); err != nil {
		failures = append(failures, "sshd -t configuration check failed")
	}
	if _, err := execCommand("which nginx >/dev/null 2>&1 && nginx -t"); err != nil {
		failures = append(failures, "nginx -t configuration check failed")
	}

	openMap := make(map[int]bool)
	for _, p := range sc.collectOpenPorts() {
		if portNum, ok := p["port"].(int); ok {
			openMap[portNum] = true
		}
	}
	for _, expPort := range snap.ExpectedPorts {
		if !openMap[expPort] {
			failures = append(failures, fmt.Sprintf("expected port %d is no longer listening", expPort))
		}
	}

	prevFailed := make(map[string]bool)
	for _, u := range snap.FailedUnits {
		prevFailed[u] = true
	}
	if out, err := execCommand("systemctl list-units --type=service --state=failed --no-pager --no-legend 2>/dev/null"); err == nil {
		for _, line := range strings.Split(strings.TrimSpace(out), "\n") {
			fields := strings.Fields(line)
			if len(fields) > 0 && !prevFailed[fields[0]] {
				unit := fields[0]
				_, _ = execCommand(fmt.Sprintf("systemctl restart %s 2>/dev/null", unit))
				if chk, err := execCommand(fmt.Sprintf("systemctl is-active %s 2>/dev/null", unit)); err != nil || strings.TrimSpace(chk) != "active" {
					failures = append(failures, fmt.Sprintf("systemd unit %s entered failed state", unit))
				}
			}
		}
	}

	return len(failures) == 0, failures
}

// RunRollback downgrades packages from the last pre-flight snapshot or cached .deb archives and holds broken packages.
func (sc *SecurityCollector) RunRollback() (map[string]any, error) {
	snapFile := filepath.Join(sc.Config.StateDir, "preflight-snapshot.json")
	var snap PreFlightSnapshot
	if data, err := os.ReadFile(snapFile); err == nil {
		_ = json.Unmarshal(data, &snap)
	}

	restored := make([]string, 0)
	for pkg, ver := range snap.PackageVers {
		cmd := fmt.Sprintf("DEBIAN_FRONTEND=noninteractive apt-get install -y --allow-downgrades -o Dpkg::Options::=--force-confdef -o Dpkg::Options::=--force-confold %s=%s 2>&1", pkg, ver)
		if _, err := execCommand(cmd); err == nil {
			restored = append(restored, fmt.Sprintf("%s=%s", pkg, ver))
			_, _ = execCommand(fmt.Sprintf("apt-mark hold %s 2>/dev/null", pkg))
		}
	}

	if len(restored) == 0 {
		rollbackDir := filepath.Join(sc.Config.StateDir, "rollback-debs")
		if _, err := execCommand(fmt.Sprintf("dpkg -i --force-confdef --force-confold %s/*.deb 2>&1", rollbackDir)); err == nil {
			restored = append(restored, "rollback-debs/*.deb")
		}
	}

	_, _ = execCommand("DEBIAN_FRONTEND=noninteractive dpkg --configure -a 2>/dev/null")
	_ = sc.SendEvent(
		"auto_rollback",
		"critical",
		"Выполнен откат обновления пакетов",
		"Package update rolled back",
		fmt.Sprintf("Восстановлено пакетов: %d", len(restored)),
		fmt.Sprintf("Restored packages: %d", len(restored)),
	)
	return map[string]any{"ok": true, "restored": restored}, nil
}

// RunVulnWatch checks and installs security-only package updates (--vuln-watch, runs every 10 minutes).
func (sc *SecurityCollector) RunVulnWatch() (map[string]any, error) {
	sc.EnforceNoRestartPolicy()
	_, _ = execCommand("apt-get update -qq 2>/dev/null")

	pending := sc.collectPendingSecurityUpdates()
	if len(pending) == 0 {
		report := sc.CollectReport()
		_ = sc.SendReport(report)
		return map[string]any{"ok": true, "patched_count": 0}, nil
	}

	pkgNames := make([]string, 0, len(pending))
	for _, p := range pending {
		if name, ok := p["package"].(string); ok && name != "" {
			pkgNames = append(pkgNames, name)
		}
	}

	snap, _ := sc.TakePreFlightSnapshot(pkgNames)
	installCmd := fmt.Sprintf(
		"DEBIAN_FRONTEND=noninteractive apt-get install -y --only-upgrade -o Dpkg::Options::=--force-confdef -o Dpkg::Options::=--force-confold %s 2>&1",
		strings.Join(pkgNames, " "),
	)
	out, err := execCommand(installCmd)
	if err != nil {
		_, _ = sc.RunRollback()
		return map[string]any{"ok": false, "error": err.Error(), "output": out}, err
	}

	if ok, failures := sc.VerifyPostUpgrade(snap); !ok {
		_, _ = sc.RunRollback()
		return map[string]any{"ok": false, "rolled_back": true, "failures": failures}, fmt.Errorf("post-upgrade verification failed: %s", strings.Join(failures, "; "))
	}

	_ = sc.SendEvent(
		"vuln_patched",
		"info",
		fmt.Sprintf("Установлены патчи безопасности (%d)", len(pkgNames)),
		fmt.Sprintf("Security patches installed (%d)", len(pkgNames)),
		fmt.Sprintf("Обновлены пакеты: %s", strings.Join(pkgNames, ", ")),
		fmt.Sprintf("Updated packages: %s", strings.Join(pkgNames, ", ")),
	)

	report := sc.CollectReport()
	_ = sc.SendReport(report)
	return map[string]any{"ok": true, "patched": pkgNames}, nil
}

// RunFullUpgrade executes the daily 04:00 non-interactive upgrade with pre-flight snapshot and automatic rollback guard.
func (sc *SecurityCollector) RunFullUpgrade() (map[string]any, error) {
	sc.EnforceNoRestartPolicy()
	_, _ = execCommand("apt-get update -qq 2>/dev/null")

	pkgs := make([]string, 0)
	if aptOut, err := execCommand("apt-get -s dist-upgrade 2>/dev/null | grep -i '^Inst '"); err == nil {
		for _, line := range strings.Split(strings.TrimSpace(aptOut), "\n") {
			fields := strings.Fields(line)
			if len(fields) >= 2 {
				pkgs = append(pkgs, fields[1])
			}
		}
	}

	if len(pkgs) > 0 {
		snap, _ := sc.TakePreFlightSnapshot(pkgs)
		upgradeCmd := "DEBIAN_FRONTEND=noninteractive apt-get dist-upgrade -y -o Dpkg::Options::=--force-confdef -o Dpkg::Options::=--force-confold 2>&1"
		if out, err := execCommand(upgradeCmd); err != nil {
			_, _ = sc.RunRollback()
			return map[string]any{"ok": false, "error": err.Error(), "output": out}, err
		}
		if ok, failures := sc.VerifyPostUpgrade(snap); !ok {
			_, _ = sc.RunRollback()
			return map[string]any{"ok": false, "rolled_back": true, "failures": failures}, fmt.Errorf("post-upgrade check failed: %s", strings.Join(failures, "; "))
		}
		_ = sc.SendEvent(
			"auto_update",
			"info",
			fmt.Sprintf("Ночное обновление завершено (%d пакетов)", len(pkgs)),
			fmt.Sprintf("Nightly upgrade completed (%d packages)", len(pkgs)),
			fmt.Sprintf("Обновлены: %s", strings.Join(pkgs, ", ")),
			fmt.Sprintf("Updated: %s", strings.Join(pkgs, ", ")),
		)
	}

	report := sc.CollectReport()
	_ = sc.SendReport(report)
	return map[string]any{"ok": true, "updated_packages": pkgs}, nil
}

// ManagePort opens or closes a UFW firewall port with protected port lock checks.
func (sc *SecurityCollector) ManagePort(action string, port int, proto string) (map[string]any, error) {
	if port < 1 || port > 65535 {
		return nil, fmt.Errorf("invalid port number: %d", port)
	}
	proto = strings.ToLower(strings.TrimSpace(proto))
	if proto == "" {
		proto = "tcp"
	}
	if proto != "tcp" && proto != "udp" {
		return nil, fmt.Errorf("invalid protocol: %s", proto)
	}

	if (action == "close" || action == "delete" || action == "deny") && sc.isProtectedPort(port) {
		return nil, fmt.Errorf("port %d is protected and cannot be closed remotely", port)
	}

	var cmd string
	switch action {
	case "open", "allow":
		cmd = fmt.Sprintf("ufw allow %d/%s", port, proto)
	case "close", "delete", "deny":
		cmd = fmt.Sprintf("ufw --force delete allow %d/%s", port, proto)
	default:
		return nil, fmt.Errorf("unsupported port action: %s", action)
	}

	out, err := execCommand(cmd)
	if err != nil {
		return map[string]any{"ok": false, "error": err.Error(), "output": out}, err
	}

	report := sc.CollectReport()
	_ = sc.SendReport(report)
	return map[string]any{"ok": true, "action": action, "port": port, "proto": proto, "output": strings.TrimSpace(out)}, nil
}

// ManageService starts, stops, restarts, or fetches logs for a systemd unit or Docker container.
func (sc *SecurityCollector) ManageService(action, kind, name string) (map[string]any, error) {
	name = strings.TrimSpace(name)
	if !validServiceNameRe.MatchString(name) {
		return nil, fmt.Errorf("invalid service name: %q", name)
	}
	if kind == "" {
		kind = "systemd"
	}

	var cmd string
	switch kind {
	case "docker":
		switch action {
		case "start", "stop", "restart":
			cmd = fmt.Sprintf("docker %s %s", action, name)
		case "logs":
			cmd = fmt.Sprintf("docker logs --tail 80 %s 2>&1", name)
		default:
			return nil, fmt.Errorf("unsupported docker action: %s", action)
		}
	default:
		if (action == "stop" || action == "delete") && (strings.Contains(name, "ssh") || strings.Contains(name, "beszel")) {
			return nil, fmt.Errorf("critical service %s cannot be stopped remotely", name)
		}
		switch action {
		case "start", "stop", "restart":
			cmd = fmt.Sprintf("systemctl %s %s", action, name)
		case "logs":
			cmd = fmt.Sprintf("journalctl -u %s -n 80 --no-pager 2>&1", name)
		default:
			return nil, fmt.Errorf("unsupported systemd action: %s", action)
		}
	}

	out, err := execCommand(cmd)
	if err != nil && action != "logs" {
		return map[string]any{"ok": false, "error": err.Error(), "output": out}, err
	}

	if action != "logs" {
		report := sc.CollectReport()
		_ = sc.SendReport(report)
	}
	return map[string]any{"ok": true, "action": action, "kind": kind, "service": name, "logs": out}, nil
}

// ManageFail2ban bans or unbans an IP address in a Fail2ban jail.
func (sc *SecurityCollector) ManageFail2ban(action, ipAddr, jail string) (map[string]any, error) {
	if net.ParseIP(strings.TrimSpace(ipAddr)) == nil {
		return nil, fmt.Errorf("invalid IP address: %q", ipAddr)
	}
	if jail == "" || !validServiceNameRe.MatchString(jail) {
		jail = "sshd"
	}

	var cmd string
	switch action {
	case "ban":
		cmd = fmt.Sprintf("fail2ban-client set %s banip %s", jail, ipAddr)
	case "unban":
		cmd = fmt.Sprintf("fail2ban-client set %s unbanip %s", jail, ipAddr)
	default:
		return nil, fmt.Errorf("unsupported fail2ban action: %s", action)
	}

	out, err := execCommand(cmd)
	if err != nil {
		return map[string]any{"ok": false, "error": err.Error(), "output": out}, err
	}

	report := sc.CollectReport()
	_ = sc.SendReport(report)
	return map[string]any{"ok": true, "action": action, "ip": ipAddr, "jail": jail, "output": strings.TrimSpace(out)}, nil
}

// RunDockerPrune removes unused Docker containers, networks, and dangling images.
func (sc *SecurityCollector) RunDockerPrune() (map[string]any, error) {
	out, err := execCommand("docker system prune -af 2>&1")
	report := sc.CollectReport()
	_ = sc.SendReport(report)
	if err != nil {
		return map[string]any{"ok": false, "error": err.Error(), "output": out}, err
	}
	return map[string]any{"ok": true, "output": strings.TrimSpace(out)}, nil
}

// RunDiskCleanup vacuums systemd journal logs, cleans apt cache, and prunes dangling Docker layers.
func (sc *SecurityCollector) RunDiskCleanup() (map[string]any, error) {
	_, _ = execCommand("journalctl --vacuum-time=7d --vacuum-size=200M 2>/dev/null")
	_, _ = execCommand("apt-get clean 2>/dev/null && apt-get autoremove -y 2>/dev/null")
	_, _ = execCommand("docker builder prune -af 2>/dev/null")
	report := sc.CollectReport()
	_ = sc.SendReport(report)
	return map[string]any{"ok": true, "status": "cleaned"}, nil
}

// RunSpeedtest measures bandwidth using speedtest-cli or curl fallback and caches the result.
func (sc *SecurityCollector) RunSpeedtest() (map[string]any, error) {
	_ = os.MkdirAll(sc.Config.StateDir, 0700)
	result := map[string]any{
		"timestamp": time.Now().UTC().Format("2006-01-02 15:04 UTC"),
		"status":    "ok",
	}

	if out, err := execCommand("speedtest-cli --simple 2>/dev/null"); err == nil && strings.TrimSpace(out) != "" {
		for _, line := range strings.Split(out, "\n") {
			if strings.HasPrefix(line, "Ping:") {
				result["ping"] = strings.TrimSpace(strings.TrimPrefix(line, "Ping:"))
			} else if strings.HasPrefix(line, "Download:") {
				result["download"] = strings.TrimSpace(strings.TrimPrefix(line, "Download:"))
			} else if strings.HasPrefix(line, "Upload:") {
				result["upload"] = strings.TrimSpace(strings.TrimPrefix(line, "Upload:"))
			}
		}
	}

	stBytes, _ := json.MarshalIndent(result, "", "  ")
	_ = os.WriteFile(filepath.Join(sc.Config.StateDir, "speedtest-cache.json"), stBytes, 0600)

	report := sc.CollectReport()
	_ = sc.SendReport(report)
	return result, nil
}

// RunSecurityCLI executes security agent actions from CLI flags (e.g., --telemetry, --vuln-watch, --rollback, --port-action, --service-action, --f2b-action).
func RunSecurityCLI(args []string) {
	sc := NewSecurityCollector("", "", "", "")
	enc := json.NewEncoder(os.Stdout)
	enc.SetIndent("", "  ")

	if len(args) > 0 {
		switch args[0] {
		case "--vuln-watch":
			res, _ := sc.RunVulnWatch()
			_ = enc.Encode(res)
			return
		case "--full", "--full-upgrade":
			res, _ := sc.RunFullUpgrade()
			_ = enc.Encode(res)
			return
		case "--rollback":
			res, _ := sc.RunRollback()
			_ = enc.Encode(res)
			return
		case "--docker-prune":
			res, _ := sc.RunDockerPrune()
			_ = enc.Encode(res)
			return
		case "--disk-cleanup":
			res, _ := sc.RunDiskCleanup()
			_ = enc.Encode(res)
			return
		case "--speedtest":
			res, _ := sc.RunSpeedtest()
			_ = enc.Encode(res)
			return
		case "--port-action":
			if len(args) >= 4 {
				port, _ := strconv.Atoi(args[2])
				res, _ := sc.ManagePort(args[1], port, args[3])
				_ = enc.Encode(res)
				return
			}
		case "--service-action":
			if len(args) >= 4 {
				res, _ := sc.ManageService(args[1], args[2], args[3])
				_ = enc.Encode(res)
				return
			}
		case "--f2b-action":
			if len(args) >= 4 {
				res, _ := sc.ManageFail2ban(args[1], args[2], args[3])
				_ = enc.Encode(res)
				return
			}
		}
	}

	report := sc.CollectReport()
	if sc.HubURL != "" {
		if err := sc.SendReport(report); err != nil {
			fmt.Fprintf(os.Stderr, "Failed to send security report to Hub: %v\n", err)
			os.Exit(1)
		}
		fmt.Println("Security report successfully synced with Hub")
	} else {
		_ = enc.Encode(report)
	}
}

