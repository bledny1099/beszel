# Beszel (Enhanced Edition)

Lightweight server monitoring platform with **Security Radar**, **Vulnerability Tracking**, **Custom Dashboard Drag-and-Drop Layouts**, and **Optimized Single-Agent Telemetry**.

Written **100% in Go** with zero Python dependencies. Based on upstream [Beszel](https://github.com/henrygd/beszel).

---

## Key Enhancements in this Fork

- **Dashboard Rearrangement Mode**: Customize and reorder all system charts, category cards, service pills, and tabs per-server using drag & drop, complete with visibility toggles and layout persistence.
- **100% Pure Go Architecture**: All security routing, port checks, CVE tracking, and telemetry collectors are written in native Go with zero external runtimes (no Python needed).
- **Integrated Security Hub**: Real-time CVE vulnerability scanning, automated security patch tracking, SSH login auditing, and Fail2ban integration with instant IP unban capabilities.
- **Unified Single-Agent Installer**: Deploy hardware metrics, security telemetry, vulnerability checks, and non-disruptive daily updates in one single command.
- **Ultra-low Memory Footprint**: Agent memory optimizations (Go GC tuning, memory limits, and madvise hooks) keeping RAM consumption below 32 MB.
- **Turnkey Hub Deployment**: One-command launch with Docker Compose including reverse proxy and dynamic asset injection.

---

## Quick Start

### 1. Hub Setup (Central Server)

Run the quick-start script on your central server:

```bash
git clone https://github.com/bledny1099/beszel.git
cd beszel
./quick-start.sh
```

Or run directly with Docker Compose:

```bash
docker compose up -d
```

The web dashboard will be available at `http://<SERVER_IP>:8090`.

### 2. Connect Your Systems (Agents)

1. Open `http://<SERVER_IP>:8090` and create your admin account.
2. Click **Add System** and copy your Hub Public Key.
3. On any server you want to monitor, run the unified installer:

```bash
curl -sL http://<HUB_IP>:8090/install-agent.sh | bash -s -- --key "<YOUR_HUB_KEY>"
```

The agent runs as an isolated systemd service, auto-discovers running containers and services, and streams hardware and security telemetry immediately.

---

## Configuration

### Environment Variables (`.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8090` | Public web port for Beszel Hub |
| `BESZEL_SECURITY_TOKEN` | *(auto-generated)* | Shared secret for security telemetry between Hub and Agents |

### Agent Installer Flags

```bash
curl -sL http://<HUB_IP>:8090/install-agent.sh | bash -s -- [FLAGS]
```

- `--key`, `-k`: Beszel Hub Public Key (required)
- `--hub`, `-h`: Hub URL (default: `http://<HUB_IP>:8090`)
- `--port`, `-p`: Agent listening port (default: `45876`)
- `--token`, `-t`: Custom security token

---

## Supported Metrics

- **CPU usage** - Host system and Docker / Podman containers.
- **Memory usage** - Host system and containers. Includes swap and ZFS ARC.
- **Disk usage** - Host system partitions and mount points.
- **Disk I/O** - Read / write throughput and IOPS.
- **Network usage** - Host system interfaces and containers.
- **Load average** - Host system 1m, 5m, 15m.
- **Security Radar** - Open firewall ports, active connections, SSH login attempts, Fail2ban jails, CVE patch backlog.
- **Services & Stack** - Automatic tracking of Docker containers, systemd services, and web endpoints.

## License

MIT License. See [LICENSE](LICENSE) for details.
