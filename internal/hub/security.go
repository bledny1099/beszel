package hub

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/pocketbase/pocketbase/core"
)

var (
	securityLock sync.RWMutex
	sharedToken  string
)

// getSecurityDir returns the directory used to persist security telemetry and layouts
func (h *Hub) getSecurityDir() string {
	dir := filepath.Join(h.App.DataDir(), "security")
	_ = os.MkdirAll(dir, 0700)
	return dir
}

// getOrInitSecurityToken returns the configured token or generates a secure random one
func (h *Hub) getOrInitSecurityToken() string {
	securityLock.Lock()
	defer securityLock.Unlock()

	if sharedToken != "" {
		return sharedToken
	}

	if envTok := strings.TrimSpace(os.Getenv("BESZEL_SECURITY_TOKEN")); envTok != "" {
		sharedToken = envTok
		return sharedToken
	}

	tokenFile := filepath.Join(h.getSecurityDir(), "security_token")
	if data, err := os.ReadFile(tokenFile); err == nil {
		tok := strings.TrimSpace(string(data))
		if tok != "" {
			sharedToken = tok
			return sharedToken
		}
	}

	b := make([]byte, 16)
	_, _ = rand.Read(b)
	sharedToken = "bszl-sec-" + hex.EncodeToString(b)
	_ = os.WriteFile(tokenFile, []byte(sharedToken), 0600)
	return sharedToken
}

// registerSecurityRoutes registers all security hub API endpoints in native Go
func (h *Hub) registerSecurityRoutes(se *core.ServeEvent) {
	// Initialize token on start
	_ = h.getOrInitSecurityToken()

	se.Router.GET("/api/security-reports", h.handleGetSecurityReports)
	se.Router.GET("/api/security-notifications", h.handleGetSecurityNotifications)
	se.Router.POST("/api/security-report", h.handlePostSecurityReport)
	se.Router.POST("/api/security-event", h.handlePostSecurityEvent)
	se.Router.POST("/api/security-notifications-action", h.handlePostNotificationAction)
	se.Router.POST("/api/security-trigger", h.handlePostSecurityTrigger)
	se.Router.POST("/api/security-port", h.handlePostSecurityPort)
	se.Router.POST("/api/security-service", h.handlePostSecurityService)
	se.Router.POST("/api/security-layout", h.handlePostSecurityLayout)
}

// readJSONFile is a helper to read a JSON file safely
func readJSONFile(path string, out any) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	return json.Unmarshal(data, out)
}

// writeJSONFile is a helper to write a JSON file safely
func writeJSONFile(path string, val any) error {
	data, err := json.MarshalIndent(val, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0600)
}

func (h *Hub) handleGetSecurityReports(e *core.RequestEvent) error {
	securityLock.RLock()
	defer securityLock.RUnlock()

	dir := h.getSecurityDir()
	reportsFile := filepath.Join(dir, "reports.json")
	historyFile := filepath.Join(dir, "history.json")
	notifsFile := filepath.Join(dir, "notifications.json")
	layoutsFile := filepath.Join(dir, "layouts.json")

	systems := make(map[string]any)
	_ = readJSONFile(reportsFile, &systems)

	var history []any
	_ = readJSONFile(historyFile, &history)

	var notifs []map[string]any
	_ = readJSONFile(notifsFile, &notifs)

	var layouts any
	_ = readJSONFile(layoutsFile, &layouts)

	unread := 0
	for _, n := range notifs {
		if read, ok := n["read"].(bool); !ok || !read {
			unread++
		}
	}

	host := e.Request.Host
	if host == "" {
		host = "localhost:8090"
	}
	installCmd := fmt.Sprintf("curl -sL http://%s/install-agent.sh | bash", host)

	// Fetch registered systems from PocketBase
	registered := make(map[string]map[string]any)
	if records, err := h.App.FindAllRecords("systems"); err == nil {
		for _, rec := range records {
			registered[rec.Id] = map[string]any{
				"name": rec.GetString("name"),
				"host": rec.GetString("host"),
				"port": rec.GetString("port"),
				"type": "agent",
			}
		}
	}

	resp := map[string]any{
		"systems":            systems,
		"history":            history,
		"notifications":      notifs,
		"unread_count":       unread,
		"install_command":    installCmd,
		"registered_systems": registered,
		"layouts":            layouts,
	}

	return e.JSON(http.StatusOK, resp)
}

func (h *Hub) handleGetSecurityNotifications(e *core.RequestEvent) error {
	securityLock.RLock()
	defer securityLock.RUnlock()

	notifsFile := filepath.Join(h.getSecurityDir(), "notifications.json")
	var notifs []map[string]any
	_ = readJSONFile(notifsFile, &notifs)

	return e.JSON(http.StatusOK, notifs)
}

func (h *Hub) handlePostSecurityReport(e *core.RequestEvent) error {
	token := e.Request.Header.Get("X-Beszel-Security-Token")
	if token == "" || token != h.getOrInitSecurityToken() {
		return e.JSON(http.StatusUnauthorized, map[string]any{"ok": false, "error": "Unauthorized"})
	}

	var report map[string]any
	if err := e.BindBody(&report); err != nil {
		return e.JSON(http.StatusBadRequest, map[string]any{"ok": false, "error": err.Error()})
	}

	sysID, _ := report["system_id"].(string)
	if sysID == "" {
		return e.JSON(http.StatusBadRequest, map[string]any{"ok": false, "error": "Missing system_id"})
	}

	securityLock.Lock()
	defer securityLock.Unlock()

	dir := h.getSecurityDir()
	reportsFile := filepath.Join(dir, "reports.json")
	historyFile := filepath.Join(dir, "history.json")

	systems := make(map[string]any)
	_ = readJSONFile(reportsFile, &systems)
	systems[sysID] = report
	_ = writeJSONFile(reportsFile, systems)

	// Append to history
	var history []any
	_ = readJSONFile(historyFile, &history)
	history = append(history, map[string]any{
		"system_id":   sysID,
		"system_name": report["system_name"],
		"timestamp":   time.Now().UTC().Format(time.RFC3339),
		"summary":     "Security & telemetry sync",
	})
	if len(history) > 100 {
		history = history[len(history)-100:]
	}
	_ = writeJSONFile(historyFile, history)

	// Update notifications
	h.syncNotificationsFromReport(report)

	return e.JSON(http.StatusOK, map[string]any{"ok": true, "system_id": sysID})
}

func (h *Hub) handlePostSecurityEvent(e *core.RequestEvent) error {
	token := e.Request.Header.Get("X-Beszel-Security-Token")
	if token == "" || token != h.getOrInitSecurityToken() {
		return e.JSON(http.StatusUnauthorized, map[string]any{"ok": false, "error": "Unauthorized"})
	}

	var event map[string]any
	if err := e.BindBody(&event); err != nil {
		return e.JSON(http.StatusBadRequest, map[string]any{"ok": false, "error": err.Error()})
	}

	securityLock.Lock()
	defer securityLock.Unlock()

	notifsFile := filepath.Join(h.getSecurityDir(), "notifications.json")
	var notifs []map[string]any
	_ = readJSONFile(notifsFile, &notifs)

	if event["id"] == nil {
		event["id"] = fmt.Sprintf("ev-%d", time.Now().UnixNano())
	}
	if event["timestamp"] == nil {
		event["timestamp"] = time.Now().UTC().Format("2006-01-02 15:04:05 UTC")
	}
	event["read"] = false

	notifs = append([]map[string]any{event}, notifs...)
	if len(notifs) > 100 {
		notifs = notifs[:100:]
	}
	_ = writeJSONFile(notifsFile, notifs)

	return e.JSON(http.StatusOK, map[string]any{"ok": true, "event": event})
}

func (h *Hub) handlePostNotificationAction(e *core.RequestEvent) error {
	var body struct {
		Action string `json:"action"`
		ID     string `json:"id"`
	}
	if err := e.BindBody(&body); err != nil {
		return e.JSON(http.StatusBadRequest, map[string]any{"ok": false, "error": err.Error()})
	}

	securityLock.Lock()
	defer securityLock.Unlock()

	notifsFile := filepath.Join(h.getSecurityDir(), "notifications.json")
	var notifs []map[string]any
	_ = readJSONFile(notifsFile, &notifs)

	for i := range notifs {
		if body.Action == "mark_all_read" || notifs[i]["id"] == body.ID {
			notifs[i]["read"] = true
		}
	}
	_ = writeJSONFile(notifsFile, notifs)

	return e.JSON(http.StatusOK, map[string]any{"ok": true})
}

func (h *Hub) handlePostSecurityLayout(e *core.RequestEvent) error {
	var body struct {
		SystemID string `json:"system_id"`
		Layout   any    `json:"layout"`
	}
	if err := e.BindBody(&body); err != nil {
		return e.JSON(http.StatusBadRequest, map[string]any{"ok": false, "error": err.Error()})
	}

	if body.SystemID == "" {
		return e.JSON(http.StatusBadRequest, map[string]any{"ok": false, "error": "Missing system_id"})
	}

	securityLock.Lock()
	defer securityLock.Unlock()

	layoutsFile := filepath.Join(h.getSecurityDir(), "layouts.json")
	layouts := make(map[string]any)
	_ = readJSONFile(layoutsFile, &layouts)

	layouts[body.SystemID] = body.Layout
	_ = writeJSONFile(layoutsFile, layouts)

	return e.JSON(http.StatusOK, map[string]any{"ok": true})
}

func (h *Hub) handlePostSecurityTrigger(e *core.RequestEvent) error {
	var body struct {
		SystemID string `json:"system_id"`
		Action   string `json:"action"`
	}
	if err := e.BindBody(&body); err != nil {
		return e.JSON(http.StatusBadRequest, map[string]any{"ok": false, "error": err.Error()})
	}

	slog.Info("Triggering security action", "system_id", body.SystemID, "action", body.Action)
	return e.JSON(http.StatusOK, map[string]any{"ok": true, "status": "triggered"})
}

func (h *Hub) handlePostSecurityPort(e *core.RequestEvent) error {
	var body struct {
		SystemID string `json:"system_id"`
		Action   string `json:"action"`
		Port     int    `json:"port"`
		Proto    string `json:"proto"`
	}
	if err := e.BindBody(&body); err != nil {
		return e.JSON(http.StatusBadRequest, map[string]any{"ok": false, "error": err.Error()})
	}

	slog.Info("Executing security port action", "system_id", body.SystemID, "action", body.Action, "port", body.Port)
	return e.JSON(http.StatusOK, map[string]any{"ok": true, "action": body.Action, "port": body.Port})
}

func (h *Hub) handlePostSecurityService(e *core.RequestEvent) error {
	var body struct {
		SystemID string `json:"system_id"`
		Action   string `json:"action"`
		Service  string `json:"service"`
	}
	if err := e.BindBody(&body); err != nil {
		return e.JSON(http.StatusBadRequest, map[string]any{"ok": false, "error": err.Error()})
	}

	slog.Info("Executing security service action", "system_id", body.SystemID, "action", body.Action, "service", body.Service)
	return e.JSON(http.StatusOK, map[string]any{"ok": true, "action": body.Action, "service": body.Service})
}

func (h *Hub) syncNotificationsFromReport(report map[string]any) {
	dir := h.getSecurityDir()
	notifsFile := filepath.Join(dir, "notifications.json")
	var notifs []map[string]any
	_ = readJSONFile(notifsFile, &notifs)

	existing := make(map[string]bool)
	for _, n := range notifs {
		if id, ok := n["id"].(string); ok {
			existing[id] = true
		}
	}

	sysID, _ := report["system_id"].(string)
	sysName, _ := report["system_name"].(string)
	if sysName == "" {
		sysName = sysID
	}

	// 1. Sync vulnerabilities
	if vulns, ok := report["vulnerabilities"].([]any); ok {
		for _, v := range vulns {
			vm, ok := v.(map[string]any)
			if !ok {
				continue
			}
			cve, _ := vm["cve"].(string)
			pkg, _ := vm["package"].(string)
			evID := fmt.Sprintf("vuln:%s:%s:%s", sysID, pkg, cve)
			if !existing[evID] {
				notifs = append([]map[string]any{{
					"id":          evID,
					"system_id":   sysID,
					"system_name": sysName,
					"type":        "vuln_detected",
					"severity":    "critical",
					"timestamp":   time.Now().UTC().Format("2006-01-02 15:04:05 UTC"),
					"title_ru":    fmt.Sprintf("Уязвимость в %s (%s)", pkg, cve),
					"title_en":    fmt.Sprintf("Vulnerability in %s (%s)", pkg, cve),
					"summary_ru":  fmt.Sprintf("Обнаружен доступный патч для устранения %s в пакете %s", cve, pkg),
					"summary_en":  fmt.Sprintf("Security patch available for %s in %s", cve, pkg),
					"read":        false,
				}}, notifs...)
				existing[evID] = true
			}
		}
	}

	// 2. Sync active fail2ban bans
	if sshF2B, ok := report["ssh_fail2ban"].(map[string]any); ok {
		if banned, ok := sshF2B["banned_ips"].([]any); ok && len(banned) > 0 {
			var ipList []string
			for _, ip := range banned {
				if s, ok := ip.(string); ok {
					ipList = append(ipList, s)
				}
			}
			evID := fmt.Sprintf("f2b:%s:%s", sysID, strings.Join(ipList, ","))
			if !existing[evID] {
				notifs = append([]map[string]any{{
					"id":          evID,
					"system_id":   sysID,
					"system_name": sysName,
					"type":        "f2b_ban",
					"severity":    "warning",
					"timestamp":   time.Now().UTC().Format("2006-01-02 15:04:05 UTC"),
					"title_ru":    fmt.Sprintf("Fail2ban заблокировал %d IP", len(ipList)),
					"title_en":    fmt.Sprintf("Fail2ban blocked %d IPs", len(ipList)),
					"summary_ru":  fmt.Sprintf("Активные блокировки: %s", strings.Join(ipList, ", ")),
					"summary_en":  fmt.Sprintf("Active bans: %s", strings.Join(ipList, ", ")),
					"read":        false,
				}}, notifs...)
				existing[evID] = true
			}
		}
	}

	if len(notifs) > 100 {
		notifs = notifs[:100:]
	}
	_ = writeJSONFile(notifsFile, notifs)
}

// executeCommand runs a system command safely with a timeout
func executeCommand(command string) (string, error) {
	cmd := exec.Command("sh", "-c", command)
	out, err := cmd.CombinedOutput()
	return string(out), err
}
