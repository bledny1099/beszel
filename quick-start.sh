#!/usr/bin/env bash
# ==============================================================================
# Beszel Hub Quick Start
# Automatically sets up and starts Beszel Hub + Security Hub + Custom UI Gateway
# ==============================================================================
set -euo pipefail

echo "=================================================================="
echo " Starting Beszel Hub Setup..."
echo "=================================================================="

# Check Docker
if ! command -v docker &>/dev/null; then
  echo "Docker is not installed. Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker 2>/dev/null || true
fi

# Check Docker Compose plugin or binary
if ! docker compose version &>/dev/null; then
  if command -v docker-compose &>/dev/null; then
    COMPOSE_CMD="docker-compose"
  else
    echo "Installing Docker Compose plugin..."
    if command -v apt-get &>/dev/null; then
      apt-get update -qq && apt-get install -y -qq docker-compose-plugin < /dev/null || true
    fi
    COMPOSE_CMD="docker compose"
  fi
else
  COMPOSE_CMD="docker compose"
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
fi

mkdir -p beszel_data custom_assets packaging

echo "Starting Beszel containers..."
$COMPOSE_CMD pull beszel beszel-gateway 2>/dev/null || true
$COMPOSE_CMD up -d

SERVER_IP="$(curl -s --max-time 2 https://api.ipify.org || curl -s --max-time 2 https://ifconfig.me || echo "localhost")"

echo ""
echo "=================================================================="
echo "✓ Beszel Hub is up and running!"
echo ""
echo "  Web Dashboard: http://${SERVER_IP}:8090"
echo "  Local Access:  http://localhost:8090"
echo ""
echo "Next steps:"
echo "1. Open http://${SERVER_IP}:8090 in your browser and create your admin account."
echo "2. Copy your public key from the Hub."
echo "3. Install the unified agent on your servers with one command:"
echo "   curl -sL http://${SERVER_IP}:8090/install-agent.sh | bash -s -- --key '<YOUR_KEY>'"
echo "=================================================================="
