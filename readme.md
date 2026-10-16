# Beszel

Beszel is a lightweight server monitoring platform that includes Docker statistics, historical data, alert functions, and integrated security telemetry.

It has a friendly web interface, simple configuration, and is ready to use out of the box. It supports automatic backup, multi-user, OAuth authentication, dashboard rearrangement, and native Go security auditing.

[![agent Docker Image Size](https://img.shields.io/docker/image-size/henrygd/beszel-agent/latest?logo=docker&label=agent%20image%20size)](https://hub.docker.com/r/henrygd/beszel-agent)
[![hub Docker Image Size](https://img.shields.io/docker/image-size/henrygd/beszel/latest?logo=docker&label=hub%20image%20size)](https://hub.docker.com/r/henrygd/beszel)
[![MIT license](https://img.shields.io/github/license/henrygd/beszel?color=%239944ee)](LICENSE)
[![Crowdin](https://badges.crowdin.net/beszel/localized.svg)](https://crowdin.com/project/beszel)
![Beszel System Overview with Security Radar](assets/images/beszel-system-overview.png)

## Features

- **Lightweight**: Smaller and less resource-intensive than leading solutions.
- **Simple**: Easy setup with little manual configuration required.
- **Dashboard customization**: Per-server drag & drop rearrangement of system charts, stack categories, and service pills with visibility controls.
- **Security Radar**: Integrated CVE vulnerability tracker, active port manager, SSH login auditing, and Fail2ban monitor.
- **Pure Go architecture**: 100% written in Go with zero Python or external runtime dependencies.
- **Alerts**: Configurable alerts for most metrics. Supports many notification services.
- **Docker stats**: Tracks CPU, memory, and network usage history for each container.
- **Network monitoring**: Monitor response time and interruptions directly from agents.
- **S.M.A.R.T.**: Disk health data and notifications on drive failure.
- **Multi-user**: Users manage their own systems. Admins can share systems across users.
- **OAuth / OIDC**: Supports many OAuth2 providers. Password auth can be disabled.
- **Automatic backups**: Save to and restore from disk or S3-compatible storage.

## Architecture

Beszel consists of two main components: the **hub** and the **agent**.

- **Hub**: A web application built on [PocketBase](https://pocketbase.io/) that provides a dashboard for viewing and managing connected systems.
- **Agent**: Runs on each system you want to monitor and communicates system metrics to the hub.

## Getting started

The [quick start guide](https://beszel.dev/guide/getting-started) and other documentation is available on our website, [beszel.dev](https://beszel.dev). You'll be up and running in a few minutes.

### 1. Hub Setup

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

### 2. Connect Your Systems

1. Open `http://<SERVER_IP>:8090` and create your admin account.
2. Click **Add System** and copy your Hub Public Key.
3. Run the unified installer on any server you want to monitor:

```bash
curl -sL http://<HUB_IP>:8090/install-agent.sh | bash -s -- --key "<YOUR_HUB_KEY>"
```

The agent runs as an isolated systemd service, auto-discovers running containers and services, and streams hardware and security telemetry immediately.

## Screenshots

### System Overview & Security Radar
Integrated CVE checks, active ports, Fail2ban monitor, and system telemetry:

![System Overview](assets/images/beszel-system-overview.png)

### Drag & Drop Dashboard Rearrange Mode
Rearrange system charts, stack tabs, and visibility controls directly on the live page:

![Rearrange Mode](assets/images/beszel-rearrange-mode.png)

### All-in-One Agent Installer
1-liner installer for hardware monitoring and automatic security auditing:

![All-in-One Installer](assets/images/beszel-agent-installer.png)

## Tailscale Setup

Running Beszel over [Tailscale](https://tailscale.com) allows monitoring your fleet across clouds, home labs, and VPS instances with zero open firewall ports on the public internet. See the [Tailscale deployment guide](TAILSCALE.md) for complete details on ACL policies, sidecars, and troubleshooting.

### Option 1: Native Host Setup (Recommended)

If your nodes already run Tailscale:

1. **Find your Hub Tailscale IP or MagicDNS name:**
   ```bash
   tailscale ip -4
   # Example: 100.64.0.2
   ```

2. **Access the Hub web dashboard:**
   Open `http://100.64.0.2:8090` (or `http://<hub-name>.<your-tailnet>.ts.net:8090`) in your browser.

3. **Install the Agent on any Tailscale node:**
   ```bash
   curl -sL http://100.64.0.2:8090/install-agent.sh | bash -s -- --key "<YOUR_HUB_KEY>"
   ```

4. **Firewall security:**
   Lock down ports `8090` (hub) and `45876` (agent) to only accept traffic from the `tailscale0` network interface:
   ```bash
   ufw allow in on tailscale0 to any port 8090 proto tcp
   ufw allow in on tailscale0 to any port 45876 proto tcp
   ```

### Option 2: Docker Compose with Tailscale Sidecar

To isolate the Hub inside a container while exposing it strictly to your Tailnet:

```yaml
services:
  tailscale:
    image: tailscale/tailscale:latest
    container_name: tailscale-beszel
    hostname: beszel-hub
    environment:
      - TS_AUTHKEY=tskey-auth-YOUR_AUTH_KEY_HERE
      - TS_STATE_DIR=/var/lib/tailscale
      - TS_USERSPACE=false
    volumes:
      - ./tailscale-data:/var/lib/tailscale
      - /dev/net/tun:/dev/net/tun
    cap_add:
      - NET_ADMIN
      - NET_RAW
    restart: unless-stopped

  beszel:
    image: henrygd/beszel:latest
    container_name: beszel-hub
    network_mode: service:tailscale
    depends_on:
      - tailscale
    volumes:
      - ./beszel_data:/beszel_data
    restart: unless-stopped
```

### Option 3: Automatic HTTPS with Tailscale Serve

Tailscale can automatically issue Let's Encrypt certificates and terminate HTTPS for your Hub:

```bash
tailscale serve --bg 8090
```

Your Beszel dashboard is now securely available at `https://<hub-name>.<your-tailnet>.ts.net` with zero certificate configuration needed.

## Supported metrics

- **CPU usage** - Host system and Docker / Podman containers.
- **Memory usage** - Host system and containers. Includes swap and ZFS ARC.
- **Disk usage** - Host system partitions and mount points.
- **Disk I/O** - Host system partitions and devices.
- **Network usage** - Host system and containers.
- **Load average** - Host system.
- **Security Radar** - Open firewall ports, active connections, SSH login attempts, Fail2ban jails, CVE patch backlog.
- **Services & Stack** - Automatic tracking of Docker containers, systemd services, and web endpoints.
- **Temperature** - Host system sensors.
- **Fan speed** - Host system sensors (Linux, via `/sys/class/hwmon`).
- **GPU usage / power draw** - Nvidia, AMD, and Intel.
- **Battery charge** - Host system and some peripherals.
- **Containers** - Status and metrics of all running Docker / Podman containers.
- **S.M.A.R.T.** - Host system disk health (includes eMMC wear/EOL and Linux mdraid array health via sysfs when available).
- **ZFS** - Pool capacity, usage, health, I/O throughput, scrub status, and per-dataset usage.

## Help and discussion

Please search existing issues and discussions before opening a new one.

#### Bug reports and feature requests

Bug reports and feature requests can be posted on [GitHub issues](https://github.com/bledny1099/beszel/issues).

#### Upstream project

Original project and documentation: [henrygd/beszel](https://github.com/henrygd/beszel) · [beszel.dev](https://beszel.dev).

## License

Beszel is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
