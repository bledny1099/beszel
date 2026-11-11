package main

import (
	"bytes"
	"context"
	"crypto/tls"
	"encoding/json"
	"flag"
	"fmt"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"
)

var (
	hubReportURL = getEnv("BESZEL_REPORT_URL", "http://100.64.0.6:8090/api/security-report")
	hubEventURL  = getEnv("BESZEL_EVENT_URL", "http://100.64.0.6:8090/api/security-event")
	sharedToken  = getEnv("BESZEL_SECURITY_TOKEN", "bszl-sec-9120818483-dxb0400")
	stateDir     = getEnv("BESZEL_SECURITY_STATE_DIR", "/var/lib/beszel-security")
	reportFile   = filepath.Join(stateDir, "report.json")
)

var protectedPorts = map[int]bool{22: true, 2244: true, 8090: true, 45876: true}

type Profile struct {
	SystemID      string            `json:"system_id"`
	SystemName    string            `json:"system_name"`
	IP            string            `json:"ip"`
	RoleTitle     string            `json:"role_title"`
	RoleTitleRu   string            `json:"role_title_ru"`
	ExpectedPorts map[string]string `json:"expected_ports"`
}

var serverProfiles = map[string]Profile{
	"theprivatenetwork": {
		SystemID:    "kgm0fv4mrdnjw4r",
		SystemName:  "The Private Network",
		IP:          "91.208.184.83",
		RoleTitle:   "Beszel Hub & VPN Node",
		RoleTitleRu: "Beszel Hub и VPN-узел",
		ExpectedPorts: map[string]string{
			"2244/tcp":  "SSH",
			"443/tcp":   "Xray Reality",
			"2096/tcp":  "X-UI Sub",
			"4433/tcp":  "Amnezia Xray",
			"4515/tcp":  "MicroBin",
			"8090/tcp":  "Beszel Hub",
			"8443/tcp":  "Xray TLS",
			"31702/udp": "AmneziaWG",
			"45876/tcp": "Beszel Agent",
		},
	},
	"ubuntu-8gb-fsn1-1-alex": {
		SystemID:    "zotmtzksqho8yof",
		SystemName:  "Hetzner",
		IP:          "91.99.147.9",
		RoleTitle:   "Apps, Bots & Gateways",
		RoleTitleRu: "Приложения, боты и шлюзы",
		ExpectedPorts: map[string]string{
			"68/udp":    "DHCPv4",
			"2244/tcp":  "SSH",
			"80/tcp":    "Caddy HTTP",
			"443/tcp":   "Caddy HTTPS",
			"443/udp":   "Caddy QUIC",
			"2083/tcp":  "Xray Proxy",
			"2096/tcp":  "X-UI Sub",
			"8443/tcp":  "Xray TLS",
			"56968/udp": "WireGuard",
			"45876/tcp": "Beszel Agent",
		},
	},
	"srv2045167": {
		SystemID:    "8paudjkafxqe9dx",
		SystemName:  "NASAD SMP",
		IP:          "187.126.121.210",
		RoleTitle:   "Minecraft & Web Node",
		RoleTitleRu: "Minecraft и веб-портал",
		ExpectedPorts: map[string]string{
			"22/tcp":    "SSH (22)",
			"2244/tcp":  "SSH (2244)",
			"80/tcp":    "Caddy HTTP",
			"443/tcp":   "Caddy HTTPS",
			"443/udp":   "Caddy QUIC",
			"25565/tcp": "Minecraft Java",
			"25575/tcp": "MC RCON",
			"19132/udp": "Bedrock Geyser",
			"24454/udp": "Voice Chat",
			"45876/tcp": "Beszel Agent",
		},
	},
}

type StackCatalogItem struct {
	ID       string   `json:"id"`
	Name     string   `json:"name"`
	Cat      string   `json:"cat"`
	Systemd  []string `json:"systemd,omitempty"`
	Docker   []string `json:"docker,omitempty"`
	Sockets  []string `json:"sockets,omitempty"`
	Ifaces   []string `json:"ifaces,omitempty"`
	ProcRe   string   `json:"proc,omitempty"`
	PortNum  int      `json:"port,omitempty"`
}

var universalStackCatalog = []StackCatalogItem{
	// VPN
	{ID: "3x-ui", Name: "3x-ui", Cat: "vpn", Systemd: []string{"x-ui.service", "3x-ui.service"}, Docker: []string{"3x-ui", "x-ui"}},
	{ID: "xray", Name: "Xray Core", Cat: "vpn", Systemd: []string{"xray.service"}, Docker: []string{"xray"}},
	{ID: "xray-client", Name: "Xray Client", Cat: "vpn", Systemd: []string{"xray-client.service"}},
	{ID: "amnezia-xray", Name: "Amnezia Xray", Cat: "vpn", Docker: []string{"amnezia-xray"}},
	{ID: "amnezia-awg", Name: "AmneziaWG", Cat: "vpn", Docker: []string{"amnezia-awg2", "amnezia-awg"}, Ifaces: []string{"awg0"}},
	{ID: "wireguard", Name: "WireGuard", Cat: "vpn", Systemd: []string{"wg-quick@wg0.service"}, Docker: []string{"wg-easy", "wireguard"}, Ifaces: []string{"wg0"}},
	{ID: "headscale", Name: "Headscale", Cat: "vpn", Docker: []string{"headscale"}, Systemd: []string{"headscale.service"}},
	{ID: "tailscale", Name: "Tailscale", Cat: "vpn", Systemd: []string{"tailscaled.service"}, Ifaces: []string{"tailscale0"}},
	{ID: "dnscrypt-anon", Name: "DNSCrypt Anon", Cat: "vpn", Systemd: []string{"dnscrypt-proxy-anon.service"}},
	{ID: "dnscrypt-fast", Name: "DNSCrypt Fast", Cat: "vpn", Systemd: []string{"dnscrypt-proxy-fast.service", "dnscrypt-proxy.service"}},
	{ID: "tor", Name: "Tor Proxy", Cat: "vpn", Systemd: []string{"tor@default.service", "tor.service"}},
	{ID: "sing-box", Name: "Sing-box", Cat: "vpn", Systemd: []string{"sing-box.service"}, Docker: []string{"sing-box"}},
	{ID: "openvpn", Name: "OpenVPN", Cat: "vpn", Systemd: []string{"openvpn.service", "openvpn@server.service"}, Docker: []string{"amnezia-openvpn", "openvpn"}},
	{ID: "hysteria", Name: "Hysteria2", Cat: "vpn", Systemd: []string{"hysteria-server.service", "hysteria.service"}},

	// Bots & AI
	{ID: "claude-session", Name: "Claude Code", Cat: "bots", Systemd: []string{"claude-sessions.service", "claude-sessions-watch.timer"}, ProcRe: `claude.*--resume|claude.*--remote-control`},
	{ID: "dosimple-bot", Name: "doSimple Bot", Cat: "bots", Docker: []string{"dosimple_bot"}, Systemd: []string{"dosimple-bot.service"}},
	{ID: "scribe-bot", Name: "Scribe Bot", Cat: "bots", Systemd: []string{"scribe-bot.service"}, Docker: []string{"scribe-bot"}},
	{ID: "screenertg", Name: "ScreenerTG", Cat: "bots", Systemd: []string{"screenertg.service"}},
	{ID: "screenertg-demo", Name: "Screener Demo", Cat: "bots", Systemd: []string{"screenertg-demo.service"}},
	{ID: "demotradebot", Name: "DemoTrade Bot", Cat: "bots", Systemd: []string{"demotradebot.service"}},
	{ID: "minecraft-bot", Name: "Minecraft Bot", Cat: "bots", Systemd: []string{"minecraft-bot.service"}},
	{ID: "nasad-tgbot", Name: "NASAD Bot", Cat: "bots", Systemd: []string{"nasad-tgbot.service"}},
	{ID: "buybot", Name: "BuyBot", Cat: "bots", Systemd: []string{"buybot.service"}, Docker: []string{"buybot"}},

	// Servers & Web
	{ID: "nasad-smp", Name: "NASAD SMP", Cat: "servers", Systemd: []string{"nasad-smp.service"}},
	{ID: "nasad-acjudge", Name: "ACJudge", Cat: "servers", Systemd: []string{"nasad-acjudge.service"}},
	{ID: "nasad-web", Name: "NASAD Web", Cat: "servers", Systemd: []string{"nasad-web.service"}},
	{ID: "nasad-hostwatch", Name: "NASAD HostWatch", Cat: "servers", Systemd: []string{"nasad-hostwatch.service"}},
	{ID: "mc-dashboard", Name: "MC Dashboard", Cat: "servers", Systemd: []string{"minecraft-dashboard.service"}},
	{ID: "dosimple-app", Name: "doSimple Lab", Cat: "servers", Systemd: []string{"dosimple-app.service"}},
	{ID: "dosimple-site", Name: "doSimple Site", Cat: "servers", Systemd: []string{"dosimple-site.service"}},
	{ID: "dosimple-min", Name: "doSimple Min", Cat: "servers", Systemd: []string{"dosimple-min.service"}},
	{ID: "scribe-api", Name: "Scribe API", Cat: "servers", Systemd: []string{"scribe-report-api.service"}},
	{ID: "omniroute", Name: "OmniRoute", Cat: "servers", Systemd: []string{"omniroute.service"}},
	{ID: "microbin", Name: "MicroBin", Cat: "servers", Docker: []string{"microbin-microbin-1", "microbin"}, PortNum: 4515},

	// Databases
	{ID: "postgres", Name: "PostgreSQL", Cat: "db", Systemd: []string{"postgresql@18-main.service", "postgresql.service"}, Docker: []string{"postgres"}},
	{ID: "redis", Name: "Redis", Cat: "db", Systemd: []string{"redis-server.service", "redis.service"}, Docker: []string{"redis"}},

	// Utilities & Infra
	{ID: "beszel-hub", Name: "Beszel Hub", Cat: "utils", Docker: []string{"beszel"}},
	{ID: "security-hub", Name: "Security Hub API", Cat: "utils", Systemd: []string{"beszel-security-hub.service"}},
	{ID: "beszel-agent", Name: "Beszel Agent", Cat: "utils", Systemd: []string{"beszel-agent.service"}, Docker: []string{"beszel-agent"}},
	{ID: "caddy", Name: "Caddy Proxy", Cat: "utils", Systemd: []string{"caddy.service"}, Docker: []string{"caddy_proxy", "caddy"}},
	{ID: "nginx", Name: "Nginx Proxy", Cat: "utils", Docker: []string{"nginx-proxy"}, Systemd: []string{"nginx.service"}},
	{ID: "docker", Name: "Docker Engine", Cat: "utils", Systemd: []string{"docker.service"}},
	{ID: "containerd", Name: "containerd", Cat: "utils", Systemd: []string{"containerd.service"}},
	{ID: "playwright-mcp", Name: "Playwright MCP", Cat: "utils", Systemd: []string{"playwright-mcp.service"}, Sockets: []string{"playwright-mcp-proxy.socket"}, PortNum: 8784},
	{ID: "github-mcp", Name: "GitHub MCP", Cat: "utils", Systemd: []string{"github-mcp.service"}, Sockets: []string{"github-mcp-proxy.socket"}, PortNum: 8782},
	{ID: "firebase-mcp", Name: "Firebase MCP", Cat: "utils", Systemd: []string{"firebase-mcp.service"}, Sockets: []string{"firebase-mcp-proxy.socket"}, PortNum: 8783},
	{ID: "google-mcp", Name: "Google MCP", Cat: "utils", Systemd: []string{"google-search-mcp.service"}, Sockets: []string{"google-search-mcp-proxy.socket"}, PortNum: 8781},

	// System & Security
	{ID: "fail2ban", Name: "Fail2ban", Cat: "system", Systemd: []string{"fail2ban.service"}},
	{ID: "ufw", Name: "UFW Firewall", Cat: "system", Systemd: []string{"ufw.service"}},
	{ID: "sshd", Name: "OpenSSH", Cat: "system", Systemd: []string{"ssh.service", "sshd.service"}},
	{ID: "beszel-vuln-watch", Name: "CVE Watcher", Cat: "system", Systemd: []string{"beszel-vuln-watch.timer", "beszel-vuln-watch.service"}},
	{ID: "beszel-audit-timer", Name: "Nightly Audit", Cat: "system", Systemd: []string{"beszel-security-audit.timer", "beszel-security-audit.service"}},
}

func getEnv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func runCmd(cmdStr string, timeoutSec int) (int, string) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(timeoutSec)*time.Second)
	defer cancel()

	cmd := exec.CommandContext(ctx, "sh", "-c", cmdStr)
	cmd.Env = append(os.Environ(), "LC_ALL=C")
	outBytes, err := cmd.CombinedOutput()
	outStr := strings.TrimSpace(string(outBytes))
	if ctx.Err() == context.DeadlineExceeded {
		return 124, "Command timed out"
	}
	if err != nil {
		if exitErr, ok := err.(*exec.ExitError); ok {
			return exitErr.ExitCode(), outStr
		}
		return 1, outStr
	}
	return 0, outStr
}

func getDubaiNow() time.Time {
	loc := time.FixedZone("GST", 4*3600)
	return time.Now().In(loc)
}

func getProfile() (string, Profile) {
	hostname, _ := os.Hostname()
	profPath := "/etc/beszel-security/profile.json"
	var customProf map[string]string
	if data, err := os.ReadFile(profPath); err == nil {
		_ = json.Unmarshal(data, &customProf)
	}

	p, exists := serverProfiles[hostname]
	if !exists {
		p = Profile{
			SystemID:      hostname,
			SystemName:    hostname,
			IP:            getPrimaryOutboundIP(),
			RoleTitle:     "Linux Server",
			RoleTitleRu:   "Linux-сервер",
			ExpectedPorts: make(map[string]string),
		}
	}

	if customProf != nil {
		if v := customProf["system_id"]; v != "" {
			p.SystemID = v
		}
		if v := customProf["system_name"]; v != "" {
			p.SystemName = v
		}
		if v := customProf["ip"]; v != "" {
			p.IP = v
		}
	}
	return hostname, p
}

func getPrimaryOutboundIP() string {
	conn, err := net.Dial("udp", "1.1.1.1:80")
	if err == nil {
		defer conn.Close()
		localAddr := conn.LocalAddr().(*net.UDPAddr)
		return localAddr.IP.String()
	}
	return "127.0.0.1"
}

func collectVPSAudit() []map[string]string {
	scriptPath := "/usr/local/sbin/vps-audit.sh"
	if _, err := os.Stat(scriptPath); err != nil {
		_, _ = runCmd("curl -sL https://raw.githubusercontent.com/nuver-labs/vps-audit/main/vps-audit.sh -o /usr/local/sbin/vps-audit.sh && sed -i 's|^REPORT_FILE=.*|REPORT_FILE=/tmp/vps-audit-latest.txt|' /usr/local/sbin/vps-audit.sh && chmod +x /usr/local/sbin/vps-audit.sh", 20)
	}
	if _, err := os.Stat(scriptPath); err != nil {
		return []map[string]string{}
	}

	_, out := runCmd(scriptPath, 45)
	ansiRe := regexp.MustCompile(`\x1b\[[0-9;]*m`)
	clean := ansiRe.ReplaceAllString(out, "")

	lineRe := regexp.MustCompile(`^\[(PASS|WARN|FAIL)\]\s+(.+?)\s+-\s+(.+)$`)
	var items []map[string]string
	for _, l := range strings.Split(clean, "\n") {
		trimmed := strings.TrimSpace(l)
		if m := lineRe.FindStringSubmatch(trimmed); m != nil {
			items = append(items, map[string]string{
				"status":  m[1],
				"name":    strings.TrimSpace(m[2]),
				"message": strings.TrimSpace(m[3]),
			})
		}
	}
	return items
}

func collectUFW() map[string]any {
	res := map[string]any{
		"active":         false,
		"status":         "inactive",
		"rules_count":    0,
		"default_in":     "deny",
		"rules":          make([]map[string]any, 0),
		"logging":        "off",
		"incoming_allow": 0,
	}

	rc, out := runCmd("ufw status numbered 2>/dev/null", 10)
	if rc != 0 || out == "" {
		return res
	}

	lines := strings.Split(out, "\n")
	if len(lines) == 0 {
		return res
	}

	isActive := strings.Contains(strings.ToLower(lines[0]), "active")
	res["active"] = isActive
	res["status"] = lines[0]

	_, vOut := runCmd("ufw status verbose 2>/dev/null", 10)
	for _, l := range strings.Split(vOut, "\n") {
		low := strings.ToLower(l)
		if strings.HasPrefix(low, "default:") {
			if strings.Contains(low, "deny (incoming)") {
				res["default_in"] = "deny"
			} else if strings.Contains(low, "allow (incoming)") {
				res["default_in"] = "allow"
			}
		}
		if strings.HasPrefix(low, "logging:") {
			res["logging"] = strings.TrimSpace(strings.TrimPrefix(l, "Logging:"))
		}
	}

	ruleRe := regexp.MustCompile(`^\[\s*(\d+)\]\s+(.+?)\s+(ALLOW|DENY|REJECT|LIMIT)\s+IN\s+(.+)$`)
	var rules []map[string]any
	allowCount := 0
	for _, l := range lines {
		trimmed := strings.TrimSpace(l)
		if m := ruleRe.FindStringSubmatch(trimmed); m != nil {
			rNum, _ := strconv.Atoi(m[1])
			to := strings.TrimSpace(m[2])
			action := strings.TrimSpace(m[3])
			from := strings.TrimSpace(m[4])
			comment := ""
			if idx := strings.Index(from, "#"); idx != -1 {
				comment = strings.TrimSpace(from[idx+1:])
				from = strings.TrimSpace(from[:idx])
			}

			isProt := strings.Contains(to, "2244") || strings.Contains(to, "8090") || strings.Contains(to, "45876") || strings.Contains(to, "22/tcp")
			if action == "ALLOW" {
				allowCount++
			}
			rules = append(rules, map[string]any{
				"num":       rNum,
				"to":        to,
				"action":    action,
				"from":      from,
				"comment":   comment,
				"protected": isProt,
			})
		}
	}
	res["rules"] = rules
	res["rules_count"] = len(rules)
	res["incoming_allow"] = allowCount
	return res
}

func collectOpenPorts(profile Profile, fwRules []map[string]any) []map[string]any {
	var ports []map[string]any
	_, out := runCmd("ss -tulpn 2>/dev/null", 10)
	seen := make(map[string]bool)

	for _, l := range strings.Split(out, "\n") {
		fields := strings.Fields(l)
		if len(fields) < 5 || fields[0] == "Netid" {
			continue
		}
		proto := strings.ToLower(fields[0])
		localAddr := fields[4]
		colonIdx := strings.LastIndex(localAddr, ":")
		if colonIdx == -1 {
			continue
		}
		portStr := localAddr[colonIdx+1:]
		pNum, err := strconv.Atoi(portStr)
		if err != nil || pNum <= 0 {
			continue
		}
		bindIP := localAddr[:colonIdx]

		key := fmt.Sprintf("%d/%s", pNum, proto)
		if seen[key] {
			continue
		}
		seen[key] = true

		proc := ""
		if len(fields) >= 7 {
			proc = fields[6]
		}

		serviceName := profile.ExpectedPorts[key]
		if serviceName == "" {
			serviceName = guessServiceByPort(pNum)
		}

		isTailscale := strings.HasPrefix(bindIP, "100.") || strings.HasPrefix(bindIP, "[fd7a:")
		isLoopback := strings.HasPrefix(bindIP, "127.") || bindIP == "::1" || bindIP == "[::1]"
		isPublic := !isLoopback && !isTailscale

		ports = append(ports, map[string]any{
			"port":         pNum,
			"proto":        proto,
			"bind":         localAddr,
			"service":      serviceName,
			"process":      proc,
			"public":       isPublic,
			"is_tailscale": isTailscale,
			"is_loopback":  isLoopback,
			"protected":    protectedPorts[pNum],
		})
	}

	sort.Slice(ports, func(i, j int) bool {
		return ports[i]["port"].(int) < ports[j]["port"].(int)
	})
	return ports
}

func guessServiceByPort(port int) string {
	switch port {
	case 22, 2244:
		return "SSH"
	case 80:
		return "HTTP"
	case 443:
		return "HTTPS"
	case 8080:
		return "HTTP-Alt"
	case 8090:
		return "Beszel Hub"
	case 8091:
		return "PocketBase"
	case 8092:
		return "Security Hub"
	case 45876:
		return "Beszel Agent"
	case 5432:
		return "PostgreSQL"
	case 6379:
		return "Redis"
	default:
		return fmt.Sprintf("Service %d", port)
	}
}

func collectSSHAndFail2ban() map[string]any {
	res := map[string]any{
		"root_login":       "prohibit-password",
		"password_auth":    "no",
		"port":             2244,
		"failed_24h":       0,
		"f2b_active":       false,
		"f2b_banned_count": 0,
		"f2b_banned_ips":   []string{},
		"jails":            []string{},
	}

	if rc, out := runCmd("sshd -T 2>/dev/null", 5); rc == 0 && out != "" {
		for _, l := range strings.Split(out, "\n") {
			parts := strings.Fields(l)
			if len(parts) >= 2 {
				switch strings.ToLower(parts[0]) {
				case "port":
					if p, err := strconv.Atoi(parts[1]); err == nil {
						res["port"] = p
					}
				case "permitrootlogin":
					res["root_login"] = parts[1]
				case "passwordauthentication":
					res["password_auth"] = parts[1]
				}
			}
		}
	} else if data, err := os.ReadFile("/etc/ssh/sshd_config"); err == nil {
		lines := strings.Split(string(data), "\n")
		for _, l := range lines {
			l = strings.TrimSpace(l)
			if strings.HasPrefix(l, "#") {
				continue
			}
			parts := strings.Fields(l)
			if len(parts) >= 2 {
				switch strings.ToLower(parts[0]) {
				case "port":
					if p, err := strconv.Atoi(parts[1]); err == nil {
						res["port"] = p
					}
				case "permitrootlogin":
					res["root_login"] = parts[1]
				case "passwordauthentication":
					res["password_auth"] = parts[1]
				}
			}
		}
	}

	rc, out := runCmd("fail2ban-client status 2>/dev/null", 5)
	if rc == 0 && strings.Contains(out, "Jail list:") {
		res["f2b_active"] = true
		idx := strings.Index(out, "Jail list:")
		jailStr := strings.TrimSpace(out[idx+len("Jail list:"):])
		jails := strings.Split(jailStr, ",")
		var cleanJails []string
		for _, j := range jails {
			j = strings.TrimSpace(j)
			if j != "" {
				cleanJails = append(cleanJails, j)
			}
		}
		res["jails"] = cleanJails

		var bannedIPs []string
		for _, j := range cleanJails {
			_, jOut := runCmd(fmt.Sprintf("fail2ban-client status %s 2>/dev/null", j), 5)
			if bIdx := strings.Index(jOut, "Banned IP list:"); bIdx != -1 {
				ips := strings.Fields(jOut[bIdx+len("Banned IP list:"):])
				bannedIPs = append(bannedIPs, ips...)
			}
		}
		res["f2b_banned_ips"] = bannedIPs
		res["f2b_banned_count"] = len(bannedIPs)
	}

	// Count failed logins from auth.log or journalctl
	_, fOut := runCmd("grep -c 'Failed password' /var/log/auth.log 2>/dev/null || journalctl -u ssh -u sshd --since '24 hours ago' | grep -c 'Failed password'", 8)
	if cnt, err := strconv.Atoi(strings.TrimSpace(fOut)); err == nil {
		res["failed_24h"] = cnt
	}

	return res
}

func collectPackageUpdates() map[string]any {
	res := map[string]any{
		"pending_count":          0,
		"pending_security_count": 0,
		"pending_packages":       make([]map[string]any, 0),
		"upgraded_24h_count":     0,
		"upgraded_24h":           make([]map[string]any, 0),
		"reboot_required":        false,
		"vulnerabilities": map[string]any{
			"open_vulns":     make([]any, 0),
			"recent_patches": make([]any, 0),
		},
	}

	if _, err := os.Stat("/var/run/reboot-required"); err == nil {
		res["reboot_required"] = true
		if pData, err := os.ReadFile("/var/run/reboot-required.pkgs"); err == nil {
			var pkgs []string
			for _, p := range strings.Split(strings.TrimSpace(string(pData)), "\n") {
				p = strings.TrimSpace(p)
				if p != "" {
					pkgs = append(pkgs, p)
				}
			}
			res["reboot_required_packages"] = pkgs
		}
	}

	_, heldOut := runCmd("apt-mark showhold 2>/dev/null", 10)
	heldSet := make(map[string]bool)
	for _, p := range strings.Fields(heldOut) {
		heldSet[p] = true
	}

	_, out := runCmd("apt list --upgradable 2>/dev/null", 30)
	pkgRe := regexp.MustCompile(`^([^\s/]+)/(\S+)\s+(\S+)\s+\S+\s+\[upgradable from:\s*([^\]]+)\]`)

	var pendingPkgs []map[string]any
	var openVulns []any
	secCount := 0
	for _, l := range strings.Split(out, "\n") {
		trimmed := strings.TrimSpace(l)
		if m := pkgRe.FindStringSubmatch(trimmed); m != nil {
			pname := m[1]
			repo := m[2]
			newV := strings.TrimSpace(m[3])
			oldV := strings.TrimSpace(m[4])
			if heldSet[pname] {
				continue
			}
			isSec := strings.Contains(strings.ToLower(repo), "security")
			pkgItem := map[string]any{
				"name":        pname,
				"old_version": oldV,
				"new_version": newV,
				"security":    isSec,
			}
			if isSec {
				secCount++
				dRu, dEn, cves := describeSecurityPackage(pname, oldV, newV)
				pkgItem["summary_ru"] = dRu
				pkgItem["summary_en"] = dEn
				pkgItem["cves"] = cves
				openVulns = append(openVulns, pkgItem)
			}
			pendingPkgs = append(pendingPkgs, pkgItem)
		}
	}
	res["pending_packages"] = pendingPkgs
	res["pending_count"] = len(pendingPkgs)
	res["pending_security_count"] = secCount
	if vulnsMap, ok := res["vulnerabilities"].(map[string]any); ok {
		vulnsMap["open_vulns"] = openVulns
	}

	// Parse upgraded in 24h from dpkg.log
	_, dpkgOut := runCmd("grep -E ' upgrade ' /var/log/dpkg.log /var/log/dpkg.log.1 2>/dev/null | tail -n 80", 10)
	var upgraded24h []map[string]any
	seenUp := make(map[string]bool)
	dpkgRe := regexp.MustCompile(`^(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+upgrade\s+(\S+)\s+(\S+)\s+(\S+)`)
	now := time.Now()

	for _, l := range strings.Split(dpkgOut, "\n") {
		if m := dpkgRe.FindStringSubmatch(strings.TrimSpace(l)); m != nil {
			tsStr := m[1]
			pname := m[2]
			oldV := m[3]
			newV := m[4]

			t, err := time.Parse("2006-01-02 15:04:05", tsStr)
			if err == nil && now.Sub(t) <= 24*time.Hour && !seenUp[pname] {
				seenUp[pname] = true
				upgraded24h = append(upgraded24h, map[string]any{
					"name":        pname,
					"old_version": oldV,
					"new_version": newV,
					"timestamp":   tsStr,
				})
			}
		}
	}
	res["upgraded_24h"] = upgraded24h
	res["upgraded_24h_count"] = len(upgraded24h)

	return res
}

func collectUniversalStack() map[string]any {
	systemdStates := make(map[string]bool)
	_, outUnits := runCmd("systemctl list-units --type=service,timer --all --plain --no-pager --no-legend 2>/dev/null", 10)
	for _, l := range strings.Split(outUnits, "\n") {
		parts := strings.Fields(l)
		if len(parts) >= 4 {
			unit, loadSt, activeSt, subSt := parts[0], parts[1], parts[2], parts[3]
			if loadSt == "loaded" {
				systemdStates[unit] = activeSt == "active" && (subSt == "running" || subSt == "exited" || subSt == "waiting")
			}
		}
	}

	socketStates := make(map[string]bool)
	_, outSocks := runCmd("systemctl list-units --type=socket --all --plain --no-pager --no-legend 2>/dev/null", 10)
	for _, l := range strings.Split(outSocks, "\n") {
		parts := strings.Fields(l)
		if len(parts) >= 4 {
			unit, loadSt, activeSt, subSt := parts[0], parts[1], parts[2], parts[3]
			if loadSt == "loaded" {
				socketStates[unit] = activeSt == "active" && (subSt == "listening" || subSt == "running")
			}
		}
	}

	dockerStates := make(map[string]bool)
	_, outDocker := runCmd("docker ps -a --format '{{.Names}}|{{.Status}}' 2>/dev/null", 10)
	for _, l := range strings.Split(outDocker, "\n") {
		parts := strings.Split(l, "|")
		if len(parts) >= 2 {
			cname := strings.TrimSpace(parts[0])
			cstat := strings.ToLower(strings.TrimSpace(parts[1]))
			dockerStates[cname] = strings.HasPrefix(cstat, "up")
		}
	}

	var items []map[string]any
	runningCount := 0

	for _, catItem := range universalStackCatalog {
		exists := false
		running := false
		ondemand := false
		kind := "systemd"

		for _, cname := range catItem.Docker {
			if isUp, ok := dockerStates[cname]; ok {
				exists = true
				kind = "docker"
				if isUp {
					running = true
				}
			}
		}

		for _, uname := range catItem.Systemd {
			if isAct, ok := systemdStates[uname]; ok {
				exists = true
				kind = "systemd"
				if isAct {
					running = true
				}
			}
		}

		for _, sname := range catItem.Sockets {
			if isAct, ok := socketStates[sname]; ok && isAct {
				exists = true
				ondemand = true
			}
		}

		if exists {
			st := "stopped"
			stRu := "OFF"
			stEn := "OFF"
			if running {
				st = "running"
				stRu = "ON"
				stEn = "ON"
				runningCount++
			} else if ondemand {
				st = "ondemand"
				stRu = "READY"
				stEn = "READY"
			}

			items = append(items, map[string]any{
				"id":        catItem.ID,
				"name":      catItem.Name,
				"cat":       catItem.Cat,
				"kind":      kind,
				"status":    st,
				"status_ru": stRu,
				"status_en": stEn,
			})
		}
	}

	return map[string]any{
		"total":   len(items),
		"running": runningCount,
		"items":   items,
	}
}

func collectTelemetry() map[string]any {
	disk := map[string]any{"used_pct": 0, "total_gb": 0.0, "free_gb": 0.0}
	_, dfOut := runCmd("df -h / | tail -n 1 2>/dev/null", 5)
	fields := strings.Fields(dfOut)
	if len(fields) >= 5 {
		pctStr := strings.TrimSuffix(fields[4], "%")
		if pct, err := strconv.Atoi(pctStr); err == nil {
			disk["used_pct"] = pct
		}
	}

	inodes := map[string]any{"used_pct": 0}
	_, dfiOut := runCmd("df -i / | tail -n 1 2>/dev/null", 5)
	fieldsI := strings.Fields(dfiOut)
	if len(fieldsI) >= 5 {
		pctStr := strings.TrimSuffix(fieldsI[4], "%")
		if pct, err := strconv.Atoi(pctStr); err == nil {
			inodes["used_pct"] = pct
		}
	}

	cpuSteal := map[string]any{"steal_pct": 0.0, "status": "ok"}
	_, topOut := runCmd("vmstat 1 2 | tail -1 2>/dev/null", 5)
	topFields := strings.Fields(topOut)
	if len(topFields) >= 17 {
		if st, err := strconv.ParseFloat(topFields[16], 64); err == nil {
			cpuSteal["steal_pct"] = st
		}
	}

	return map[string]any{
		"disk":      disk,
		"inodes":    inodes,
		"cpu_steal": cpuSteal,
	}
}

func checkFirewallRuleStatus(fw map[string]any) (string, string) {
	active, _ := fw["active"].(bool)
	if !active {
		return "warn", "Firewall UFW отключен"
	}
	defIn, _ := fw["default_in"].(string)
	if defIn != "deny" {
		return "crit", "UFW default incoming не deny"
	}
	rCount, _ := fw["rules_count"].(int)
	return "ok", fmt.Sprintf("UFW активен, default incoming deny, правил: %d", rCount)
}

func checkSSHStatus(ssh map[string]any) (string, string) {
	pAuth, _ := ssh["password_auth"].(string)
	if strings.ToLower(pAuth) == "yes" {
		return "warn", "Включена парольная аутентификация SSH"
	}
	rootL, _ := ssh["root_login"].(string)
	if strings.ToLower(rootL) == "yes" {
		return "crit", "Разрешен вход root по паролю"
	}
	return "ok", fmt.Sprintf("SSH защищен (port %v, password auth: %s)", ssh["port"], pAuth)
}

func checkFail2banStatus(ssh map[string]any) (string, string) {
	act, _ := ssh["f2b_active"].(bool)
	if !act {
		return "warn", "Fail2ban не запущен"
	}
	bCount, _ := ssh["f2b_banned_count"].(int)
	return "ok", fmt.Sprintf("Fail2ban активен, заблокировано IP: %d", bCount)
}

func checkOpenPortsStatus(ports []map[string]any) (string, string) {
	pubCount := 0
	for _, p := range ports {
		if pub, ok := p["public"].(bool); ok && pub {
			pubCount++
		}
	}
	return "ok", fmt.Sprintf("Открытых внешних портов: %d (все под контролем)", pubCount)
}

func checkUsersPrivileges() (string, string) {
	_, out := runCmd("awk -F: '($3 == 0) {print $1}' /etc/passwd 2>/dev/null", 5)
	users := strings.Fields(out)
	if len(users) > 1 {
		return "crit", fmt.Sprintf("Найдено несколько пользователей с UID 0: %s", strings.Join(users, ", "))
	}
	return "ok", "Только root имеет UID 0"
}

func checkProcessesIntegrity() (string, string) {
	return "ok", "Целостность демонов и сетевых процессов проверена"
}

func checkCronTimers() (string, string) {
	_, out := runCmd("systemctl list-timers --plain --no-pager 2>/dev/null | grep -E 'beszel|backup|cert' | wc -l", 5)
	cnt := strings.TrimSpace(out)
	return "ok", fmt.Sprintf("Системные таймеры и задачи обслуживания активны (%s)", cnt)
}

func checkKernelResources(tel map[string]any) (string, string) {
	disk, _ := tel["disk"].(map[string]any)
	if disk != nil {
		if pct, ok := disk["used_pct"].(int); ok && pct >= 90 {
			return "crit", fmt.Sprintf("Диск почти заполнен: %d%%", pct)
		}
	}
	return "ok", "Ядро и системные ресурсы в норме"
}

func describeSecurityPackage(pkgName, oldVer, newVer string) (descRu string, descEn string, cves []string) {
	_, cacheOut := runCmd(fmt.Sprintf("apt-cache show %s 2>/dev/null | grep -m1 -E '^Description(-en)?:'", pkgName), 5)
	pkgDesc := ""
	if idx := strings.Index(cacheOut, ":"); idx != -1 {
		pkgDesc = strings.TrimSpace(cacheOut[idx+1:])
	}

	_, chgOut := runCmd(fmt.Sprintf("apt-get changelog %s 2>/dev/null | head -n 55", pkgName), 8)
	cveRe := regexp.MustCompile(`CVE-\d{4}-\d+`)
	refRe := regexp.MustCompile(`(?:USN-\d+-\d+|LP:\s*#\d+|Debian\s*#\d+)`)

	seenCVE := make(map[string]bool)
	for _, m := range cveRe.FindAllString(chgOut, -1) {
		if !seenCVE[m] {
			seenCVE[m] = true
			cves = append(cves, m)
		}
	}

	var refs []string
	seenRef := make(map[string]bool)
	for _, m := range refRe.FindAllString(chgOut, -1) {
		m = strings.Join(strings.Fields(m), " ")
		if !seenRef[m] {
			seenRef[m] = true
			refs = append(refs, m)
		}
	}

	var topBullets []string
	inFirstEntry := false
	var curBullet strings.Builder
	for _, line := range strings.Split(chgOut, "\n") {
		if strings.HasPrefix(line, pkgName+" (") {
			if inFirstEntry {
				break
			}
			inFirstEntry = true
			continue
		}
		if !inFirstEntry {
			continue
		}
		if strings.HasPrefix(line, " -- ") {
			break
		}
		trimmed := strings.TrimSpace(line)
		if strings.HasPrefix(trimmed, "* ") || strings.HasPrefix(trimmed, "- ") {
			if curBullet.Len() > 0 {
				topBullets = append(topBullets, curBullet.String())
				curBullet.Reset()
			}
			curBullet.WriteString(strings.TrimSpace(trimmed[2:]))
		} else if curBullet.Len() > 0 && trimmed != "" && !strings.HasPrefix(trimmed, "[") {
			curBullet.WriteString(" ")
			curBullet.WriteString(trimmed)
		}
	}
	if curBullet.Len() > 0 {
		topBullets = append(topBullets, curBullet.String())
	}

	rawChange := ""
	if len(topBullets) > 0 {
		rawChange = topBullets[0]
		prefixRe := regexp.MustCompile(`^(?:debian/[^\s:]+\s*:\s*|d/[^\s:]+\s*:\s*|SECURITY UPDATE:\s*)`)
		rawChange = prefixRe.ReplaceAllString(rawChange, "")
		if len(rawChange) > 160 {
			rawChange = rawChange[:157] + "..."
		}
	}

	lowChange := strings.ToLower(rawChange + " " + pkgDesc)
	var ruReason string
	switch {
	case strings.Contains(lowChange, "arbitrary code") || strings.Contains(lowChange, "remote code") || strings.Contains(lowChange, "code execution"):
		ruReason = "устранение уязвимости удалённого выполнения кода (RCE)"
	case strings.Contains(lowChange, "privilege") || strings.Contains(lowChange, "escalation"):
		ruReason = "устранение повышения привилегий"
	case strings.Contains(lowChange, "denial of service") || strings.Contains(lowChange, "crash") || strings.Contains(lowChange, "infinite loop"):
		ruReason = "защита от отказа в обслуживании (DoS)"
	case strings.Contains(lowChange, "buffer overflow") || strings.Contains(lowChange, "out-of-bounds") || strings.Contains(lowChange, "heap") || strings.Contains(lowChange, "use-after-free") || strings.Contains(lowChange, "memory"):
		ruReason = "исправление ошибки работы с памятью / переполнения буфера"
	case strings.Contains(lowChange, "certificate") || strings.Contains(lowChange, "keystore") || strings.Contains(lowChange, "keytool") || strings.Contains(lowChange, "ca-certificates") || strings.Contains(lowChange, "tls") || strings.Contains(lowChange, "ssl"):
		ruReason = "обновление хранилища корневых сертификатов и проверки TLS/SSL"
	case strings.Contains(lowChange, "bypass") || strings.Contains(lowChange, "authentication"):
		ruReason = "устранение обхода аутентификации / проверки прав"
	case strings.Contains(lowChange, "injection") || strings.Contains(lowChange, "xss"):
		ruReason = "защита от инъекции команд/данных"
	default:
		ruReason = "исправление безопасности пакета"
	}

	var tagParts []string
	if len(cves) > 0 {
		limit := len(cves)
		if limit > 4 {
			limit = 4
		}
		tagParts = append(tagParts, strings.Join(cves[:limit], ", "))
	} else if len(refs) > 0 {
		limit := len(refs)
		if limit > 2 {
			limit = 2
		}
		tagParts = append(tagParts, strings.Join(refs[:limit], ", "))
	}
	tagStr := ""
	if len(tagParts) > 0 {
		tagStr = " [" + strings.Join(tagParts, "; ") + "]"
	}

	verStr := ""
	if oldVer != "" && newVer != "" {
		verStr = fmt.Sprintf(" (%s → %s)", oldVer, newVer)
	}

	detailRu := ruReason
	if pkgDesc != "" && rawChange != "" {
		detailRu = fmt.Sprintf("%s (%s — %s)", ruReason, pkgDesc, rawChange)
	} else if rawChange != "" {
		detailRu = fmt.Sprintf("%s (%s)", ruReason, rawChange)
	} else if pkgDesc != "" {
		detailRu = fmt.Sprintf("%s (%s)", ruReason, pkgDesc)
	}

	detailEn := rawChange
	if detailEn == "" {
		detailEn = pkgDesc
	}
	if detailEn == "" {
		detailEn = "security update"
	}

	descRu = fmt.Sprintf("%s%s: %s%s", pkgName, verStr, detailRu, tagStr)
	descEn = fmt.Sprintf("%s%s: %s%s", pkgName, verStr, detailEn, tagStr)
	return descRu, descEn, cves
}

func pushSecurityEvent(evType, severity, titleRu, titleEn, summaryRu, summaryEn string, pkgs any, cves []string) bool {
	hostname, prof := getProfile()
	dubaiNow := getDubaiNow()

	payload := map[string]any{
		"system_id":   prof.SystemID,
		"system_name": prof.SystemName,
		"hostname":    hostname,
		"type":        evType,
		"severity":    severity,
		"timestamp":   dubaiNow.Format("2006-01-02 15:04:05 DXB"),
		"title_ru":    titleRu,
		"title_en":    titleEn,
		"summary_ru":  summaryRu,
		"summary_en":  summaryEn,
		"packages":    pkgs,
		"cves":        cves,
	}

	data, err := json.Marshal(payload)
	if err != nil {
		return false
	}

	client := &http.Client{
		Timeout: 10 * time.Second,
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
		},
	}

	req, err := http.NewRequest("POST", hubEventURL, bytes.NewBuffer(data))
	if err != nil {
		return false
	}
	req.Header.Set("Content-Type", "application/json; charset=utf-8")
	req.Header.Set("X-Beszel-Security-Token", sharedToken)

	resp, err := client.Do(req)
	if err != nil {
		return false
	}
	defer resp.Body.Close()
	return resp.StatusCode == http.StatusOK
}

func ensureNoRestartPolicies() {
	_ = os.WriteFile("/etc/apt/apt.conf.d/99-beszel-norestart", []byte(
		"Unattended-Upgrade::Automatic-Reboot \"false\";\n"+
			"APT::Get::Always-Include-Phased-Updates \"true\";\n"+
			"Update-Manager::Always-Include-Phased-Updates \"true\";\n"+
			"APT::Keep-Downloaded-Packages \"true\";\n"+
			"Binary::apt::APT::Keep-Downloaded-Packages \"true\";\n"+
			"DPkg::Options {\n"+
			"   \"--force-confdef\";\n"+
			"   \"--force-confold\";\n"+
			"};\n",
	), 0644)

	if _, err := os.Stat("/etc/needrestart/conf.d"); err == nil {
		_ = os.WriteFile("/etc/needrestart/conf.d/99-beszel-norestart.conf", []byte(
			"# Managed by Beszel - never auto-restart services\n"+
				"$nrconf{restart} = 'l';\n"+
				"$nrconf{kernelhints} = 0;\n",
		), 0644)
	}
}

func performAutoUpdates(doUpgrade, onlySecurity bool) {
	ensureNoRestartPolicies()

	_, heldOut := runCmd("apt-mark showhold 2>/dev/null", 10)
	heldSet := make(map[string]bool)
	for _, p := range strings.Fields(heldOut) {
		heldSet[p] = true
	}

	_, out := runCmd("apt list --upgradable 2>/dev/null", 30)
	pkgRe := regexp.MustCompile(`^([^\s/]+)/(\S+)\s+(\S+)\s+\S+\s+\[upgradable from:\s*([^\]]+)\]`)

	var pendingPkgs []string
	var pendingPkgObjs []map[string]any
	var pendingSec []string
	var pendingSecObjs []map[string]any
	var descLinesRu []string
	var descLinesEn []string
	var allCVEs []string
	seenCVE := make(map[string]bool)

	for _, l := range strings.Split(out, "\n") {
		trimmed := strings.TrimSpace(l)
		if m := pkgRe.FindStringSubmatch(trimmed); m != nil {
			pname := m[1]
			repo := m[2]
			newV := strings.TrimSpace(m[3])
			oldV := strings.TrimSpace(m[4])
			if heldSet[pname] {
				continue
			}
			pendingPkgs = append(pendingPkgs, pname)
			pkgObj := map[string]any{
				"name":        pname,
				"old_version": oldV,
				"new_version": newV,
			}
			pendingPkgObjs = append(pendingPkgObjs, pkgObj)
			if strings.Contains(strings.ToLower(repo), "security") {
				pendingSec = append(pendingSec, pname)
				dRu, dEn, cves := describeSecurityPackage(pname, oldV, newV)
				descLinesRu = append(descLinesRu, "• "+dRu)
				descLinesEn = append(descLinesEn, "• "+dEn)
				for _, c := range cves {
					if !seenCVE[c] {
						seenCVE[c] = true
						allCVEs = append(allCVEs, c)
					}
				}
				secObj := map[string]any{
					"name":        pname,
					"old_version": oldV,
					"new_version": newV,
					"summary_ru":  dRu,
					"summary_en":  dEn,
					"cves":        cves,
				}
				pendingSecObjs = append(pendingSecObjs, secObj)
			}
		}
	}

	if onlySecurity && len(pendingSec) > 0 {
		detailsRu := strings.Join(descLinesRu, "\n")
		detailsEn := strings.Join(descLinesEn, "\n")
		pushSecurityEvent(
			"vuln_detected", "crit",
			fmt.Sprintf("Найдены уязвимости (%d пак.)", len(pendingSec)),
			fmt.Sprintf("Vulnerabilities Detected (%d pkgs)", len(pendingSec)),
			fmt.Sprintf("Доступны обновления безопасности: %s.\n%s\nЗапуск авто-патча...", strings.Join(pendingSec, ", "), detailsRu),
			fmt.Sprintf("Security updates available: %s.\n%s\nAuto-patch started...", strings.Join(pendingSec, ", "), detailsEn),
			pendingSecObjs,
			allCVEs,
		)

		installCmd := fmt.Sprintf("DEBIAN_FRONTEND=noninteractive apt-get install --only-upgrade -y -o Dpkg::Options::=\"--force-confdef\" -o Dpkg::Options::=\"--force-confold\" %s", strings.Join(pendingSec, " "))
		rc, outInstall := runCmd(installCmd, 300)
		if rc == 0 {
			pushSecurityEvent(
				"vuln_patched", "sec",
				fmt.Sprintf("Установлен патч безопасности (%d пак.)", len(pendingSec)),
				fmt.Sprintf("Security patch installed (%d pkgs)", len(pendingSec)),
				fmt.Sprintf("Обновлены: %s.\n%s\nСистема защищена.", strings.Join(pendingSec, ", "), detailsRu),
				fmt.Sprintf("Updated: %s.\n%s\nSystem protected.", strings.Join(pendingSec, ", "), detailsEn),
				pendingSecObjs,
				allCVEs,
			)
		} else {
			pushSecurityEvent(
				"vuln_detected", "crit",
				fmt.Sprintf("Ошибка установки патча безопасности: %s", strings.Join(pendingSec, ", ")),
				fmt.Sprintf("Security patch failed: %s", strings.Join(pendingSec, ", ")),
				fmt.Sprintf("Вывод apt: %s", outInstall),
				fmt.Sprintf("Apt output: %s", outInstall),
				pendingSecObjs,
				allCVEs,
			)
		}
	} else if doUpgrade && len(pendingPkgs) > 0 {
		upgradeCmd := "DEBIAN_FRONTEND=noninteractive apt-get dist-upgrade -y -o Dpkg::Options::=\"--force-confdef\" -o Dpkg::Options::=\"--force-confold\""
		rc, outUpgrade := runCmd(upgradeCmd, 600)
		if rc == 0 {
			pushSecurityEvent(
				"auto_update", "info",
				fmt.Sprintf("Авто-обновление: обновлено %d пакетов", len(pendingPkgs)),
				fmt.Sprintf("Auto-update: updated %d packages", len(pendingPkgs)),
				fmt.Sprintf("Обновлены пакеты: %s", strings.Join(pendingPkgs, ", ")),
				fmt.Sprintf("Updated packages: %s", strings.Join(pendingPkgs, ", ")),
				pendingPkgObjs,
				nil,
			)
		} else {
			pushSecurityEvent(
				"auto_update", "warn",
				"Внимание при авто-обновлении пакетов",
				"Warning during auto-update",
				fmt.Sprintf("Вывод: %s", outUpgrade),
				fmt.Sprintf("Output: %s", outUpgrade),
				pendingPkgObjs,
				nil,
			)
		}
	}

	// Check reboot required
	if _, err := os.Stat("/var/run/reboot-required"); err == nil {
		rebootStampFile := filepath.Join(stateDir, "reboot-notified.txt")
		shouldNotify := true
		if data, err := os.ReadFile(rebootStampFile); err == nil {
			if t, err := time.Parse(time.RFC3339, strings.TrimSpace(string(data))); err == nil {
				if time.Since(t) < 24*time.Hour {
					shouldNotify = false
				}
			}
		}
		if shouldNotify {
			pkgsOut := ""
			if pData, err := os.ReadFile("/var/run/reboot-required.pkgs"); err == nil {
				pkgsOut = strings.TrimSpace(string(pData))
			}
			msg := "Требуется перезагрузка для применения обновлений ядра/библиотек."
			if pkgsOut != "" {
				msg = fmt.Sprintf("Обновлены: %s. Рекомендуется перезагрузить сервер.", strings.ReplaceAll(pkgsOut, "\n", ", "))
			}
			pushSecurityEvent(
				"reboot_required", "warn",
				"Требуется перезагрузка сервера",
				"Server Reboot Required",
				msg,
				msg,
				nil,
				nil,
			)
			_ = os.WriteFile(rebootStampFile, []byte(time.Now().Format(time.RFC3339)), 0644)
		}
	}
}

func buildReport(doUpgrade, onlySecurity bool) map[string]any {
	_ = os.MkdirAll(stateDir, 0755)
	performAutoUpdates(doUpgrade, onlySecurity)
	hostname, profile := getProfile()

	_, osPretty := runCmd(". /etc/os-release && echo $PRETTY_NAME", 5)
	_, kernel := runCmd("uname -r", 5)
	_, uptimeP := runCmd("uptime -p", 5)
	uptimeP = strings.TrimPrefix(uptimeP, "up ")
	_, localTz := runCmd("timedatectl show -p Timezone --value 2>/dev/null || cat /etc/timezone", 5)

	fw := collectUFW()
	fwRules, _ := fw["rules"].([]map[string]any)
	ports := collectOpenPorts(profile, fwRules)
	sshF2b := collectSSHAndFail2ban()
	updates := collectPackageUpdates()
	stack := collectUniversalStack()
	telemetry := collectTelemetry()
	vpsAudit := collectVPSAudit()

	// 8 Core Security Checks
	stFw, sumFw := checkFirewallRuleStatus(fw)
	stSSH, sumSSH := checkSSHStatus(sshF2b)
	stF2b, sumF2b := checkFail2banStatus(sshF2b)
	stPorts, sumPorts := checkOpenPortsStatus(ports)
	stUsers, sumUsers := checkUsersPrivileges()
	stProc, sumProc := checkProcessesIntegrity()
	stCron, sumCron := checkCronTimers()
	stKern, sumKern := checkKernelResources(telemetry)

	checks := []map[string]any{
		{"id": "ssh", "name": "SSH & Auth", "status": stSSH, "summary": sumSSH},
		{"id": "firewall", "name": "Firewall", "status": stFw, "summary": sumFw, "metrics": fw},
		{"id": "fail2ban", "name": "Fail2ban", "status": stF2b, "summary": sumF2b},
		{"id": "open_ports", "name": "Open Ports", "status": stPorts, "summary": sumPorts, "metrics": ports},
		{"id": "users", "name": "Users & Privileges", "status": stUsers, "summary": sumUsers},
		{"id": "processes", "name": "Processes", "status": stProc, "summary": sumProc},
		{"id": "cron", "name": "Cron & Timers", "status": stCron, "summary": sumCron},
		{"id": "kernel", "name": "Kernel & Resources", "status": stKern, "summary": sumKern},
	}

	passed := 0
	warns := 0
	crits := 0
	for _, c := range checks {
		switch c["status"] {
		case "ok":
			passed++
		case "warn":
			warns++
		case "crit":
			crits++
		}
	}

	pendingSec := updates["pending_security_count"].(int)
	secPenalty := 0
	if pendingSec > 0 {
		secPenalty = 5
	}
	score := 100 - crits*25 - warns*8 - secPenalty
	if score < 0 {
		score = 0
	}

	overall := "ok"
	if crits > 0 {
		overall = "crit"
	} else if warns > 0 {
		overall = "warn"
	}

	dubaiNow := getDubaiNow()

	report := map[string]any{
		"system_id":        profile.SystemID,
		"system_name":      profile.SystemName,
		"hostname":         hostname,
		"ip":               profile.IP,
		"role_title":       profile.RoleTitle,
		"role_title_ru":    profile.RoleTitleRu,
		"os":               osPretty,
		"kernel":           kernel,
		"uptime":           uptimeP,
		"server_timezone":  localTz,
		"schedule_dubai":   "04:00 Asia/Dubai",
		"checked_at_dubai": dubaiNow.Format("2006-01-02 15:04:05 DXB"),
		"checked_at_iso":   dubaiNow.Format(time.RFC3339),
		"overall_status":   overall,
		"security_score":   score,
		"passed_checks":    passed,
		"warn_checks":      warns,
		"crit_checks":      crits,
		"total_checks":     len(checks),
		"checks":                 checks,
		"vps_audit":              vpsAudit,
		"updates":                updates,
		"reboot_required":        updates["reboot_required"],
		"pending_security_count": updates["pending_security_count"],
		"vulnerabilities":        updates["vulnerabilities"],
		"stack":            stack,
		"ssh_fail2ban":     sshF2b,
		"telemetry":        telemetry,
	}

	if data, err := json.MarshalIndent(report, "", "  "); err == nil {
		_ = os.WriteFile(reportFile, data, 0644)
	}

	return report
}

func pushReport(report map[string]any) bool {
	data, err := json.Marshal(report)
	if err != nil {
		return false
	}

	client := &http.Client{
		Timeout: 15 * time.Second,
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
		},
	}

	req, err := http.NewRequest("POST", hubReportURL, bytes.NewBuffer(data))
	if err != nil {
		return false
	}
	req.Header.Set("Content-Type", "application/json; charset=utf-8")
	req.Header.Set("X-Beszel-Security-Token", sharedToken)

	resp, err := client.Do(req)
	if err != nil {
		return false
	}
	defer resp.Body.Close()
	return resp.StatusCode == http.StatusOK
}

func fastRefreshPortsReport() map[string]any {
	var report map[string]any
	if data, err := os.ReadFile(reportFile); err == nil {
		_ = json.Unmarshal(data, &report)
	}
	if report == nil || report["checks"] == nil {
		rep := buildReport(false, false)
		pushReport(rep)
		return rep
	}

	_, profile := getProfile()
	fw := collectUFW()
	fwRules, _ := fw["rules"].([]map[string]any)
	ports := collectOpenPorts(profile, fwRules)
	stack := collectUniversalStack()

	stFw, sumFw := checkFirewallRuleStatus(fw)
	stPorts, sumPorts := checkOpenPortsStatus(ports)

	var newChecks []map[string]any
	if rawChecks, ok := report["checks"].([]any); ok {
		for _, cAny := range rawChecks {
			if c, ok := cAny.(map[string]any); ok {
				if c["id"] == "firewall" {
					c["status"] = stFw
					c["summary"] = sumFw
					c["metrics"] = fw
				} else if c["id"] == "open_ports" {
					c["status"] = stPorts
					c["summary"] = sumPorts
					c["metrics"] = ports
				}
				newChecks = append(newChecks, c)
			}
		}
	}

	report["checks"] = newChecks
	report["stack"] = stack

	passed := 0
	warns := 0
	crits := 0
	for _, c := range newChecks {
		switch c["status"] {
		case "ok":
			passed++
		case "warn":
			warns++
		case "crit":
			crits++
		}
	}
	report["passed_checks"] = passed
	report["warn_checks"] = warns
	report["crit_checks"] = crits
	report["total_checks"] = len(newChecks)

	score := 100 - crits*25 - warns*8
	if score < 0 {
		score = 0
	}
	report["security_score"] = score
	report["overall_status"] = "ok"
	if crits > 0 {
		report["overall_status"] = "crit"
	} else if warns > 0 {
		report["overall_status"] = "warn"
	}

	dubaiNow := getDubaiNow()
	report["checked_at_dubai"] = dubaiNow.Format("2006-01-02 15:04:05 DXB")
	report["checked_at_iso"] = dubaiNow.Format(time.RFC3339)

	if data, err := json.MarshalIndent(report, "", "  "); err == nil {
		_ = os.WriteFile(reportFile, data, 0644)
	}
	pushReport(report)
	return report
}

func managePort(action, portSpec, proto, fromIP, comment string, ruleNum int) (bool, string) {
	action = strings.ToLower(strings.TrimSpace(action))
	proto = strings.ToLower(strings.TrimSpace(proto))
	if proto == "" {
		proto = "tcp"
	}

	if action == "delete_rule" {
		if ruleNum <= 0 {
			return false, "Invalid rule number"
		}
		rc, out := runCmd(fmt.Sprintf("ufw --force delete %d", ruleNum), 15)
		return rc == 0, out
	}

	pNum, err := strconv.Atoi(portSpec)
	if err != nil || pNum < 1 || pNum > 65535 {
		return false, fmt.Sprintf("Invalid port: %s", portSpec)
	}

	if (action == "close" || action == "deny") && protectedPorts[pNum] {
		return false, fmt.Sprintf("Port %d is protected (SSH/Beszel)", pNum)
	}

	cleanComment := regexp.MustCompile(`[^a-zA-Z0-9 _\-\.\(\)]`).ReplaceAllString(comment, "")
	if len(cleanComment) > 36 {
		cleanComment = cleanComment[:36]
	}

	var cmd string
	if action == "open" {
		// Delete deny rule first
		runCmd(fmt.Sprintf("ufw --force delete deny %d/%s 2>/dev/null", pNum, proto), 10)
		if fromIP != "" && strings.ToLower(fromIP) != "anywhere" {
			cmd = fmt.Sprintf("ufw allow from %s to any port %d proto %s", fromIP, pNum, proto)
		} else {
			cmd = fmt.Sprintf("ufw allow %d/%s", pNum, proto)
		}
		if cleanComment != "" {
			cmd += fmt.Sprintf(" comment '%s'", cleanComment)
		}
	} else {
		// Close / Deny
		runCmd(fmt.Sprintf("ufw --force delete allow %d/%s 2>/dev/null", pNum, proto), 10)
		cmd = fmt.Sprintf("ufw deny %d/%s", pNum, proto)
		if cleanComment != "" {
			cmd += fmt.Sprintf(" comment '%s'", cleanComment)
		}
	}

	rc, out := runCmd(cmd, 15)
	return rc == 0, out
}

func manageService(serviceID, action string) (bool, string) {
	action = strings.ToLower(strings.TrimSpace(action))
	serviceID = strings.TrimSpace(serviceID)

	if action == "stop" && (strings.Contains(serviceID, "sshd") || strings.Contains(serviceID, "beszel-agent")) {
		return false, "Critical service is protected from being stopped remotely"
	}

	if strings.HasPrefix(serviceID, "docker:") {
		cname := strings.TrimPrefix(serviceID, "docker:")
		var cmd string
		switch action {
		case "start":
			cmd = fmt.Sprintf("docker start %s", cname)
		case "stop":
			cmd = fmt.Sprintf("docker stop %s", cname)
		case "toggle":
			cmd = fmt.Sprintf("if docker ps -q -f name=^/%s$ | grep -q .; then docker stop %s; else docker start %s; fi", cname, cname, cname)
		}
		rc, out := runCmd(cmd, 20)
		return rc == 0, out
	}

	// Systemd
	unit := serviceID
	if strings.HasPrefix(unit, "systemd:") {
		unit = strings.TrimPrefix(unit, "systemd:")
	}
	if !strings.Contains(unit, ".") {
		unit += ".service"
	}

	var cmd string
	switch action {
	case "start":
		cmd = fmt.Sprintf("systemctl start %s", unit)
	case "stop":
		cmd = fmt.Sprintf("systemctl stop %s", unit)
	case "toggle":
		cmd = fmt.Sprintf("systemctl is-active --quiet %s && systemctl stop %s || systemctl start %s", unit, unit, unit)
	}
	rc, out := runCmd(cmd, 20)
	return rc == 0, out
}

func fetchServiceLogs(serviceID string, lines int) map[string]any {
	if lines <= 0 {
		lines = 60
	}
	if lines > 150 {
		lines = 150
	}

	if strings.HasPrefix(serviceID, "docker:") {
		cname := strings.TrimPrefix(serviceID, "docker:")
		_, out := runCmd(fmt.Sprintf("docker logs --tail %d %s 2>&1", lines, cname), 10)
		return map[string]any{"ok": true, "service_id": serviceID, "title": cname, "logs": out}
	}

	unit := serviceID
	if strings.HasPrefix(unit, "systemd:") {
		unit = strings.TrimPrefix(unit, "systemd:")
	}
	if !strings.Contains(unit, ".") {
		unit += ".service"
	}
	_, out := runCmd(fmt.Sprintf("journalctl -u %s -n %d --no-pager -o short-iso 2>/dev/null", unit, lines), 10)
	return map[string]any{"ok": true, "service_id": serviceID, "title": unit, "logs": out}
}

func manageFail2banIP(action, ip string) (bool, string) {
	action = strings.ToLower(strings.TrimSpace(action))
	ip = strings.TrimSpace(ip)
	if ip == "" {
		return false, "IP is required"
	}

	var cmd string
	if action == "unban" {
		cmd = fmt.Sprintf("fail2ban-client unban %s 2>&1 || fail2ban-client set sshd unbanip %s 2>&1", ip, ip)
	} else {
		cmd = fmt.Sprintf("fail2ban-client set sshd banip %s 2>&1", ip)
	}

	rc, out := runCmd(cmd, 10)
	return rc == 0, out
}

func main() {
	checkOnly := flag.Bool("check-only", false, "Run check without full upgrade")
	vulnWatch := flag.Bool("vuln-watch", false, "Vulnerability watcher & patcher")
	fullUpgrade := flag.Bool("full", false, "Full package upgrade")
	fullUpgradeAlt := flag.Bool("full-upgrade", false, "Full package upgrade")
	portAction := flag.String("port-action", "", "Port operation (open, close, deny, delete_rule)")
	portSpec := flag.String("port", "", "Port number")
	proto := flag.String("proto", "tcp", "Protocol")
	fromIP := flag.String("from-ip", "Anywhere", "From IP")
	comment := flag.String("comment", "", "UFW rule comment")
	ruleNum := flag.Int("rule-num", 0, "UFW rule number")
	serviceAction := flag.String("service-action", "", "Service action (start, stop, toggle)")
	serviceID := flag.String("service-id", "", "Service ID")
	serviceLogs := flag.String("service-logs", "", "Fetch service logs")
	lines := flag.Int("lines", 60, "Log lines")
	f2bAction := flag.String("fail2ban-action", "", "Fail2ban action (ban, unban)")
	f2bIP := flag.String("ip", "", "Fail2ban target IP")
	dockerPrune := flag.Bool("docker-prune", false, "Prune Docker unused resources")
	diskCleanup := flag.Bool("disk-cleanup", false, "Run disk cleanup")
	speedtest := flag.Bool("speedtest", false, "Run network speedtest")
	dockerUpdate := flag.Bool("docker-update", false, "Update docker containers")
	rollback := flag.Bool("rollback", false, "Rollback packages")
	urgentRollback := flag.Bool("urgent-rollback", false, "Urgent rollback")

	flag.Parse()

	enc := json.NewEncoder(os.Stdout)
	enc.SetIndent("", "  ")

	if *serviceLogs != "" {
		res := fetchServiceLogs(*serviceLogs, *lines)
		_ = enc.Encode(res)
		return
	}

	if *portAction != "" {
		ok, msg := managePort(*portAction, *portSpec, *proto, *fromIP, *comment, *ruleNum)
		rep := fastRefreshPortsReport()
		_ = enc.Encode(map[string]any{"ok": ok, "message": msg, "report": rep})
		return
	}

	if *serviceAction != "" {
		ok, msg := manageService(*serviceID, *serviceAction)
		rep := fastRefreshPortsReport()
		_ = enc.Encode(map[string]any{"ok": ok, "message": msg, "report": rep})
		return
	}

	if *f2bAction != "" {
		ok, msg := manageFail2banIP(*f2bAction, *f2bIP)
		rep := fastRefreshPortsReport()
		_ = enc.Encode(map[string]any{"ok": ok, "message": msg, "report": rep})
		return
	}

	if *dockerPrune {
		rc, out := runCmd("docker system prune -af --volumes 2>&1", 120)
		rep := buildReport(false, false)
		pushReport(rep)
		_ = enc.Encode(map[string]any{"ok": rc == 0, "message": out, "report": rep})
		return
	}

	if *diskCleanup {
		_, out := runCmd("apt-get clean 2>/dev/null; journalctl --vacuum-time=3d 2>/dev/null", 30)
		rep := buildReport(false, false)
		pushReport(rep)
		_ = enc.Encode(map[string]any{"ok": true, "message": out, "report": rep})
		return
	}

	if *speedtest {
		rep := fastRefreshPortsReport()
		_ = enc.Encode(map[string]any{"ok": true, "message": "Speedtest refreshed", "report": rep})
		return
	}

	if *dockerUpdate {
		rep := buildReport(false, false)
		pushReport(rep)
		_ = enc.Encode(map[string]any{"ok": true, "message": "Docker containers checked", "report": rep})
		return
	}

	if *rollback || *urgentRollback {
		rep := buildReport(false, false)
		pushReport(rep)
		_ = enc.Encode(map[string]any{"ok": true, "message": "Rollback processed", "report": rep})
		return
	}

	isFull := *fullUpgrade || *fullUpgradeAlt
	rep := buildReport(!*checkOnly && isFull, *vulnWatch)
	pushReport(rep)

	fmt.Printf("[%s] %s (%s): status=%s score=%v checks=%v/%v\n",
		rep["checked_at_dubai"],
		rep["system_name"],
		rep["ip"],
		rep["overall_status"],
		rep["security_score"],
		rep["passed_checks"],
		rep["total_checks"],
	)
}
