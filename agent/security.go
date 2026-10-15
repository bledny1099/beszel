package agent

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"os"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
	"time"
)

// SecurityCollector gathers open ports, firewall status, fail2ban bans, and running services
type SecurityCollector struct {
	SystemID   string
	SystemName string
	HubURL     string
	Token      string
}

// NewSecurityCollector creates a new security collector
func NewSecurityCollector(sysID, sysName, hubURL, token string) *SecurityCollector {
	if sysName == "" {
		sysName, _ = os.Hostname()
	}
	return &SecurityCollector{
		SystemID:   sysID,
		SystemName: sysName,
		HubURL:     hubURL,
		Token:      token,
	}
}

// CollectReport gathers all security telemetry into a unified JSON-serializable map
func (sc *SecurityCollector) CollectReport() map[string]any {
	hostname, _ := os.Hostname()
	primaryIP := getPrimaryOutboundIP()

	openPorts := sc.collectOpenPorts()
	connections := sc.collectActiveConnections()
	sshF2b := sc.collectSSHFail2ban()
	services := sc.collectRunningServices()
	vulns := sc.collectPendingSecurityUpdates()

	report := map[string]any{
		"system_id":          sc.SystemID,
		"system_name":        sc.SystemName,
		"hostname":           hostname,
		"ip":                 primaryIP,
		"timestamp":          time.Now().UTC().Format(time.RFC3339),
		"open_ports":         openPorts,
		"active_connections": connections,
		"port_security":      sc.evaluatePortSecurity(openPorts),
		"ssh_fail2ban":       sshF2b,
		"services":           services,
		"vulnerabilities":    vulns,
	}
	return report
}

// SendReport posts the collected security report to the Beszel Hub
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

	client := &http.Client{Timeout: 10 * time.Second}
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

// StartSecurityAuditLoop periodically collects and sends security telemetry to the Hub
func (sc *SecurityCollector) StartSecurityAuditLoop(ctx context.Context, interval time.Duration) {
	if interval < 5*time.Minute {
		interval = time.Hour
	}

	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	// Initial run
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

// collectOpenPorts parses listening ports using ss or netstat
func (sc *SecurityCollector) collectOpenPorts() []map[string]any {
	ports := make([]map[string]any, 0)
	seen := make(map[string]bool)

	out, err := execCommand("ss -H -tulpn 2>/dev/null || netstat -tulnp 2>/dev/null")
	if err != nil || strings.TrimSpace(out) == "" {
		return ports
	}

	lines := strings.Split(out, "\n")
	portRegex := regexp.MustCompile(`:(\d+)\s+`)

	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" || strings.HasPrefix(line, "Proto") || strings.HasPrefix(line, "Netid") {
			continue
		}

		proto := "tcp"
		if strings.HasPrefix(line, "udp") || strings.Contains(line, "UDP") {
			proto = "udp"
		}

		match := portRegex.FindStringSubmatch(line)
		if len(match) < 2 {
			continue
		}

		portNum, _ := strconv.Atoi(match[1])
		if portNum <= 0 || portNum > 65535 {
			continue
		}

		key := fmt.Sprintf("%d/%s", portNum, proto)
		if seen[key] {
			continue
		}
		seen[key] = true

		serviceName := guessServiceName(portNum)
		ports = append(ports, map[string]any{
			"port":    portNum,
			"proto":   proto,
			"service": serviceName,
			"state":   "LISTEN",
		})
	}

	return ports
}

// collectActiveConnections returns active established network connections
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

// collectSSHFail2ban inspects fail2ban jails and recent auth attempts
func (sc *SecurityCollector) collectSSHFail2ban() map[string]any {
	result := map[string]any{
		"banned_ips":    []string{},
		"recent_logins": []map[string]any{},
	}

	// Fail2ban status
	if f2bOut, err := execCommand("fail2ban-client status sshd 2>/dev/null"); err == nil {
		if idx := strings.Index(f2bOut, "Banned IP list:"); idx != -1 {
			rawList := strings.TrimSpace(f2bOut[idx+len("Banned IP list:"):])
			ips := strings.Fields(rawList)
			result["banned_ips"] = ips
		}
	}

	// Recent SSH logins from journalctl or auth.log
	authCmd := "journalctl -u ssh -u sshd -n 25 --no-pager 2>/dev/null || tail -n 25 /var/log/auth.log 2>/dev/null"
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

// collectRunningServices detects active Docker containers and systemd services
func (sc *SecurityCollector) collectRunningServices() []map[string]any {
	services := make([]map[string]any, 0)
	seen := make(map[string]bool)

	// 1. Docker containers
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
						"cat":    "containers",
						"type":   "docker",
						"status": "running",
					})
				}
			}
		}
	}

	// 2. Running systemd services
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

// collectPendingSecurityUpdates checks for package updates with security flags
func (sc *SecurityCollector) collectPendingSecurityUpdates() []map[string]any {
	vulns := make([]map[string]any, 0)

	// Check apt for security patches
	if aptOut, err := execCommand("apt-get -s dist-upgrade 2>/dev/null | grep -i security"); err == nil && aptOut != "" {
		lines := strings.Split(strings.TrimSpace(aptOut), "\n")
		for _, l := range lines {
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

// evaluatePortSecurity classifies port risk levels
func (sc *SecurityCollector) evaluatePortSecurity(ports []map[string]any) []map[string]any {
	res := make([]map[string]any, 0, len(ports))
	for _, p := range ports {
		portNum, _ := p["port"].(int)
		risk := "normal"
		if portNum == 23 || portNum == 21 || portNum == 3389 {
			risk = "high"
		} else if portNum == 80 || portNum == 443 || portNum == 8090 {
			risk = "safe"
		}
		res = append(res, map[string]any{
			"port": p["port"],
			"risk": risk,
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
	common := []string{"nginx", "caddy", "docker", "redis", "postgres", "mysql", "beszel", "ssh", "fail2ban", "ufw", "tor", "wireguard", "tailscale"}
	for _, c := range common {
		if strings.Contains(name, c) {
			return true
		}
	}
	return false
}

func categorizeService(name string) string {
	if strings.Contains(name, "wireguard") || strings.Contains(name, "tailscale") || strings.Contains(name, "tor") {
		return "vpn"
	}
	if strings.Contains(name, "redis") || strings.Contains(name, "postgres") || strings.Contains(name, "mysql") {
		return "databases"
	}
	if strings.Contains(name, "nginx") || strings.Contains(name, "caddy") {
		return "web"
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

func execCommand(cmdStr string) (string, error) {
	cmd := exec.Command("sh", "-c", cmdStr)
	out, err := cmd.CombinedOutput()
	return string(out), err
}
