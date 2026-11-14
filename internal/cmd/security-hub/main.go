package main

import (
	"bytes"
	"context"
	"crypto/sha1"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"

	_ "modernc.org/sqlite"
)

var (
	sharedToken     = getEnv("BESZEL_SECURITY_TOKEN", "bszl-sec-9120818483-dxb0400")
	dataDir         = getEnv("BESZEL_SECURITY_DATA_DIR", "/root/beszel/beszel_data/security")
	listenAddr      = getEnv("BESZEL_SECURITY_HUB_LISTEN", "127.0.0.1:8092")
	dbPath          = getEnv("BESZEL_DATA_DB", "/root/beszel/beszel_data/data.db")
	fileLock        sync.RWMutex
	notificationMtx sync.Mutex
)

const sshOpts = "-i /root/.ssh/beszel_audit_ed25519 -i /root/.ssh/id_ed25519 -o StrictHostKeyChecking=accept-new -o ConnectTimeout=6 -o ServerAliveInterval=5 -o ServerAliveCountMax=2 -o ControlMaster=auto -o ControlPath=/tmp/bszl-ssh-%r@%h:%p -o ControlPersist=600"

var runCommandOnTarget = runOnTarget

var triggerFlags = map[string]string{
	"check":         "--check-only",
	"full":          "--full",
	"vuln_watch":    "--vuln-watch",
	"docker_update": "--docker-update",
	"speedtest":     "--speedtest",
	"disk_cleanup":  "--disk-cleanup",
	"prune":         "--docker-prune",
}

type SystemTarget struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Type string `json:"type"` // "local" or "ssh"
	Host string `json:"host,omitempty"`
	Port int    `json:"port,omitempty"`
	User string `json:"user,omitempty"`
	Key  string `json:"key,omitempty"`
}

var defaultTargets = map[string]SystemTarget{
	"kgm0fv4mrdnjw4r": {ID: "kgm0fv4mrdnjw4r", Name: "The Private Network", Type: "local"},
	"zotmtzksqho8yof": {ID: "zotmtzksqho8yof", Name: "Hetzner", Type: "ssh", Host: "91.99.147.9", Port: 2244},
	"8paudjkafxqe9dx": {ID: "8paudjkafxqe9dx", Name: "NASAD SMP", Type: "ssh", Host: "187.126.121.210", Port: 2244},
	"4rnyjklpllef0yl": {ID: "4rnyjklpllef0yl", Name: "Lineage", Type: "ssh", Host: "100.64.0.5", Port: 8022, User: "u0_a161", Key: "/root/.ssh/id_ed25519"},
	"Lineage":         {ID: "Lineage", Name: "Lineage", Type: "ssh", Host: "100.64.0.5", Port: 8022, User: "u0_a161", Key: "/root/.ssh/id_ed25519"},
}

func getEnv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func getDubaiStr() string {
	loc := time.FixedZone("GST", 4*3600)
	return time.Now().In(loc).Format("2006-01-02 15:04:05 DXB")
}

func reportsFilePath() string       { return filepath.Join(dataDir, "reports.json") }
func historyFilePath() string       { return filepath.Join(dataDir, "history.json") }
func notificationsFilePath() string { return filepath.Join(dataDir, "notifications.json") }
func layoutsFilePath() string       { return filepath.Join(dataDir, "layouts.json") }
func alertsFilePath() string        { return filepath.Join(dataDir, "alert-config.json") }

type AlertConfig struct {
	TelegramEnabled      bool   `json:"telegram_enabled"`
	TelegramBotToken     string `json:"telegram_bot_token"`
	TelegramChatID       string `json:"telegram_chat_id"`
	NotifyVulnPatched    bool   `json:"notify_vuln_patched"`
	NotifyVulnDetected   bool   `json:"notify_vuln_detected"`
	NotifyAutoUpdate     bool   `json:"notify_auto_update"`
	NotifyRebootRequired bool   `json:"notify_reboot_required"`
	NotifyCritChecks     bool   `json:"notify_crit_checks"`
}

func loadAlertConfig() AlertConfig {
	cfg := AlertConfig{
		TelegramEnabled:      true,
		TelegramBotToken:     getEnv("BESZEL_TELEGRAM_BOT_TOKEN", "9217036122:AAH9pAIbNTLsJiF4VUeE_i-naPqrtk-UhgU"),
		TelegramChatID:       getEnv("BESZEL_TELEGRAM_CHAT_ID", "6157618020"),
		NotifyVulnPatched:    true,
		NotifyVulnDetected:   true,
		NotifyAutoUpdate:     true,
		NotifyRebootRequired: true,
		NotifyCritChecks:     true,
	}
	if data, err := os.ReadFile(alertsFilePath()); err == nil {
		_ = json.Unmarshal(data, &cfg)
	}
	return cfg
}

func saveAlertConfig(cfg AlertConfig) error {
	fileLock.Lock()
	defer fileLock.Unlock()
	_ = os.MkdirAll(dataDir, 0755)
	out, err := json.MarshalIndent(cfg, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(alertsFilePath(), out, 0644)
}

func escapeTelegramHTML(s string) string {
	s = strings.ReplaceAll(s, "&", "&amp;")
	s = strings.ReplaceAll(s, "<", "&lt;")
	s = strings.ReplaceAll(s, ">", "&gt;")
	return s
}

func richToClassicHTML(rich string) string {
	h := regexp.MustCompile(`<h\d>(.*?)</h\d>`).ReplaceAllString(rich, "<b>$1</b>\n")
	h = regexp.MustCompile(`<details[^>]*>\s*<summary>(.*?)</summary>`).ReplaceAllString(h, "\n<b>$1</b>\n")
	h = regexp.MustCompile(`</t[dh]>\s*<t[dh][^>]*>`).ReplaceAllString(h, " · ")
	h = regexp.MustCompile(`<li[^>]*>`).ReplaceAllString(h, "• ")
	h = regexp.MustCompile(`<br\s*/?>|</tr>|</li>|</p>|<hr\s*/?>|</footer>|</caption>`).ReplaceAllString(h, "\n")
	h = regexp.MustCompile(`</?(?:p|table|tr|td|th|ul|ol|footer|details|caption|aside)(?:\s[^>]*)?>`).ReplaceAllString(h, "")
	h = regexp.MustCompile(`\n{3,}`).ReplaceAllString(h, "\n\n")
	return strings.TrimSpace(h)
}

func sendTelegramMessage(token, chatID, richHTML string) (bool, string) {
	if token == "" || chatID == "" {
		return false, "Missing bot token or chat_id"
	}
	client := &http.Client{Timeout: 10 * time.Second}

	// 1. Send via Telegram Bot API 10.1+ sendRichMessage
	richURL := fmt.Sprintf("https://api.telegram.org/bot%s/sendRichMessage", token)
	richPayload := map[string]any{
		"chat_id": chatID,
		"rich_message": map[string]any{
			"html": richHTML,
		},
	}
	if body, err := json.Marshal(richPayload); err == nil {
		if resp, err := client.Post(richURL, "application/json", bytes.NewBuffer(body)); err == nil {
			respBytes, _ := io.ReadAll(resp.Body)
			resp.Body.Close()
			if resp.StatusCode == http.StatusOK {
				return true, string(respBytes)
			}
		}
	}

	// 2. Fallback to classic sendMessage if sendRichMessage is rejected
	apiURL := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", token)
	payload := map[string]any{
		"chat_id":                  chatID,
		"text":                     richToClassicHTML(richHTML),
		"parse_mode":               "HTML",
		"disable_web_page_preview": true,
	}
	body, err := json.Marshal(payload)
	if err != nil {
		return false, err.Error()
	}

	resp, err := client.Post(apiURL, "application/json", bytes.NewBuffer(body))
	if err != nil {
		return false, err.Error()
	}
	defer resp.Body.Close()
	respBytes, _ := io.ReadAll(resp.Body)
	return resp.StatusCode == http.StatusOK, string(respBytes)
}

func formatRichRefsHTML(text string) string {
	escaped := escapeTelegramHTML(text)
	cveRe := regexp.MustCompile(`CVE-\d{4}-\d+`)
	escaped = cveRe.ReplaceAllStringFunc(escaped, func(cve string) string {
		return fmt.Sprintf(`<a href="https://ubuntu.com/security/%s"><b>%s</b></a>`, cve, cve)
	})
	lpRe := regexp.MustCompile(`LP:\s*#(\d+)`)
	escaped = lpRe.ReplaceAllString(escaped, `<a href="https://bugs.launchpad.net/bugs/$1"><b>LP: #$1</b></a>`)
	debRe := regexp.MustCompile(`Debian\s*#(\d+)`)
	escaped = debRe.ReplaceAllString(escaped, `<a href="https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=$1"><b>Debian #$1</b></a>`)
	return escaped
}

func formatRichSummaryLine(line string) string {
	trimmed := strings.TrimSpace(line)
	trimmed = strings.TrimPrefix(trimmed, "• ")
	// Pattern: pkgName (oldVer → newVer): detail [refs]
	pkgLineRe := regexp.MustCompile(`^([a-zA-Z0-9._+-]+)(?:\s+\(([^)]+)\))?:\s+(.+)$`)
	if m := pkgLineRe.FindStringSubmatch(trimmed); m != nil {
		pkg := escapeTelegramHTML(m[1])
		ver := strings.TrimSpace(m[2])
		rest := m[3]
		verHTML := ""
		if ver != "" {
			parts := strings.Split(ver, "→")
			if len(parts) == 2 {
				verHTML = fmt.Sprintf(" (<code>%s</code> → <code>%s</code>)",
					escapeTelegramHTML(strings.TrimSpace(parts[0])),
					escapeTelegramHTML(strings.TrimSpace(parts[1])))
			} else {
				verHTML = fmt.Sprintf(" (<code>%s</code>)", escapeTelegramHTML(ver))
			}
		}
		return fmt.Sprintf("📦 <b><code>%s</code></b>%s\n└ %s", pkg, verHTML, formatRichRefsHTML(rest))
	}
	return "• " + formatRichRefsHTML(trimmed)
}

func richRow(label, value string) string {
	return fmt.Sprintf(`<tr><td>%s</td><td align="right">%s</td></tr>`, label, value)
}

func richTable(rows [][2]string, cls string) string {
	if cls == "" {
		cls = "bordered compact"
	}
	var b strings.Builder
	b.WriteString(fmt.Sprintf("<table %s>", cls))
	for _, r := range rows {
		b.WriteString(richRow(r[0], r[1]))
	}
	b.WriteString("</table>")
	return b.String()
}

func buildRichTelegramMessage(rec map[string]any) string {
	evType := fmt.Sprint(rec["type"])
	sysName := fmt.Sprint(rec["system_name"])
	if sysName == "" || sysName == "<nil>" {
		sysName = fmt.Sprint(rec["system_id"])
	}
	title := fmt.Sprint(rec["title_ru"])
	if title == "" || title == "<nil>" {
		title = fmt.Sprint(rec["title_en"])
	}
	summary := fmt.Sprint(rec["summary_ru"])
	if summary == "" || summary == "<nil>" {
		summary = fmt.Sprint(rec["summary_en"])
	}
	ts := fmt.Sprint(rec["timestamp"])

	var icon, statusText, dotEmoji, actionWord string
	switch evType {
	case "vuln_patched":
		icon = "✅"
		statusText = "Патч установлен · Защищено"
		dotEmoji = "🟢"
		actionWord = "Исправлено"
	case "vuln_detected":
		icon = "🚨"
		statusText = "Уязвимость · Авто-патч"
		dotEmoji = "🔴"
		actionWord = "Требует патча"
	case "auto_update":
		icon = "🔄"
		statusText = "Плановое обновление"
		dotEmoji = "🟢"
		actionWord = "Обновлено"
	case "reboot_required":
		icon = "⚠️"
		statusText = "Требуется перезагрузка"
		dotEmoji = "🟡"
		actionWord = "Ожидает ребута"
	case "system_reboot":
		icon = "🔄"
		statusText = "Состояние сохранено · Сервер перезагружается"
		dotEmoji = "🟡"
		actionWord = "Перезагрузка"
	case "auto_rollback":
		icon = "⏪"
		statusText = "Авто-откат выполнен"
		dotEmoji = "🟡"
		actionWord = "Откачено"
	default:
		icon = "🛡️"
		statusText = "Мониторинг безопасности"
		dotEmoji = "🟢"
		actionWord = "Проверено"
	}

	// Extract CVE / LP references and package lines from summary & record
	pkgLineRe := regexp.MustCompile(`^•\s*([a-zA-Z0-9._+-]+)(?:\s+\(([^)]+)\))?:\s+(.+)$`)
	refRe := regexp.MustCompile(`(?:CVE-\d{4}-\d+|LP:\s*#\d+|Debian\s*#\d+)`)

	var pkgRows [][2]string
	var descParagraphs []string
	var allRefs []string
	seenRef := make(map[string]bool)

	for _, m := range refRe.FindAllString(summary, -1) {
		m = strings.Join(strings.Fields(m), " ")
		if !seenRef[m] {
			seenRef[m] = true
			allRefs = append(allRefs, formatRichRefsHTML(m))
		}
	}

	if summary != "" && summary != "<nil>" {
		for _, l := range strings.Split(summary, "\n") {
			tl := strings.TrimSpace(l)
			if tl == "" {
				continue
			}
			if m := pkgLineRe.FindStringSubmatch(tl); m != nil {
				pkgName := escapeTelegramHTML(m[1])
				ver := strings.TrimSpace(m[2])
				detail := strings.TrimSpace(m[3])
				// Strip trailing [LP: ...] / [CVE-...] from detail since we show refs in table
				detailClean := regexp.MustCompile(`\s*\[[^\]]+\]\s*$`).ReplaceAllString(detail, "")

				verDisplay := actionWord
				if ver != "" {
					verDisplay = escapeTelegramHTML(ver)
				}
				pkgRows = append(pkgRows, [2]string{
					fmt.Sprintf("%s <b>%s</b> · %s", dotEmoji, pkgName, actionWord),
					verDisplay,
				})
				descParagraphs = append(descParagraphs, fmt.Sprintf("<b>%s:</b> <i>%s</i>", pkgName, formatRichRefsHTML(detailClean)))
			} else if !strings.HasPrefix(tl, "Доступны обновления") &&
				!strings.HasPrefix(tl, "Security updates") &&
				!strings.HasPrefix(tl, "Обновлены:") &&
				!strings.HasPrefix(tl, "Updated:") &&
				!strings.Contains(tl, "Запуск авто-патча") &&
				!strings.Contains(tl, "Система защищена") {
				descParagraphs = append(descParagraphs, "<i>"+formatRichRefsHTML(tl)+"</i>")
			}
		}
	}

	// If pkgRows is still empty, check rec["packages"]
	if len(pkgRows) == 0 {
		if pkgsAny, ok := rec["packages"].([]any); ok {
			for _, p := range pkgsAny {
				switch v := p.(type) {
				case string:
					pkgRows = append(pkgRows, [2]string{
						fmt.Sprintf("%s <b>%s</b> · %s", dotEmoji, escapeTelegramHTML(v), actionWord),
						actionWord,
					})
				case map[string]any:
					pname := escapeTelegramHTML(fmt.Sprint(v["name"]))
					oldV := fmt.Sprint(v["old_version"])
					newV := fmt.Sprint(v["new_version"])
					verDisp := actionWord
					if oldV != "" && oldV != "<nil>" && newV != "" && newV != "<nil>" {
						verDisp = escapeTelegramHTML(oldV + " → " + newV)
					}
					pkgRows = append(pkgRows, [2]string{
						fmt.Sprintf("%s <b>%s</b> · %s", dotEmoji, pname, actionWord),
						verDisp,
					})
				}
			}
		}
	}

	topRows := [][2]string{
		{"Событие", fmt.Sprintf("<b>%s</b>", escapeTelegramHTML(title))},
		{"Статус", fmt.Sprintf("<b>%s</b>", escapeTelegramHTML(statusText))},
	}
	if len(allRefs) > 0 {
		topRows = append(topRows, [2]string{"Бюллетень / Код", strings.Join(allRefs, ", ")})
	}

	var b strings.Builder
	b.WriteString(fmt.Sprintf("<h2>%s %s</h2>\n", icon, escapeTelegramHTML(sysName)))
	b.WriteString(richTable(topRows, "bordered compact") + "\n")

	if len(pkgRows) > 0 {
		b.WriteString("<h3>Пакеты</h3>\n")
		b.WriteString(richTable(pkgRows, "striped compact") + "\n")
	}

	if len(descParagraphs) > 0 {
		b.WriteString("<p>" + strings.Join(descParagraphs, "<br/>") + "</p>\n")
	}

	footerText := "Beszel Security"
	if ts != "" && ts != "<nil>" {
		footerText = fmt.Sprintf("%s · Beszel Security", escapeTelegramHTML(ts))
	}
	b.WriteString(fmt.Sprintf("<footer>%s</footer>", footerText))

	return b.String()
}

func dispatchTelegramNotification(rec map[string]any) {
	cfg := loadAlertConfig()
	if !cfg.TelegramEnabled || cfg.TelegramBotToken == "" || cfg.TelegramChatID == "" {
		return
	}

	evType := fmt.Sprint(rec["type"])
	switch evType {
	case "vuln_patched":
		if !cfg.NotifyVulnPatched {
			return
		}
	case "vuln_detected":
		if !cfg.NotifyVulnDetected {
			return
		}
	case "auto_update":
		if !cfg.NotifyAutoUpdate {
			return
		}
	case "reboot_required":
		if !cfg.NotifyRebootRequired {
			return
		}
	case "system_reboot":
		// Always deliver user-initiated reboot confirmation when Telegram alerts are enabled
	default:
		sev := fmt.Sprint(rec["severity"])
		if sev != "crit" || !cfg.NotifyCritChecks {
			return
		}
	}

	msg := buildRichTelegramMessage(rec)
	go sendTelegramMessage(cfg.TelegramBotToken, cfg.TelegramChatID, msg)
}

func getAllSystems() map[string]SystemTarget {
	systems := make(map[string]SystemTarget)
	for k, v := range defaultTargets {
		systems[k] = v
	}

	if _, err := os.Stat(dbPath); err == nil {
		db, err := sql.Open("sqlite", fmt.Sprintf("file:%s?mode=ro", dbPath))
		if err == nil {
			defer db.Close()
			rows, err := db.Query("SELECT id, name, host, port FROM systems")
			if err == nil {
				defer rows.Close()
				for rows.Next() {
					var id, name, host, portStr string
					if err := rows.Scan(&id, &name, &host, &portStr); err == nil {
						port := 22
						if p, err := strconv.Atoi(portStr); err == nil && p > 0 {
							port = p
						}
						isLocal := host == "127.0.0.1" || host == "localhost" || host == "91.208.184.83"
						tgt, exists := systems[id]
						if !exists {
							typ := "ssh"
							if isLocal {
								typ = "local"
							}
							systems[id] = SystemTarget{
								ID:   id,
								Name: name,
								Type: typ,
								Host: host,
								Port: port,
							}
						} else {
							tgt.Name = name
							systems[id] = tgt
						}
					}
				}
			}
		}
	}
	return systems
}

func loadReports() map[string]any {
	_ = os.MkdirAll(dataDir, 0755)
	fileLock.RLock()
	defer fileLock.RUnlock()

	res := map[string]any{"updated_at": nil, "systems": make(map[string]any)}
	if data, err := os.ReadFile(reportsFilePath()); err == nil {
		var parsed map[string]any
		if err := json.Unmarshal(data, &parsed); err == nil {
			if _, ok := parsed["systems"]; ok {
				return parsed
			}
		}
	}
	return res
}

func saveReport(report map[string]any) {
	sysID, _ := report["system_id"].(string)
	if sysID == "" {
		return
	}

	fileLock.Lock()
	defer fileLock.Unlock()
	_ = os.MkdirAll(dataDir, 0755)

	// Load existing
	data := make(map[string]any)
	if raw, err := os.ReadFile(reportsFilePath()); err == nil {
		_ = json.Unmarshal(raw, &data)
	}
	systems, ok := data["systems"].(map[string]any)
	if !ok {
		systems = make(map[string]any)
		data["systems"] = systems
	}
	systems[sysID] = report
	data["updated_at"] = getDubaiStr()

	if out, err := json.MarshalIndent(data, "", "  "); err == nil {
		_ = os.WriteFile(reportsFilePath(), out, 0644)
	}

	// Update history
	var hist []map[string]any
	if hRaw, err := os.ReadFile(historyFilePath()); err == nil {
		_ = json.Unmarshal(hRaw, &hist)
	}

	upd, _ := report["updates"].(map[string]any)
	var up24Count, pendCount any
	if upd != nil {
		up24Count = upd["upgraded_24h_count"]
		pendCount = upd["pending_count"]
	}

	summary := map[string]any{
		"system_id":          sysID,
		"system_name":        report["system_name"],
		"checked_at_dubai":   report["checked_at_dubai"],
		"overall_status":     report["overall_status"],
		"security_score":     report["security_score"],
		"passed_checks":      report["passed_checks"],
		"total_checks":       report["total_checks"],
		"upgraded_24h_count": up24Count,
		"pending_count":      pendCount,
	}

	hist = append([]map[string]any{summary}, hist...)
	if len(hist) > 60 {
		hist = hist[:60]
	}
	if hOut, err := json.MarshalIndent(hist, "", "  "); err == nil {
		_ = os.WriteFile(historyFilePath(), hOut, 0644)
	}

	go syncNotificationsFromReport(report)
}

func loadNotifications() []map[string]any {
	_ = os.MkdirAll(dataDir, 0755)
	fileLock.RLock()
	defer fileLock.RUnlock()

	var items []map[string]any
	if data, err := os.ReadFile(notificationsFilePath()); err == nil {
		_ = json.Unmarshal(data, &items)
	}
	if items == nil {
		items = make([]map[string]any, 0)
	}
	return items
}

func saveNotificationsList(items []map[string]any) {
	fileLock.Lock()
	defer fileLock.Unlock()
	_ = os.MkdirAll(dataDir, 0755)

	if len(items) > 120 {
		items = items[:120]
	}
	if out, err := json.MarshalIndent(items, "", "  "); err == nil {
		_ = os.WriteFile(notificationsFilePath(), out, 0644)
	}
}

func makeEventID(sysID, evType, tsPrefix, keyExtra string) string {
	raw := fmt.Sprintf("%s|%s|%s|%s", sysID, evType, tsPrefix, keyExtra)
	h := sha1.Sum([]byte(raw))
	return "ev-" + hex.EncodeToString(h[:])[:14]
}

func recordNotification(payload map[string]any, markUnread bool) string {
	notificationMtx.Lock()
	defer notificationMtx.Unlock()

	items := loadNotifications()
	existingIDs := make(map[string]bool)
	for _, it := range items {
		if id, ok := it["id"].(string); ok {
			existingIDs[id] = true
		}
	}

	sysID, _ := payload["system_id"].(string)
	evType, _ := payload["type"].(string)
	if evType == "" {
		evType = "auto_update"
	}
	ts, _ := payload["timestamp"].(string)
	if ts == "" {
		ts = getDubaiStr()
	}

	evID, _ := payload["id"].(string)
	if evID == "" {
		titleEn, _ := payload["title_en"].(string)
		tsPref := ts
		if len(tsPref) > 16 {
			tsPref = tsPref[:16]
		}
		evID = makeEventID(sysID, evType, tsPref, titleEn)
	}

	if existingIDs[evID] {
		return evID
	}

	sysName, _ := payload["system_name"].(string)
	if sysName == "" {
		tgts := getAllSystems()
		if t, ok := tgts[sysID]; ok {
			sysName = t.Name
		} else {
			sysName = sysID
		}
	}

	severity, _ := payload["severity"].(string)
	if severity == "" {
		if evType == "vuln_detected" || evType == "auto_rollback" {
			severity = "crit"
		} else if evType == "vuln_patched" {
			severity = "sec"
		} else {
			severity = "info"
		}
	}

	titleRu, _ := payload["title_ru"].(string)
	if titleRu == "" {
		titleRu = "Событие безопасности"
	}
	titleEn, _ := payload["title_en"].(string)
	if titleEn == "" {
		titleEn = "Security Event"
	}

	summaryRu, _ := payload["summary_ru"].(string)
	summaryEn, _ := payload["summary_en"].(string)

	cves, _ := payload["cves"].([]any)
	pkgs, _ := payload["packages"].([]any)

	rbGuard, _ := payload["rollback_guard"].(string)
	if rbGuard == "" && (evType == "vuln_patched" || evType == "auto_update") {
		rbGuard = "ok"
	}

	rolledBack, _ := payload["rolled_back"].(bool)

	record := map[string]any{
		"id":             evID,
		"system_id":      sysID,
		"system_name":    sysName,
		"type":           evType,
		"severity":       severity,
		"timestamp":      ts,
		"title_ru":       titleRu,
		"title_en":       titleEn,
		"summary_ru":     summaryRu,
		"summary_en":     summaryEn,
		"cves":           cves,
		"packages":       pkgs,
		"rollback_guard": rbGuard,
		"rolled_back":    rolledBack,
		"read":           !markUnread,
	}

	items = append([]map[string]any{record}, items...)
	saveNotificationsList(items)

	if markUnread {
		go dispatchTelegramNotification(record)
	}

	return evID
}

func syncNotificationsFromReport(report map[string]any) {
	sysID, _ := report["system_id"].(string)
	sysName, _ := report["system_name"].(string)
	if sysID == "" {
		return
	}

	updates, _ := report["updates"].(map[string]any)
	vulns, _ := report["vulnerabilities"].(map[string]any)
	if vulns == nil && updates != nil {
		vulns, _ = updates["vulnerabilities"].(map[string]any)
	}
	if vulns == nil {
		return
	}

	openVulns, _ := vulns["open_vulns"].([]any)
	recentPatches, _ := vulns["recent_patches"].([]any)

	items := loadNotifications()
	existingIDs := make(map[string]bool)
	for _, it := range items {
		if id, ok := it["id"].(string); ok {
			existingIDs[id] = true
		}
	}
	changed := false

	// Open vulnerabilities
	if len(openVulns) > 0 {
		var pkgNames []string
		var descLinesRu []string
		var descLinesEn []string
		var allOpenCVEs []string
		for _, ov := range openVulns {
			if m, ok := ov.(map[string]any); ok {
				if n, ok := m["name"].(string); ok {
					pkgNames = append(pkgNames, n)
				}
				if sRu, ok := m["summary_ru"].(string); ok && sRu != "" {
					descLinesRu = append(descLinesRu, "• "+sRu)
				}
				if sEn, ok := m["summary_en"].(string); ok && sEn != "" {
					descLinesEn = append(descLinesEn, "• "+sEn)
				}
				if cList, ok := m["cves"].([]any); ok {
					for _, c := range cList {
						cs := fmt.Sprint(c)
						if !slicesContains(allOpenCVEs, cs) {
							allOpenCVEs = append(allOpenCVEs, cs)
						}
					}
				}
			}
		}

		sort.Strings(pkgNames)
		tsPref := fmt.Sprint(report["checked_at_dubai"])
		if len(tsPref) > 13 {
			tsPref = tsPref[:13]
		}
		evID := makeEventID(sysID, "vuln_detected", tsPref, strings.Join(pkgNames, ","))
		if !existingIDs[evID] {
			sumRu := fmt.Sprintf("Обнаружены доступные патчи безопасности для %s.", strings.Join(truncateSlice(pkgNames, 6), ", "))
			if len(descLinesRu) > 0 {
				sumRu += "\n" + strings.Join(truncateSlice(descLinesRu, 6), "\n")
			}
			sumEn := fmt.Sprintf("Security patches available for %s.", strings.Join(truncateSlice(pkgNames, 6), ", "))
			if len(descLinesEn) > 0 {
				sumEn += "\n" + strings.Join(truncateSlice(descLinesEn, 6), "\n")
			}
			record := map[string]any{
				"id":          evID,
				"system_id":   sysID,
				"system_name": sysName,
				"type":        "vuln_detected",
				"severity":    "crit",
				"timestamp":   report["checked_at_dubai"],
				"title_ru":    fmt.Sprintf("Найдены уязвимости (%d пак.) - запуск патча", len(openVulns)),
				"title_en":    fmt.Sprintf("Vulnerabilities Detected (%d pkgs) - Patching", len(openVulns)),
				"summary_ru":  sumRu,
				"summary_en":  sumEn,
				"cves":        allOpenCVEs,
				"packages":    openVulns,
				"read":        false,
			}
			items = append([]map[string]any{record}, items...)
			existingIDs[evID] = true
			changed = true
		}
	}

	// Recent patches
	if len(recentPatches) > 0 {
		for _, rp := range recentPatches {
			rpm, ok := rp.(map[string]any)
			if !ok {
				continue
			}
			pname, _ := rpm["name"].(string)
			tsRaw, _ := rpm["timestamp"].(string)
			tsPref := tsRaw
			if len(tsPref) > 13 {
				tsPref = tsPref[:13]
			}
			evID := makeEventID(sysID, "vuln_patched", tsPref, pname)
			if !existingIDs[evID] {
				cves, _ := rpm["cves"].([]any)
				record := map[string]any{
					"id":             evID,
					"system_id":      sysID,
					"system_name":    sysName,
					"type":           "vuln_patched",
					"severity":       "sec",
					"timestamp":      tsRaw,
					"title_ru":       fmt.Sprintf("Патч: %s", pname),
					"title_en":       fmt.Sprintf("Patched: %s", pname),
					"summary_ru":     "Установлен патч безопасности",
					"summary_en":     "Applied security patch",
					"cves":           cves,
					"packages":       []any{rpm},
					"rollback_guard": "ok",
					"rolled_back":    false,
					"read":           false,
				}
				items = append([]map[string]any{record}, items...)
				existingIDs[evID] = true
				changed = true
			}
		}
	}

	if changed {
		saveNotificationsList(items)
	}
}

func slicesContains(slice []string, val string) bool {
	for _, s := range slice {
		if s == val {
			return true
		}
	}
	return false
}

func truncateSlice(slice []string, n int) []string {
	if len(slice) <= n {
		return slice
	}
	return slice[:n]
}

func loadLayouts() map[string]any {
	_ = os.MkdirAll(dataDir, 0755)
	fileLock.RLock()
	defer fileLock.RUnlock()

	var obj map[string]any
	if data, err := os.ReadFile(layoutsFilePath()); err == nil {
		_ = json.Unmarshal(data, &obj)
	}
	if obj == nil {
		obj = map[string]any{
			"systems":      make(map[string]any),
			"global_table": make([]any, 0),
		}
	}
	return obj
}

func saveLayouts(obj map[string]any) {
	fileLock.Lock()
	defer fileLock.Unlock()
	_ = os.MkdirAll(dataDir, 0755)
	if out, err := json.MarshalIndent(obj, "", "  "); err == nil {
		_ = os.WriteFile(layoutsFilePath(), out, 0644)
	}
}

func resolveSystemTarget(systemID string) (string, SystemTarget, bool) {
	id := strings.TrimSpace(systemID)
	if id == "" || id == "<nil>" {
		return "", SystemTarget{}, false
	}
	targets := getAllSystems()
	if tgt, ok := targets[id]; ok {
		return tgt.ID, tgt, true
	}
	lower := strings.ToLower(id)
	for _, tgt := range targets {
		if strings.ToLower(tgt.ID) == lower || strings.ToLower(tgt.Name) == lower {
			return tgt.ID, tgt, true
		}
	}
	return "", SystemTarget{}, false
}

func isAndroidTarget(systemID string, target SystemTarget) bool {
	lowerID := strings.ToLower(strings.TrimSpace(systemID))
	lowerName := strings.ToLower(strings.TrimSpace(target.Name))
	return target.User == "u0_a161" ||
		lowerID == "4rnyjklpllef0yl" ||
		lowerID == "lineage" ||
		strings.Contains(lowerName, "lineage")
}

func runOnTarget(systemID, remoteCmd string, timeoutSec int) (bool, string) {
	resolvedID, target, exists := resolveSystemTarget(systemID)
	if !exists {
		return false, fmt.Sprintf("Unknown system_id: %s", systemID)
	}
	_ = resolvedID

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(timeoutSec)*time.Second)
	defer cancel()

	var cmd *exec.Cmd
	if target.Type == "local" {
		cmd = exec.CommandContext(ctx, "sh", "-c", remoteCmd)
	} else {
		user := target.User
		if user == "" {
			user = "root"
		}
		sshCmd := fmt.Sprintf("ssh %s -p %d %s@%s %s", sshOpts, target.Port, user, target.Host, escapeShellArg(remoteCmd))
		cmd = exec.CommandContext(ctx, "sh", "-c", sshCmd)
	}

	outBytes, err := cmd.CombinedOutput()
	outStr := strings.TrimSpace(string(outBytes))
	return err == nil, outStr
}

func closeSSHControlMaster(target SystemTarget) {
	if target.Type == "local" || target.Host == "" {
		return
	}
	user := target.User
	if user == "" {
		user = "root"
	}
	port := target.Port
	if port <= 0 {
		port = 22
	}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	closeCmd := fmt.Sprintf(
		"ssh -o ControlPath=/tmp/bszl-ssh-%%r@%%h:%%p -o ControlMaster=no -O exit -p %d %s@%s >/dev/null 2>&1 || true",
		port, user, target.Host,
	)
	_ = exec.CommandContext(ctx, "sh", "-c", closeCmd).Run()
}

func executeSystemReboot(systemID string) (int, bool, string, string, string) {
	cleanID := strings.TrimSpace(systemID)
	if cleanID == "" || cleanID == "<nil>" || strings.EqualFold(cleanID, "all") {
		return http.StatusBadRequest, false, "Укажите конкретный сервер для перезагрузки", "", ""
	}

	resolvedID, target, exists := resolveSystemTarget(cleanID)
	if !exists {
		return http.StatusNotFound, false, fmt.Sprintf("Неизвестный сервер: %s", cleanID), "", ""
	}
	sysName := target.Name
	if sysName == "" {
		sysName = resolvedID
	}

	if isAndroidTarget(resolvedID, target) {
		return http.StatusBadRequest, false, "Устройство Android (LineageOS/Termux) не поддерживает удаленную перезагрузку", resolvedID, sysName
	}

	saveCmd := "if [ -x /usr/local/bin/server-resurrect ]; then /usr/local/bin/server-resurrect save --shutdown || exit 1; fi; sync"
	if ok, out := runCommandOnTarget(resolvedID, saveCmd, 25); !ok {
		return http.StatusBadGateway, false, fmt.Sprintf("Не удалось сохранить состояние перед перезагрузкой: %s", out), resolvedID, sysName
	}

	delaySec := 1
	if target.Type == "local" {
		delaySec = 2
	}
	innerReboot := fmt.Sprintf(
		"sleep %d; sync; if command -v systemctl >/dev/null 2>&1; then exec systemctl reboot; fi; if command -v sudo >/dev/null 2>&1; then exec sudo -n reboot; fi; exec reboot",
		delaySec,
	)
	triggerCmd := fmt.Sprintf(
		"if command -v setsid >/dev/null 2>&1; then setsid -f bash -c %s </dev/null >/dev/null 2>&1; else nohup bash -c %s </dev/null >/dev/null 2>&1 & fi",
		escapeShellArg(innerReboot),
		escapeShellArg(innerReboot),
	)
	if ok, out := runCommandOnTarget(resolvedID, triggerCmd, 15); !ok {
		return http.StatusInternalServerError, false, fmt.Sprintf("Ошибка запуска перезагрузки: %s", out), resolvedID, sysName
	}

	if target.Type != "local" {
		closeSSHControlMaster(target)
	}

	recordNotification(map[string]any{
		"system_id":   resolvedID,
		"system_name": sysName,
		"type":        "system_reboot",
		"severity":    "info",
		"title_ru":    "Запущена перезагрузка сервера",
		"title_en":    "Server Reboot Initiated",
		"summary_ru":  fmt.Sprintf("Состояние (%s) сохранено через server-resurrect (screen/tmux, Claude Code, службы и история). После загрузки всё восстановится автоматически.", sysName),
		"summary_en":  fmt.Sprintf("State on %s saved via server-resurrect (screen/tmux, Claude Code, services, shell history). Everything will resume automatically after boot.", sysName),
		"timestamp":   getDubaiStr(),
	}, true)

	msg := fmt.Sprintf("Состояние %s сохранено. Сервер перезагружается и восстановит работу автоматически.", sysName)
	return http.StatusOK, true, msg, resolvedID, sysName
}

func escapeShellArg(arg string) string {
	return "'" + strings.ReplaceAll(arg, "'", "'\"'\"'") + "'"
}

func triggerServer(systemID, mode string) (bool, string) {
	targets := getAllSystems()
	target := targets[systemID]
	if target.User == "u0_a161" || systemID == "4rnyjklpllef0yl" || systemID == "Lineage" {
		return true, "Статус служб и дашборда LineageOS обновлен"
	}

	flag, ok := triggerFlags[mode]
	if !ok {
		return false, fmt.Sprintf("unknown mode: %s", mode)
	}

	cmdRemote := fmt.Sprintf("/usr/local/sbin/beszel-daily-audit %s", flag)
	return runOnTarget(systemID, strings.TrimSpace(cmdRemote), 600)
}

func executeServiceLogs(payload map[string]any) (bool, map[string]any) {
	sysID := strings.TrimSpace(fmt.Sprint(payload["system_id"]))
	serviceID := strings.ToLower(strings.TrimSpace(fmt.Sprint(payload["service_id"])))
	lines := 60
	if l, err := strconv.Atoi(fmt.Sprint(payload["lines"])); err == nil && l > 0 {
		lines = l
	}

	cleanSvc := regexp.MustCompile(`[^a-zA-Z0-9_\-\.\:\@]`).ReplaceAllString(serviceID, "")
	remoteCmd := fmt.Sprintf("/usr/local/sbin/beszel-daily-audit --service-logs %s --lines %d", escapeShellArg(cleanSvc), lines)

	ok, out := runOnTarget(sysID, remoteCmd, 25)
	var parsed map[string]any
	linesSlice := strings.Split(out, "\n")
	if len(linesSlice) > 0 {
		_ = json.Unmarshal([]byte(linesSlice[len(linesSlice)-1]), &parsed)
	}
	if parsed != nil {
		if pOk, has := parsed["ok"].(bool); has {
			return pOk, parsed
		}
		return ok, parsed
	}
	return ok, map[string]any{
		"ok":         ok,
		"service_id": cleanSvc,
		"title":      cleanSvc,
		"logs":       out,
	}
}

func executePortAction(payload map[string]any) (bool, string) {
	sysID := fmt.Sprint(payload["system_id"])
	action := strings.ToLower(strings.TrimSpace(fmt.Sprint(payload["action"])))
	port := strings.TrimSpace(fmt.Sprint(payload["port"]))
	proto := strings.ToLower(strings.TrimSpace(fmt.Sprint(payload["proto"])))
	fromIP := strings.TrimSpace(fmt.Sprint(payload["from_ip"]))
	comment := strings.TrimSpace(fmt.Sprint(payload["comment"]))
	ruleNum := strings.TrimSpace(fmt.Sprint(payload["rule_num"]))

	args := []string{"/usr/local/sbin/beszel-daily-audit", "--port-action", action}
	if port != "" {
		args = append(args, "--port", port)
	}
	if proto != "" {
		args = append(args, "--proto", proto)
	}
	if fromIP != "" && fromIP != "<nil>" {
		args = append(args, "--from-ip", fromIP)
	}
	if comment != "" && comment != "<nil>" {
		args = append(args, "--comment", comment)
	}
	if ruleNum != "" && ruleNum != "<nil>" {
		args = append(args, "--rule-num", ruleNum)
	}

	var escArgs []string
	for _, a := range args {
		escArgs = append(escArgs, escapeShellArg(a))
	}
	remoteCmd := strings.Join(escArgs, " ")

	ok, out := runOnTarget(sysID, remoteCmd, 25)
	linesSlice := strings.Split(out, "\n")
	var parsed map[string]any
	if len(linesSlice) > 0 {
		_ = json.Unmarshal([]byte(linesSlice[len(linesSlice)-1]), &parsed)
	}
	if parsed != nil {
		if rep, has := parsed["report"].(map[string]any); has {
			saveReport(rep)
		}
		msg := fmt.Sprint(parsed["message"])
		if msg == "" || msg == "<nil>" {
			msg = out
		}
		if pOk, has := parsed["ok"].(bool); has {
			return pOk, msg
		}
	}
	return ok, out
}

func executeServiceAction(payload map[string]any) (bool, string) {
	sysID := fmt.Sprint(payload["system_id"])
	action := strings.ToLower(strings.TrimSpace(fmt.Sprint(payload["action"])))
	serviceID := strings.TrimSpace(fmt.Sprint(payload["service_id"]))

	cleanSvc := regexp.MustCompile(`[^a-zA-Z0-9_\-\.\:\@]`).ReplaceAllString(serviceID, "")
	remoteCmd := fmt.Sprintf("/usr/local/sbin/beszel-daily-audit --service-action %s --service-id %s", escapeShellArg(action), escapeShellArg(cleanSvc))

	ok, out := runOnTarget(sysID, remoteCmd, 35)
	linesSlice := strings.Split(out, "\n")
	var parsed map[string]any
	if len(linesSlice) > 0 {
		_ = json.Unmarshal([]byte(linesSlice[len(linesSlice)-1]), &parsed)
	}
	if parsed != nil {
		if rep, has := parsed["report"].(map[string]any); has {
			saveReport(rep)
		}
		msg := fmt.Sprint(parsed["message"])
		if msg == "" || msg == "<nil>" {
			msg = out
		}
		if pOk, has := parsed["ok"].(bool); has {
			return pOk, msg
		}
	}
	return ok, out
}

func executeFail2banAction(payload map[string]any) (bool, string) {
	sysID := fmt.Sprint(payload["system_id"])
	action := strings.ToLower(strings.TrimSpace(fmt.Sprint(payload["action"])))
	ip := regexp.MustCompile(`[^0-9a-fA-F\.\:]`).ReplaceAllString(fmt.Sprint(payload["ip"]), "")

	remoteCmd := fmt.Sprintf("/usr/local/sbin/beszel-daily-audit --fail2ban-action %s --ip %s", escapeShellArg(action), escapeShellArg(ip))
	ok, out := runOnTarget(sysID, remoteCmd, 25)
	linesSlice := strings.Split(out, "\n")
	var parsed map[string]any
	if len(linesSlice) > 0 {
		_ = json.Unmarshal([]byte(linesSlice[len(linesSlice)-1]), &parsed)
	}
	if parsed != nil {
		if rep, has := parsed["report"].(map[string]any); has {
			saveReport(rep)
		}
		msg := fmt.Sprint(parsed["message"])
		if msg == "" || msg == "<nil>" {
			msg = out
		}
		if pOk, has := parsed["ok"].(bool); has {
			return pOk, msg
		}
	}
	return ok, out
}

func enrichSystemsWithPocketBase(systems map[string]any) {
	if _, err := os.Stat(dbPath); err != nil {
		return
	}

	db, err := sql.Open("sqlite", fmt.Sprintf("file:%s?mode=ro", dbPath))
	if err != nil {
		return
	}
	defer db.Close()

	// Containers
	pbContainers := make(map[string][]map[string]any)
	cRows, err := db.Query("SELECT id, system, name, image, status, health, cpu, memory, net, ports, updatable, updated FROM containers ORDER BY name ASC")
	if err == nil {
		defer cRows.Close()
		for cRows.Next() {
			var id, sid, name, image, status, ports string
			var health int
			var cpu, memory, net float64
			var updatable bool
			var updated int64
			if err := cRows.Scan(&id, &sid, &name, &image, &status, &health, &cpu, &memory, &net, &ports, &updatable, &updated); err == nil {
				state := "running"
				if !strings.HasPrefix(strings.ToLower(status), "up") {
					state = "exited"
				}
				pbContainers[sid] = append(pbContainers[sid], map[string]any{
					"id":        id,
					"name":      name,
					"image":     image,
					"status":    status,
					"state":     state,
					"health":    health,
					"cpu":       cpu,
					"memory_mb": memory,
					"net_bps":   net,
					"ports":     ports,
					"updatable": updatable,
					"updated":   updated,
				})
			}
		}
	}

	// Systemd services
	pbSystemd := make(map[string][]map[string]any)
	sRows, err := db.Query("SELECT id, system, name, state, sub, cpu, cpuPeak, memory, memPeak, updated FROM systemd_services ORDER BY name ASC")
	if err == nil {
		defer sRows.Close()
		for sRows.Next() {
			var id, sid, name string
			var st, sub int
			var cpu, cpuPeak float64
			var memB, memPeakB int64
			var updated int64
			if err := sRows.Scan(&id, &sid, &name, &st, &sub, &cpu, &cpuPeak, &memB, &memPeakB, &updated); err == nil {
				pbSystemd[sid] = append(pbSystemd[sid], map[string]any{
					"id":          id,
					"name":        name,
					"state":       st,
					"sub":         sub,
					"cpu":         cpu,
					"cpu_peak":    cpuPeak,
					"memory_mb":   float64(memB) / 1048576.0,
					"mem_peak_mb": float64(memPeakB) / 1048576.0,
					"updated":     updated,
				})
			}
		}
	}

	for sid, repAny := range systems {
		rep, ok := repAny.(map[string]any)
		if !ok {
			continue
		}
		actualSID, _ := rep["system_id"].(string)
		if actualSID == "" {
			actualSID = sid
		}

		if cList, has := pbContainers[actualSID]; has {
			rep["all_containers"] = cList
		}
		if sList, has := pbSystemd[actualSID]; has {
			rep["systemd_services"] = sList
		}
	}
}

func buildFullResponse() map[string]any {
	data := loadReports()

	// History
	if hRaw, err := os.ReadFile(historyFilePath()); err == nil {
		var hist []any
		if err := json.Unmarshal(hRaw, &hist); err == nil {
			if len(hist) > 20 {
				hist = hist[:20]
			}
			data["history"] = hist
		}
	} else {
		data["history"] = make([]any, 0)
	}

	notifs := loadNotifications()
	if sysMap, ok := data["systems"].(map[string]any); ok {
		enrichSystemsWithPocketBase(sysMap)
	}

	data["notifications"] = notifs
	unread := 0
	for _, n := range notifs {
		if read, ok := n["read"].(bool); !ok || !read {
			unread++
		}
	}
	data["unread_count"] = unread
	data["install_command"] = "curl -sL http://91.208.184.83:8090/install-agent.sh | bash"
	data["registered_systems"] = getAllSystems()
	data["layouts"] = loadLayouts()
	return data
}

func sendJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func buildMux() *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/security-reports", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			sendJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "Method not allowed"})
			return
		}
		sendJSON(w, http.StatusOK, buildFullResponse())
	})

	mux.HandleFunc("/api/security-notifications", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			sendJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "Method not allowed"})
			return
		}
		notifs := loadNotifications()
		unread := 0
		for _, n := range notifs {
			if read, ok := n["read"].(bool); !ok || !read {
				unread++
			}
		}
		sendJSON(w, http.StatusOK, map[string]any{
			"notifications": notifs,
			"unread_count":  unread,
		})
	})

	mux.HandleFunc("/api/security-layout", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			sendJSON(w, http.StatusOK, loadLayouts())
			return
		}
		if r.Method == http.MethodPost {
			var payload map[string]any
			if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
				sendJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid JSON"})
				return
			}
			layouts := loadLayouts()
			sysMap, ok := layouts["systems"].(map[string]any)
			if !ok {
				sysMap = make(map[string]any)
				layouts["systems"] = sysMap
			}

			sysID := strings.TrimSpace(fmt.Sprint(payload["system_id"]))
			layoutData := payload["layout"]
			applyAll, _ := payload["apply_all"].(bool)

			if sysID != "" && layoutData != nil {
				if applyAll {
					for k := range getAllSystems() {
						sysMap[k] = layoutData
					}
				} else {
					sysMap[sysID] = layoutData
				}
			} else if sysID != "" && layoutData == nil {
				delete(sysMap, sysID)
			}
			if gt, ok := payload["global_table"].([]any); ok {
				layouts["global_table"] = gt
			}
			saveLayouts(layouts)
			sendJSON(w, http.StatusOK, map[string]any{"ok": true, "layouts": layouts})
			return
		}
		sendJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "Method not allowed"})
	})

	mux.HandleFunc("/api/security-alerts-config", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			sendJSON(w, http.StatusOK, loadAlertConfig())
			return
		}
		if r.Method == http.MethodPost {
			var cfg AlertConfig
			if err := json.NewDecoder(r.Body).Decode(&cfg); err != nil {
				sendJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid JSON"})
				return
			}
			if err := saveAlertConfig(cfg); err != nil {
				sendJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
				return
			}
			sendJSON(w, http.StatusOK, map[string]any{"ok": true, "config": cfg})
			return
		}
		sendJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "Method not allowed"})
	})

	mux.HandleFunc("/api/security-alerts-test", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			sendJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "Method not allowed"})
			return
		}
		cfg := loadAlertConfig()
		testMsg := buildRichTelegramMessage(map[string]any{
			"type":        "vuln_patched",
			"system_name": "Hetzner",
			"title_ru":    "Тестовое оповещение (1 пак.)",
			"summary_ru":  "Доступны обновления безопасности: ca-certificates-java.\n• ca-certificates-java (20260311 → 20260311ubuntu0.26.04.2): обновление хранилища корневых сертификатов и проверки TLS/SSL (Common CA certificates (JKS keystore) — set LC_ALL=C.UTF-8 so keytool calls do not fail parsing) [LP: #2173752]\nСистема защищена.",
			"timestamp":   getDubaiStr(),
		})
		ok, resp := sendTelegramMessage(cfg.TelegramBotToken, cfg.TelegramChatID, testMsg)
		sendJSON(w, http.StatusOK, map[string]any{"ok": ok, "response": resp})
	})

	mux.HandleFunc("/api/security-report", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			sendJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "Method not allowed"})
			return
		}
		token := r.Header.Get("X-Beszel-Security-Token")
		if token != sharedToken {
			sendJSON(w, http.StatusForbidden, map[string]string{"error": "Forbidden"})
			return
		}
		var payload map[string]any
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			sendJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid JSON"})
			return
		}
		saveReport(payload)
		sendJSON(w, http.StatusOK, map[string]any{"ok": true})
	})

	mux.HandleFunc("/api/security-event", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			sendJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "Method not allowed"})
			return
		}
		token := r.Header.Get("X-Beszel-Security-Token")
		if token != sharedToken {
			sendJSON(w, http.StatusForbidden, map[string]string{"error": "Forbidden"})
			return
		}
		var payload map[string]any
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			sendJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid JSON"})
			return
		}
		evID := recordNotification(payload, true)
		sendJSON(w, http.StatusOK, map[string]any{"ok": true, "id": evID})
	})

	mux.HandleFunc("/api/security-notifications-action", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			sendJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "Method not allowed"})
			return
		}
		var payload map[string]any
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			sendJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid JSON"})
			return
		}
		action := strings.TrimSpace(fmt.Sprint(payload["action"]))
		if action == "mark_read" {
			targetID := fmt.Sprint(payload["id"])
			items := loadNotifications()
			for _, n := range items {
				if targetID == "" || fmt.Sprint(n["id"]) == targetID {
					n["read"] = true
				}
			}
			saveNotificationsList(items)
			sendJSON(w, http.StatusOK, map[string]any{"ok": true, "reports": buildFullResponse()})
			return
		}
		if action == "scan_patch" {
			sysID := fmt.Sprint(payload["system_id"])
			var ids []string
			if sysID == "all" || sysID == "" {
				for k := range getAllSystems() {
					ids = append(ids, k)
				}
			} else {
				ids = []string{sysID}
			}
			results := make(map[string]any)
			var wg sync.WaitGroup
			var mu sync.Mutex
			for _, id := range ids {
				wg.Add(1)
				go func(sid string) {
					defer wg.Done()
					ok, out := triggerServer(sid, "vuln_watch")
					mu.Lock()
					results[sid] = map[string]any{"ok": ok, "output": out}
					mu.Unlock()
				}(id)
			}
			wg.Wait()
			sendJSON(w, http.StatusOK, map[string]any{"ok": true, "results": results, "reports": buildFullResponse()})
			return
		}
		sendJSON(w, http.StatusBadRequest, map[string]string{"error": "Unknown action"})
	})

	mux.HandleFunc("/api/security-logs", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			sendJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "Method not allowed"})
			return
		}
		var payload map[string]any
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			sendJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid JSON"})
			return
		}
		_, res := executeServiceLogs(payload)
		sendJSON(w, http.StatusOK, res)
	})

	mux.HandleFunc("/api/security-port", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			sendJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "Method not allowed"})
			return
		}
		var payload map[string]any
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			sendJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid JSON"})
			return
		}
		ok, msg := executePortAction(payload)
		sendJSON(w, http.StatusOK, map[string]any{"ok": ok, "message": msg, "reports": buildFullResponse()})
	})

	mux.HandleFunc("/api/security-service", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			sendJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "Method not allowed"})
			return
		}
		var payload map[string]any
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			sendJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid JSON"})
			return
		}
		ok, msg := executeServiceAction(payload)
		sendJSON(w, http.StatusOK, map[string]any{"ok": ok, "message": msg, "reports": buildFullResponse()})
	})

	mux.HandleFunc("/api/security-fail2ban", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			sendJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "Method not allowed"})
			return
		}
		var payload map[string]any
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			sendJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid JSON"})
			return
		}
		ok, msg := executeFail2banAction(payload)
		sendJSON(w, http.StatusOK, map[string]any{"ok": ok, "message": msg, "reports": buildFullResponse()})
	})

	mux.HandleFunc("/api/security-trigger", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			sendJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "Method not allowed"})
			return
		}
		var payload map[string]any
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			sendJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid JSON"})
			return
		}

		sysID := fmt.Sprint(payload["system_id"])
		mode := fmt.Sprint(payload["mode"])
		if mode == "" || mode == "<nil>" {
			mode = "check"
		}

		var ids []string
		if sysID == "all" || sysID == "" || sysID == "<nil>" {
			for k := range getAllSystems() {
				ids = append(ids, k)
			}
		} else {
			ids = []string{sysID}
		}

		results := make(map[string]any)
		var wg sync.WaitGroup
		var mu sync.Mutex

		for _, id := range ids {
			wg.Add(1)
			go func(sid string) {
				defer wg.Done()
				ok, out := triggerServer(sid, mode)
				linesSlice := strings.Split(out, "\n")
				var parsed map[string]any
				if len(linesSlice) > 0 {
					_ = json.Unmarshal([]byte(linesSlice[len(linesSlice)-1]), &parsed)
				}
				mu.Lock()
				defer mu.Unlock()
				if parsed != nil {
					if rep, has := parsed["report"].(map[string]any); has {
						saveReport(rep)
					}
					msg := fmt.Sprint(parsed["message"])
					if msg == "" {
						msg = out
					}
					pOk := ok
					if b, has := parsed["ok"].(bool); has {
						pOk = b
					}
					results[sid] = map[string]any{"ok": pOk, "message": msg}
				} else {
					results[sid] = map[string]any{"ok": ok, "message": out}
				}
			}(id)
		}
		wg.Wait()

		sendJSON(w, http.StatusOK, map[string]any{"ok": true, "results": results, "reports": buildFullResponse()})
	})

	mux.HandleFunc("/api/security-reboot", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			sendJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "Method not allowed"})
			return
		}
		var payload map[string]any
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			sendJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid JSON"})
			return
		}
		sysID := fmt.Sprint(payload["system_id"])
		statusCode, ok, msg, resolvedID, sysName := executeSystemReboot(sysID)
		sendJSON(w, statusCode, map[string]any{
			"ok":          ok,
			"message":     msg,
			"system_id":   resolvedID,
			"system_name": sysName,
		})
	})

	return mux
}

func main() {
	mux := buildMux()
	slog.Info("Starting Beszel Security Hub API in Go", "listen", listenAddr)
	if err := http.ListenAndServe(listenAddr, mux); err != nil {
		slog.Error("Security Hub server failed", "error", err)
		os.Exit(1)
	}
}
