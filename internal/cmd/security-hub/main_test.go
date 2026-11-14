package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func setupTestEnv(t *testing.T) {
	t.Helper()
	tmpDir := t.TempDir()
	origDataDir := dataDir
	origDBPath := dbPath
	origRunner := runCommandOnTarget

	dataDir = tmpDir
	dbPath = filepath.Join(tmpDir, "missing.db")
	// Disable real Telegram network calls during unit tests.
	_ = saveAlertConfig(AlertConfig{TelegramEnabled: false})

	t.Cleanup(func() {
		dataDir = origDataDir
		dbPath = origDBPath
		runCommandOnTarget = origRunner
	})
}

func TestResolveSystemTarget(t *testing.T) {
	setupTestEnv(t)

	id, tgt, ok := resolveSystemTarget("zotmtzksqho8yof")
	if !ok || id != "zotmtzksqho8yof" || tgt.Name != "Hetzner" {
		t.Fatalf("expected Hetzner by ID, got ok=%v id=%q name=%q", ok, id, tgt.Name)
	}

	id, tgt, ok = resolveSystemTarget("hetzner")
	if !ok || id != "zotmtzksqho8yof" || tgt.Type != "ssh" {
		t.Fatalf("expected Hetzner by case-insensitive name, got ok=%v id=%q type=%q", ok, id, tgt.Type)
	}

	id, tgt, ok = resolveSystemTarget("The Private Network")
	if !ok || id != "kgm0fv4mrdnjw4r" || tgt.Type != "local" {
		t.Fatalf("expected local target by name, got ok=%v id=%q type=%q", ok, id, tgt.Type)
	}

	if _, _, ok := resolveSystemTarget("nonexistent"); ok {
		t.Fatalf("expected unknown system to return ok=false")
	}
}

func TestSecurityRebootEndpointValidationAndFlow(t *testing.T) {
	setupTestEnv(t)
	mux := buildMux()

	// 1. Method not allowed
	req := httptest.NewRequest(http.MethodGet, "/api/security-reboot", nil)
	rec := httptest.NewRecorder()
	mux.ServeHTTP(rec, req)
	if rec.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected 405 for GET, got %d", rec.Code)
	}

	// 2. Reject "all" and missing system_id
	for _, sysID := range []string{"", "all"} {
		body, _ := json.Marshal(map[string]any{"system_id": sysID})
		req = httptest.NewRequest(http.MethodPost, "/api/security-reboot", bytes.NewReader(body))
		rec = httptest.NewRecorder()
		mux.ServeHTTP(rec, req)
		if rec.Code != http.StatusBadRequest {
			t.Fatalf("expected 400 for system_id=%q, got %d (%s)", sysID, rec.Code, rec.Body.String())
		}
	}

	// 3. Reject unknown system_id
	req = httptest.NewRequest(http.MethodPost, "/api/security-reboot", strings.NewReader(`{"system_id":"unknown123"}`))
	rec = httptest.NewRecorder()
	mux.ServeHTTP(rec, req)
	if rec.Code != http.StatusNotFound {
		t.Fatalf("expected 404 for unknown system, got %d", rec.Code)
	}

	// 4. Reject Android Lineage target
	req = httptest.NewRequest(http.MethodPost, "/api/security-reboot", strings.NewReader(`{"system_id":"4rnyjklpllef0yl"}`))
	rec = httptest.NewRecorder()
	mux.ServeHTTP(rec, req)
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for Android Lineage target, got %d (%s)", rec.Code, rec.Body.String())
	}

	// 5. Simulate pre-reboot save failure -> must NOT schedule reboot
	var commands []string
	runCommandOnTarget = func(systemID, remoteCmd string, timeoutSec int) (bool, string) {
		commands = append(commands, systemID+"::"+remoteCmd)
		return false, "ssh timeout"
	}
	req = httptest.NewRequest(http.MethodPost, "/api/security-reboot", strings.NewReader(`{"system_id":"Hetzner"}`))
	rec = httptest.NewRecorder()
	mux.ServeHTTP(rec, req)
	if rec.Code != http.StatusBadGateway {
		t.Fatalf("expected 502 when save fails, got %d", rec.Code)
	}
	if len(commands) != 1 {
		t.Fatalf("expected only 1 command (save) before aborting, got %d: %v", len(commands), commands)
	}

	// 6. Successful save -> schedules detached reboot & records notification
	commands = nil
	runCommandOnTarget = func(systemID, remoteCmd string, timeoutSec int) (bool, string) {
		commands = append(commands, systemID+"::"+remoteCmd)
		return true, "ok"
	}
	req = httptest.NewRequest(http.MethodPost, "/api/security-reboot", strings.NewReader(`{"system_id":"zotmtzksqho8yof"}`))
	rec = httptest.NewRecorder()
	mux.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on success, got %d (%s)", rec.Code, rec.Body.String())
	}
	if len(commands) != 2 {
		t.Fatalf("expected 2 commands (save + trigger), got %d: %v", len(commands), commands)
	}
	if !strings.Contains(commands[0], "/usr/local/bin/server-resurrect save --shutdown") {
		t.Fatalf("first command must invoke server-resurrect save --shutdown, got: %s", commands[0])
	}
	if !strings.Contains(commands[1], "systemctl reboot") || !strings.Contains(commands[1], "</dev/null >/dev/null 2>&1") {
		t.Fatalf("second command must detach and call systemctl reboot, got: %s", commands[1])
	}

	var resp map[string]any
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("invalid JSON response: %v", err)
	}
	if ok, _ := resp["ok"].(bool); !ok || resp["system_id"] != "zotmtzksqho8yof" || resp["system_name"] != "Hetzner" {
		t.Fatalf("unexpected response payload: %#v", resp)
	}

	rawNotifs, err := os.ReadFile(notificationsFilePath())
	if err != nil {
		t.Fatalf("expected notification file written: %v", err)
	}
	if !strings.Contains(string(rawNotifs), `"type": "system_reboot"`) {
		t.Fatalf("expected system_reboot notification recorded, got: %s", string(rawNotifs))
	}
}

func TestBuildRichTelegramMessageSystemReboot(t *testing.T) {
	msg := buildRichTelegramMessage(map[string]any{
		"type":        "system_reboot",
		"system_name": "Hetzner",
		"title_ru":    "Запущена перезагрузка сервера",
		"summary_ru":  "Состояние (Hetzner) сохранено через server-resurrect.",
		"timestamp":   "2026-11-14 15:45:00 DXB",
	})
	if !strings.Contains(msg, "🔄") || !strings.Contains(msg, "Hetzner") || !strings.Contains(msg, "server-resurrect") {
		t.Fatalf("unexpected rich telegram message: %s", msg)
	}
}
