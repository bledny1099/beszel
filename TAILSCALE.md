# Deploying Beszel with Tailscale

Deploying Beszel over [Tailscale](https://tailscale.com) creates an end-to-end encrypted, zero-trust monitoring mesh. You can monitor servers across multiple clouds (Hetzner, AWS, DigitalOcean), private home labs, and edge devices without exposing any management ports to the public internet.

---

## Key Benefits

- **Zero Open Ports**: No public firewall holes needed for port `8090` (Hub) or `45876` (Agent).
- **Encrypted Mesh**: All telemetry and metrics are encrypted via WireGuard.
- **Stable Addressing**: Nodes communicate using stable Tailscale IPs (`100.x.y.z`) and MagicDNS hostnames (`hub.your-tailnet.ts.net`).
- **Automatic HTTPS**: Built-in Let's Encrypt certificates through Tailscale Serve.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Tailscale Mesh                        │
│                                                             │
│   ┌────────────────────┐          ┌─────────────────────┐   │
│   │   Beszel Agent     │          │    Beszel Hub       │   │
│   │   (Edge Server)    │◄─────────┤  (Central Server)   │   │
│   │   100.64.0.3:45876 │          │   100.64.0.2:8090   │   │
│   └────────────────────┘          └──────────▲──────────┘   │
│                                              │              │
│                                       Tailscale Serve       │
│                                      (HTTPS / MagicDNS)     │
└──────────────────────────────────────────────┼──────────────┘
                                               │
                                     ┌─────────┴─────────┐
                                     │  Admin Browser    │
                                     │  (on your tailnet)│
                                     └───────────────────┘
```

---

## Method 1: Host-Level Tailscale (Recommended)

### 1. Install Tailscale on the Hub Server

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

Get the Tailscale IP of your hub:
```bash
tailscale ip -4
# Example output: 100.64.0.2
```

### 2. Start the Beszel Hub

Start your Beszel hub bound to localhost or the Tailscale interface:
```bash
docker run -d \
  --name beszel \
  --restart unless-stopped \
  -p 100.64.0.2:8090:8090 \
  -v ./beszel_data:/beszel_data \
  henrygd/beszel:latest
```

### 3. Install Beszel Agent on Remote Nodes

On each server you want to monitor, install Tailscale first:
```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

Then install the Beszel Agent pointing to the Hub's Tailscale IP:
```bash
curl -sL http://100.64.0.2:8090/install-agent.sh | bash -s -- --key "<YOUR_HUB_KEY>"
```

### 4. Firewall Hardening (UFW)

Ensure only Tailnet peers can access Beszel services:
```bash
# On the Hub:
sudo ufw allow in on tailscale0 to any port 8090 proto tcp

# On monitored Agents:
sudo ufw allow in on tailscale0 to any port 45876 proto tcp
```

---

## Method 2: Docker Compose with Tailscale Sidecar

If you prefer containing Tailscale inside Docker without installing it on the host:

```yaml
version: "3.8"

services:
  tailscale:
    image: tailscale/tailscale:latest
    container_name: tailscale-beszel
    hostname: beszel-hub
    environment:
      - TS_AUTHKEY=tskey-auth-YOUR_REUSABLE_KEY
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

1. Generate a reusable Auth Key in the [Tailscale Admin Console](https://login.tailscale.com/admin/settings/keys).
2. Replace `tskey-auth-YOUR_REUSABLE_KEY` in `docker-compose.yml`.
3. Launch with `docker compose up -d`.

---

## Method 3: HTTPS via Tailscale Serve

To get valid SSL certificates on your tailnet without setting up Caddy, Nginx, or Certbot:

```bash
# Enable background HTTPS proxy on port 443 forwarding to Beszel 8090:
tailscale serve --bg 8090
```

Now open:
```
https://beszel-hub.your-tailnet.ts.net
```

Tailscale automatically handles certificate renewal and TLS termination.

---

## Tailscale ACL Policies (Optional)

You can restrict which devices can communicate with the Hub using Tailscale ACL tags:

```json
{
  "tagOwners": {
    "tag:beszel-hub": ["autogroup:admin"],
    "tag:beszel-agent": ["autogroup:admin"]
  },
  "acls": [
    // Allow admins to access the Hub web interface
    {
      "action": "accept",
      "src": ["autogroup:admin"],
      "dst": ["tag:beszel-hub:8090", "tag:beszel-hub:443"]
    },
    // Allow Hub to poll Agents on port 45876
    {
      "action": "accept",
      "src": ["tag:beszel-hub"],
      "dst": ["tag:beszel-agent:45876"]
    }
  ]
}
```

---

## Troubleshooting

### Agent connection timeout
Check that the Agent is listening on `0.0.0.0:45876` or the Tailscale IP, and verify connectivity from the Hub:
```bash
curl -I http://<agent-tailscale-ip>:45876
```

### Tailscale interface name
On Linux hosts, Tailscale usually creates interface `tailscale0`. Verify with `ip addr show dev tailscale0`.
