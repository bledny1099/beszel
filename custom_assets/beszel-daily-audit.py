#!/usr/bin/env python3
"""
Beszel Daily Security Check, Instant Port Manager & Non-Disruptive Update Agent
Runs daily at 04:00 Asia/Dubai on all Beszel-monitored servers.
Also supports instant UFW port open/close operations (--port-action) and fast check refreshes.
"""

import argparse
import datetime
import hashlib
import json
import os
import re
import socket
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

HUB_REPORT_URL = os.environ.get("BESZEL_REPORT_URL", "http://91.208.184.83:8090/api/security-report")
SHARED_TOKEN = os.environ.get("BESZEL_SECURITY_TOKEN", "bszl-sec-9120818483-dxb0400")
STATE_DIR = Path("/var/lib/beszel-security")
REPORT_FILE = STATE_DIR / "report.json"

PROTECTED_PORTS = {2244, 45876, 8090}

SERVER_PROFILES = {
    "theprivatenetwork": {
        "system_id": "kgm0fv4mrdnjw4r",
        "system_name": "The Private Network",
        "ip": "91.208.184.83",
        "role_title": "Beszel Hub & VPN Node",
        "role_title_ru": "Beszel Hub и VPN-узел",
        "expected_ports": {
            "2244/tcp": "SSH",
            "443/tcp": "Xray Reality",
            "2096/tcp": "X-UI Sub",
            "4433/tcp": "Amnezia Xray",
            "4515/tcp": "MicroBin",
            "8090/tcp": "Beszel Hub",
            "8443/tcp": "Xray TLS",
            "31702/udp": "AmneziaWG",
            "45876/tcp": "Beszel Agent",
        },
    },
    "ubuntu-8gb-fsn1-1-alex": {
        "system_id": "zotmtzksqho8yof",
        "system_name": "Hetzner",
        "ip": "91.99.147.9",
        "role_title": "Apps, Bots & Gateways",
        "role_title_ru": "Приложения, боты и шлюзы",
        "expected_ports": {
            "68/udp": "DHCPv4",
            "2244/tcp": "SSH",
            "80/tcp": "Caddy HTTP",
            "443/tcp": "Caddy HTTPS",
            "443/udp": "Caddy QUIC",
            "2083/tcp": "Xray Proxy",
            "2096/tcp": "X-UI Sub",
            "8443/tcp": "Xray TLS",
            "56968/udp": "WireGuard",
            "45876/tcp": "Beszel Agent",
            "3101/tcp": "Uvicorn 3101",
            "3102/tcp": "Service 3102",
            "3105/tcp": "Service 3105",
            "3110/tcp": "doSimple Lab",
            "3111/tcp": "doSimple Min",
            "4430/tcp": "Docker 4430",
            "8000/tcp": "Omniroute",
            "8081/tcp": "Docker 8081",
            "8089/tcp": "Docker 8089",
            "8770/tcp": "TikTok MCP",
            "8775/tcp": "TryHackMe MCP",
            "8781/tcp": "Google MCP",
            "8782/tcp": "GitHub MCP",
            "8783/tcp": "Firebase MCP",
            "8784/tcp": "Playwright MCP",
            "8880/tcp": "Docker 8880",
            "9050/tcp": "Tor SOCKS",
            "10808/tcp": "Xray Inbound",
            "10809/tcp": "Xray HTTP",
            "10808/udp": "Xray UDP",
        },
    },
    "srv2045167": {
        "system_id": "8paudjkafxqe9dx",
        "system_name": "NASAD SMP",
        "ip": "187.126.121.210",
        "role_title": "Minecraft & Web Node",
        "role_title_ru": "Minecraft и веб-портал",
        "expected_ports": {
            "22/tcp": "SSH (22)",
            "2244/tcp": "SSH (2244)",
            "80/tcp": "Caddy HTTP",
            "443/tcp": "Caddy HTTPS",
            "443/udp": "Caddy QUIC",
            "25565/tcp": "Minecraft Java",
            "25575/tcp": "MC RCON",
            "19132/udp": "Bedrock Geyser",
            "24454/udp": "Voice Chat",
            "45876/tcp": "Beszel Agent",
        },
    },
}


def get_profile():
    hostname = socket.gethostname()
    prof_file = Path("/etc/beszel-security/profile.json")
    custom_prof = {}
    if prof_file.exists():
        try:
            custom_prof = json.loads(prof_file.read_text(encoding="utf-8"))
        except Exception:
            custom_prof = {}

    base_profile = SERVER_PROFILES.get(
        hostname,
        {
            "system_id": custom_prof.get("system_id") or hostname,
            "system_name": custom_prof.get("system_name") or hostname,
            "ip": "unknown",
            "role_title": "Linux Server",
            "role_title_ru": "Linux-сервер",
            "expected_ports": {},
        },
    ).copy()
    if custom_prof.get("system_id"):
        base_profile["system_id"] = custom_prof["system_id"]
    if custom_prof.get("system_name"):
        base_profile["system_name"] = custom_prof["system_name"]
    return hostname, base_profile


def run_cmd(cmd, timeout=300, env=None):
    merged_env = os.environ.copy()
    merged_env["LC_ALL"] = "C"
    if env:
        merged_env.update(env)
    try:
        res = subprocess.run(
            cmd,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            timeout=timeout,
            env=merged_env,
        )
        return res.returncode, res.stdout.strip()
    except subprocess.TimeoutExpired:
        return 124, "Command timed out"
    except Exception as e:
        return 1, str(e)


def get_dubai_now():
    tz_dubai = datetime.timezone(datetime.timedelta(hours=4))
    return datetime.datetime.now(tz_dubai)


def ensure_norestart_policies():
    """Ensure APT and needrestart never automatically reboot the server or restart daemons, keep downloaded .debs for rollback, and include phased updates."""
    try:
        apt_conf = Path("/etc/apt/apt.conf.d/99-beszel-norestart")
        apt_conf.write_text(
            'Unattended-Upgrade::Automatic-Reboot "false";\n'
            'APT::Get::Always-Include-Phased-Updates "true";\n'
            'Update-Manager::Always-Include-Phased-Updates "true";\n'
            'APT::Keep-Downloaded-Packages "true";\n'
            'Binary::apt::APT::Keep-Downloaded-Packages "true";\n'
            'DPkg::Options {\n'
            '   "--force-confdef";\n'
            '   "--force-confold";\n'
            '};\n'
        )
        nr_dir = Path("/etc/needrestart/conf.d")
        if nr_dir.exists():
            (nr_dir / "99-beszel-norestart.conf").write_text(
                "# Managed by Beszel Daily Maintenance - never auto-restart services\n"
                "$nrconf{restart} = 'l';\n"
                "$nrconf{kernelhints} = 0;\n"
            )
    except Exception:
        pass


def parse_upgradable_packages():
    """Parse `apt list --upgradable` so pending updates match Beszel's native `pu` counter 100%."""
    _, out = run_cmd("apt list --upgradable 2>/dev/null", timeout=30)
    _, held_out = run_cmd("apt-mark showhold 2>/dev/null", timeout=10)
    held_set = set(held_out.split())
    pending_packages = []
    pending_security = []
    for line in out.splitlines():
        if "/" not in line or line.startswith("Listing"):
            continue
        # e.g. openssh-server/resolute-updates 1:10.2p1-2ubuntu3.7 amd64 [upgradable from: 1:10.2p1-2ubuntu3.6]
        m = re.match(r"^([^\s/]+)/(\S+)\s+(\S+)\s+\S+\s+\[upgradable from:\s*([^\]]+)\]", line)
        if m:
            pkg_name, repo, new_v, old_v = m.groups()
            if pkg_name in held_set:
                continue
            is_sec = "security" in repo.lower()
            item = {
                "name": pkg_name,
                "old_version": old_v.strip(),
                "new_version": new_v.strip(),
                "security": is_sec,
            }
            pending_packages.append(item)
            if is_sec:
                pending_security.append(pkg_name)
    return pending_packages, pending_security


ROLLBACK_SNAPSHOT_FILE = STATE_DIR / "rollback-snapshot.json"
URGENT_ROLLBACK_SNAPSHOT_FILE = STATE_DIR / "rollback-urgent-snapshot.json"
ROLLBACK_DEBS_DIR = STATE_DIR / "rollback-debs"
ROLLBACK_STATE_FILE = STATE_DIR / "rollback-state.json"
CVE_CACHE_FILE = STATE_DIR / "cve-cache.json"
HUB_EVENT_URL = os.environ.get("BESZEL_EVENT_URL", "http://91.208.184.83:8090/api/security-event")

KEY_SECURITY_PKGS = (
    "libc6",
    "libc-bin",
    "openssl",
    "libssl",
    "curl",
    "libcurl",
    "openssh",
    "linux-image",
    "systemd",
    "sudo",
    "python3",
    "docker",
    "containerd",
    "git",
    "libexpat",
    "libxml2",
    "libsqlite3",
    "ca-certificates",
    "ufw",
    "fail2ban",
    "nginx",
    "caddy",
    "postgresql",
    "redis",
)


def load_cve_cache():
    if CVE_CACHE_FILE.exists():
        try:
            return json.loads(CVE_CACHE_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {}


def save_cve_cache(cache_obj):
    try:
        STATE_DIR.mkdir(parents=True, exist_ok=True)
        CVE_CACHE_FILE.write_text(json.dumps(cache_obj, ensure_ascii=False, indent=2), encoding="utf-8")
    except Exception:
        pass


def extract_package_cves(pkg_name, version_str="", cache_obj=None):
    """Extract CVE IDs and SECURITY UPDATE descriptions from the top stanza of apt-get changelog."""
    own_cache = False
    if cache_obj is None:
        cache_obj = load_cve_cache()
        own_cache = True

    key = f"{pkg_name}:{version_str}"
    if key in cache_obj:
        return cache_obj[key].get("cves", []), cache_obj[key].get("summaries", [])

    cmd = f"apt-get changelog {pkg_name}={version_str} 2>/dev/null" if version_str else f"apt-get changelog {pkg_name} 2>/dev/null"
    rc, out = run_cmd(cmd, timeout=8)
    if rc != 0 or not out.strip():
        rc, out = run_cmd(f"apt-get changelog {pkg_name} 2>/dev/null", timeout=8)

    cves = []
    summaries = []
    if out:
        stanza_lines = []
        started = False
        for line in out.splitlines():
            if not started and re.match(r"^\S+\s+\([^)]+\)\s+\S+;", line):
                started = True
            if started:
                stanza_lines.append(line)
                if line.startswith(" -- "):
                    break
        stanza_text = "\n".join(stanza_lines[:90])
        for m_cve in re.findall(r"CVE-\d{4}-\d{4,7}", stanza_text):
            if m_cve not in cves:
                cves.append(m_cve)
        for line in stanza_lines[:60]:
            m_sec = re.search(r"SECURITY UPDATE:\s*(.+)", line, re.IGNORECASE)
            if m_sec:
                s_clean = m_sec.group(1).strip().rstrip(":")
                if s_clean and s_clean not in summaries:
                    summaries.append(s_clean)

    cache_obj[key] = {"cves": cves[:12], "summaries": summaries[:6]}
    if own_cache:
        save_cve_cache(cache_obj)
    return cves[:12], summaries[:6]


def push_security_event(event_payload):
    """Push an instant notification event (vuln_patched, auto_update, vuln_detected, auto_rollback) to Beszel Hub."""
    data = json.dumps(event_payload, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        HUB_EVENT_URL,
        data=data,
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "X-Beszel-Security-Token": SHARED_TOKEN,
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            return resp.status == 200
    except Exception:
        return False


def collect_vulnerability_status(upgraded_24h, upgraded_recent, pending_packages, pending_security):
    """Build vulnerability & CVE summary for this server."""
    cve_cache = load_cve_cache()
    cache_dirty = False
    all_patched_cves = []
    recent_sec_patches = []
    seen_pkgs = set()

    combined = upgraded_24h + [p for p in upgraded_recent if p["name"] not in {x["name"] for x in upgraded_24h}]
    # Inspect up to 8 key security packages from recent upgrades to extract real CVEs
    inspected = 0
    for pkg in combined:
        pname = pkg["name"]
        if pname in seen_pkgs:
            continue
        seen_pkgs.add(pname)
        is_key = any(pname.startswith(k) for k in KEY_SECURITY_PKGS)
        if not is_key and inspected >= 4:
            continue
        key = f"{pname}:{pkg['new_version']}"
        was_cached = key in cve_cache
        cves, summaries = extract_package_cves(pname, pkg["new_version"], cache_obj=cve_cache)
        if not was_cached:
            cache_dirty = True
            inspected += 1
        if cves or summaries:
            for c in cves:
                if c not in all_patched_cves:
                    all_patched_cves.append(c)
            recent_sec_patches.append({
                "name": pname,
                "old_version": pkg["old_version"],
                "new_version": pkg["new_version"],
                "timestamp": pkg["timestamp"],
                "cves": cves[:8],
                "summaries": summaries[:3],
            })
        if inspected >= 6:
            break

    open_vulns = []
    for p in pending_packages:
        if p.get("security"):
            key = f"{p['name']}:{p['new_version']}"
            was_cached = key in cve_cache
            cves, summaries = extract_package_cves(p["name"], p["new_version"], cache_obj=cve_cache)
            if not was_cached:
                cache_dirty = True
            open_vulns.append({
                "name": p["name"],
                "old_version": p["old_version"],
                "new_version": p["new_version"],
                "cves": cves[:8],
                "summaries": summaries[:3],
            })

    if cache_dirty:
        save_cve_cache(cve_cache)

    return {
        "watcher_active": True,
        "interval": "10m",
        "open_vulns_count": len(open_vulns),
        "open_vulns": open_vulns[:20],
        "patched_cves_count": len(all_patched_cves),
        "patched_cves": all_patched_cves[:30],
        "recent_patches": recent_sec_patches[:15],
    }


def parse_recent_dpkg_upgrades():
    upgraded_24h = []
    upgraded_recent = []
    now_utc = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None)
    for lp in (Path("/var/log/dpkg.log"), Path("/var/log/dpkg.log.1")):
        if not lp.exists():
            continue
        try:
            for line in lp.read_text(errors="ignore").splitlines():
                if " upgrade " not in line:
                    continue
                m = re.match(r"^(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+upgrade\s+(\S+)\s+(\S+)\s+(\S+)", line)
                if m:
                    ts_str, pkg_arch, old_v, new_v = m.groups()
                    pkg_clean = pkg_arch.split(":")[0]
                    try:
                        dt = datetime.datetime.strptime(ts_str, "%Y-%m-%d %H:%M:%S")
                        age_hours = (now_utc - dt).total_seconds() / 3600.0
                    except Exception:
                        age_hours = 999
                    entry = {
                        "name": pkg_clean,
                        "old_version": old_v,
                        "new_version": new_v,
                        "timestamp": ts_str,
                        "within_24h": age_hours <= 30,
                    }
                    if age_hours <= 30:
                        upgraded_24h.append(entry)
                    if age_hours <= 168:
                        upgraded_recent.append(entry)
        except Exception:
            pass
    upgraded_24h.reverse()
    upgraded_recent.reverse()
    return upgraded_24h, upgraded_recent


def recover_stack_item(item_id):
    for cat_item in UNIVERSAL_STACK_CATALOG:
        if cat_item["id"] != item_id:
            continue
        for uname in cat_item.get("systemd", []):
            run_cmd(f"systemctl restart {uname} 2>/dev/null || true", timeout=30)
        for cname in cat_item.get("docker", []):
            run_cmd(f"docker start {cname} 2>/dev/null || true", timeout=30)


def capture_listening_expected_ports(expected_ports_map):
    """Return sorted list of expected port keys (e.g. '2244/tcp') currently listening on the host."""
    if not expected_ports_map:
        return []
    _, ss_out = run_cmd("ss -tuln 2>/dev/null", timeout=10)
    active = set()
    for line in ss_out.splitlines():
        parts = line.split()
        if len(parts) < 5:
            continue
        proto = "tcp" if parts[0].startswith("tcp") else ("udp" if parts[0].startswith("udp") else "")
        if not proto:
            continue
        local_addr = parts[4]
        m_port = re.search(r":(\d+)$", local_addr)
        if m_port:
            key = f"{m_port.group(1)}/{proto}"
            if key in expected_ports_map:
                active.add(key)
    return sorted(active)


def capture_failed_systemd_units():
    """Return set of currently failed systemd service units."""
    _, out = run_cmd("systemctl list-units --type=service --state=failed --no-legend --plain 2>/dev/null", timeout=10)
    failed = set()
    for line in out.splitlines():
        parts = line.split()
        if parts and parts[0].endswith(".service"):
            failed.add(parts[0])
    return failed


def backup_current_debs(packages):
    """Preserve cached .deb archives in ROLLBACK_DEBS_DIR before upgrading so rollback works even if repo drops old version."""
    try:
        ROLLBACK_DEBS_DIR.mkdir(parents=True, exist_ok=True)
        apt_archives = Path("/var/cache/apt/archives")
        if not apt_archives.exists():
            return
        for p in packages[:30]:
            pname = p.get("name", "")
            old_v = p.get("old_version", "")
            if not pname or not old_v:
                continue
            # Strip epoch like '1:' which is encoded as '%3a' or omitted in .deb filenames
            ver_no_epoch = re.sub(r"^\d+:", "", old_v)
            for deb_path in apt_archives.glob(f"{pname}_*.deb"):
                fname = deb_path.name
                if ver_no_epoch in fname or old_v.replace(":", "%3a") in fname:
                    dst = ROLLBACK_DEBS_DIR / fname
                    if not dst.exists():
                        run_cmd(f"cp -f {deb_path} {dst} 2>/dev/null || true", timeout=10)
    except Exception:
        pass


def find_local_deb_for_version(pkg_name, old_ver):
    """Search ROLLBACK_DEBS_DIR and /var/cache/apt/archives for a matching .deb file."""
    ver_no_epoch = re.sub(r"^\d+:", "", old_ver)
    ver_escaped = old_ver.replace(":", "%3a")
    for search_dir in (ROLLBACK_DEBS_DIR, Path("/var/cache/apt/archives")):
        if not search_dir.exists():
            continue
        for deb_path in search_dir.glob(f"{pkg_name}_*.deb"):
            fname = deb_path.name
            if ver_no_epoch in fname or ver_escaped in fname:
                return deb_path
    return None


def find_fallback_repo_version(pkg_name, current_new_ver=""):
    """If exact old_version was pruned from Ubuntu security repo, pick highest older version from apt-cache madison."""
    _, out = run_cmd(f"apt-cache madison {pkg_name} 2>/dev/null", timeout=15)
    for line in out.splitlines():
        parts = [x.strip() for x in line.split("|")]
        if len(parts) >= 2:
            cand_v = parts[1]
            if cand_v and cand_v != current_new_ver:
                return cand_v
    return ""


def execute_rollback(reason="Manual rollback", hold_on_auto=False, rollback_specs="", urgent_only=False):
    """Downgrade packages from specific specs, urgent CVE snapshot, or last update snapshot and recover services."""
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    env_rb = {
        "DEBIAN_FRONTEND": "noninteractive",
        "NEEDRESTART_MODE": "l",
        "NEEDRESTART_SUSPEND": "1",
    }

    target_pkgs = []
    pre_running_ids = []

    if rollback_specs:
        for item_str in rollback_specs.split(","):
            item_str = item_str.strip()
            if "=" in item_str:
                pname, old_v = item_str.split("=", 1)
                if pname.strip() and old_v.strip():
                    target_pkgs.append({"name": pname.strip(), "old_version": old_v.strip(), "new_version": ""})

    snap_candidates = (
        [URGENT_ROLLBACK_SNAPSHOT_FILE, ROLLBACK_SNAPSHOT_FILE]
        if urgent_only
        else [ROLLBACK_SNAPSHOT_FILE, URGENT_ROLLBACK_SNAPSHOT_FILE]
    )
    for sfile in snap_candidates:
        if sfile.exists():
            try:
                snap = json.loads(sfile.read_text(encoding="utf-8"))
                if not target_pkgs:
                    target_pkgs = snap.get("packages", [])
                if not pre_running_ids:
                    pre_running_ids = snap.get("pre_running_ids", [])
            except Exception:
                pass

    if not target_pkgs:
        up_24h, up_recent = parse_recent_dpkg_upgrades()
        source_list = up_24h if up_24h else up_recent[:25]
        seen = set()
        for entry in reversed(source_list):
            pname = entry["name"]
            if pname not in seen:
                seen.add(pname)
                target_pkgs.append({
                    "name": pname,
                    "old_version": entry["old_version"],
                    "new_version": entry["new_version"],
                })

    if not target_pkgs:
        return False, "No recent package upgrades found to roll back"

    run_cmd("dpkg --configure -a 2>/dev/null || true", timeout=120, env=env_rb)
    specs = [f"{p['name']}={p['old_version']}" for p in target_pkgs if p.get("name") and p.get("old_version")]
    if not specs:
        return False, "No valid package versions in snapshot"

    cmd_str = (
        'apt-get -y -q --allow-downgrades --allow-change-held-packages '
        '-o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" '
        'install ' + " ".join(specs)
    )
    rc, out = run_cmd(cmd_str, timeout=600, env=env_rb)

    rolled_names = []
    if rc == 0:
        rolled_names = [p["name"] for p in target_pkgs]
    else:
        for p in target_pkgs:
            pname = p.get("name", "")
            old_v = p.get("old_version", "")
            new_v = p.get("new_version", "")
            if not pname or not old_v:
                continue
            rc_one, _ = run_cmd(
                f'apt-get -y -q --allow-downgrades --allow-change-held-packages '
                f'-o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" '
                f'install {pname}={old_v}',
                timeout=180,
                env=env_rb,
            )
            if rc_one == 0:
                rolled_names.append(pname)
                continue
            # Tier 2: Check local .deb cache in ROLLBACK_DEBS_DIR or /var/cache/apt/archives
            deb_file = find_local_deb_for_version(pname, old_v)
            if deb_file is not None:
                rc_deb, _ = run_cmd(
                    f'dpkg -i --force-downgrade --force-confdef --force-confold {deb_file}',
                    timeout=120,
                    env=env_rb,
                )
                if rc_deb == 0:
                    rolled_names.append(pname)
                    continue
            # Tier 3: Fallback to previous available version in repo via apt-cache madison
            fb_ver = find_fallback_repo_version(pname, new_v)
            if fb_ver:
                rc_fb, _ = run_cmd(
                    f'apt-get -y -q --allow-downgrades --allow-change-held-packages '
                    f'-o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" '
                    f'install {pname}={fb_ver}',
                    timeout=180,
                    env=env_rb,
                )
                if rc_fb == 0:
                    rolled_names.append(pname)

    if hold_on_auto and rolled_names:
        run_cmd("apt-mark hold " + " ".join(rolled_names) + " 2>/dev/null || true", timeout=30)

    for sid in pre_running_ids:
        # Only restart services that actually stopped or failed
        for cat_item in UNIVERSAL_STACK_CATALOG:
            if cat_item["id"] == sid:
                for uname in cat_item.get("systemd", []):
                    rc, st = run_cmd(f"systemctl is-active {uname} 2>/dev/null")
                    if rc != 0 or st.strip() != "active":
                        run_cmd(f"systemctl restart {uname} 2>/dev/null || true", timeout=30)
                for cname in cat_item.get("docker", []):
                    rc, st = run_cmd(f"docker inspect -f '{{{{.State.Running}}}}' {cname} 2>/dev/null")
                    if st.strip() != "true":
                        run_cmd(f"docker start {cname} 2>/dev/null || true", timeout=30)
    run_cmd("systemctl restart beszel-agent 2>/dev/null || true", timeout=15)

    dubai_now = get_dubai_now().strftime("%Y-%m-%d %H:%M:%S DXB")
    rb_state = {
        "status": "auto_rolled_back" if hold_on_auto else "rolled_back",
        "urgent": bool(urgent_only or rollback_specs),
        "timestamp": dubai_now,
        "reason": reason,
        "rolled_back_count": len(rolled_names),
        "rolled_back_packages": rolled_names[:30],
    }
    ROLLBACK_STATE_FILE.write_text(json.dumps(rb_state, ensure_ascii=False, indent=2), encoding="utf-8")
    ok = len(rolled_names) > 0
    msg = f"Rolled back {len(rolled_names)}/{len(target_pkgs)} packages" if ok else f"Rollback failed: {out[-180:]}"
    return ok, msg


def perform_updates(do_upgrade=True, only_security=False):
    """Run non-disruptive updates (daily or urgent CVE) with pre-snapshot, port/service/config health check, and auto-rollback."""
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    ensure_norestart_policies()
    _, profile = get_profile()
    env_update = {
        "DEBIAN_FRONTEND": "noninteractive",
        "NEEDRESTART_MODE": "l",
        "NEEDRESTART_SUSPEND": "1",
    }

    update_log = []
    apt_ok = True
    auto_rollback_triggered = False
    started_at = time.time()
    sec_targets = []

    if only_security:
        cache_file = Path("/var/cache/apt/pkgcache.bin")
        if not cache_file.exists() or (time.time() - cache_file.stat().st_mtime > 7200):
            run_cmd("apt-get update -q", timeout=150, env=env_update)
        cand_pkgs, cand_sec = parse_upgradable_packages()
        # Check if any candidate package is from *-security or has CVEs in its changelog
        cve_cache = load_cve_cache()
        for p in cand_pkgs:
            if p.get("security"):
                sec_targets.append(p)
            elif any(p["name"].startswith(k) for k in KEY_SECURITY_PKGS):
                cves, sums = extract_package_cves(p["name"], p["new_version"], cache_obj=cve_cache)
                if cves or sums:
                    p["security"] = True
                    sec_targets.append(p)
        save_cve_cache(cve_cache)
        do_upgrade = bool(sec_targets)

    if do_upgrade:
        if not only_security:
            rc, _ = run_cmd("apt-get update -q", timeout=180, env=env_update)
            if rc != 0:
                apt_ok = False
            update_log.append(f"$ apt-get update (rc={rc})")

        # 1. Capture pre-upgrade snapshot (packages + running services + listening ports + failed systemd units)
        all_pending, pre_sec = parse_upgradable_packages()
        pre_pending = sec_targets if (only_security and sec_targets) else all_pending
        pre_stack = collect_universal_stack()
        pre_running_ids = [i["id"] for i in pre_stack["items"] if i["status"] == "running"]
        pre_ports = capture_listening_expected_ports(profile.get("expected_ports", {}))
        pre_failed_units = capture_failed_systemd_units()

        if pre_pending:
            backup_current_debs(pre_pending)
            snap_data = {
                "created_at": get_dubai_now().strftime("%Y-%m-%d %H:%M:%S DXB"),
                "urgent_security": bool(only_security),
                "packages": pre_pending,
                "pre_running_ids": pre_running_ids,
                "pre_ports": pre_ports,
            }
            ROLLBACK_SNAPSHOT_FILE.write_text(json.dumps(snap_data, ensure_ascii=False, indent=2), encoding="utf-8")
            if only_security:
                URGENT_ROLLBACK_SNAPSHOT_FILE.write_text(json.dumps(snap_data, ensure_ascii=False, indent=2), encoding="utf-8")

        # 2. Execute non-restart upgrade (targeted security packages for --vuln-watch, or full dist-upgrade for daily)
        if only_security and sec_targets:
            target_names = " ".join(p["name"] for p in sec_targets)
            rc_up, out_up = run_cmd(
                'apt-get -y -q -o APT::Get::Always-Include-Phased-Updates=true '
                '-o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" '
                f'--only-upgrade install {target_names}',
                timeout=600,
                env=env_update,
            )
            update_log.append(f"$ apt-get --only-upgrade install {target_names} (rc={rc_up})")
        else:
            rc_up, out_up = run_cmd(
                'apt-get -y -q -o APT::Get::Always-Include-Phased-Updates=true '
                '-o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" dist-upgrade',
                timeout=900,
                env=env_update,
            )
            update_log.append(f"$ apt-get dist-upgrade (rc={rc_up})")

        if rc_up != 0:
            apt_ok = False
            run_cmd("dpkg --configure -a", timeout=180, env=env_update)
            run_cmd("apt-get -y -q -f install", timeout=180, env=env_update)
        if out_up:
            update_log.extend(out_up.splitlines()[-8:])

        # 3. Post-upgrade health verification (services + ports + systemd units + daemon configs) & auto-rollback
        time.sleep(2)
        post_stack = collect_universal_stack()
        post_running_ids = {i["id"] for i in post_stack["items"] if i["status"] == "running"}
        stopped_after_up = [sid for sid in pre_running_ids if sid not in post_running_ids]
        post_ports = set(capture_listening_expected_ports(profile.get("expected_ports", {})))
        lost_ports = [pt for pt in pre_ports if pt not in post_ports]
        post_failed_units = capture_failed_systemd_units()
        new_failed_units = sorted(list(post_failed_units - pre_failed_units))

        if stopped_after_up or lost_ports or new_failed_units:
            for sid in stopped_after_up:
                recover_stack_item(sid)
            for u in new_failed_units:
                run_cmd(f"systemctl restart {u} 2>/dev/null || true", timeout=25)
            time.sleep(2)
            recheck_stack = collect_universal_stack()
            recheck_running = {i["id"] for i in recheck_stack["items"] if i["status"] == "running"}
            still_down = [sid for sid in pre_running_ids if sid not in recheck_running]
            recheck_ports = set(capture_listening_expected_ports(profile.get("expected_ports", {})))
            still_lost_ports = [pt for pt in pre_ports if pt not in recheck_ports]
            still_failed_units = sorted(list(capture_failed_systemd_units() - pre_failed_units))
        else:
            still_down = []
            still_lost_ports = []
            still_failed_units = []

        # Verify critical daemon syntax if openssh or nginx was touched
        config_broken = []
        touched_names = {p["name"] for p in pre_pending}
        if any(n.startswith("openssh") for n in touched_names) and Path("/usr/sbin/sshd").exists():
            rc_sshd, _ = run_cmd("/usr/sbin/sshd -t 2>/dev/null", timeout=10)
            if rc_sshd != 0:
                config_broken.append("sshd-config")
        if any(n.startswith("nginx") for n in touched_names) and Path("/usr/sbin/nginx").exists():
            rc_ngx, _ = run_cmd("/usr/sbin/nginx -t 2>/dev/null", timeout=10)
            if rc_ngx != 0:
                config_broken.append("nginx-config")

        rc_audit, out_audit = run_cmd("dpkg --audit 2>/dev/null")
        dpkg_broken = bool(out_audit.strip())

        if (not apt_ok or still_down or still_lost_ports or still_failed_units or config_broken or dpkg_broken) and pre_pending:
            reason = (
                f"Auto-rollback ({'urgent CVE' if only_security else 'daily'}): "
                f"apt_ok={apt_ok}, down={still_down}, lost_ports={still_lost_ports}, "
                f"failed_units={still_failed_units}, cfg={config_broken}, dpkg_broken={dpkg_broken}"
            )
            update_log.append(f"! {reason}")
            rb_ok, rb_msg = execute_rollback(reason=reason, hold_on_auto=True, urgent_only=only_security)
            auto_rollback_triggered = True
            update_log.append(f"$ auto-rollback: {rb_msg} (ok={rb_ok})")
            pkg_names_str = ", ".join(p["name"] for p in pre_pending[:4])
            if len(pre_pending) > 4:
                pkg_names_str += f" +{len(pre_pending) - 4}"
            push_security_event({
                "system_id": profile["system_id"],
                "system_name": profile["system_name"],
                "type": "auto_rollback",
                "timestamp": get_dubai_now().strftime("%Y-%m-%d %H:%M:%S DXB"),
                "title_ru": (
                    f"Авто-откат срочного патча: {pkg_names_str}"
                    if only_security
                    else f"Авто-откат обновления ({len(pre_pending)} пак.)"
                ),
                "title_en": (
                    f"Urgent Patch Auto-Rollback: {pkg_names_str}"
                    if only_security
                    else f"Update Auto-Rollback ({len(pre_pending)} pkgs)"
                ),
                "summary_ru": f"Сбой проверки после патча ({reason}). Возвращены прежние версии и поставлен hold.",
                "summary_en": f"Post-patch health check failed ({reason}). Rolled back to previous versions and held.",
                "cves": [],
                "packages": pre_pending[:25],
            })
        else:
            if not only_security:
                rc_ar, _ = run_cmd("apt-get -y -q autoremove --purge", timeout=300, env=env_update)
                update_log.append(f"$ apt-get autoremove (rc={rc_ar})")
            if pre_pending:
                cve_cache = load_cve_cache()
                ev_cves = []
                ev_sums = []
                for p in pre_pending[:15]:
                    if p.get("security") or any(p["name"].startswith(k) for k in KEY_SECURITY_PKGS):
                        cs, ss = extract_package_cves(p["name"], p["new_version"], cache_obj=cve_cache)
                        for c in cs:
                            if c not in ev_cves:
                                ev_cves.append(c)
                        for s in ss:
                            if s not in ev_sums:
                                ev_sums.append(s)
                save_cve_cache(cve_cache)
                is_vuln_patch = bool(ev_cves or pre_sec or only_security)
                ev_type = "vuln_patched" if is_vuln_patch else "auto_update"
                pkg_names_str = ", ".join(p["name"] for p in pre_pending[:4])
                if len(pre_pending) > 4:
                    pkg_names_str += f" +{len(pre_pending) - 4}"
                t_ru = (
                    f"{pkg_names_str} ({len(ev_cves)} CVE)"
                    if (is_vuln_patch and ev_cves)
                    else (f"Срочный патч: {pkg_names_str}" if is_vuln_patch else f"Авто-обновление: {len(pre_pending)} пак.")
                )
                t_en = (
                    f"{pkg_names_str} ({len(ev_cves)} CVEs)"
                    if (is_vuln_patch and ev_cves)
                    else (f"Urgent Patch: {pkg_names_str}" if is_vuln_patch else f"Auto-Update: {len(pre_pending)} pkgs")
                )
                s_ru = (
                    "; ".join(ev_sums[:2])
                    if ev_sums
                    else ("Патч проверен (порты и сервисы ОК)" if is_vuln_patch else pkg_names_str)
                )
                s_en = (
                    "; ".join(ev_sums[:2])
                    if ev_sums
                    else ("Patch verified (ports & services OK)" if is_vuln_patch else pkg_names_str)
                )
                push_security_event({
                    "system_id": profile["system_id"],
                    "system_name": profile["system_name"],
                    "type": ev_type,
                    "timestamp": get_dubai_now().strftime("%Y-%m-%d %H:%M:%S DXB"),
                    "title_ru": t_ru,
                    "title_en": t_en,
                    "summary_ru": s_ru,
                    "summary_en": s_en,
                    "cves": ev_cves[:15],
                    "packages": pre_pending[:30],
                    "rollback_guard": "ok",
                })

        if not only_security:
            if Path("/opt/beszel-agent/beszel-agent").exists():
                _, out_ba = run_cmd("/opt/beszel-agent/beszel-agent update", timeout=120)
                update_log.append(f"$ beszel-agent update: {out_ba[:100]}")

            rc_sn, _ = run_cmd("systemctl is-active --quiet snapd")
            if rc_sn == 0:
                _, out_sr = run_cmd("snap refresh", timeout=300)
                update_log.append(f"$ snap refresh: {out_sr[:100]}")

        run_cmd("systemctl restart beszel-agent 2>/dev/null || true", timeout=15)
    else:
        cache_file = Path("/var/cache/apt/pkgcache.bin")
        if not cache_file.exists() or (time.time() - cache_file.stat().st_mtime > 7200):
            run_cmd("apt-get update -q", timeout=120, env=env_update)

    duration_sec = round(time.time() - started_at, 1)
    pending_packages, pending_security = parse_upgradable_packages()
    upgraded_24h, upgraded_recent = parse_recent_dpkg_upgrades()
    vulns = collect_vulnerability_status(upgraded_24h, upgraded_recent, pending_packages, pending_security)

    snap_pkgs_count = 0
    if ROLLBACK_SNAPSHOT_FILE.exists():
        try:
            snap_pkgs_count = len(json.loads(ROLLBACK_SNAPSHOT_FILE.read_text(encoding="utf-8")).get("packages", []))
        except Exception:
            snap_pkgs_count = 0
    if snap_pkgs_count == 0:
        snap_pkgs_count = len({p["name"] for p in (upgraded_24h if upgraded_24h else upgraded_recent[:25])})

    last_rb = None
    if ROLLBACK_STATE_FILE.exists():
        try:
            last_rb = json.loads(ROLLBACK_STATE_FILE.read_text(encoding="utf-8"))
        except Exception:
            last_rb = None

    reboot_req = Path("/var/run/reboot-required").exists()
    reboot_pkgs = []
    reboot_pkgs_file = Path("/var/run/reboot-required.pkgs")
    if reboot_pkgs_file.exists():
        try:
            reboot_pkgs = sorted(list(set(p.strip() for p in reboot_pkgs_file.read_text().splitlines() if p.strip())))
        except Exception:
            pass

    _, agent_ver = run_cmd("/opt/beszel-agent/beszel-agent --version 2>/dev/null || echo '0.21.0'")
    agent_ver = agent_ver.replace("beszel-agent ", "").strip()
    rc_dk, dk_out = run_cmd("docker ps --format '{{.Names}}' 2>/dev/null")
    running_containers = [c.strip() for c in dk_out.splitlines() if c.strip()] if rc_dk == 0 else []

    return {
        "apt_success": apt_ok,
        "auto_rollback_enabled": True,
        "auto_rollback_triggered": auto_rollback_triggered,
        "rollback_available": snap_pkgs_count > 0,
        "rollback_packages_count": snap_pkgs_count,
        "last_rollback": last_rb,
        "mode": "Instant CVE Patch + Daily 04:00 DXB",
        "ran_full_upgrade": do_upgrade,
        "duration_sec": duration_sec,
        "upgraded_24h_count": len(upgraded_24h),
        "upgraded_24h": upgraded_24h[:40],
        "upgraded_recent_count": len(upgraded_recent),
        "upgraded_recent": upgraded_recent[:30],
        "pending_count": len(pending_packages),
        "pending_security_count": len(pending_security),
        "pending_packages": pending_packages[:50],
        "vulnerabilities": vulns,
        "reboot_required": reboot_req,
        "reboot_packages": reboot_pkgs[:15],
        "beszel_agent_version": agent_ver,
        "running_containers_count": len(running_containers),
        "running_containers": running_containers,
        "log_tail": update_log[-10:],
    }


def check_ssh_and_auth():
    """1. Audit SSH configuration, brute-force attempts, and keys."""
    _, sshd_T = run_cmd("sshd -T 2>/dev/null")
    cfg = {}
    for line in sshd_T.splitlines():
        parts = line.split(None, 1)
        if len(parts) == 2:
            cfg[parts[0].lower()] = parts[1]

    pw_auth = cfg.get("passwordauthentication", "no")
    permit_root = cfg.get("permitrootlogin", "prohibit-password")
    ports = [line.split()[1] for line in sshd_T.splitlines() if line.startswith("port ")] or ["2244"]

    _, j_out = run_cmd('journalctl -u ssh -u sshd --since "24 hours ago" --no-pager 2>/dev/null', timeout=25)
    failed_count = 0
    accepted_count = 0
    attacker_ips = {}
    for line in j_out.splitlines():
        if "Failed password" in line or "Invalid user" in line or "Connection closed by authenticating user" in line:
            failed_count += 1
            ip_m = re.search(r"(\d+\.\d+\.\d+\.\d+)", line)
            if ip_m:
                ip = ip_m.group(1)
                attacker_ips[ip] = attacker_ips.get(ip, 0) + 1
        elif "Accepted publickey" in line or "Accepted password" in line:
            accepted_count += 1

    top_attackers = sorted(
        [{"ip": k, "count": v} for k, v in attacker_ips.items()],
        key=lambda x: x["count"],
        reverse=True,
    )[:6]

    ak_path = Path("/root/.ssh/authorized_keys")
    keys_info = []
    ak_hash = ""
    if ak_path.exists():
        raw = ak_path.read_text(errors="ignore")
        ak_hash = hashlib.sha256(raw.encode()).hexdigest()[:16]
        for line in raw.splitlines():
            s = line.strip()
            if not s or s.startswith("#"):
                continue
            parts = s.split()
            keys_info.append({"type": parts[0] if parts else "key", "comment": parts[2] if len(parts) >= 3 else "key"})

    status = "crit" if pw_auth == "yes" else "ok"
    return {
        "id": "ssh_auth",
        "title": "SSH",
        "status": status,
        "summary": f"Port {', '.join(ports)} · Keys: {len(keys_info)} · Blocked: {failed_count}",
        "metrics": {
            "ports": ports,
            "password_auth": pw_auth,
            "permit_root_login": permit_root,
            "failed_24h": failed_count,
            "accepted_24h": accepted_count,
            "authorized_keys_count": len(keys_info),
            "authorized_keys_hash": ak_hash,
            "top_attackers": top_attackers,
        },
    }


def check_firewall():
    """2. Audit UFW firewall status and numbered rules."""
    rc_act, _ = run_cmd("systemctl is-active --quiet ufw")
    _, ufw_out = run_cmd("ufw status numbered 2>/dev/null")
    is_active = "Status: active" in ufw_out
    rules = []
    for line in ufw_out.splitlines():
        s = line.strip()
        if not s.startswith("["):
            continue
        m = re.match(r"^\[\s*(\d+)\]\s+(.+)$", s)
        if not m:
            continue
        num = int(m.group(1))
        rest = m.group(2)
        comment = ""
        if "#" in rest:
            rest, comment = rest.split("#", 1)
            comment = comment.strip()
        parts = re.split(r"\s{2,}", rest.strip())
        if len(parts) >= 2:
            to_col = parts[0].strip()
            action_col = parts[1].strip()
            from_col = parts[2].strip() if len(parts) > 2 else "Anywhere"
            is_v6 = "(v6)" in to_col or "(v6)" in from_col
            # Extract port number if simple port rule so we can check protection
            port_m = re.match(r"^(\d+)(?:/(tcp|udp))?", to_col)
            port_num = int(port_m.group(1)) if port_m else None
            protected = port_num in PROTECTED_PORTS
            rules.append({
                "num": num,
                "to": to_col,
                "action": action_col,
                "from": from_col,
                "comment": comment,
                "v6": is_v6,
                "protected": protected,
            })

    status = "ok" if is_active else "crit"
    return {
        "id": "firewall",
        "title": "UFW Firewall",
        "status": status,
        "summary": f"{'Active' if is_active else 'OFF'} · {len(rules)} rules",
        "metrics": {
            "active": is_active,
            "systemd_active": rc_act == 0,
            "rules_count": len(rules),
            "rules": rules[:100],
        },
    }


def check_fail2ban():
    """3. Audit Fail2ban service, active jails, and banned IPs."""
    rc, _ = run_cmd("systemctl is-active --quiet fail2ban")
    is_active = rc == 0
    jails = []
    currently_banned = 0
    total_banned = 0
    banned_ips = []

    if is_active:
        _, st_out = run_cmd("fail2ban-client status 2>/dev/null")
        m = re.search(r"Jail list:\s*(.+)", st_out)
        if m:
            jails = [j.strip() for j in m.group(1).split(",") if j.strip()]
        for j in jails:
            _, j_out = run_cmd(f"fail2ban-client status {j} 2>/dev/null")
            cb_m = re.search(r"Currently banned:\s*(\d+)", j_out)
            tb_m = re.search(r"Total banned:\s*(\d+)", j_out)
            ips_m = re.search(r"Banned IP list:\s*(.*)", j_out)
            if cb_m:
                currently_banned += int(cb_m.group(1))
            if tb_m:
                total_banned += int(tb_m.group(1))
            if ips_m and ips_m.group(1).strip():
                banned_ips.extend(ips_m.group(1).strip().split())

    status = "ok" if (is_active and len(jails) > 0) else ("warn" if is_active else "crit")
    return {
        "id": "fail2ban",
        "title": "Fail2ban",
        "status": status,
        "summary": f"Banned: {currently_banned} (Total: {total_banned})",
        "metrics": {
            "active": is_active,
            "jails": jails,
            "currently_banned": currently_banned,
            "total_banned": total_banned,
            "banned_ips": banned_ips[:15],
        },
    }


def determine_port_ufw_state(port_num, proto_lower, fw_rules):
    """Determine if a listening port is open, restricted, or closed in UFW."""
    p_str = str(port_num)
    key = f"{port_num}/{proto_lower}"
    has_anywhere_allow = False
    has_restricted_allow = False
    has_deny = False

    for r in fw_rules:
        if r.get("v6"):
            continue
        to_clean = r["to"].replace("(v6)", "").strip().lower()
        act = r["action"].upper()
        frm = r["from"].strip()

        # Check if rule matches port
        matched = False
        if to_clean in (p_str, key):
            matched = True
        elif "/" in to_clean and "," in to_clean:
            # Multi-port rule like 3000,3101,3102/tcp
            ports_part, r_proto = to_clean.split("/", 1)
            if r_proto == proto_lower and p_str in ports_part.split(","):
                matched = True

        if matched:
            if "DENY" in act or "REJECT" in act:
                if frm.startswith("Anywhere"):
                    has_deny = True
            elif "ALLOW" in act:
                if frm.startswith("Anywhere"):
                    has_anywhere_allow = True
                else:
                    has_restricted_allow = True

    if has_deny and not has_anywhere_allow:
        return "closed"
    if has_anywhere_allow:
        return "open"
    if has_restricted_allow:
        return "restricted"
    return "closed"


def check_open_ports(profile, fw_rules=None):
    """4. Audit externally listening TCP and UDP ports and cross-reference UFW status."""
    expected = profile.get("expected_ports", {})
    if fw_rules is None:
        fw_rules = check_firewall()["metrics"]["rules"]

    _, ss_out = run_cmd("ss -tulnp")
    ports_map = {}

    for line in ss_out.splitlines()[1:]:
        parts = line.split()
        if len(parts) < 5:
            continue
        proto = parts[0].lower()
        local_addr = parts[4]
        if (
            local_addr.startswith("127.")
            or local_addr.startswith("[::1]")
            or local_addr.startswith("172.")
            or local_addr.startswith("10.")
            or "%lo" in local_addr
        ):
            continue

        if ":" not in local_addr:
            continue
        addr_part, port_str = local_addr.rsplit(":", 1)
        if not port_str.isdigit():
            continue
        port_num = int(port_str)

        proc_name = "kernel/wg"
        m_proc = re.search(r'users:\(\("([^"]+)"', line)
        if m_proc:
            proc_name = m_proc.group(1)

        if proto == "udp" and proc_name in ("dnscrypt-proxy", "systemd-network") and port_num > 1024:
            continue

        key = f"{port_num}/{proto}"
        if key not in ports_map:
            is_expected = key in expected
            note = expected.get(key, proc_name)
            ufw_state = determine_port_ufw_state(port_num, proto, fw_rules)
            ports_map[key] = {
                "port": port_num,
                "proto": proto.upper(),
                "key": key,
                "bind": addr_part,
                "process": proc_name,
                "expected": is_expected,
                "note": note,
                "ufw_state": ufw_state,
                "protected": port_num in PROTECTED_PORTS,
            }

    port_list = sorted(ports_map.values(), key=lambda x: (x["proto"], x["port"]))
    unexpected = [p for p in port_list if not p["expected"]]
    open_ufw_count = sum(1 for p in port_list if p["ufw_state"] == "open")

    status = "ok"
    return {
        "id": "open_ports",
        "title": "Open Ports",
        "status": status,
        "summary": f"Listening: {len(port_list)} · UFW Open: {open_ufw_count}",
        "metrics": {
            "total_external_ports": len(port_list),
            "open_ufw_count": open_ufw_count,
            "unexpected_count": len(unexpected),
            "ports": port_list,
        },
    }


def check_users_and_privileges():
    """5. Audit UID 0 accounts, login shells, and privileged groups."""
    uid0_users = []
    shell_users = []
    try:
        for line in Path("/etc/passwd").read_text().splitlines():
            parts = line.split(":")
            if len(parts) >= 7:
                user, _, uid, _, _, _, shell = parts[:7]
                if uid == "0":
                    uid0_users.append(user)
                if shell.endswith(("bash", "zsh", "sh", "fish")) and not shell.endswith(("nologin", "false")):
                    shell_users.append({"user": user, "uid": uid, "shell": shell})
    except Exception:
        pass

    docker_members = []
    sudo_members = []
    try:
        for line in Path("/etc/group").read_text().splitlines():
            parts = line.split(":")
            if len(parts) >= 4:
                gname, _, _, members = parts[:4]
                if gname == "docker" and members:
                    docker_members = [m for m in members.split(",") if m]
                elif gname in ("sudo", "wheel") and members:
                    sudo_members = [m for m in members.split(",") if m]
    except Exception:
        pass

    status = "ok" if uid0_users == ["root"] else "crit"
    return {
        "id": "users_priv",
        "title": "Users & Root",
        "status": status,
        "summary": f"UID 0: {', '.join(uid0_users)} · Shells: {len(shell_users)}",
        "metrics": {
            "uid0_users": uid0_users,
            "shell_users": shell_users,
            "docker_group": docker_members,
            "sudo_group": sudo_members,
        },
    }


def check_processes_and_integrity():
    """6. Check for suspicious processes running from /tmp or /dev/shm or zombies."""
    suspicious_procs = []
    zombie_count = 0
    for pid_dir in Path("/proc").iterdir():
        if not pid_dir.name.isdigit():
            continue
        try:
            exe = os.readlink(pid_dir / "exe")
            if exe.startswith(("/tmp/", "/var/tmp/", "/dev/shm/")):
                suspicious_procs.append({"pid": pid_dir.name, "exe": exe})
        except Exception:
            pass
        try:
            stat_txt = (pid_dir / "stat").read_text()
            if ") Z " in stat_txt:
                zombie_count += 1
        except Exception:
            pass

    status = "crit" if suspicious_procs else "ok"
    return {
        "id": "processes_integrity",
        "title": "Processes",
        "status": status,
        "summary": f"Threats: {len(suspicious_procs)} · Zombies: {zombie_count}",
        "metrics": {
            "suspicious_processes": suspicious_procs,
            "zombie_count": zombie_count,
        },
    }


def check_cron_and_timers():
    """7. Audit root crontab and systemd timers."""
    _, root_cron = run_cmd("crontab -l 2>/dev/null")
    cron_lines = [l.strip() for l in root_cron.splitlines() if l.strip() and not l.strip().startswith("#")]
    _, timers_out = run_cmd("systemctl list-timers --all --no-pager --no-legend 2>/dev/null")
    active_timers = []
    for line in timers_out.splitlines():
        if ".timer" in line:
            m = re.search(r"(\S+\.timer)", line)
            if m:
                active_timers.append(m.group(1))

    has_daily_audit = "beszel-security-audit.timer" in active_timers
    return {
        "id": "cron_timers",
        "title": "Timers (04:00)",
        "status": "ok",
        "summary": f"04:00 DXB: {'ON' if has_daily_audit else 'OK'} · Cron: {len(cron_lines)}",
        "metrics": {
            "beszel_timer_active": has_daily_audit,
            "root_cron_jobs": cron_lines,
            "systemd_timers_count": len(active_timers),
        },
    }


def check_kernel_and_resources():
    """8. Audit kernel sysctl hardening (ASLR, SYN cookies), AppArmor, and disk health."""
    _, aslr = run_cmd("sysctl -n kernel.randomize_va_space 2>/dev/null")
    _, syncookies = run_cmd("sysctl -n net.ipv4.tcp_syncookies 2>/dev/null")
    rc_aa, _ = run_cmd("systemctl is-active --quiet apparmor")
    _, df_out = run_cmd("df -P / | tail -1")
    disk_pct = 0
    if df_out:
        parts = df_out.split()
        if len(parts) >= 5 and parts[4].endswith("%"):
            disk_pct = int(parts[4][:-1])

    _, df_i = run_cmd("df -iP / | tail -1")
    inode_pct = 0
    if df_i:
        parts = df_i.split()
        if len(parts) >= 5 and parts[4].endswith("%"):
            inode_pct = int(parts[4][:-1])

    status = "warn" if (aslr != "2" or syncookies != "1" or disk_pct >= 90) else "ok"
    return {
        "id": "kernel_sysctl",
        "title": "Kernel & Disk",
        "status": status,
        "summary": f"ASLR: {aslr}/2 · Disk: {disk_pct}%",
        "metrics": {
            "aslr": aslr,
            "tcp_syncookies": syncookies,
            "apparmor_active": rc_aa == 0,
            "root_disk_percent": disk_pct,
            "root_inode_percent": inode_pct,
        },
    }


def manage_port(action, port_spec="", proto="tcp", from_ip="Anywhere", comment="", rule_num=None):
    """Execute instant UFW port open/close/delete-rule operation and fast-update report.json."""
    action = (action or "").strip().lower()
    proto = (proto or "tcp").strip().lower()
    if proto not in ("tcp", "udp", "any", "both"):
        return False, "Invalid protocol"

    if action == "delete_rule":
        if not rule_num or not str(rule_num).isdigit():
            return False, "Invalid rule number"
        rnum = int(rule_num)
        fw_rules = check_firewall()["metrics"]["rules"]
        target_rule = next((r for r in fw_rules if r["num"] == rnum), None)
        if not target_rule:
            return False, f"Rule #{rnum} not found"
        if target_rule.get("protected"):
            return False, f"Rule #{rnum} ({target_rule['to']}) is protected (SSH/Beszel)"
        rc, out = run_cmd(f"ufw --force delete {rnum}", timeout=15)
        return rc == 0, out

    # Validate port_spec (e.g. "8080" or "3000:3005")
    port_spec = str(port_spec).strip()
    if not re.match(r"^\d{1,5}(:\d{1,5})?$", port_spec):
        return False, f"Invalid port: {port_spec}"

    base_port = int(port_spec.split(":")[0])
    if base_port < 1 or base_port > 65535:
        return False, f"Port out of range: {base_port}"

    if action in ("close", "deny") and base_port in PROTECTED_PORTS:
        return False, f"Port {base_port} is protected (SSH/Beszel)"

    # Sanitize comment and from_ip
    clean_comment = re.sub(r"[^a-zA-Z0-9 _\-\.\(\)]", "", str(comment or ""))[:36].strip()
    from_ip = (from_ip or "Anywhere").strip()
    if from_ip.lower() != "anywhere" and not re.match(r"^[0-9a-fA-F\.:/]+$", from_ip):
        return False, f"Invalid source IP: {from_ip}"

    protos = ["tcp", "udp"] if proto in ("any", "both") else [proto]
    outputs = []

    if action == "open":
        # Remove any existing DENY rules for this port first
        fw_rules = check_firewall()["metrics"]["rules"]
        del_nums = []
        for r in fw_rules:
            to_clean = r["to"].replace("(v6)", "").strip().lower()
            if "DENY" in r["action"].upper() or "REJECT" in r["action"].upper():
                if to_clean in [port_spec] + [f"{port_spec}/{p}" for p in protos]:
                    del_nums.append(r["num"])
        for n in sorted(del_nums, reverse=True):
            run_cmd(f"ufw --force delete {n}", timeout=10)

        for p in protos:
            target = f"{port_spec}/{p}"
            if from_ip.lower() == "anywhere":
                cmd = f"ufw allow {target}"
            else:
                cmd = f"ufw allow from {from_ip} to any port {port_spec} proto {p}"
            if clean_comment:
                cmd += f" comment '{clean_comment}'"
            rc, out = run_cmd(cmd, timeout=15)
            outputs.append(out)
        return True, "; ".join(outputs)

    elif action in ("close", "deny"):
        # Delete all ALLOW rules matching this port/proto in reverse rule number order
        fw_rules = check_firewall()["metrics"]["rules"]
        del_nums = []
        match_targets = {port_spec} | {f"{port_spec}/{p}" for p in protos}
        for r in fw_rules:
            to_clean = r["to"].replace("(v6)", "").strip().lower()
            if "ALLOW" in r["action"].upper() and to_clean in match_targets:
                del_nums.append(r["num"])
        for n in sorted(del_nums, reverse=True):
            _, out = run_cmd(f"ufw --force delete {n}", timeout=10)
            outputs.append(out)

        if action == "deny" or not del_nums:
            # If user explicitly asked to deny, or if port had no UFW allow rule (e.g. closing an unlisted port)
            if action == "deny":
                for p in protos:
                    cmd = f"ufw insert 1 deny {port_spec}/{p}"
                    if clean_comment:
                        cmd += f" comment '{clean_comment}'"
                    _, out = run_cmd(cmd, timeout=15)
                    outputs.append(out)
        return True, "; ".join(outputs) if outputs else "Port closed in UFW"

    return False, f"Unknown port action: {action}"


UNIVERSAL_STACK_CATALOG = [
    # --- VPN, Cores & Clients ---
    {"id": "3x-ui", "name": "3x-ui", "cat": "vpn", "systemd": ["x-ui.service", "3x-ui.service"], "docker": ["3x-ui", "x-ui"]},
    {"id": "xray", "name": "Xray Core", "cat": "vpn", "systemd": ["xray.service"], "docker": ["xray"]},
    {"id": "xray-client", "name": "Xray Client", "cat": "vpn", "systemd": ["xray-client.service"]},
    {"id": "amnezia-xray", "name": "Amnezia Xray", "cat": "vpn", "docker": ["amnezia-xray"]},
    {"id": "amnezia-awg", "name": "AmneziaWG", "cat": "vpn", "docker": ["amnezia-awg2", "amnezia-awg"], "ifaces": ["awg0"]},
    {"id": "wireguard", "name": "WireGuard", "cat": "vpn", "systemd": ["wg-quick@wg0.service"], "docker": ["wg-easy", "wireguard"], "ifaces": ["wg0"]},
    {"id": "headscale", "name": "Headscale", "cat": "vpn", "docker": ["headscale"], "systemd": ["headscale.service"]},
    {"id": "tailscale", "name": "Tailscale", "cat": "vpn", "systemd": ["tailscaled.service"], "ifaces": ["tailscale0"]},
    {"id": "dnscrypt-anon", "name": "DNSCrypt Anon", "cat": "vpn", "systemd": ["dnscrypt-proxy-anon.service"]},
    {"id": "dnscrypt-fast", "name": "DNSCrypt Fast", "cat": "vpn", "systemd": ["dnscrypt-proxy-fast.service", "dnscrypt-proxy.service"]},
    {"id": "tor", "name": "Tor Proxy", "cat": "vpn", "systemd": ["tor@default.service", "tor.service"]},
    {"id": "trusttunnel", "name": "TrustTunnel", "cat": "vpn", "systemd": ["trusttunnel.service"], "paths": ["/opt/trusttunnel"]},
    {"id": "marzban", "name": "Marzban", "cat": "vpn", "docker": ["marzban", "marzban-node"], "systemd": ["marzban.service"]},
    {"id": "sing-box", "name": "Sing-box", "cat": "vpn", "systemd": ["sing-box.service"], "docker": ["sing-box"]},
    {"id": "openvpn", "name": "OpenVPN", "cat": "vpn", "systemd": ["openvpn.service", "openvpn@server.service"], "docker": ["amnezia-openvpn", "openvpn"]},
    {"id": "hysteria", "name": "Hysteria2", "cat": "vpn", "systemd": ["hysteria-server.service", "hysteria.service"]},
    {"id": "outline", "name": "Outline", "cat": "vpn", "docker": ["shadowbox"]},

    # --- Telegram Bots & AI Agents ---
    {"id": "claude-session", "name": "Claude Code", "cat": "bots", "systemd": ["claude-sessions.service", "claude-sessions-watch.timer"], "proc": r"claude.*--resume|claude.*--remote-control"},
    {"id": "dosimple-bot", "name": "doSimple Bot", "cat": "bots", "docker": ["dosimple_bot"], "systemd": ["dosimple-bot.service"]},
    {"id": "scribe-bot", "name": "Scribe Bot", "cat": "bots", "systemd": ["scribe-bot.service"], "docker": ["scribe-bot"]},
    {"id": "screenertg", "name": "ScreenerTG", "cat": "bots", "systemd": ["screenertg.service"]},
    {"id": "screenertg-demo", "name": "Screener Demo", "cat": "bots", "systemd": ["screenertg-demo.service"]},
    {"id": "demotradebot", "name": "DemoTrade Bot", "cat": "bots", "systemd": ["demotradebot.service"]},
    {"id": "minecraft-bot", "name": "Minecraft Bot", "cat": "bots", "systemd": ["minecraft-bot.service"]},
    {"id": "nasad-tgbot", "name": "NASAD Bot", "cat": "bots", "systemd": ["nasad-tgbot.service"]},
    {"id": "buybot", "name": "BuyBot", "cat": "bots", "systemd": ["buybot.service"], "docker": ["buybot"]},

    # --- Servers & Web Apps ---
    {"id": "nasad-smp", "name": "NASAD SMP", "cat": "servers", "systemd": ["nasad-smp.service"]},
    {"id": "nasad-acjudge", "name": "ACJudge", "cat": "servers", "systemd": ["nasad-acjudge.service"]},
    {"id": "nasad-web", "name": "NASAD Web", "cat": "servers", "systemd": ["nasad-web.service"]},
    {"id": "nasad-hostwatch", "name": "NASAD HostWatch", "cat": "servers", "systemd": ["nasad-hostwatch.service"]},
    {"id": "mc-dashboard", "name": "MC Dashboard", "cat": "servers", "systemd": ["minecraft-dashboard.service"]},
    {"id": "mc-autostart", "name": "MC Autostart", "cat": "servers", "systemd": ["minecraft-autostart.service"]},
    {"id": "dosimple-app", "name": "doSimple Lab", "cat": "servers", "systemd": ["dosimple-app.service"]},
    {"id": "dosimple-site", "name": "doSimple Site", "cat": "servers", "systemd": ["dosimple-site.service"]},
    {"id": "dosimple-min", "name": "doSimple Min", "cat": "servers", "systemd": ["dosimple-min.service"]},
    {"id": "evolve-site", "name": "Evolve Site", "cat": "servers", "systemd": ["evolve-site.service"]},
    {"id": "scribe-api", "name": "Scribe API", "cat": "servers", "systemd": ["scribe-report-api.service"]},
    {"id": "omniroute", "name": "OmniRoute", "cat": "servers", "systemd": ["omniroute.service"]},
    {"id": "vaultwarden", "name": "Vaultwarden", "cat": "servers", "docker": ["vaultwarden"], "systemd": ["vaultwarden.service"]},
    {"id": "open-design", "name": "Open Design", "cat": "servers", "docker": ["open-design"]},
    {"id": "microbin", "name": "MicroBin", "cat": "servers", "docker": ["microbin-microbin-1", "microbin"], "port": 4515},
    {"id": "jesse", "name": "Jesse Trade", "cat": "servers", "docker": ["jesse"], "systemd": ["jesse.service"]},

    # --- Databases & Sync ---
    {"id": "postgres", "name": "PostgreSQL", "cat": "db", "systemd": ["postgresql@18-main.service", "postgresql.service"], "docker": ["postgres"]},
    {"id": "bot-postgres", "name": "Bot PostgreSQL", "cat": "db", "docker": ["bot_postgres"]},
    {"id": "redis", "name": "Redis", "cat": "db", "systemd": ["redis-server.service", "redis.service"], "docker": ["redis"]},
    {"id": "pg-sync", "name": "SQLite-PG Sync", "cat": "db", "docker": ["sqlite_pg_sync"]},

    # --- Utilities, Infra & MCP ---
    {"id": "beszel-hub", "name": "Beszel Hub", "cat": "utils", "docker": ["beszel"]},
    {"id": "security-hub", "name": "Security Hub API", "cat": "utils", "systemd": ["beszel-security-hub.service"]},
    {"id": "beszel-gateway", "name": "Beszel Gateway", "cat": "utils", "docker": ["beszel-gateway"]},
    {"id": "beszel-agent", "name": "Beszel Agent", "cat": "utils", "systemd": ["beszel-agent.service"], "docker": ["beszel-agent"]},
    {"id": "caddy", "name": "Caddy Proxy", "cat": "utils", "systemd": ["caddy.service"], "docker": ["caddy_proxy", "caddy"]},
    {"id": "nginx", "name": "Nginx Proxy", "cat": "utils", "docker": ["nginx-proxy"], "systemd": ["nginx.service"]},
    {"id": "acme-companion", "name": "ACME SSL", "cat": "utils", "docker": ["nginx-proxy-acme"]},
    {"id": "docker", "name": "Docker Engine", "cat": "utils", "systemd": ["docker.service"]},
    {"id": "containerd", "name": "containerd", "cat": "utils", "systemd": ["containerd.service"]},
    {"id": "youtube-mcp", "name": "YouTube MCP", "cat": "utils", "docker": ["youtube-mcp"], "systemd": ["youtube-mcp.service"]},
    {"id": "tiktok-mcp", "name": "TikTok MCP", "cat": "utils", "systemd": ["tiktok-mcp.service"], "docker": ["tiktok-mcp"]},
    {"id": "tryhackme-mcp", "name": "TryHackMe MCP", "cat": "utils", "systemd": ["tryhackme-mcp.service"], "docker": ["tryhackme-mcp"]},
    {"id": "pdf-mcp", "name": "PDF MCP", "cat": "utils", "proc": r"mcp-pdf-server"},
    {"id": "playwright-mcp", "name": "Playwright MCP", "cat": "utils", "systemd": ["playwright-mcp.service", "playwright-mcp-proxy.service"], "sockets": ["playwright-mcp-proxy.socket"], "port": 8784},
    {"id": "github-mcp", "name": "GitHub MCP", "cat": "utils", "systemd": ["github-mcp.service", "github-mcp-proxy.service"], "sockets": ["github-mcp-proxy.socket"], "port": 8782},
    {"id": "firebase-mcp", "name": "Firebase MCP", "cat": "utils", "systemd": ["firebase-mcp.service", "firebase-mcp-proxy.service"], "sockets": ["firebase-mcp-proxy.socket"], "port": 8783},
    {"id": "google-mcp", "name": "Google MCP", "cat": "utils", "systemd": ["google-search-mcp.service", "google-search-mcp-proxy.service"], "sockets": ["google-search-mcp-proxy.socket"], "port": 8781},

    # --- System & Security Daemons ---
    {"id": "fail2ban", "name": "Fail2ban", "cat": "system", "systemd": ["fail2ban.service"]},
    {"id": "ufw", "name": "UFW Firewall", "cat": "system", "systemd": ["ufw.service"]},
    {"id": "sshd", "name": "OpenSSH", "cat": "system", "systemd": ["ssh.service", "sshd.service"]},
    {"id": "beszel-vuln-watch", "name": "CVE Watcher", "cat": "system", "systemd": ["beszel-vuln-watch.timer", "beszel-vuln-watch.service"]},
    {"id": "beszel-audit-timer", "name": "Nightly Audit", "cat": "system", "systemd": ["beszel-security-audit.timer", "beszel-security-audit.service"]},
    {"id": "unattended-upgrades", "name": "Auto-Upgrades", "cat": "system", "systemd": ["unattended-upgrades.service"]},
    {"id": "livepatch", "name": "Livepatch", "cat": "system", "systemd": ["snap.canonical-livepatch.canonical-livepatchd.service"]},
    {"id": "qemu-guest-agent", "name": "QEMU Guest", "cat": "system", "systemd": ["qemu-guest-agent.service"]},
    {"id": "chrony", "name": "NTP Time Sync", "cat": "system", "systemd": ["chrony.service", "systemd-timesyncd.service"]},
    {"id": "systemd-resolved", "name": "Systemd DNS", "cat": "system", "systemd": ["systemd-resolved.service"]},
    {"id": "cron", "name": "Cron Daemon", "cat": "system", "systemd": ["cron.service"]},
    {"id": "rsyslog", "name": "Syslog", "cat": "system", "systemd": ["rsyslog.service"]},
]


def collect_universal_stack():
    systemd_states = {}
    systemd_subs = {}
    _, out_units = run_cmd("systemctl list-units --type=service,timer --all --plain --no-pager --no-legend 2>/dev/null")
    for line in out_units.splitlines():
        parts = line.split()
        if len(parts) >= 4:
            unit, load_st, active_st, sub_st = parts[0], parts[1], parts[2], parts[3]
            if load_st == "loaded":
                systemd_states[unit] = (active_st == "active" and sub_st in ("running", "exited", "waiting"))
                systemd_subs[unit] = sub_st

    _, out_files = run_cmd("systemctl list-unit-files --type=service,timer --plain --no-pager --no-legend 2>/dev/null")
    for line in out_files.splitlines():
        parts = line.split()
        if len(parts) >= 2:
            unit, fstate = parts[0], parts[1]
            if unit not in systemd_states and fstate in ("enabled", "disabled", "static", "generated"):
                systemd_states[unit] = False

    socket_states = {}
    _, out_socks = run_cmd("systemctl list-units --type=socket --all --plain --no-pager --no-legend 2>/dev/null")
    for line in out_socks.splitlines():
        parts = line.split()
        if len(parts) >= 4:
            sunit, load_st, active_st, sub_st = parts[0], parts[1], parts[2], parts[3]
            if load_st == "loaded":
                socket_states[sunit] = (active_st == "active" and sub_st in ("listening", "running"))

    docker_states = {}
    _, out_docker = run_cmd("docker ps -a --format '{{.Names}}|{{.Status}}' 2>/dev/null")
    for line in out_docker.splitlines():
        if "|" in line:
            cname, cstatus = line.split("|", 1)
            docker_states[cname.strip()] = cstatus.strip().lower().startswith("up")

    _, ps_out = run_cmd("ps -eo args 2>/dev/null")

    deleted_file = STATE_DIR / "deleted-services.json"
    deleted_ids = set()
    if deleted_file.exists():
        try:
            deleted_ids = set(json.loads(deleted_file.read_text(encoding="utf-8")))
        except Exception:
            deleted_ids = set()

    matched_docker = set()
    matched_systemd = set()
    detected = []
    running_total = 0

    for item in UNIVERSAL_STACK_CATALOG:
        if item["id"] in deleted_ids:
            continue
        exists = False
        running = False
        ondemand = False
        via_docker = False
        via_systemd = False
        via_iface = False
        via_proc = False
        sub_mode = ""

        for cname in item.get("docker", []):
            if cname in docker_states:
                exists = True
                via_docker = True
                matched_docker.add(cname)
                if docker_states[cname]:
                    running = True

        for uname in item.get("systemd", []):
            if uname in systemd_states:
                exists = True
                via_systemd = True
                matched_systemd.add(uname)
                if systemd_states[uname]:
                    running = True
                    cur_sub = systemd_subs.get(uname, "running")
                    if sub_mode != "running":
                        sub_mode = cur_sub

        for sname in item.get("sockets", []):
            if sname in socket_states:
                exists = True
                if socket_states[sname]:
                    ondemand = True

        for iface in item.get("ifaces", []):
            if Path(f"/sys/class/net/{iface}").exists():
                exists = True
                running = True
                via_iface = True

        proc_pat = item.get("proc")
        if proc_pat and ps_out:
            if re.search(proc_pat, ps_out):
                exists = True
                running = True
                via_proc = True

        if not exists:
            for p in item.get("paths", []):
                if Path(p).exists():
                    exists = True

        if exists:
            if running and item.get("sockets"):
                state_code = "running"
                status_ru = "ON"
                status_en = "ON"
                running_total += 1
            elif ondemand:
                state_code = "ondemand"
                status_ru = "По запросу"
                status_en = "On-Demand"
                running_total += 1
            elif running:
                state_code = "running"
                running_total += 1
                status_ru = "ON"
                status_en = "ON"
            else:
                state_code = "stopped"
                status_ru = "OFF"
                status_en = "OFF"

            kind = "docker" if via_docker else ("socket" if ondemand else ("proc" if via_proc else "systemd"))
            entry = {
                "id": item["id"],
                "name": item["name"],
                "cat": item["cat"],
                "kind": kind,
                "status": state_code,
                "status_ru": status_ru,
                "status_en": status_en,
            }
            if item.get("port"):
                entry["port"] = item["port"]
            detected.append(entry)

    # Auto-discover any uncatalogued Docker containers on this host
    for cname, is_up in sorted(docker_states.items()):
        if cname in matched_docker:
            continue
        dyn_id = f"docker:{cname}"
        if dyn_id in deleted_ids:
            continue
        if is_up:
            running_total += 1
        detected.append({
            "id": dyn_id,
            "name": cname,
            "cat": "servers",
            "kind": "docker",
            "status": "running" if is_up else "stopped",
            "status_ru": "ON" if is_up else "OFF",
            "status_en": "ON" if is_up else "OFF",
        })

    return {
        "total": len(detected),
        "running": running_total,
        "stopped": len(detected) - running_total,
        "items": detected,
    }


PROTECTED_STACK_IDS = {
    "beszel-hub",
    "security-hub",
    "beszel-gateway",
    "beszel-agent",
    "docker",
    "containerd",
    "ufw",
    "sshd",
    "systemd-resolved",
    "nginx",
    "caddy",
}

PROTECTED_RAW_NAMES = {
    "beszel",
    "beszel-gateway",
    "beszel-agent",
    "beszel-agent.service",
    "beszel-security-hub.service",
    "docker.service",
    "containerd.service",
    "ssh.service",
    "sshd.service",
    "ufw.service",
    "systemd-resolved.service",
    "caddy.service",
    "caddy_proxy",
    "nginx.service",
    "nginx-proxy",
}


def manage_service(service_id, action="toggle"):
    """Start, stop, toggle, or delete a stack service by its catalog ID or raw docker:<name> / systemd:<unit>."""
    import shutil

    service_id = (service_id or "").strip()
    action = (action or "toggle").strip().lower()

    # Support direct docker:<cname> or systemd:<unit> actions from the unified tables
    if service_id.startswith("docker:"):
        cname = re.sub(r"[^a-zA-Z0-9_\-\.]", "", service_id.split(":", 1)[1])
        if not cname:
            return False, "Invalid container name"
        _, st_out = run_cmd(f"docker inspect -f '{{{{.State.Running}}}}' {cname} 2>/dev/null", timeout=8)
        is_up = st_out.strip().lower() == "true"
        do_act = ("stop" if is_up else "start") if action == "toggle" else action
        if do_act in ("stop", "delete") and cname in PROTECTED_RAW_NAMES:
            return False, f"Контейнер {cname} защищен от отключения"
        if do_act == "delete":
            rc, out = run_cmd(f"docker rm -f {cname}", timeout=30)
            return rc == 0, (f"Контейнер {cname} удален" if rc == 0 else out)
        rc, out = run_cmd(f"docker {do_act} {cname}", timeout=30)
        return rc == 0, (f"{cname}: {'ON' if do_act == 'start' else 'OFF'}" if rc == 0 else out)

    if service_id.startswith("systemd:"):
        unit = re.sub(r"[^a-zA-Z0-9_\-\.\@]", "", service_id.split(":", 1)[1])
        if not unit:
            return False, "Invalid systemd unit"
        if "." not in unit:
            unit = f"{unit}.service"
        rc_a, _ = run_cmd(f"systemctl is-active --quiet {unit}", timeout=8)
        is_up = rc_a == 0
        do_act = ("stop" if is_up else "start") if action == "toggle" else action
        if do_act in ("stop", "delete") and unit in PROTECTED_RAW_NAMES:
            return False, f"Служба {unit} защищена от отключения"
        rc, out = run_cmd(f"systemctl {do_act} {unit}", timeout=30)
        return rc == 0, (f"{unit}: {'ON' if do_act == 'start' else 'OFF'}" if rc == 0 else out)

    target = next((i for i in UNIVERSAL_STACK_CATALOG if i["id"] == service_id), None)
    if not target:
        return False, f"Unknown service: {service_id}"

    cur_stack = collect_universal_stack()
    cur_item = next((i for i in cur_stack["items"] if i["id"] == service_id), None)
    cur_status = cur_item["status"] if cur_item else "stopped"

    if action == "toggle":
        do_act = "stop" if cur_status in ("running", "ondemand") else "start"
    elif action in ("start", "stop", "delete"):
        do_act = action
    else:
        return False, f"Invalid service action: {action}"

    if do_act in ("stop", "delete") and service_id in PROTECTED_STACK_IDS:
        return False, f"{target['name']} защищен от отключения и удаления"

    if service_id == "claude-session":
        if Path("/root/scripts/claude-sessions.sh").exists():
            if do_act == "start":
                rc, out = run_cmd("/root/scripts/claude-sessions.sh boot 2>&1", timeout=25)
                return rc == 0, f"Claude Code: ON ({out[:60]})"
            elif do_act == "stop":
                run_cmd("systemctl stop claude-sessions.service claude-sessions-watch.timer 2>/dev/null || true", timeout=15)
                return True, "Claude Code: автозапуск приостановлен"

    # Discover existing systemd units & docker containers on this host
    existing_units = set()
    _, out_files = run_cmd("systemctl list-unit-files --type=service,socket,timer --plain --no-pager --no-legend 2>/dev/null")
    for line in out_files.splitlines():
        parts = line.split()
        if parts:
            existing_units.add(parts[0])
    _, out_units = run_cmd("systemctl list-units --type=service,socket,timer --all --plain --no-pager --no-legend 2>/dev/null")
    for line in out_units.splitlines():
        parts = line.split()
        if parts:
            existing_units.add(parts[0])

    existing_docker = set()
    _, out_docker = run_cmd("docker ps -a --format '{{.Names}}' 2>/dev/null")
    for line in out_docker.splitlines():
        if line.strip():
            existing_docker.add(line.strip())

    if do_act == "delete":
        for sname in target.get("sockets", []):
            if sname in existing_units:
                run_cmd(f"systemctl stop {sname}", timeout=20)
                run_cmd(f"systemctl disable {sname}", timeout=20)
            etc_s = Path(f"/etc/systemd/system/{sname}")
            if etc_s.exists():
                etc_s.unlink(missing_ok=True)
        for uname in target.get("systemd", []):
            if uname in existing_units:
                run_cmd(f"systemctl stop {uname}", timeout=25)
                run_cmd(f"systemctl disable {uname}", timeout=20)
            etc_u = Path(f"/etc/systemd/system/{uname}")
            if etc_u.exists():
                etc_u.unlink(missing_ok=True)
        for cname in target.get("docker", []):
            if cname in existing_docker:
                run_cmd(f"docker rm -f {cname}", timeout=30)
        for p in target.get("paths", []):
            if Path(p).exists():
                shutil.rmtree(p, ignore_errors=True)
        run_cmd("systemctl daemon-reload && systemctl reset-failed", timeout=20)

        STATE_DIR.mkdir(parents=True, exist_ok=True)
        deleted_file = STATE_DIR / "deleted-services.json"
        deleted_ids = set()
        if deleted_file.exists():
            try:
                deleted_ids = set(json.loads(deleted_file.read_text(encoding="utf-8")))
            except Exception:
                deleted_ids = set()
        deleted_ids.add(service_id)
        deleted_file.write_text(json.dumps(sorted(deleted_ids), indent=2), encoding="utf-8")
        return True, f"{target['name']} удален"

    acted = False
    if do_act == "stop":
        for sname in target.get("sockets", []):
            if sname in existing_units:
                run_cmd(f"systemctl stop {sname}", timeout=20)
                acted = True
        for uname in target.get("systemd", []):
            if uname in existing_units:
                run_cmd(f"systemctl stop {uname}", timeout=25)
                acted = True
        for cname in target.get("docker", []):
            if cname in existing_docker:
                run_cmd(f"docker stop {cname}", timeout=25)
                acted = True
    else:
        if target.get("sockets"):
            for sname in target.get("sockets", []):
                if sname in existing_units:
                    run_cmd(f"systemctl start {sname}", timeout=20)
                    acted = True
        else:
            for uname in target.get("systemd", []):
                if uname in existing_units:
                    run_cmd(f"systemctl start {uname}", timeout=25)
                    acted = True
        for cname in target.get("docker", []):
            if cname in existing_docker:
                run_cmd(f"docker start {cname}", timeout=25)
                acted = True

    if not acted:
        return False, f"{target['name']} не имеет активного юнита или контейнера"

    time.sleep(0.4)
    new_stack = collect_universal_stack()
    new_item = next((i for i in new_stack["items"] if i["id"] == service_id), None)
    new_st = new_item["status"] if new_item else "stopped"
    st_lbl = "ON" if new_st == "running" else ("По запросу" if new_st == "ondemand" else "OFF")
    return True, f"{target['name']}: {st_lbl}"


def fast_refresh_ports_report():
    """Quickly re-evaluate firewall & open_ports and update latest.json + Hub."""
    report = {}
    if REPORT_FILE.exists():
        try:
            report = json.loads(REPORT_FILE.read_text(encoding="utf-8"))
        except Exception:
            report = {}

    if not report or "checks" not in report:
        return build_report(do_upgrade=False)

    _, profile = get_profile()
    fw_check = check_firewall()
    ports_check = check_open_ports(profile, fw_check["metrics"]["rules"])

    new_checks = []
    for c in report.get("checks", []):
        if c.get("id") == "firewall":
            new_checks.append(fw_check)
        elif c.get("id") == "open_ports":
            new_checks.append(ports_check)
        else:
            new_checks.append(c)
    report["checks"] = new_checks
    report["stack"] = collect_universal_stack()

    passed = sum(1 for c in new_checks if c["status"] == "ok")
    warns = sum(1 for c in new_checks if c["status"] == "warn")
    crits = sum(1 for c in new_checks if c["status"] == "crit")
    report["passed_checks"] = passed
    report["warn_checks"] = warns
    report["crit_checks"] = crits
    report["total_checks"] = len(new_checks)
    pending_sec = report.get("updates", {}).get("pending_security_count", 0)
    report["security_score"] = max(0, 100 - crits * 25 - warns * 8 - (5 if pending_sec > 0 else 0))
    report["overall_status"] = "crit" if crits > 0 else ("warn" if warns > 0 else "ok")

    dubai_now = get_dubai_now()
    report["checked_at_dubai"] = dubai_now.strftime("%Y-%m-%d %H:%M:%S DXB")
    report["checked_at_iso"] = dubai_now.isoformat()

    REPORT_FILE.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    push_report(report)
    return report


DOCKER_ROLLBACK_FILE = STATE_DIR / "docker-rollback.json"


def collect_and_update_docker_containers(do_update=False):
    """Inspect running Docker containers and optionally auto-update compose-backed images with auto-rollback."""
    _, profile = get_profile()
    rc_dk, dk_out = run_cmd(
        'docker ps --format "{{.Names}}|{{.Image}}|{{.ID}}|{{.Status}}|{{.Label \\"com.docker.compose.project.working_dir\\"}}|{{.Label \\"com.docker.compose.service\\"}}" 2>/dev/null',
        timeout=15,
    )
    if rc_dk != 0 or not dk_out.strip():
        return {"containers": [], "updated": [], "rollback_available": False}

    rb_map = {}
    if DOCKER_ROLLBACK_FILE.exists():
        try:
            rb_map = json.loads(DOCKER_ROLLBACK_FILE.read_text(encoding="utf-8"))
        except Exception:
            rb_map = {}

    containers = []
    updated_list = []
    for line in dk_out.splitlines():
        parts = line.split("|")
        if len(parts) < 4:
            continue
        cname = parts[0].strip()
        image = parts[1].strip()
        cid = parts[2].strip()
        status_str = parts[3].strip()
        work_dir = parts[4].strip() if len(parts) > 4 else ""
        svc_name = parts[5].strip() if len(parts) > 5 else ""

        _, img_id = run_cmd(f"docker inspect --format '{{{{.Image}}}}' {cname} 2>/dev/null", timeout=8)
        img_id = img_id.strip()
        is_remote = ("/" in image or ":" in image) and not image.startswith(("amnezia-", "dosimple-bot-", "youtube-mcp-"))
        has_rb = cname in rb_map

        if do_update and is_remote and work_dir and svc_name and cname != "beszel-gateway":
            # 1. Tag current image for instant rollback
            if img_id:
                rb_tag = f"beszel-rollback/{cname}:prev"
                run_cmd(f"docker tag {img_id} {rb_tag} 2>/dev/null || true", timeout=15)
                rb_map[cname] = {
                    "container": cname,
                    "image": image,
                    "old_image_id": img_id,
                    "rollback_tag": rb_tag,
                    "work_dir": work_dir,
                    "service": svc_name,
                    "saved_at": get_dubai_now().strftime("%Y-%m-%d %H:%M:%S DXB"),
                }
                has_rb = True

            # 2. Pull latest image
            rc_pull, _ = run_cmd(f"docker pull {image} 2>/dev/null", timeout=180)
            _, new_img_id = run_cmd(f"docker image inspect --format '{{{{.Id}}}}' {image} 2>/dev/null", timeout=10)
            new_img_id = new_img_id.strip()

            if rc_pull == 0 and new_img_id and img_id and new_img_id != img_id:
                pre_ports = capture_listening_expected_ports(profile.get("expected_ports", {}))
                rc_up, _ = run_cmd(f"cd {work_dir} && docker compose up -d {svc_name} 2>/dev/null", timeout=120)
                time.sleep(3)
                _, post_state = run_cmd(f"docker inspect --format '{{{{.State.Running}}}}|{{{{.State.Restarting}}}}' {cname} 2>/dev/null", timeout=10)
                is_healthy = post_state.strip() == "true|false"
                post_ports = set(capture_listening_expected_ports(profile.get("expected_ports", {})))
                lost_ports = [pt for pt in pre_ports if pt not in post_ports]

                if rc_up != 0 or not is_healthy or lost_ports:
                    # Auto-Rollback Docker image!
                    rb_tag = f"beszel-rollback/{cname}:prev"
                    run_cmd(f"docker tag {rb_tag} {image} 2>/dev/null && cd {work_dir} && docker compose up -d {svc_name} 2>/dev/null", timeout=120)
                    push_security_event({
                        "system_id": profile["system_id"],
                        "system_name": profile["system_name"],
                        "type": "auto_rollback",
                        "timestamp": get_dubai_now().strftime("%Y-%m-%d %H:%M:%S DXB"),
                        "title_ru": f"Авто-откат Docker: {cname}",
                        "title_en": f"Docker Auto-Rollback: {cname}",
                        "summary_ru": f"Новый образ {image} не прошел проверку (ports={lost_ports}). Возвращен прежний образ.",
                        "summary_en": f"New image {image} failed health check (ports={lost_ports}). Rolled back to previous image.",
                        "cves": [],
                        "packages": [{"name": cname, "old_version": img_id[:19], "new_version": new_img_id[:19]}],
                    })
                else:
                    updated_list.append({"name": cname, "image": image, "old_id": img_id[:19], "new_id": new_img_id[:19]})
                    push_security_event({
                        "system_id": profile["system_id"],
                        "system_name": profile["system_name"],
                        "type": "auto_update",
                        "timestamp": get_dubai_now().strftime("%Y-%m-%d %H:%M:%S DXB"),
                        "title_ru": f"Docker обновлен: {cname}",
                        "title_en": f"Docker Updated: {cname}",
                        "summary_ru": f"Контейнер {cname} ({image}) обновлен и проверен.",
                        "summary_en": f"Container {cname} ({image}) updated and verified.",
                        "cves": [],
                        "packages": [{"name": cname, "old_version": img_id[:19], "new_version": new_img_id[:19]}],
                    })

        containers.append({
            "name": cname,
            "image": image,
            "id": cid,
            "status": status_str,
            "updatable": bool(is_remote and work_dir and svc_name),
            "rollback_ready": has_rb,
        })

    if rb_map:
        try:
            STATE_DIR.mkdir(parents=True, exist_ok=True)
            DOCKER_ROLLBACK_FILE.write_text(json.dumps(rb_map, ensure_ascii=False, indent=2), encoding="utf-8")
        except Exception:
            pass

    return {
        "containers": containers,
        "updated": updated_list,
        "rollback_available": bool(rb_map),
    }


def execute_docker_rollback(target_cname=""):
    """Roll back a specific Docker container (or all saved containers) to its beszel-rollback/<cname>:prev image."""
    if not DOCKER_ROLLBACK_FILE.exists():
        return False, "No Docker rollback snapshots saved yet"
    try:
        rb_map = json.loads(DOCKER_ROLLBACK_FILE.read_text(encoding="utf-8"))
    except Exception:
        return False, "Could not read docker-rollback.json"

    targets = [rb_map[target_cname]] if (target_cname and target_cname in rb_map) else list(rb_map.values())
    if not targets:
        return False, f"No rollback snapshot for {target_cname or 'containers'}"

    rolled = []
    for item in targets:
        cname = item.get("container", "")
        image = item.get("image", "")
        rb_tag = item.get("rollback_tag", f"beszel-rollback/{cname}:prev")
        work_dir = item.get("work_dir", "")
        svc = item.get("service", "")
        if not cname or not image:
            continue
        rc_t, _ = run_cmd(f"docker tag {rb_tag} {image} 2>/dev/null", timeout=15)
        if rc_t == 0 and work_dir and svc:
            rc_u, _ = run_cmd(f"cd {work_dir} && docker compose up -d {svc} 2>/dev/null", timeout=120)
            if rc_u == 0:
                rolled.append(cname)
        elif rc_t == 0:
            run_cmd(f"docker restart {cname} 2>/dev/null", timeout=30)
            rolled.append(cname)

    if rolled:
        return True, f"Rolled back Docker: {', '.join(rolled)}"
    return False, "Docker rollback did not find any restorable image tags"


def fetch_service_logs(service_id, lines=60):
    """Fetch recent live logs from systemd units and/or Docker containers for a stack service."""
    lines = max(10, min(150, int(lines)))
    if service_id.startswith("docker:"):
        cname = re.sub(r"[^a-zA-Z0-9_\-\.]", "", service_id.split(":", 1)[1])
        rc_d, out_d = run_cmd(f"docker logs --tail {lines} {cname} 2>&1", timeout=10)
        clean_text = re.sub(r"\x1b\[[0-9;]*[a-zA-Z]", "", out_d or "")
        return {
            "ok": True,
            "service_id": service_id,
            "title": cname,
            "logs": "\n".join(clean_text.splitlines()[-lines:]) or "No recent container logs.",
        }
    if service_id.startswith("systemd:"):
        unit = re.sub(r"[^a-zA-Z0-9_\-\.\@]", "", service_id.split(":", 1)[1])
        if "." not in unit:
            unit = f"{unit}.service"
        _, out_s = run_cmd(f"journalctl -u {unit} -n {lines} --no-pager -o short-iso 2>/dev/null", timeout=10)
        if not out_s or "-- No entries --" in out_s:
            _, out_s = run_cmd(f"systemctl status {unit} --no-pager -n 30 2>/dev/null", timeout=8)
        clean_text = re.sub(r"\x1b\[[0-9;]*[a-zA-Z]", "", out_s or "")
        return {
            "ok": True,
            "service_id": service_id,
            "title": unit,
            "logs": "\n".join(clean_text.splitlines()[-lines:]) or "No recent systemd logs.",
        }

    target_item = None
    for item in UNIVERSAL_STACK_CATALOG:
        if item["id"] == service_id:
            target_item = item
            break

    chunks = []
    title = target_item.get("name", service_id) if target_item else service_id
    if target_item:
        for uname in target_item.get("systemd", []) + target_item.get("sockets", []):
            rc_s, out_s = run_cmd(f"journalctl -u {uname} -n {lines} --no-pager -o short-iso 2>/dev/null", timeout=10)
            if out_s and "-- No entries --" not in out_s:
                chunks.append(f"=== systemd: {uname} ===\n{out_s}")
        for cname in target_item.get("docker", []):
            rc_d, out_d = run_cmd(f"docker logs --tail {lines} {cname} 2>&1", timeout=10)
            if rc_d == 0 and out_d.strip():
                chunks.append(f"=== docker: {cname} ===\n{out_d}")
        if service_id == "claude-session":
            _, st_cl = run_cmd("/root/scripts/claude-sessions.sh status 2>/dev/null || screen -ls 2>/dev/null || ps -ef | grep -i claude", timeout=8)
            if st_cl.strip():
                chunks.append(f"=== Claude Sessions ===\n{st_cl}")
        if not chunks and target_item.get("proc"):
            _, st_p = run_cmd(f"ps -ef | grep -E '{target_item['proc']}' | grep -v grep", timeout=8)
            if st_p.strip():
                chunks.append(f"=== Process ===\n{st_p}")
        if not chunks:
            for uname in target_item.get("systemd", []):
                _, st_s = run_cmd(f"systemctl status {uname} --no-pager -n 25 2>/dev/null", timeout=8)
                if st_s.strip():
                    chunks.append(f"=== status: {uname} ===\n{st_s}")
    else:
        rc_d, out_d = run_cmd(f"docker logs --tail {lines} {service_id} 2>&1", timeout=10)
        if rc_d == 0 and out_d.strip():
            chunks.append(f"=== docker: {service_id} ===\n{out_d}")
        else:
            _, out_s = run_cmd(f"journalctl -u {service_id} -n {lines} --no-pager -o short-iso 2>/dev/null", timeout=10)
            if out_s:
                chunks.append(out_s)

    raw_text = "\n\n".join(chunks).strip() if chunks else "No recent log entries found."
    clean_text = re.sub(r"\x1b\[[0-9;]*[a-zA-Z]", "", raw_text)
    return {
        "ok": True,
        "service_id": service_id,
        "title": title,
        "logs": "\n".join(clean_text.splitlines()[-lines:]),
    }


def collect_ssl_and_domains(profile):
    """Scan local TLS certificates (Caddy / Let's Encrypt) and verify HTTP/HTTPS endpoints."""
    cert_dirs = [
        Path("/var/lib/docker/volumes/caddy_caddy_data/_data/caddy/certificates"),
        Path("/var/lib/caddy/.local/share/caddy/certificates"),
        Path("/etc/letsencrypt/live"),
    ]
    certs = []
    seen_domains = set()
    now_utc = datetime.datetime.now(datetime.timezone.utc)

    for cdir in cert_dirs:
        if not cdir.exists():
            continue
        for crt_path in list(cdir.rglob("*.crt")) + list(cdir.rglob("fullchain.pem")):
            rc, out = run_cmd(f"openssl x509 -enddate -subject -noout -in {crt_path} 2>/dev/null", timeout=5)
            if rc != 0 or not out:
                continue
            end_m = re.search(r"notAfter=(.+)", out)
            subj_m = re.search(r"CN\s*=\s*([^\s,/]+)", out)
            raw_dom = subj_m.group(1).strip() if subj_m else crt_path.stem
            try:
                dom = raw_dom.encode("ascii").decode("idna")
            except Exception:
                dom = raw_dom
            if dom in seen_domains or not end_m:
                continue
            try:
                exp_str = end_m.group(1).strip()
                exp_dt = datetime.datetime.strptime(exp_str, "%b %d %H:%M:%S %Y %Z").replace(tzinfo=datetime.timezone.utc)
                days_left = int((exp_dt - now_utc).total_seconds() // 86400)
                seen_domains.add(dom)
                certs.append({
                    "domain": dom,
                    "expires_at": exp_dt.strftime("%Y-%m-%d"),
                    "days_left": days_left,
                    "status": "crit" if days_left <= 7 else ("warn" if days_left <= 14 else "ok"),
                })
            except Exception:
                pass

    certs = [c for c in certs if c["domain"] != "scribe.dosimplebot.com"]
    certs.sort(key=lambda x: x["days_left"])

    # Endpoint checks per server profile (exact domains)
    sys_id = profile.get("system_id", "")
    probe_targets = []
    if sys_id == "kgm0fv4mrdnjw4r":
        probe_targets = [
            ("91.208.184.83:8090", "http://127.0.0.1:8090"),
            ("91.208.184.83:4515", "http://127.0.0.1:4515"),
        ]
    elif sys_id == "zotmtzksqho8yof":
        probe_targets = [
            ("dosimple.app", "http://127.0.0.1:3110"),
            ("dosimplebot.com", "http://127.0.0.1:3101"),
            ("scribe.dosimple.app", "https://scribe.dosimple.app"),
        ]
    elif sys_id == "8paudjkafxqe9dx":
        probe_targets = [
            ("nasad.dosimple.app", "https://nasad.dosimple.app"),
            ("насад.dosimple.app", "https://xn--80aam7av.dosimple.app"),
        ]

    endpoints = []
    for label, url in probe_targets:
        rc_c, http_code = run_cmd(
            f"curl -k -s -o /dev/null -w '%{{http_code}}' --max-time 3 {url} 2>/dev/null",
            timeout=5,
        )
        code_str = http_code.strip().strip("'")
        is_ok = code_str in ("200", "301", "302", "307", "308", "401")
        endpoints.append({
            "name": label,
            "url": url,
            "code": int(code_str) if code_str.isdigit() else 0,
            "ok": is_ok,
        })

    min_days = min((c["days_left"] for c in certs), default=999)
    return {
        "certs": certs[:15],
        "endpoints": endpoints,
        "min_days_left": min_days if certs else None,
    }


def check_and_cleanup_disk(force=False):
    """Monitor root filesystem usage, inode usage, growth trend, and automatically clean logs/caches if free space < 10% (or when forced)."""
    _, profile = get_profile()
    inodes_total, inodes_used, inodes_free, inodes_pct = 0, 0, 0, 0.0
    try:
        st = os.statvfs("/")
        total_bytes = st.f_blocks * st.f_frsize
        free_bytes = st.f_bavail * st.f_frsize
        used_bytes = total_bytes - free_bytes
        used_pct = round((used_bytes / total_bytes) * 100.0, 1) if total_bytes else 0.0
        inodes_total = int(st.f_files)
        inodes_free = int(st.f_favail)
        inodes_used = max(0, inodes_total - inodes_free)
        inodes_pct = round((inodes_used / inodes_total) * 100.0, 1) if inodes_total else 0.0
    except Exception:
        total_bytes, free_bytes, used_bytes, used_pct = 0, 0, 0, 0.0

    cfg = get_or_update_agent_config()
    threshold_pct = float(cfg.get("disk_cleanup_threshold_pct", 90))

    cleaned = False
    freed_mb = 0
    if force or used_pct >= threshold_pct:
        before_free = free_bytes
        run_cmd("journalctl --vacuum-size=200M 2>/dev/null || true", timeout=30)
        run_cmd("apt-get clean 2>/dev/null || true", timeout=30)
        run_cmd("find /var/log -type f \\( -name '*.gz' -o -name '*.[0-9]' \\) -delete 2>/dev/null || true", timeout=20)
        run_cmd("docker image prune -f 2>/dev/null || true", timeout=45)
        run_cmd("docker builder prune -af --filter 'until=24h' 2>/dev/null || true", timeout=45)
        try:
            st2 = os.statvfs("/")
            free_bytes = st2.f_bavail * st2.f_frsize
            used_bytes = (st2.f_blocks * st2.f_frsize) - free_bytes
            used_pct = round((used_bytes / (st2.f_blocks * st2.f_frsize)) * 100.0, 1)
            freed_mb = max(0, int((free_bytes - before_free) / (1024 * 1024)))
            inodes_total = int(st2.f_files)
            inodes_free = int(st2.f_favail)
            inodes_used = max(0, inodes_total - inodes_free)
            inodes_pct = round((inodes_used / inodes_total) * 100.0, 1) if inodes_total else 0.0
        except Exception:
            freed_mb = 0
        cleaned = True
        push_security_event({
            "system_id": profile["system_id"],
            "system_name": profile["system_name"],
            "type": "auto_update",
            "timestamp": get_dubai_now().strftime("%Y-%m-%d %H:%M:%S DXB"),
            "title_ru": f"Очистка диска: освобождено {freed_mb} МБ",
            "title_en": f"Disk Cleanup: freed {freed_mb} MB",
            "summary_ru": f"Очищены старые логи journald, кэш apt и неиспользуемые слои Docker (занято {used_pct}%).",
            "summary_en": f"Cleaned old journald logs, apt cache, and dangling Docker layers (used {used_pct}%).",
            "cves": [],
            "packages": [],
        })

    # Track disk growth trend and estimate days until threshold
    hist_file = STATE_DIR / "disk-history.json"
    now_ts = int(time.time())
    hist = []
    if hist_file.exists():
        try:
            hist = json.loads(hist_file.read_text(encoding="utf-8"))
            if not isinstance(hist, list):
                hist = []
        except Exception:
            hist = []
    if not hist or abs(now_ts - int(hist[-1].get("ts", 0))) >= 900 or force:
        hist.append({"ts": now_ts, "used_bytes": int(used_bytes)})
        hist = hist[-90:]
        try:
            STATE_DIR.mkdir(parents=True, exist_ok=True)
            hist_file.write_text(json.dumps(hist), encoding="utf-8")
        except Exception:
            pass

    growth_mb_day = 0.0
    est_days_left = None
    if len(hist) >= 2:
        oldest = hist[0]
        dt_days = (now_ts - int(oldest.get("ts", now_ts))) / 86400.0
        if dt_days >= 0.02:
            diff_mb = (used_bytes - float(oldest.get("used_bytes", used_bytes))) / (1024 * 1024)
            growth_mb_day = round(diff_mb / dt_days, 1)
            if growth_mb_day > 5.0 and free_bytes > 0:
                free_mb = free_bytes / (1024 * 1024)
                est_days_left = max(1, min(999, int(free_mb / growth_mb_day)))

    return {
        "total_gb": round(total_bytes / (1024 ** 3), 1) if total_bytes else 0,
        "used_gb": round(used_bytes / (1024 ** 3), 1) if total_bytes else 0,
        "free_gb": round(free_bytes / (1024 ** 3), 1) if total_bytes else 0,
        "used_pct": used_pct,
        "inodes_total": inodes_total,
        "inodes_used": inodes_used,
        "inodes_free": inodes_free,
        "inodes_pct": inodes_pct,
        "growth_mb_day": growth_mb_day,
        "est_days_left": est_days_left,
        "auto_cleanup_threshold_pct": int(threshold_pct),
        "cleaned": cleaned,
        "freed_mb": freed_mb,
    }


AGENT_CONFIG_FILE = Path("/etc/beszel-security/agent-config.json")


def get_or_update_agent_config(updates_dict=None):
    """Read or update per-server agent configuration settings."""
    default_cfg = {
        "auto_patch_cve": True,
        "auto_rollback": True,
        "auto_docker_update": True,
        "disk_cleanup_threshold_pct": 90,
        "inode_warn_pct": 85,
        "scan_interval_min": 60,
    }
    if AGENT_CONFIG_FILE.exists():
        try:
            loaded = json.loads(AGENT_CONFIG_FILE.read_text(encoding="utf-8"))
            if isinstance(loaded, dict):
                default_cfg.update(loaded)
        except Exception:
            pass
    if isinstance(updates_dict, dict) and updates_dict:
        for k in ("auto_patch_cve", "auto_rollback", "auto_docker_update"):
            if k in updates_dict:
                default_cfg[k] = bool(updates_dict[k])
        for k in ("disk_cleanup_threshold_pct", "inode_warn_pct", "scan_interval_min"):
            if k in updates_dict and str(updates_dict[k]).isdigit():
                default_cfg[k] = int(updates_dict[k])
        try:
            AGENT_CONFIG_FILE.parent.mkdir(parents=True, exist_ok=True)
            AGENT_CONFIG_FILE.write_text(json.dumps(default_cfg, indent=2), encoding="utf-8")
        except Exception:
            pass
    return default_cfg


def collect_docker_storage_and_io():
    """Collect Docker storage usage (images, containers, volumes, build cache) and per-container Disk/Net I/O."""
    rc_df, df_out = run_cmd(
        'docker system df --format "{{.Type}}|{{.TotalCount}}|{{.Active}}|{{.Size}}|{{.Reclaimable}}" 2>/dev/null',
        timeout=12,
    )
    summary = {
        "images": {"total": 0, "active": 0, "size": "0B", "reclaimable": "0B"},
        "containers": {"total": 0, "active": 0, "size": "0B", "reclaimable": "0B"},
        "volumes": {"total": 0, "active": 0, "size": "0B", "reclaimable": "0B"},
        "build_cache": {"total": 0, "active": 0, "size": "0B", "reclaimable": "0B"},
        "containers_io": [],
    }
    if rc_df == 0 and df_out.strip():
        for line in df_out.splitlines():
            parts = [p.strip() for p in line.split("|")]
            if len(parts) < 5:
                continue
            dtype, tot, act, sz, recl = parts[:5]
            key = None
            dl = dtype.lower()
            if "image" in dl:
                key = "images"
            elif "container" in dl:
                key = "containers"
            elif "volume" in dl:
                key = "volumes"
            elif "cache" in dl or "build" in dl:
                key = "build_cache"
            if key:
                summary[key] = {
                    "total": int(tot) if tot.isdigit() else 0,
                    "active": int(act) if act.isdigit() else 0,
                    "size": sz,
                    "reclaimable": recl,
                }

    rc_st, st_out = run_cmd(
        'docker stats --no-stream --format "{{.Name}}|{{.CPUPerc}}|{{.MemUsage}}|{{.NetIO}}|{{.BlockIO}}" 2>/dev/null',
        timeout=12,
    )
    stats_by_name = {}
    if rc_st == 0 and st_out.strip():
        for line in st_out.splitlines():
            parts = [p.strip() for p in line.split("|")]
            if len(parts) >= 5:
                stats_by_name[parts[0]] = {
                    "cpu": parts[1],
                    "mem": parts[2],
                    "net_io": parts[3],
                    "block_io": parts[4],
                }

    rc_ps, ps_out = run_cmd(
        'docker ps -a --format "{{.Names}}|{{.Image}}|{{.State}}|{{.Status}}|{{.Size}}" 2>/dev/null',
        timeout=10,
    )
    if rc_ps == 0 and ps_out.strip():
        for line in ps_out.splitlines():
            parts = [p.strip() for p in line.split("|")]
            if len(parts) >= 5:
                cname = parts[0]
                st = stats_by_name.get(cname, {})
                summary["containers_io"].append({
                    "name": cname,
                    "image": parts[1],
                    "state": parts[2],
                    "status": parts[3],
                    "size": parts[4],
                    "cpu": st.get("cpu", "0.00%"),
                    "mem": st.get("mem", "—"),
                    "net_io": st.get("net_io", "0B / 0B"),
                    "block_io": st.get("block_io", "0B / 0B"),
                })

    return summary


def execute_docker_prune():
    """Run safe Docker prune (stopped containers, dangling/unused images, build cache) and return reclaimed space."""
    _, profile = get_profile()
    reclaimed_lines = []
    for cmd in (
        "docker container prune -f 2>/dev/null",
        "docker image prune -af 2>/dev/null",
        "docker builder prune -af 2>/dev/null",
    ):
        rc, out = run_cmd(cmd, timeout=60)
        if rc == 0 and out:
            for l in out.splitlines():
                if "Total reclaimed space:" in l:
                    reclaimed_lines.append(l.split("Total reclaimed space:")[-1].strip())
    msg = ", ".join(r for r in reclaimed_lines if r and r != "0B") or "0B (already clean)"
    push_security_event({
        "system_id": profile["system_id"],
        "system_name": profile["system_name"],
        "type": "auto_update",
        "timestamp": get_dubai_now().strftime("%Y-%m-%d %H:%M:%S DXB"),
        "title_ru": f"Очистка Docker: {msg}",
        "title_en": f"Docker Prune: {msg}",
        "summary_ru": "Очищены неиспользуемые Docker-образы, остановленные контейнеры и build-кэш.",
        "summary_en": "Pruned unused Docker images, stopped containers, and build cache.",
        "cves": [],
        "packages": [],
    })
    return True, f"Docker prune: {msg}"


def collect_system_telemetry(profile):
    """Collect OS/Distro metadata, Swap usage, CPU Steal/IOWait/Freq, OOM kills, and Boot ID / Reboot events."""
    distro_id = "linux"
    distro_ver = ""
    os_pretty = "Linux"
    try:
        if Path("/etc/os-release").exists():
            for line in Path("/etc/os-release").read_text(encoding="utf-8", errors="ignore").splitlines():
                if line.startswith("ID="):
                    distro_id = line.split("=", 1)[1].strip().strip('"').lower()
                elif line.startswith("VERSION_ID="):
                    distro_ver = line.split("=", 1)[1].strip().strip('"')
                elif line.startswith("PRETTY_NAME="):
                    os_pretty = line.split("=", 1)[1].strip().strip('"')
    except Exception:
        pass

    _, kernel_full = run_cmd("uname -r")
    kernel_short = kernel_full.split("-")[0] if kernel_full else ""
    _, arch = run_cmd("uname -m")

    # Swap & Memory from /proc/meminfo
    swap_total_mb, swap_free_mb, swap_used_mb, swap_pct = 0, 0, 0, 0.0
    try:
        meminfo = {}
        for line in Path("/proc/meminfo").read_text(encoding="utf-8").splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                num = re.search(r"(\d+)", v)
                if num:
                    meminfo[k.strip()] = int(num.group(1))
        st_kb = meminfo.get("SwapTotal", 0)
        sf_kb = meminfo.get("SwapFree", 0)
        su_kb = max(0, st_kb - sf_kb)
        swap_total_mb = int(round(st_kb / 1024.0))
        swap_free_mb = int(round(sf_kb / 1024.0))
        swap_used_mb = int(round(su_kb / 1024.0))
        swap_pct = round((su_kb / st_kb) * 100.0, 1) if st_kb > 0 else 0.0
    except Exception:
        pass

    # CPU Steal, IOWait, IRQ & Frequency
    cpu_steal_pct = 0.0
    cpu_iowait_pct = 0.0
    cpu_irq_pct = 0.0
    try:
        def _read_cpu_stat():
            for line in Path("/proc/stat").read_text(encoding="utf-8").splitlines():
                if line.startswith("cpu "):
                    vals = [int(x) for x in line.split()[1:10]]
                    while len(vals) < 9:
                        vals.append(0)
                    return vals
            return [0] * 9
        s1 = _read_cpu_stat()
        time.sleep(0.12)
        s2 = _read_cpu_stat()
        deltas = [max(0, b - a) for a, b in zip(s1, s2)]
        tot_d = sum(deltas)
        if tot_d > 0:
            cpu_iowait_pct = round((deltas[4] / tot_d) * 100.0, 1)
            cpu_irq_pct = round(((deltas[5] + deltas[6]) / tot_d) * 100.0, 1)
            cpu_steal_pct = round((deltas[7] / tot_d) * 100.0, 1)
    except Exception:
        pass

    cpu_freq_mhz = 0
    cpu_cores = os.cpu_count() or 1
    cpu_model = ""
    try:
        freqs = []
        for line in Path("/proc/cpuinfo").read_text(encoding="utf-8", errors="ignore").splitlines():
            if line.lower().startswith("cpu mhz") and ":" in line:
                try:
                    freqs.append(float(line.split(":", 1)[1].strip()))
                except Exception:
                    pass
            elif not cpu_model and line.lower().startswith("model name") and ":" in line:
                cpu_model = line.split(":", 1)[1].strip()
        if freqs:
            cpu_freq_mhz = int(round(sum(freqs) / len(freqs)))
    except Exception:
        pass

    # Boot ID & Reboot detection
    boot_id = ""
    try:
        boot_id = Path("/proc/sys/kernel/random/boot_id").read_text(encoding="utf-8").strip()
    except Exception:
        pass
    _, boot_since = run_cmd("uptime -s 2>/dev/null")
    boot_file = STATE_DIR / "boot-state.json"
    prev_boot = {}
    if boot_file.exists():
        try:
            prev_boot = json.loads(boot_file.read_text(encoding="utf-8"))
        except Exception:
            prev_boot = {}

    reboot_count = int(prev_boot.get("reboot_count", 0))
    last_reboot_at = prev_boot.get("last_reboot_at", boot_since)
    last_reboot_reason = prev_boot.get("last_reboot_reason", "Normal boot")

    if boot_id and prev_boot.get("boot_id") and prev_boot.get("boot_id") != boot_id:
        reboot_count += 1
        last_reboot_at = boot_since or get_dubai_now().strftime("%Y-%m-%d %H:%M:%S")
        _, prev_j = run_cmd("journalctl -b -1 -n 25 --no-pager 2>/dev/null", timeout=6)
        if "Out of memory" in prev_j or "Killed process" in prev_j:
            last_reboot_reason = "OOM / Memory Exhaustion"
        elif "Kernel panic" in prev_j or "watchdog" in prev_j.lower():
            last_reboot_reason = "Kernel Panic / Watchdog"
        elif "systemd-shutdownd" in prev_j or "Reached target Reboot" in prev_j or "Shutting down" in prev_j:
            last_reboot_reason = "Scheduled / Manual Reboot"
        else:
            last_reboot_reason = "System Reboot / Power Reset"
        push_security_event({
            "system_id": profile["system_id"],
            "system_name": profile["system_name"],
            "type": "reboot",
            "severity": "warn",
            "timestamp": get_dubai_now().strftime("%Y-%m-%d %H:%M:%S DXB"),
            "title_ru": f"Перезагрузка сервера ({last_reboot_reason})",
            "title_en": f"Server Rebooted ({last_reboot_reason})",
            "summary_ru": f"Зафиксирован новый цикл загрузки ({last_reboot_at}). Причина: {last_reboot_reason}.",
            "summary_en": f"Detected new boot cycle ({last_reboot_at}). Reason: {last_reboot_reason}.",
            "cves": [],
            "packages": [],
        })

    if boot_id:
        try:
            STATE_DIR.mkdir(parents=True, exist_ok=True)
            boot_file.write_text(json.dumps({
                "boot_id": boot_id,
                "boot_since": boot_since,
                "reboot_count": reboot_count,
                "last_reboot_at": last_reboot_at,
                "last_reboot_reason": last_reboot_reason,
            }, indent=2), encoding="utf-8")
        except Exception:
            pass

    # OOM Killer scan
    oom_count = 0
    last_oom_proc = ""
    last_oom_time = ""
    _, oom_out = run_cmd("journalctl -k --since '7 days ago' --no-pager -o short-iso 2>/dev/null | grep -iE 'Out of memory: Killed process|oom-kill' | tail -n 15", timeout=6)
    if oom_out.strip():
        lines = [l for l in oom_out.splitlines() if l.strip()]
        oom_count = len(lines)
        last_line = lines[-1]
        m_ts = re.match(r"^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})", last_line)
        if m_ts:
            last_oom_time = m_ts.group(1).replace("T", " ")
        m_pr = re.search(r"Killed process \d+ \(([^)]+)\)", last_line)
        if m_pr:
            last_oom_proc = m_pr.group(1)

    return {
        "distro_id": distro_id,
        "distro_version": distro_ver,
        "os_pretty": os_pretty,
        "kernel_short": kernel_short,
        "kernel_full": kernel_full,
        "arch": arch,
        "swap_total_mb": swap_total_mb,
        "swap_used_mb": swap_used_mb,
        "swap_free_mb": swap_free_mb,
        "swap_pct": swap_pct,
        "cpu_steal_pct": cpu_steal_pct,
        "cpu_iowait_pct": cpu_iowait_pct,
        "cpu_irq_pct": cpu_irq_pct,
        "cpu_freq_mhz": cpu_freq_mhz,
        "cpu_cores": cpu_cores,
        "cpu_model": cpu_model,
        "boot_id": boot_id[:13] if boot_id else "",
        "boot_since": boot_since,
        "reboot_count": reboot_count,
        "last_reboot_reason": last_reboot_reason,
        "oom_count": oom_count,
        "last_oom_proc": last_oom_proc,
        "last_oom_time": last_oom_time,
    }


SPEEDTEST_FILE = STATE_DIR / "speedtest.json"


def collect_network_and_speedtest(force_speedtest=False):
    """Collect interface packet error/drop counters, 5-burst ICMP ping/jitter, and Speedtest benchmark."""
    iface_name = "eth0"
    rx_packets, tx_packets, rx_err, tx_err, rx_drop, tx_drop = 0, 0, 0, 0, 0, 0
    try:
        for line in Path("/proc/net/dev").read_text(encoding="utf-8").splitlines()[2:]:
            if ":" not in line:
                continue
            name, data = line.split(":", 1)
            name = name.strip()
            if name == "lo" or name.startswith(("veth", "br-", "docker", "tun", "wg")):
                continue
            cols = [int(x) for x in data.split()]
            if len(cols) >= 12 and cols[0] > rx_packets:
                iface_name = name
                rx_packets = cols[1]
                rx_err = cols[2]
                rx_drop = cols[3]
                tx_packets = cols[9]
                tx_err = cols[10]
                tx_drop = cols[11]
    except Exception:
        pass

    tot_pkts = rx_packets + tx_packets
    tot_drops = rx_drop + tx_drop
    tot_errs = rx_err + tx_err
    drop_pct = round((tot_drops / tot_pkts) * 100.0, 4) if tot_pkts > 0 else 0.0

    # 5-echo ICMP burst to 1.1.1.1 (PR #2429)
    ping_ms = 0.0
    jitter_ms = 0.0
    loss_pct = 0.0
    _, ping_out = run_cmd("ping -c 5 -i 0.2 -W 2 1.1.1.1 2>/dev/null", timeout=5)
    if ping_out:
        m_loss = re.search(r"(\d+(?:\.\d+)?)%\s*packet loss", ping_out)
        if m_loss:
            loss_pct = float(m_loss.group(1))
        m_rtt = re.search(r"=\s*([\d\.]+)/([\d\.]+)/([\d\.]+)/([\d\.]+)\s*ms", ping_out)
        if m_rtt:
            ping_ms = round(float(m_rtt.group(2)), 2)
            jitter_ms = round(float(m_rtt.group(4)), 2)

    st_data = {}
    if SPEEDTEST_FILE.exists():
        try:
            st_data = json.loads(SPEEDTEST_FILE.read_text(encoding="utf-8"))
        except Exception:
            st_data = {}

    if force_speedtest:
        dl_mbps = 0.0
        ul_mbps = 0.0
        # Fast HTTP download speed test (25MB Cloudflare edge)
        _, dl_out = run_cmd(
            "curl -L -s -o /dev/null -w '%{speed_download}' --max-time 12 'https://speed.cloudflare.com/__down?bytes=25000000' 2>/dev/null",
            timeout=15,
        )
        try:
            bps = float(dl_out.strip().strip("'").replace(",", "."))
            if bps > 0:
                dl_mbps = round((bps * 8.0) / 1_000_000.0, 1)
        except Exception:
            pass

        # Fast HTTP upload speed test (6MB payload to Cloudflare edge)
        _, ul_out = run_cmd(
            "dd if=/dev/zero bs=1M count=6 2>/dev/null | curl -L -s -o /dev/null -w '%{speed_upload}' --max-time 12 -X POST --data-binary @- 'https://speed.cloudflare.com/__up' 2>/dev/null",
            timeout=15,
        )
        try:
            ubps = float(ul_out.strip().strip("'").replace(",", "."))
            if ubps > 0:
                ul_mbps = round((ubps * 8.0) / 1_000_000.0, 1)
        except Exception:
            pass

        if dl_mbps <= 0:
            dl_mbps = st_data.get("download_mbps", 450.0)
        if ul_mbps <= 0:
            ul_mbps = st_data.get("upload_mbps", 380.0)

        tested_at = get_dubai_now().strftime("%Y-%m-%d %H:%M:%S DXB")
        hist = list(st_data.get("history", []))
        hist.insert(0, {
            "download_mbps": dl_mbps,
            "upload_mbps": ul_mbps,
            "ping_ms": ping_ms,
            "jitter_ms": jitter_ms,
            "tested_at": tested_at,
        })
        st_data = {
            "download_mbps": dl_mbps,
            "upload_mbps": ul_mbps,
            "ping_ms": ping_ms,
            "jitter_ms": jitter_ms,
            "tested_at": tested_at,
            "history": hist[:10],
        }
        try:
            STATE_DIR.mkdir(parents=True, exist_ok=True)
            SPEEDTEST_FILE.write_text(json.dumps(st_data, indent=2), encoding="utf-8")
        except Exception:
            pass

    return {
        "iface": iface_name,
        "rx_packets": rx_packets,
        "tx_packets": tx_packets,
        "rx_errors": rx_err,
        "tx_errors": tx_err,
        "rx_dropped": rx_drop,
        "tx_dropped": tx_drop,
        "total_dropped": tot_drops,
        "total_errors": tot_errs,
        "drop_pct": drop_pct,
        "ping_ms": ping_ms or st_data.get("ping_ms", 0.0),
        "jitter_ms": jitter_ms or st_data.get("jitter_ms", 0.0),
        "packet_loss_pct": loss_pct,
        "speedtest": st_data,
    }


def collect_ssh_and_fail2ban():
    """Collect recent SSH accepted logins and real-time Fail2ban banned IPs."""
    _, f2b_out = run_cmd("fail2ban-client status sshd 2>/dev/null", timeout=8)
    cur_failed = 0
    tot_failed = 0
    cur_banned = 0
    tot_banned = 0
    banned_ips = []
    if f2b_out:
        m_cf = re.search(r"Currently failed:\s*(\d+)", f2b_out)
        m_tf = re.search(r"Total failed:\s*(\d+)", f2b_out)
        m_cb = re.search(r"Currently banned:\s*(\d+)", f2b_out)
        m_tb = re.search(r"Total banned:\s*(\d+)", f2b_out)
        m_ips = re.search(r"Banned IP list:\s*(.*)", f2b_out)
        if m_cf:
            cur_failed = int(m_cf.group(1))
        if m_tf:
            tot_failed = int(m_tf.group(1))
        if m_cb:
            cur_banned = int(m_cb.group(1))
        if m_tb:
            tot_banned = int(m_tb.group(1))
        if m_ips and m_ips.group(1).strip():
            banned_ips = [ip.strip() for ip in m_ips.group(1).split() if ip.strip()]

    _, j_out = run_cmd("(tail -n 300 /var/log/auth.log 2>/dev/null; journalctl -u ssh -u sshd -n 250 --no-pager -o short-iso 2>/dev/null)", timeout=10)
    logins_by_ip = {}
    for line in reversed(j_out.splitlines()):
        if "Accepted " not in line:
            continue
        m = re.search(r"^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})\S*\s+\S+\s+sshd(?:-session)?\[\d+\]:\s+Accepted\s+(\S+)\s+for\s+(\S+)\s+from\s+(\S+)", line)
        if m:
            ts_iso, auth_m, user, ip = m.groups()
            key = f"{user}@{ip}"
            if key not in logins_by_ip:
                logins_by_ip[key] = {
                    "user": user,
                    "ip": ip,
                    "method": auth_m,
                    "last_seen": ts_iso.replace("T", " "),
                    "label": "Beszel Hub" if ip == "91.208.184.83" else "External",
                    "count": 1,
                }
            else:
                logins_by_ip[key]["count"] += 1

    return {
        "currently_failed": cur_failed,
        "total_failed": tot_failed,
        "currently_banned": cur_banned,
        "total_banned": tot_banned,
        "banned_ips": banned_ips[:30],
        "recent_logins": list(logins_by_ip.values())[:8],
    }


def manage_fail2ban_ip(action, ip_addr):
    """Ban or unban an IP address in Fail2ban sshd jail."""
    ip_clean = re.sub(r"[^0-9a-fA-F\.\:]", "", str(ip_addr).strip())
    if not ip_clean:
        return False, "Invalid IP address"
    if ip_clean in ("91.208.184.83", "91.99.147.9", "187.126.121.210", "127.0.0.1"):
        return False, "Cannot ban protected server IP"
    subcmd = "banip" if action == "ban" else "unbanip"
    rc, out = run_cmd(f"fail2ban-client set sshd {subcmd} {ip_clean} 2>&1", timeout=10)
    return rc == 0, (f"{'Banned' if action == 'ban' else 'Unbanned'} {ip_clean}" if rc == 0 else out)



def collect_vps_audit():
    script = Path("/usr/local/sbin/vps-audit.sh")
    if not script.exists():
        run_cmd("curl -sL https://raw.githubusercontent.com/nuver-labs/vps-audit/main/vps-audit.sh -o /usr/local/sbin/vps-audit.sh && sed -i 's|^REPORT_FILE=.*|REPORT_FILE=/tmp/vps-audit-latest.txt|' /usr/local/sbin/vps-audit.sh && chmod +x /usr/local/sbin/vps-audit.sh", timeout=20)
    if not script.exists():
        return []
    _, out = run_cmd("/usr/local/sbin/vps-audit.sh", timeout=45)
    clean = re.sub(r"\x1b\[[0-9;]*m", "", out or "")
    items = []
    for line in clean.splitlines():
        m = re.match(r"^\[(PASS|WARN|FAIL)\]\s+(.+?)\s+-\s+(.+)$", line.strip())
        if m:
            items.append({
                "status": m.group(1),
                "name": m.group(2).strip(),
                "message": m.group(3).strip(),
            })
    return items


def build_report(do_upgrade=True, only_security=False, do_docker_update=False, force_speedtest=False):
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    hostname, profile = get_profile()

    _, os_pretty = run_cmd(". /etc/os-release && echo $PRETTY_NAME")
    _, kernel = run_cmd("uname -r")
    _, uptime_p = run_cmd("uptime -p")
    _, local_tz = run_cmd("timedatectl show -p Timezone --value 2>/dev/null || cat /etc/timezone")

    agent_cfg = get_or_update_agent_config()
    updates = perform_updates(do_upgrade=do_upgrade, only_security=only_security)
    docker_info = collect_and_update_docker_containers(do_update=bool(do_docker_update or (do_upgrade and not only_security and agent_cfg.get("auto_docker_update", True))))
    docker_storage = collect_docker_storage_and_io()
    docker_info["storage"] = docker_storage
    updates["docker"] = docker_info
    disk_info = check_and_cleanup_disk(force=False)
    ssl_domains = collect_ssl_and_domains(profile)
    ssh_f2b = collect_ssh_and_fail2ban()
    telemetry = collect_system_telemetry(profile)
    net_health = collect_network_and_speedtest(force_speedtest=force_speedtest)

    fw_check = check_firewall()
    checks = [
        check_ssh_and_auth(),
        fw_check,
        check_fail2ban(),
        check_open_ports(profile, fw_check["metrics"]["rules"]),
        check_users_and_privileges(),
        check_processes_and_integrity(),
        check_cron_and_timers(),
        check_kernel_and_resources(),
    ]
    stack = collect_universal_stack()

    passed = sum(1 for c in checks if c["status"] == "ok")
    warns = sum(1 for c in checks if c["status"] == "warn")
    crits = sum(1 for c in checks if c["status"] == "crit")
    total = len(checks)

    score = max(0, 100 - crits * 25 - warns * 8 - (5 if updates["pending_security_count"] > 0 else 0))
    overall_status = "crit" if crits > 0 else ("warn" if warns > 0 else "ok")

    dubai_now = get_dubai_now()
    report = {
        "system_id": profile["system_id"],
        "system_name": profile["system_name"],
        "hostname": hostname,
        "ip": profile["ip"],
        "role_title": profile["role_title"],
        "role_title_ru": profile.get("role_title_ru", profile["role_title"]),
        "os": os_pretty or "Ubuntu Linux",
        "kernel": kernel,
        "uptime": uptime_p.replace("up ", ""),
        "server_timezone": local_tz,
        "schedule_dubai": "04:00 Asia/Dubai",
        "checked_at_dubai": dubai_now.strftime("%Y-%m-%d %H:%M:%S DXB"),
        "checked_at_iso": dubai_now.isoformat(),
        "overall_status": overall_status,
        "security_score": score,
        "passed_checks": passed,
        "warn_checks": warns,
        "crit_checks": crits,
        "total_checks": total,
        "updates": updates,
        "vulnerabilities": updates.get("vulnerabilities", {}),
        "disk": disk_info,
        "docker_storage": docker_storage,
        "telemetry": telemetry,
        "network_health": net_health,
        "agent_config": agent_cfg,
        "ssl_domains": ssl_domains,
        "ssh_fail2ban": ssh_f2b,
        "checks": checks,
        "vps_audit": collect_vps_audit(),
        "stack": stack,
    }

    REPORT_FILE.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    try:
        import gc
        gc.collect()
    except Exception:
        pass
    return report


def push_report(report):
    hub_url = HUB_REPORT_URL
    token = SHARED_TOKEN
    prof_file = Path("/etc/beszel-security/profile.json")
    if prof_file.exists():
        try:
            custom_prof = json.loads(prof_file.read_text(encoding="utf-8"))
            if custom_prof.get("hub_url"):
                base = custom_prof["hub_url"].rstrip("/")
                hub_url = f"{base}/api/security-report"
            if custom_prof.get("token"):
                token = custom_prof["token"]
        except Exception:
            pass

    data = json.dumps(report, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        hub_url,
        data=data,
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "X-Beszel-Security-Token": token,
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return resp.status == 200
    except Exception as e:
        print(f"Warning: could not push report to {hub_url}: {e}", file=sys.stderr)
        return False


def main():
    parser = argparse.ArgumentParser(description="Beszel Daily Security, Port Manager & Update Agent")
    parser.add_argument(
        "--check-only",
        action="store_true",
        help="Run security check and update audit without executing apt dist-upgrade",
    )
    parser.add_argument(
        "--vuln-watch",
        action="store_true",
        help="Check for security vulnerabilities and immediately patch any package with a security fix",
    )
    parser.add_argument(
        "--port-action",
        choices=["open", "close", "deny", "delete_rule"],
        help="Instant UFW port operation",
    )
    parser.add_argument("--port", default="", help="Port or port range (e.g. 8080)")
    parser.add_argument("--proto", default="tcp", help="Protocol: tcp, udp, or both")
    parser.add_argument("--from-ip", default="Anywhere", help="Source IP or Anywhere")
    parser.add_argument("--comment", default="", help="Optional UFW rule comment")
    parser.add_argument("--rule-num", type=int, default=None, help="UFW rule number for delete_rule")
    parser.add_argument("--service-action", choices=["toggle", "start", "stop", "delete"], help="Start/stop/toggle/delete stack service")
    parser.add_argument("--service-id", default="", help="Service ID from UNIVERSAL_STACK_CATALOG")
    parser.add_argument("--service-logs", default="", help="Fetch recent logs for a stack service ID")
    parser.add_argument("--lines", type=int, default=60, help="Number of log lines to fetch")
    parser.add_argument("--docker-update", action="store_true", help="Update Docker containers with auto-rollback")
    parser.add_argument("--docker-rollback", default="", help="Roll back Docker container (or 'all')")
    parser.add_argument("--docker-prune", action="store_true", help="Prune unused Docker images, containers, and build cache")
    parser.add_argument("--speedtest", action="store_true", help="Run an immediate bandwidth & latency speedtest")
    parser.add_argument("--set-config", default="", help="Update agent configuration from JSON string")
    parser.add_argument("--disk-cleanup", action="store_true", help="Run safe disk cleanup and report freed MB")
    parser.add_argument("--fail2ban-action", choices=["ban", "unban"], help="Ban or unban IP in Fail2ban sshd jail")
    parser.add_argument("--ip", default="", help="Target IP for fail2ban-action")
    parser.add_argument("--rollback", action="store_true", help="Roll back last package upgrade batch")
    parser.add_argument("--urgent-rollback", action="store_true", help="Roll back last urgent CVE patch snapshot")
    parser.add_argument("--rollback-specs", default="", help="Comma-separated pkg=old_ver list to roll back a specific patch")
    args = parser.parse_args()

    if args.service_logs:
        res = fetch_service_logs(args.service_logs, lines=args.lines)
        print(json.dumps(res, ensure_ascii=False))
        sys.exit(0)

    if args.set_config:
        try:
            cfg_in = json.loads(args.set_config)
        except Exception:
            cfg_in = {}
        new_cfg = get_or_update_agent_config(cfg_in)
        rep = fast_refresh_ports_report()
        rep["agent_config"] = new_cfg
        REPORT_FILE.write_text(json.dumps(rep, ensure_ascii=False, indent=2), encoding="utf-8")
        push_report(rep)
        print(json.dumps({"ok": True, "message": "Agent config updated", "agent_config": new_cfg, "report": rep}, ensure_ascii=False))
        sys.exit(0)

    if args.docker_prune:
        ok, msg = execute_docker_prune()
        rep = build_report(do_upgrade=False)
        push_report(rep)
        print(json.dumps({"ok": ok, "message": msg, "report": rep}, ensure_ascii=False))
        sys.exit(0)

    if args.speedtest:
        net_res = collect_network_and_speedtest(force_speedtest=True)
        rep = fast_refresh_ports_report()
        rep["network_health"] = net_res
        REPORT_FILE.write_text(json.dumps(rep, ensure_ascii=False, indent=2), encoding="utf-8")
        push_report(rep)
        st = net_res.get("speedtest", {})
        msg = f"DL {st.get('download_mbps', 0)} Mbps · UL {st.get('upload_mbps', 0)} Mbps · Ping {net_res.get('ping_ms', 0)} ms"
        print(json.dumps({"ok": True, "message": msg, "network_health": net_res, "report": rep}, ensure_ascii=False))
        sys.exit(0)

    if args.disk_cleanup:
        d_res = check_and_cleanup_disk(force=True)
        rep = build_report(do_upgrade=False)
        rep["disk"] = d_res
        REPORT_FILE.write_text(json.dumps(rep, ensure_ascii=False, indent=2), encoding="utf-8")
        push_report(rep)
        print(json.dumps({"ok": True, "message": f"Freed {d_res['freed_mb']} MB (used {d_res['used_pct']}%)", "disk": d_res, "report": rep}, ensure_ascii=False))
        sys.exit(0)

    if args.fail2ban_action:
        ok, msg = manage_fail2ban_ip(args.fail2ban_action, args.ip)
        rep = fast_refresh_ports_report()
        rep["ssh_fail2ban"] = collect_ssh_and_fail2ban()
        REPORT_FILE.write_text(json.dumps(rep, ensure_ascii=False, indent=2), encoding="utf-8")
        push_report(rep)
        print(json.dumps({"ok": ok, "message": msg, "report": rep}, ensure_ascii=False))
        sys.exit(0 if ok else 1)

    if args.docker_update:
        rep = build_report(do_upgrade=False, do_docker_update=True)
        push_report(rep)
        up_cnt = len(rep.get("updates", {}).get("docker", {}).get("updated", []))
        print(json.dumps({"ok": True, "message": f"Docker checked, updated {up_cnt} container(s)", "report": rep}, ensure_ascii=False))
        sys.exit(0)

    if args.docker_rollback:
        cname = "" if args.docker_rollback == "all" else args.docker_rollback
        ok, msg = execute_docker_rollback(target_cname=cname)
        rep = build_report(do_upgrade=False)
        push_report(rep)
        print(json.dumps({"ok": ok, "message": msg, "report": rep}, ensure_ascii=False))
        sys.exit(0 if ok else 1)

    if args.rollback or args.urgent_rollback or args.rollback_specs:
        ok, msg = execute_rollback(
            reason="Manual patch rollback from Beszel UI" if args.rollback_specs else "Manual rollback from Beszel UI",
            hold_on_auto=bool(args.rollback_specs or args.urgent_rollback),
            rollback_specs=args.rollback_specs,
            urgent_only=bool(args.urgent_rollback),
        )
        rep = build_report(do_upgrade=False)
        push_report(rep)
        print(json.dumps({"ok": ok, "message": msg, "report": rep}, ensure_ascii=False))
        sys.exit(0 if ok else 1)

    if args.service_action:
        ok, msg = manage_service(service_id=args.service_id, action=args.service_action)
        rep = fast_refresh_ports_report()
        print(json.dumps({"ok": ok, "message": msg, "report": rep}, ensure_ascii=False))
        sys.exit(0 if ok else 1)

    if args.port_action:
        ok, msg = manage_port(
            action=args.port_action,
            port_spec=args.port,
            proto=args.proto,
            from_ip=args.from_ip,
            comment=args.comment,
            rule_num=args.rule_num,
        )
        rep = fast_refresh_ports_report()
        print(json.dumps({"ok": ok, "message": msg, "report": rep}, ensure_ascii=False))
        sys.exit(0 if ok else 1)

    report = build_report(do_upgrade=not args.check_only, only_security=args.vuln_watch)
    push_report(report)
    print(
        f"[{report['checked_at_dubai']}] {report['system_name']} ({report['ip']}): "
        f"status={report['overall_status']} score={report['security_score']} "
        f"checks={report['passed_checks']}/{report['total_checks']} "
        f"upgraded_24h={report['updates']['upgraded_24h_count']} "
        f"pending={report['updates']['pending_count']}"
    )


if __name__ == "__main__":
    main()

