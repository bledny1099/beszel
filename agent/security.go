package agent

import (
	"bytes"
	"context"
	"crypto/sha256"
	"crypto/tls"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"
)

const (
	DefaultSecurityConfigPath = "/etc/beszel-security/config.json"
	DefaultSecurityStateDir   = "/var/lib/beszel-security"
)

// SecurityConfig holds per-node security agent configuration loaded from /etc/beszel-security/config.json or environment variables.
type SecurityConfig struct {
	SystemID          string   `json:"system_id"`
	SystemName        string   `json:"system_name"`
	HubURL            string   `json:"hub_url"`
	Token             string   `json:"token"`
	Profile           string   `json:"profile"`
	ProtectedPorts    []int    `json:"protected_ports"`
	ExpectedPorts     []int    `json:"expected_ports"`
	Domains           []string `json:"domains"`
	DockerComposeDirs []string `json:"docker_compose_dirs"`
	StateDir          string   `json:"state_dir"`
}

// SecurityCheck represents one of the 8 core security checks in the audit report.
type SecurityCheck struct {
	ID      string         `json:"id"`
	Name    string         `json:"name"`
	NameRu  string         `json:"name_ru"`
	NameEn  string         `json:"name_en"`
	Status  string         `json:"status"` // "ok", "warn", "crit"
	Summary string         `json:"summary"`
	Details map[string]any `json:"details,omitempty"`
}

// SecurityCollector gathers security checks, telemetry, stack services, and domain health.
type SecurityCollector struct {
	Config     SecurityConfig
	SystemID   string
	SystemName string
	HubURL     string
	Token      string
}

// LoadSecurityConfig loads configuration from /etc/beszel-security/config.json and overrides with environment variables.
func LoadSecurityConfig(sysID, sysName, hubURL, token string) SecurityConfig {
	cfg := SecurityConfig{
		Profile:        "standard",
		ProtectedPorts: []int{22, 2244, 8090, 45876},
		StateDir:       DefaultSecurityStateDir,
	}

	cfgPath := os.Getenv("BESZEL_SECURITY_CONFIG")
	if cfgPath == "" {
		cfgPath = DefaultSecurityConfigPath
	}
	if data, err := os.ReadFile(cfgPath); err == nil {
		_ = json.Unmarshal(data, &cfg)
	}

	if sysID != "" {
		cfg.SystemID = sysID
	} else if envID := os.Getenv("SYSTEM_ID"); envID != "" {
		cfg.SystemID = envID
	}
	if sysName != "" {
		cfg.SystemName = sysName
	} else if envName := os.Getenv("SYSTEM_NAME"); envName != "" {
		cfg.SystemName = envName
	}
	if cfg.SystemName == "" {
		cfg.SystemName, _ = os.Hostname()
	}
	if cfg.SystemID == "" {
		cfg.SystemID = cfg.SystemName
	}
	if hubURL != "" {
		cfg.HubURL = hubURL
	} else if envHub := os.Getenv("HUB_URL"); envHub != "" {
		cfg.HubURL = envHub
	}
	if token != "" {
		cfg.Token = token
	} else if envTok := os.Getenv("SECURITY_TOKEN"); envTok != "" {
		cfg.Token = envTok
	}
	if len(cfg.ProtectedPorts) == 0 {
		cfg.ProtectedPorts = []int{22, 2244, 8090, 45876}
	}
	if cfg.StateDir == "" {
		cfg.StateDir = DefaultSecurityStateDir
	}
	return cfg
}

// NewSecurityCollector creates a new security collector instance.
func NewSecurityCollector(sysID, sysName, hubURL, token string) *SecurityCollector {
	cfg := LoadSecurityConfig(sysID, sysName, hubURL, token)
	return &SecurityCollector{
		Config:     cfg,
		SystemID:   cfg.SystemID,
		SystemName: cfg.SystemName,
		HubURL:     cfg.HubURL,
		Token:      cfg.Token,
	}
}

// CollectReport gathers all 8 core checks, 4 system health indicators, stack services, Docker stats, and SSL/network telemetry.
func (sc *SecurityCollector) CollectReport() map[string]any {
	hostname, _ := os.Hostname()
	primaryIP := getPrimaryOutboundIP()

	openPorts := sc.collectOpenPorts()
	ufwInfo := sc.collectUFWStatus()
	sshF2b := sc.collectSSHFail2ban()
	services := sc.collectRunningServices()
	vulns := sc.collectPendingSecurityUpdates()

	inodesInfo := sc.collectInodeUsage()
	diskTrend := sc.collectDiskTrend()
	cpuSteal := sc.collectCPUSteal()
	oomReboot := sc.collectOOMAndReboot()

	checks := []SecurityCheck{
		sc.checkSSHAndAuth(sshF2b),
		sc.checkFirewall(ufwInfo),
		sc.checkFail2ban(sshF2b),
		sc.checkOpenPorts(openPorts, ufwInfo),
		sc.checkUsersAndPrivileges(),
		sc.checkProcessesAndIntegrity(),
		sc.checkCronAndTimers(),
		sc.checkKernelAndResources(inodesInfo),
	}

	overall := "ok"
	for _, c := range checks {
		if c.Status == "crit" {
			overall = "crit"
			break
		}
		if c.Status == "warn" && overall == "ok" {
			overall = "warn"
		}
	}

	report := map[string]any{
		"system_id":          sc.SystemID,
		"system_name":        sc.SystemName,
		"hostname":           hostname,
		"ip":                 primaryIP,
		"profile":            sc.Config.Profile,
		"timestamp":          time.Now().UTC().Format(time.RFC3339),
		"overall_status":     overall,
		"checks":             checks,
		"inodes":             inodesInfo,
		"disk_trend":         diskTrend,
		"cpu_steal":          cpuSteal,
		"oom_reboot":         oomReboot,
		"open_ports":         openPorts,
		"active_connections": sc.collectActiveConnections(),
		"port_security":      sc.evaluatePortSecurity(openPorts, ufwInfo),
		"ssh_fail2ban":       sshF2b,
		"services":           services,
		"stack_status":       map[string]any{"services": services},
		"docker_storage":     sc.collectDockerStorage(),
		"ssl_domains":        sc.collectSSLDomains(),
		"network_health":     sc.collectNetworkHealth(),
		"vulnerabilities":    vulns,
		"cve_watch": map[string]any{
			"pending_count": len(vulns),
			"pending":       vulns,
			"last_checked":  time.Now().UTC().Format("2006-01-02 15:04 UTC"),
		},
	}
	return report
}

// SendReport posts the collected security report to the Beszel Hub.
func (sc *SecurityCollector) SendReport(report map[string]any) error {
	if sc.HubURL == "" {
		return fmt.Errorf("hub URL is not configured")
	}

	endpoint := strings.TrimRight(sc.HubURL, "/") + "/api/security-report"
	bodyBytes, err := json.Marshal(report)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json; charset=utf-8")
	if sc.Token != "" {
		req.Header.Set("X-Beszel-Security-Token", sc.Token)
	}

	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("hub returned status code: %d", resp.StatusCode)
	}
	return nil
}

// SendEvent posts a real-time security event notification to the Beszel Hub.
func (sc *SecurityCollector) SendEvent(evType, severity, titleRu, titleEn, summaryRu, summaryEn string) error {
	if sc.HubURL == "" {
		return nil
	}
	endpoint := strings.TrimRight(sc.HubURL, "/") + "/api/security-event"
	payload := map[string]any{
		"system_id":   sc.SystemID,
		"system_name": sc.SystemName,
		"type":        evType,
		"severity":    severity,
		"timestamp":   time.Now().UTC().Format("2006-01-02 15:04:05 UTC"),
		"title_ru":    titleRu,
		"title_en":    titleEn,
		"summary_ru":  summaryRu,
		"summary_en":  summaryEn,
	}
	bodyBytes, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	req, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json; charset=utf-8")
	if sc.Token != "" {
		req.Header.Set("X-Beszel-Security-Token", sc.Token)
	}
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	return nil
}

// StartSecurityAuditLoop periodically collects and sends security telemetry to the Hub.
func (sc *SecurityCollector) StartSecurityAuditLoop(ctx context.Context, interval time.Duration) {
	if interval < 5*time.Minute {
		interval = 10 * time.Minute
	}

	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	go func() {
		report := sc.CollectReport()
		if err := sc.SendReport(report); err != nil {
			slog.Debug("Initial security report send failed", "err", err)
		} else {
			slog.Info("Initial security report synced with Hub")
		}
	}()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			report := sc.CollectReport()
			if err := sc.SendReport(report); err != nil {
				slog.Debug("Periodic security report send failed", "err", err)
			}
		}
	}
}

// --- 8 Core Security Checks ---

func (sc *SecurityCollector) checkSSHAndAuth(sshF2b map[string]any) SecurityCheck {
	status := "ok"
	passAuth := "no"
	if out, err := execCommand("sshd -T 2>/dev/null | grep -i '^passwordauthentication '"); err == nil && strings.TrimSpace(out) != "" {
		fields := strings.Fields(strings.ToLower(strings.TrimSpace(out)))
		if len(fields) >= 2 {
			passAuth = fields[1]
		}
	}

	keyCount := 0
	keyHash := ""
	if data, err := os.ReadFile("/root/.ssh/authorized_keys"); err == nil {
		for _, line := range strings.Split(string(data), "\n") {
			l := strings.TrimSpace(line)
			if l != "" && !strings.HasPrefix(l, "#") {
				keyCount++
			}
		}
		sum := sha256.Sum256(data)
		keyHash = hex.EncodeToString(sum[:8])
	}

	failed24h, _ := sshF2b["failed_24h"].(int)
	if passAuth == "yes" {
		status = "warn"
	}
	if failed24h > 500 && status == "ok" {
		status = "warn"
	}

	summary := fmt.Sprintf("PasswordAuth=%s, keys=%d, failed_24h=%d", passAuth, keyCount, failed24h)
	return SecurityCheck{
		ID:      "ssh_auth",
		Name:    "SSH & Auth",
		NameRu:  "SSH и авторизация",
		NameEn:  "SSH & Auth",
		Status:  status,
		Summary: summary,
		Details: map[string]any{
			"password_authentication": passAuth,
			"authorized_keys_count":   keyCount,
			"authorized_keys_sha256":  keyHash,
			"failed_24h":              failed24h,
		},
	}
}

func (sc *SecurityCollector) checkFirewall(ufwInfo map[string]any) SecurityCheck {
	active, _ := ufwInfo["active"].(bool)
	rulesCount, _ := ufwInfo["rules_count"].(int)
	status := "ok"
	summary := fmt.Sprintf("UFW active (%d rules)", rulesCount)
	if !active {
		status = "warn"
		summary = "UFW inactive"
	}
	return SecurityCheck{
		ID:      "firewall",
		Name:    "Firewall (UFW)",
		NameRu:  "Межсетевой экран",
		NameEn:  "Firewall (UFW)",
		Status:  status,
		Summary: summary,
		Details: ufwInfo,
	}
}

func (sc *SecurityCollector) checkFail2ban(sshF2b map[string]any) SecurityCheck {
	active, _ := sshF2b["active"].(bool)
	banned, _ := sshF2b["banned_ips"].([]string)
	status := "ok"
	summary := fmt.Sprintf("Active, %d banned IPs", len(banned))
	if !active {
		status = "warn"
		summary = "Fail2ban service not active"
	}
	return SecurityCheck{
		ID:      "fail2ban",
		Name:    "Fail2ban",
		NameRu:  "Защита Fail2ban",
		NameEn:  "Fail2ban",
		Status:  status,
		Summary: summary,
		Details: map[string]any{
			"active":       active,
			"banned_count": len(banned),
		},
	}
}

func (sc *SecurityCollector) checkOpenPorts(openPorts []map[string]any, ufwInfo map[string]any) SecurityCheck {
	publicCount := 0
	for _, p := range openPorts {
		if pub, ok := p["public"].(bool); ok && pub {
			publicCount++
		}
	}
	return SecurityCheck{
		ID:      "open_ports",
		Name:    "Listening Ports",
		NameRu:  "Открытые порты",
		NameEn:  "Listening Ports",
		Status:  "ok",
		Summary: fmt.Sprintf("%d listening (%d public)", len(openPorts), publicCount),
		Details: map[string]any{
			"total":  len(openPorts),
			"public": publicCount,
		},
	}
}

func (sc *SecurityCollector) checkUsersAndPrivileges() SecurityCheck {
	uid0Users := []string{}
	if data, err := os.ReadFile("/etc/passwd"); err == nil {
		for _, line := range strings.Split(string(data), "\n") {
			parts := strings.Split(line, ":")
			if len(parts) >= 3 && parts[2] == "0" {
				uid0Users = append(uid0Users, parts[0])
			}
		}
	}
	status := "ok"
	if len(uid0Users) > 1 || (len(uid0Users) == 1 && uid0Users[0] != "root") {
		status = "crit"
	}
	return SecurityCheck{
		ID:      "users_priv",
		Name:    "Users & Privileges",
		NameRu:  "Пользователи и права",
		NameEn:  "Users & Privileges",
		Status:  status,
		Summary: fmt.Sprintf("UID 0: %s", strings.Join(uid0Users, ", ")),
		Details: map[string]any{
			"uid0_users": uid0Users,
		},
	}
}

func (sc *SecurityCollector) checkProcessesAndIntegrity() SecurityCheck {
	suspicious := []string{}
	entries, _ := os.ReadDir("/proc")
	for _, ent := range entries {
		if !ent.IsDir() {
			continue
		}
		if _, err := strconv.Atoi(ent.Name()); err != nil {
			continue
		}
		exePath, err := os.Readlink(filepath.Join("/proc", ent.Name(), "exe"))
		if err == nil {
			if strings.HasPrefix(exePath, "/tmp/") || strings.HasPrefix(exePath, "/var/tmp/") || strings.HasPrefix(exePath, "/dev/shm/") {
				suspicious = append(suspicious, fmt.Sprintf("pid %s: %s", ent.Name(), exePath))
			}
		}
	}
	status := "ok"
	summary := "No suspicious processes in /tmp or /dev/shm"
	if len(suspicious) > 0 {
		status = "crit"
		summary = fmt.Sprintf("%d suspicious process(es) detected", len(suspicious))
	}
	return SecurityCheck{
		ID:      "processes_integrity",
		Name:    "Process Integrity",
		NameRu:  "Целостность процессов",
		NameEn:  "Process Integrity",
		Status:  status,
		Summary: summary,
		Details: map[string]any{
			"suspicious_processes": suspicious,
		},
	}
}

func (sc *SecurityCollector) checkCronAndTimers() SecurityCheck {
	timerActive := false
	if out, err := execCommand("systemctl is-active beszel-security-audit.timer 2>/dev/null"); err == nil && strings.TrimSpace(out) == "active" {
		timerActive = true
	}
	return SecurityCheck{
		ID:      "cron_timers",
		Name:    "Cron & Timers",
		NameRu:  "Планировщик и таймеры",
		NameEn:  "Cron & Timers",
		Status:  "ok",
		Summary: fmt.Sprintf("audit_timer=%v", timerActive),
		Details: map[string]any{
			"audit_timer_active": timerActive,
		},
	}
}

func (sc *SecurityCollector) checkKernelAndResources(inodesInfo map[string]any) SecurityCheck {
	aslr := strings.TrimSpace(readFileString("/proc/sys/kernel/randomize_va_space"))
	syncookies := strings.TrimSpace(readFileString("/proc/sys/net/ipv4/tcp_syncookies"))
	status := "ok"
	if aslr != "" && aslr != "2" {
		status = "warn"
	}
	if inodeStatus, _ := inodesInfo["status"].(string); inodeStatus == "crit" {
		status = "crit"
	} else if inodeStatus == "warn" && status == "ok" {
		status = "warn"
	}
	return SecurityCheck{
		ID:      "kernel_sysctl",
		Name:    "Kernel & Sysctl",
		NameRu:  "Ядро и sysctl",
		NameEn:  "Kernel & Sysctl",
		Status:  status,
		Summary: fmt.Sprintf("ASLR=%s, syncookies=%s", aslr, syncookies),
		Details: map[string]any{
			"aslr":       aslr,
			"syncookies": syncookies,
		},
	}
}

// --- 4 System Health Indicators ---

func (sc *SecurityCollector) collectInodeUsage() map[string]any {
	pct := 0
	if out, err := execCommand("df -i / 2>/dev/null | tail -n 1"); err == nil {
		fields := strings.Fields(out)
		if len(fields) >= 5 {
			rawPct := strings.TrimSuffix(fields[4], "%")
			pct, _ = strconv.Atoi(rawPct)
		}
	}
	status := "ok"
	if pct >= 90 {
		status = "crit"
	} else if pct >= 80 {
		status = "warn"
	}
	return map[string]any{
		"status":   status,
		"used_pct": pct,
	}
}

func (sc *SecurityCollector) collectDiskTrend() map[string]any {
	usedMB := 0.0
	freeMB := 0.0
	if out, err := execCommand("df -BM / 2>/dev/null | tail -n 1"); err == nil {
		fields := strings.Fields(out)
		if len(fields) >= 4 {
			u, _ := strconv.ParseFloat(strings.TrimSuffix(fields[2], "M"), 64)
			f, _ := strconv.ParseFloat(strings.TrimSuffix(fields[3], "M"), 64)
			usedMB = u
			freeMB = f
		}
	}
	return map[string]any{
		"status":          "ok",
		"used_mb":         usedMB,
		"free_mb":         freeMB,
		"growth_mb_day":   0.0,
		"days_until_full": 999,
	}
}

func (sc *SecurityCollector) collectCPUSteal() map[string]any {
	stealPct := 0.0
	if data, err := os.ReadFile("/proc/stat"); err == nil {
		lines := strings.Split(string(data), "\n")
		if len(lines) > 0 && strings.HasPrefix(lines[0], "cpu ") {
			fields := strings.Fields(lines[0])[1:]
			if len(fields) >= 8 {
				var total float64
				for _, f := range fields {
					v, _ := strconv.ParseFloat(f, 64)
					total += v
				}
				steal, _ := strconv.ParseFloat(fields[7], 64)
				if total > 0 {
					stealPct = (steal / total) * 100.0
				}
			}
		}
	}
	status := "ok"
	if stealPct >= 20 {
		status = "crit"
	} else if stealPct >= 10 {
		status = "warn"
	}
	return map[string]any{
		"status":    status,
		"steal_pct": stealPct,
	}
}

func (sc *SecurityCollector) collectOOMAndReboot() map[string]any {
	oomCount := 0
	if out, err := execCommand("journalctl -k --since '7 days ago' --no-pager 2>/dev/null | grep -ciE 'Out of memory|Killed process'"); err == nil {
		oomCount, _ = strconv.Atoi(strings.TrimSpace(out))
	}
	bootID := strings.TrimSpace(readFileString("/proc/sys/kernel/random/boot_id"))
	status := "ok"
	if oomCount > 0 {
		status = "warn"
	}
	return map[string]any{
		"status":         status,
		"oom_kills_7d":   oomCount,
		"boot_id":        bootID,
		"reboot_changed": false,
	}
}

// --- Network, Ports, Firewall, SSL & Services Collectors ---

func (sc *SecurityCollector) collectUFWStatus() map[string]any {
	res := map[string]any{
		"active":       false,
		"rules_count":  0,
		"allowed_list": []int{},
	}
	out, err := execCommand("ufw status numbered 2>/dev/null")
	if err != nil {
		return res
	}
	if strings.Contains(out, "Status: active") {
		res["active"] = true
	}
	allowed := make([]int, 0)
	ruleRe := regexp.MustCompile(`\[\s*\d+\]\s+(\d+)(?:/(tcp|udp))?\s+ALLOW`)
	for _, line := range strings.Split(out, "\n") {
		m := ruleRe.FindStringSubmatch(line)
		if len(m) >= 2 {
			p, _ := strconv.Atoi(m[1])
			if p > 0 {
				allowed = append(allowed, p)
			}
		}
	}
	res["rules_count"] = len(allowed)
	res["allowed_list"] = allowed
	return res
}

func (sc *SecurityCollector) collectOpenPorts() []map[string]any {
	ports := make([]map[string]any, 0)
	seen := make(map[string]bool)

	out, err := execCommand("ss -H -tulpn 2>/dev/null || netstat -tulnp 2>/dev/null")
	if err != nil || strings.TrimSpace(out) == "" {
		return ports
	}

	lines := strings.Split(out, "\n")
	addrPortRe := regexp.MustCompile(`(\S+):(\d+)\s+`)
	procRe := regexp.MustCompile(`users:\(\("([^"]+)"`)

	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" || strings.HasPrefix(line, "Proto") || strings.HasPrefix(line, "Netid") {
			continue
		}

		proto := "tcp"
		if strings.HasPrefix(line, "udp") || strings.Contains(line, "UDP") {
			proto = "udp"
		}

		match := addrPortRe.FindStringSubmatch(line)
		if len(match) < 3 {
			continue
		}

		bindAddr := match[1]
		portNum, _ := strconv.Atoi(match[2])
		if portNum <= 0 || portNum > 65535 {
			continue
		}

		key := fmt.Sprintf("%d/%s", portNum, proto)
		if seen[key] {
			continue
		}
		seen[key] = true

		procName := ""
		if pm := procRe.FindStringSubmatch(line); len(pm) >= 2 {
			procName = pm[1]
		}
		if procName == "" {
			procName = guessServiceName(portNum)
		}

		isPublic := !strings.HasPrefix(bindAddr, "127.") && bindAddr != "::1" && !strings.HasPrefix(bindAddr, "100.")
		ports = append(ports, map[string]any{
			"port":      portNum,
			"proto":     proto,
			"bind":      bindAddr,
			"public":    isPublic,
			"process":   procName,
			"service":   guessServiceName(portNum),
			"protected": sc.isProtectedPort(portNum),
			"state":     "LISTEN",
		})
	}

	return ports
}

func (sc *SecurityCollector) isProtectedPort(port int) bool {
	for _, p := range sc.Config.ProtectedPorts {
		if p == port {
			return true
		}
	}
	return false
}

func (sc *SecurityCollector) collectActiveConnections() []map[string]any {
	conns := make([]map[string]any, 0)
	out, err := execCommand("ss -H -tn state established 2>/dev/null | head -n 30")
	if err != nil {
		return conns
	}

	lines := strings.Split(strings.TrimSpace(out), "\n")
	for _, l := range lines {
		fields := strings.Fields(l)
		if len(fields) >= 4 {
			conns = append(conns, map[string]any{
				"local":  fields[2],
				"remote": fields[3],
				"state":  "ESTABLISHED",
			})
		}
	}
	return conns
}

func (sc *SecurityCollector) collectSSHFail2ban() map[string]any {
	result := map[string]any{
		"active":        false,
		"banned_ips":    []string{},
		"recent_logins": []map[string]any{},
		"failed_24h":    0,
	}

	if f2bOut, err := execCommand("fail2ban-client status sshd 2>/dev/null"); err == nil {
		result["active"] = true
		if idx := strings.Index(f2bOut, "Banned IP list:"); idx != -1 {
			rawList := strings.TrimSpace(f2bOut[idx+len("Banned IP list:"):])
			ips := strings.Fields(rawList)
			result["banned_ips"] = ips
		}
	}

	if failOut, err := execCommand("journalctl -u ssh -u sshd --since '24 hours ago' --no-pager 2>/dev/null | grep -ci 'Failed password'"); err == nil {
		cnt, _ := strconv.Atoi(strings.TrimSpace(failOut))
		result["failed_24h"] = cnt
	}

	authCmd := "journalctl -u ssh -u sshd -n 40 --no-pager 2>/dev/null || tail -n 40 /var/log/auth.log 2>/dev/null"
	if authOut, err := execCommand(authCmd); err == nil {
		logins := make([]map[string]any, 0)
		lines := strings.Split(authOut, "\n")
		acceptedRegex := regexp.MustCompile(`Accepted\s+(\w+)\s+for\s+(\w+)\s+from\s+([0-9a-fA-F\.\:]+)`)

		for _, l := range lines {
			m := acceptedRegex.FindStringSubmatch(l)
			if len(m) == 4 {
				logins = append(logins, map[string]any{
					"method":    m[1],
					"user":      m[2],
					"ip":        m[3],
					"last_seen": time.Now().UTC().Format("2006-01-02 15:04:05"),
					"count":     1,
				})
			}
		}
		result["recent_logins"] = logins
	}

	return result
}

func (sc *SecurityCollector) collectRunningServices() []map[string]any {
	services := make([]map[string]any, 0)
	seen := make(map[string]bool)

	if dOut, err := execCommand("docker ps --format '{{.Names}}|{{.Image}}|{{.Status}}' 2>/dev/null"); err == nil {
		lines := strings.Split(strings.TrimSpace(dOut), "\n")
		for _, l := range lines {
			parts := strings.Split(l, "|")
			if len(parts) >= 3 {
				cName := strings.TrimSpace(parts[0])
				if cName != "" && !seen[cName] {
					seen[cName] = true
					services = append(services, map[string]any{
						"id":     cName,
						"name":   cName,
						"unit":   cName,
						"kind":   "docker",
						"cat":    "containers",
						"type":   "docker",
						"status": "running",
						"image":  strings.TrimSpace(parts[1]),
					})
				}
			}
		}
	}

	if sOut, err := execCommand("systemctl list-units --type=service --state=running --no-pager --no-legend 2>/dev/null"); err == nil {
		lines := strings.Split(strings.TrimSpace(sOut), "\n")
		for _, l := range lines {
			fields := strings.Fields(l)
			if len(fields) >= 1 {
				unit := fields[0]
				sName := strings.TrimSuffix(unit, ".service")
				if !seen[sName] && isRecognizedService(sName) {
					seen[sName] = true
					services = append(services, map[string]any{
						"id":     sName,
						"name":   sName,
						"unit":   unit,
						"kind":   "systemd",
						"cat":    categorizeService(sName),
						"type":   "systemd",
						"status": "running",
					})
				}
			}
		}
	}

	return services
}

func (sc *SecurityCollector) collectDockerStorage() map[string]any {
	res := map[string]any{
		"available": false,
		"summary":   []map[string]any{},
	}
	out, err := execCommand("docker system df --format '{{.Type}}|{{.TotalCount}}|{{.Active}}|{{.Size}}|{{.Reclaimable}}' 2>/dev/null")
	if err != nil || strings.TrimSpace(out) == "" {
		return res
	}
	res["available"] = true
	rows := make([]map[string]any, 0)
	for _, line := range strings.Split(strings.TrimSpace(out), "\n") {
		parts := strings.Split(line, "|")
		if len(parts) >= 5 {
			rows = append(rows, map[string]any{
				"type":        parts[0],
				"total":       parts[1],
				"active":      parts[2],
				"size":        parts[3],
				"reclaimable": parts[4],
			})
		}
	}
	res["summary"] = rows
	return res
}

func (sc *SecurityCollector) collectSSLDomains() []map[string]any {
	domains := make([]map[string]any, 0)
	for _, d := range sc.Config.Domains {
		d = strings.TrimSpace(d)
		if d == "" {
			continue
		}
		info := map[string]any{
			"domain": d,
			"status": "ok",
		}
		dialer := &net.Dialer{Timeout: 4 * time.Second}
		conn, err := tls.DialWithDialer(dialer, "tcp", d+":443", &tls.Config{ServerName: d})
		if err != nil {
			info["status"] = "warn"
			info["error"] = err.Error()
		} else {
			certs := conn.ConnectionState().PeerCertificates
			if len(certs) > 0 {
				daysLeft := int(time.Until(certs[0].NotAfter).Hours() / 24)
				info["days_left"] = daysLeft
				info["expires_at"] = certs[0].NotAfter.UTC().Format("2006-01-02")
				info["issuer"] = certs[0].Issuer.CommonName
				if daysLeft <= 7 {
					info["status"] = "crit"
				} else if daysLeft <= 21 {
					info["status"] = "warn"
				}
			}
			_ = conn.Close()
		}
		domains = append(domains, info)
	}
	return domains
}

func (sc *SecurityCollector) collectNetworkHealth() map[string]any {
	targets := []struct {
		Name string
		IP   string
	}{
		{"Cloudflare", "1.1.1.1"},
		{"Google", "8.8.8.8"},
		{"Quad9", "9.9.9.9"},
	}
	pings := make([]map[string]any, 0, len(targets))
	for _, t := range targets {
		start := time.Now()
		conn, err := net.DialTimeout("tcp", t.IP+":53", 2*time.Second)
		if err == nil {
			rtt := float64(time.Since(start).Microseconds()) / 1000.0
			_ = conn.Close()
			pings = append(pings, map[string]any{
				"name":   t.Name,
				"target": t.IP,
				"rtt_ms": rtt,
				"loss":   0,
				"status": "ok",
			})
		} else {
			pings = append(pings, map[string]any{
				"name":   t.Name,
				"target": t.IP,
				"rtt_ms": 0,
				"loss":   100,
				"status": "warn",
			})
		}
	}

	var speedtestData map[string]any
	stFile := filepath.Join(sc.Config.StateDir, "speedtest-cache.json")
	if raw, err := os.ReadFile(stFile); err == nil {
		_ = json.Unmarshal(raw, &speedtestData)
	}

	return map[string]any{
		"pings":     pings,
		"speedtest": speedtestData,
	}
}

func (sc *SecurityCollector) collectPendingSecurityUpdates() []map[string]any {
	vulns := make([]map[string]any, 0)
	if aptOut, err := execCommand("apt-get -s dist-upgrade 2>/dev/null | grep -i '^Inst '"); err == nil && aptOut != "" {
		lines := strings.Split(strings.TrimSpace(aptOut), "\n")
		for _, l := range lines {
			if !strings.Contains(strings.ToLower(l), "security") {
				continue
			}
			fields := strings.Fields(l)
			if len(fields) >= 2 {
				pkgName := fields[1]
				vulns = append(vulns, map[string]any{
					"package":  pkgName,
					"cve":      "Pending Security Patch",
					"severity": "high",
				})
			}
		}
	}
	return vulns
}

func (sc *SecurityCollector) evaluatePortSecurity(ports []map[string]any, ufwInfo map[string]any) []map[string]any {
	res := make([]map[string]any, 0, len(ports))
	for _, p := range ports {
		portNum, _ := p["port"].(int)
		risk := "normal"
		if portNum == 23 || portNum == 21 || portNum == 3389 {
			risk = "high"
		} else if portNum == 80 || portNum == 443 || sc.isProtectedPort(portNum) {
			risk = "safe"
		}
		res = append(res, map[string]any{
			"port":      p["port"],
			"proto":     p["proto"],
			"service":   p["service"],
			"process":   p["process"],
			"public":    p["public"],
			"protected": sc.isProtectedPort(portNum),
			"risk":      risk,
		})
	}
	return res
}

func guessServiceName(port int) string {
	switch port {
	case 22, 2244:
		return "SSH"
	case 80:
		return "HTTP"
	case 443:
		return "HTTPS"
	case 8090:
		return "Beszel Hub"
	case 45876:
		return "Beszel Agent"
	case 3306:
		return "MySQL"
	case 5432:
		return "PostgreSQL"
	case 6379:
		return "Redis"
	case 27017:
		return "MongoDB"
	case 9050:
		return "Tor"
	default:
		return fmt.Sprintf("Port %d", port)
	}
}

func isRecognizedService(name string) bool {
	common := []string{"nginx", "caddy", "docker", "redis", "postgres", "mysql", "mariadb", "beszel", "ssh", "fail2ban", "ufw", "tor", "wireguard", "wg-quick", "tailscale", "xray", "sing-box"}
	for _, c := range common {
		if strings.Contains(name, c) {
			return true
		}
	}
	return false
}

func categorizeService(name string) string {
	if strings.Contains(name, "wireguard") || strings.Contains(name, "wg-quick") || strings.Contains(name, "tailscale") || strings.Contains(name, "tor") || strings.Contains(name, "xray") || strings.Contains(name, "sing-box") {
		return "vpn"
	}
	if strings.Contains(name, "redis") || strings.Contains(name, "postgres") || strings.Contains(name, "mysql") || strings.Contains(name, "mariadb") {
		return "databases"
	}
	if strings.Contains(name, "nginx") || strings.Contains(name, "caddy") {
		return "web"
	}
	if strings.Contains(name, "beszel") {
		return "monitoring"
	}
	return "utils"
}

func getPrimaryOutboundIP() string {
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		return "127.0.0.1"
	}
	defer conn.Close()
	localAddr := conn.LocalAddr().(*net.UDPAddr)
	return localAddr.IP.String()
}

func readFileString(path string) string {
	data, err := os.ReadFile(path)
	if err != nil {
		return ""
	}
	return string(data)
}

func execCommand(cmdStr string) (string, error) {
	cmd := exec.Command("sh", "-c", cmdStr)
	out, err := cmd.CombinedOutput()
	return string(out), err
}
