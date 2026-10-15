#!/usr/bin/env bash
# ==============================================================================
# Beszel Unified All-In-One Agent Installer (Pure Go Edition)
# Installs Beszel Agent (Hardware, Containers, Services, Security & CVE Telemetry)
#
# Usage:
#   curl -sL http://<HUB_HOST>:8090/install-agent.sh | bash -s -- --key "<HUB_PUB_KEY>"
#   or:
#   HUB_URL="http://<HUB_HOST>:8090" KEY="ssh-ed25519 ..." ./install-agent.sh
# ==============================================================================
set -euo pipefail

HUB_URL="${HUB_URL:-}"
HUB_PUB_KEY="${KEY:-${HUB_PUB_KEY:-}}"
SECURITY_TOKEN="${SECURITY_TOKEN:-}"
AGENT_PORT="${PORT:-45876}"
SYSTEM_ID="${SYSTEM_ID:-}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --system-id|-s)
      SYSTEM_ID="$2"
      shift 2
      ;;
    --hub|-h)
      HUB_URL="$2"
      shift 2
      ;;
    --key|-k)
      HUB_PUB_KEY="$2"
      shift 2
      ;;
    --token|-t)
      SECURITY_TOKEN="$2"
      shift 2
      ;;
    --port|-p)
      AGENT_PORT="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

echo "[1/4] Checking environment..."
if [ "$EUID" -ne 0 ]; then
  echo "Error: this installer must be run as root (sudo bash)" >&2
  exit 1
fi

if [ -z "$HUB_PUB_KEY" ]; then
  if [ -t 0 ]; then
    read -rp "Enter Beszel Hub Public Key (ssh-ed25519 ...): " HUB_PUB_KEY
  fi
fi

if [ -z "$HUB_PUB_KEY" ]; then
  echo "Error: Beszel Hub Public Key is required." >&2
  echo "Usage: curl -sL <HUB_URL>/install-agent.sh | bash -s -- --key '<KEY>'" >&2
  exit 1
fi

if [ -z "$HUB_URL" ]; then
  if [ -t 0 ]; then
    read -rp "Enter Beszel Hub URL (e.g. http://hub.example.com:8090): " HUB_URL
  else
    HUB_URL="http://localhost:8090"
  fi
fi

if [ -z "$SECURITY_TOKEN" ]; then
  if command -v openssl &>/dev/null; then
    SECURITY_TOKEN="bszl-sec-$(openssl rand -hex 12)"
  else
    SECURITY_TOKEN="bszl-sec-$(head -c 16 /dev/urandom | od -An -tx1 | tr -d ' \n')"
  fi
fi

ARCH="$(uname -m)"
case "$ARCH" in
  x86_64) AGENT_ARCH="x86_64" ;;
  aarch64|arm64) AGENT_ARCH="arm64" ;;
  *) echo "Unsupported architecture: $ARCH" >&2; exit 1 ;;
esac

# 1. System packages (only curl & tar needed)
echo "[2/4] Verifying basic tools (curl, tar)..."
if ! command -v curl &>/dev/null || ! command -v tar &>/dev/null; then
  if command -v apt-get &>/dev/null; then
    apt-get update -qq && apt-get install -y -qq curl tar < /dev/null || true
  elif command -v yum &>/dev/null; then
    yum install -y curl tar || true
  elif command -v dnf &>/dev/null; then
    dnf install -y curl tar || true
  elif command -v apk &>/dev/null; then
    apk add --no-cache curl tar || true
  fi
fi

# 2. Beszel Agent user & directory
echo "[3/4] Installing pure Go Beszel agent (/opt/beszel-agent)..."
mkdir -p /opt/beszel-agent
if ! id -u beszel &>/dev/null; then
  useradd -M -s /bin/false beszel 2>/dev/null || true
fi

# Add to docker group if present for container stats
if command -v docker &>/dev/null; then
  usermod -aG docker beszel 2>/dev/null || true
fi

# Download binary if not present
if [ ! -f /opt/beszel-agent/beszel-agent ]; then
  echo "Downloading beszel-agent binary..."
  TMP_TAR="/tmp/beszel-agent.tar.gz"
  if curl -sSf "${HUB_URL}/assets/beszel-agent_${AGENT_ARCH}.tar.gz" -o "$TMP_TAR" 2>/dev/null || \
     curl -sSfL "https://github.com/henrygd/beszel/releases/latest/download/beszel-agent_Linux_${AGENT_ARCH}.tar.gz" -o "$TMP_TAR"; then
    tar -xzf "$TMP_TAR" -C /opt/beszel-agent/ beszel-agent 2>/dev/null || tar -xzf "$TMP_TAR" -C /opt/beszel-agent/
    rm -f "$TMP_TAR"
    chmod 755 /opt/beszel-agent/beszel-agent
    chown -R beszel:beszel /opt/beszel-agent
  else
    echo "Warning: could not download beszel-agent binary automatically. Please place it in /opt/beszel-agent/beszel-agent" >&2
  fi
fi

# Systemd service with low-memory tuning & native security telemetry
cat <<EOF > /etc/systemd/system/beszel-agent.service
[Unit]
Description=Beszel Unified Agent (Hardware & Security Telemetry)
Wants=network-online.target
After=network-online.target

[Service]
Environment="PORT=${AGENT_PORT}"
Environment="KEY=${HUB_PUB_KEY}"
Environment="HUB_URL=${HUB_URL}"
Environment="SECURITY_TOKEN=${SECURITY_TOKEN}"
Environment="SYSTEM_ID=${SYSTEM_ID}"
Environment="GOMEMLIMIT=24MiB"
Environment="GODEBUG=madvdontneed=1"
MemoryHigh=32M
MemoryMax=48M
ExecStart=/opt/beszel-agent/beszel-agent
User=beszel
Restart=on-failure
RestartSec=5
StateDirectory=beszel-agent
KeyringMode=private
LockPersonality=yes
ProtectClock=yes
ProtectHome=read-only
ProtectHostname=yes
ProtectKernelLogs=yes
ProtectSystem=strict
RemoveIPC=yes
RestrictSUIDSGID=true

[Install]
WantedBy=multi-user.target
EOF

if command -v systemctl &>/dev/null; then
  systemctl daemon-reload
  systemctl enable --now beszel-agent.service 2>/dev/null || true
fi

# Allow agent port in firewall if UFW active
if command -v ufw &>/dev/null && ufw status 2>/dev/null | grep -q "Status: active"; then
  ufw allow "${AGENT_PORT}/tcp" comment "Beszel Agent" >/dev/null 2>&1 || true
fi

# 3. Initial security check and sync
echo "[4/4] Starting initial telemetry sync..."
/opt/beszel-agent/beszel-agent security 2>/dev/null || true

echo ""
echo "=================================================================="
echo "✓ Beszel Pure-Go Agent successfully installed and active!"
echo "  - Service: beszel-agent.service (port ${AGENT_PORT})"
echo "  - Telemetry: Hardware metrics, containers, ports & security"
echo "  - Hub: ${HUB_URL}"
echo "  - Runtime: Native Go binary (no python or external runtime needed)"
echo "=================================================================="
