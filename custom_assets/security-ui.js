/**
 * Beszel Security, Instant Port Control & Unified Updates UI (Native Monochrome)
 */

const ICONS = {
  shield: `<span class="bszl-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg></span>`,
  sync: (spinning = false) => `<span class="bszl-ico bszl-ico-sync ${spinning ? "is-spinning" : ""}"><svg width="13.5" height="13.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g class="ico-arrows"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></g></svg></span>`,
  langGlobe: `<svg class="h-[1.2rem] w-[1.2rem]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>`,
  flagUS: `<svg viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="28" height="20" fill="#FFFFFF"/><path d="M0 0H28V1.54H0V0ZM0 3.08H28V4.62H0V3.08ZM0 6.15H28V7.69H0V6.15ZM0 9.23H28V10.77H0V9.23ZM0 12.31H28V13.85H0V12.31ZM0 15.38H28V16.92H0V15.38ZM0 18.46H28V20H0V18.46Z" fill="#B22234"/><rect width="12" height="10.77" fill="#3C3B6E"/><g fill="#FFFFFF"><circle cx="2.2" cy="2" r="0.75"/><circle cx="4.7" cy="2" r="0.75"/><circle cx="7.2" cy="2" r="0.75"/><circle cx="9.7" cy="2" r="0.75"/><circle cx="3.45" cy="3.7" r="0.75"/><circle cx="5.95" cy="3.7" r="0.75"/><circle cx="8.45" cy="3.7" r="0.75"/><circle cx="2.2" cy="5.4" r="0.75"/><circle cx="4.7" cy="5.4" r="0.75"/><circle cx="7.2" cy="5.4" r="0.75"/><circle cx="9.7" cy="5.4" r="0.75"/><circle cx="3.45" cy="7.1" r="0.75"/><circle cx="5.95" cy="7.1" r="0.75"/><circle cx="8.45" cy="7.1" r="0.75"/><circle cx="2.2" cy="8.8" r="0.75"/><circle cx="4.7" cy="8.8" r="0.75"/><circle cx="7.2" cy="8.8" r="0.75"/><circle cx="9.7" cy="8.8" r="0.75"/></g></svg>`,
  flagRU: `<svg viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="28" height="6.67" fill="#FFFFFF"/><rect y="6.67" width="28" height="6.67" fill="#0039A6"/><rect y="13.33" width="28" height="6.67" fill="#D52B1E"/></svg>`,
  sshLock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  firewall: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  fail2ban: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m5.7 5.7 12.6 12.6"/></svg>`,
  radarPorts: `<span class="bszl-ico bszl-ico-radar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" stroke-opacity="0.5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><path class="ico-sweep" d="M12 12 18.2 5.8"/></svg></span>`,
  usersPriv: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>`,
  procMemory: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="14" x="3" y="5" rx="2"/><path d="m7 10 3 2-3 2"/><path d="M12 14h4"/></svg>`,
  cronTimer: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5"/><path d="M9 2h6"/></svg>`,
  kernelDisk: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>`,
  chevronUp: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`,
  chevronDown: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  bell: `<svg class="h-[1.2rem] w-[1.2rem]" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
  terminal: `<svg class="h-[1.2rem] w-[1.2rem]" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" width="13.5" height="13.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  sliders: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>`,
  grip: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>`,
  gauge: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>`,
  dockerBox: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
  ubuntu: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#E95420"/><circle cx="12" cy="12" r="4.3" stroke="#FFF" stroke-width="1.8"/><circle cx="6.2" cy="12" r="1.6" fill="#FFF"/><circle cx="14.9" cy="7" r="1.6" fill="#FFF"/><circle cx="14.9" cy="17" r="1.6" fill="#FFF"/></svg>`,
  debian: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#A80030"/><path d="M13 6.5c-3.2 0-5.5 2.4-5.5 5.5s2.4 5.5 5.3 5.5c1.8 0 3.2-.8 3.9-2M13 9.2c1.6 0 2.8 1.2 2.8 2.8 0 1.4-1 2.4-2.3 2.4-1.1 0-1.9-.8-1.9-1.9" stroke="#FFF" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  linux: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="9" x2="10" y2="12"/><line x1="10" y1="12" x2="7" y2="15"/><line x1="12" y1="15" x2="17" y2="15"/></svg>`,
};

const CHECK_ICON_MAP = {
  ssh_auth: ICONS.sshLock,
  firewall: ICONS.firewall,
  fail2ban: ICONS.fail2ban,
  open_ports: ICONS.radarPorts,
  users_priv: ICONS.usersPriv,
  processes_integrity: ICONS.procMemory,
  cron_timers: ICONS.cronTimer,
  kernel_sysctl: ICONS.kernelDisk,
  inodes: ICONS.kernelDisk,
  disk_trend: ICONS.cronTimer,
  cpu_steal: ICONS.procMemory,
  oom_reboot: ICONS.shield,
};

const I18N = {
  ru: {
    secCol: "Защита",
    osCol: "ОС / Ядро",
    tabChecks: "Стек",
    tabPorts: "Порты",
    tabDocker: "Docker и Диск",
    tabNet: "Speedtest",
    tabUpdates: "Апдейты",
    checkNow: "Проверка",
    updateNow: "Обновить",
    hide: "Скрыть",
    expand: "Развернуть",
    portPlaceholder: "Порт (8080)",
    ipPlaceholder: "Anywhere / IP",
    commentPlaceholder: "Сервис",
    openPortBtn: "+ Открыть",
    closePortBtn: "✕ Закрыть",
    openBtn: "Открыть",
    closeBtn: "Закрыть",
    ufwOpen: "Открыт",
    ufwClosed: "Закрыт",
    ufwRestricted: "По IP",
    listeningPorts: "Порты",
    ufwRules: "UFW",
    colPort: "Порт",
    colService: "Сервис",
    colUfw: "UFW",
    colAction: "Действие",
    colRule: "Правило",
    colFrom: "Источник",
    pendingUpdates: "Доступно",
    installedUpdates: "За 24ч",
    noPending: "0 обновлений",
    noRecent: "Нет записей",
    colPkg: "Пакет",
    colOld: "Было",
    colNew: "Стало",
    colTime: "Время",
    catVpn: "VPN и ядра",
    catBots: "TG-боты",
    catServers: "Серверы и веб",
    catUtils: "Утилиты и MCP",
    rollbackNow: "↺ Откат",
    autoRollbackOn: "Авто-откат: ВКЛ",
    snapshotCount: "Снимок",
    cveMonitorOn: "CVE 10m",
    notifBtnTitle: "Уведомления",
    notifPageTitle: "Уведомления",
    scanPatchBtn: "Проверить CVE",
    backBtn: "← Назад",
    kpiOpenVulns: "Уязвимости",
    kpiPatchedCves: "CVE закрыто",
    kpiAutoUpdates: "Апдейты",
    filterAll: "Все",
    filterVulns: "CVE",
    filterUpdates: "Апдейты",
    allServers: "Все",
    typeVulnPatched: "CVE",
    typeVulnDetected: "УЯЗВ",
    typeAutoUpdate: "UPD",
    typeAutoRollback: "ОТКАТ",
    emptyNotifs: "Событий нет",
    openNotifsBtn: "Уведомления",
    agentBtnTitle: "Установка единого агента",
    agentBtnLabel: "Агент",
    agentModalTitle: "Установка единого агента Beszel",
    agentModalSubtitle: "Установите мониторинг, аудит безопасности, порты и авто-патчи CVE одной командой.",
    agentCopyBtn: "Копировать",
    agentCopiedBtn: "✓ Скопировано",
    agentFeatureHw: "Аппаратный мониторинг: CPU, память, диски, сеть, Docker",
    agentFeatureSec: "Аудит безопасности: открытые порты, UFW, fail2ban, SSH, SSL",
    agentFeatureCve: "Авто-патчи CVE: ежечасный мониторинг уязвимостей и откат",
    agentFeatureLive: "Мгновенные действия: службы, блокировка IP и живые логи",
    agentClose: "Закрыть",
    rearrangeTitle: "Порядок параметров",
    rearrangeDragMode: "Перетаскивание на странице",
    rearrangeSecCharts: "Графики",
    rearrangeSecChecks: "Параметры",
    rearrangeSecTabs: "Вкладки",
    rearrangeApplyAll: "Ко всем серверам",
    rearrangeReset: "Сброс",
    rearrangeDone: "✓ Готово",
    pruneDockerBtn: "Очистить Docker",
    runSpeedtestBtn: "Запустить Speedtest",
    updateAgentBtn: "Обновить агент",
    checkTitles: {
      ssh_auth: "SSH",
      firewall: "UFW",
      fail2ban: "F2B",
      open_ports: "Порты",
      users_priv: "Root",
      processes_integrity: "Проц",
      cron_timers: "04:00",
      kernel_sysctl: "Диск",
      inodes: "Inodes",
      disk_trend: "Прогноз",
      cpu_steal: "Steal",
      oom_reboot: "OOM",
    },
  },
  en: {
    secCol: "Shield",
    osCol: "OS / Kernel",
    tabChecks: "Stack",
    tabPorts: "Ports",
    tabDocker: "Docker & Disk",
    tabNet: "Speedtest",
    tabUpdates: "Updates",
    checkNow: "Check",
    updateNow: "Update",
    hide: "Hide",
    expand: "Expand",
    portPlaceholder: "Port (8080)",
    ipPlaceholder: "Anywhere / IP",
    commentPlaceholder: "Service",
    openPortBtn: "+ Open",
    closePortBtn: "✕ Close",
    openBtn: "Open",
    closeBtn: "Close",
    ufwOpen: "Open",
    ufwClosed: "Closed",
    ufwRestricted: "IP Only",
    listeningPorts: "Ports",
    ufwRules: "UFW",
    colPort: "Port",
    colService: "Service",
    colUfw: "UFW",
    colAction: "Action",
    colRule: "Rule",
    colFrom: "Source",
    pendingUpdates: "Pending",
    installedUpdates: "24h",
    noPending: "Up to date",
    noRecent: "None",
    colPkg: "Package",
    colOld: "Old",
    colNew: "New",
    colTime: "Time",
    catVpn: "VPN & Cores",
    catBots: "TG Bots",
    catServers: "Servers & Web",
    catUtils: "Utils & MCP",
    rollbackNow: "↺ Rollback",
    autoRollbackOn: "Auto-Rollback: ON",
    snapshotCount: "Snapshot",
    cveMonitorOn: "CVE 10m",
    notifBtnTitle: "Notifications",
    notifPageTitle: "Notifications",
    scanPatchBtn: "Scan CVEs",
    backBtn: "← Back",
    kpiOpenVulns: "Open",
    kpiPatchedCves: "CVEs Fixed",
    kpiAutoUpdates: "Updates",
    filterAll: "All",
    filterVulns: "CVEs",
    filterUpdates: "Updates",
    allServers: "All",
    typeVulnPatched: "CVE",
    typeVulnDetected: "VULN",
    typeAutoUpdate: "UPD",
    typeAutoRollback: "ROLLBACK",
    emptyNotifs: "No events",
    openNotifsBtn: "Notifications",
    agentBtnTitle: "All-in-One Agent Installer",
    agentBtnLabel: "Agent",
    agentModalTitle: "All-in-One Beszel Agent Setup",
    agentModalSubtitle: "Install hardware monitoring, security audit, ports and CVE auto-patching in a single command.",
    agentCopyBtn: "Copy",
    agentCopiedBtn: "✓ Copied",
    agentFeatureHw: "Hardware metrics: CPU, memory, disks, network, Docker",
    agentFeatureSec: "Security audit: listening ports, UFW, fail2ban, SSH, SSL",
    agentFeatureCve: "CVE auto-patch: hourly vulnerability scanning with instant rollback",
    agentFeatureLive: "Instant actions: service control, IP banning, and live logs",
    agentClose: "Close",
    rearrangeTitle: "Rearrange Parameters",
    rearrangeDragMode: "On-Page Drag & Drop",
    rearrangeSecCharts: "Charts",
    rearrangeSecChecks: "Parameters",
    rearrangeSecTabs: "Tabs",
    rearrangeApplyAll: "Apply to All",
    rearrangeReset: "Reset",
    rearrangeDone: "✓ Done",
    pruneDockerBtn: "Prune Docker",
    runSpeedtestBtn: "Run Speedtest",
    updateAgentBtn: "Update Agent",
    checkTitles: {
      ssh_auth: "SSH",
      firewall: "UFW",
      fail2ban: "F2B",
      open_ports: "Ports",
      users_priv: "Root",
      processes_integrity: "Procs",
      cron_timers: "04:00",
      kernel_sysctl: "Disk",
      inodes: "Inodes",
      disk_trend: "Trend",
      cpu_steal: "Steal",
      oom_reboot: "OOM",
    },
  },
};

const PROGRAM_INFO = {
  "3x-ui": {
    ru: "Панель управления прокси и VPN-протоколами (VLESS, VMess, Trojan, Shadowsocks) поверх ядра Xray. Отвечает за выдачу клиентских ключей, подписок, контроль трафика и TLS-сертификатов. Работает как постоянный системный сервис.",
    en: "Web control panel for managing proxy and VPN protocols (VLESS, VMess, Trojan, Shadowsocks) built on Xray. It handles client keys, subscription links, traffic accounting, and TLS certificates. Runs continuously as a background systemd service.",
  },
  xray: {
    ru: "Высокопроизводительное сетевое ядро маршрутизации и обхода блокировок (VLESS Reality, XTLS, SOCKS/HTTP). Принимает и перенаправляет зашифрованный трафик клиентов с маскировкой под обычный веб-трафик.",
    en: "High-performance network routing and circumvention core supporting VLESS Reality, XTLS, and SOCKS/HTTP. It processes and forwards encrypted client connections while disguising traffic as standard HTTPS.",
  },
  "amnezia-awg": {
    ru: "Контейнер AmneziaWG, модифицированная версия протокола WireGuard с защитой от глубокого анализа пакетов (DPI). Меняет заголовки и размер рукопожатий, чтобы VPN-трафик не распознавался провайдерами.",
    en: "AmneziaWG container running an obfuscated version of the WireGuard protocol with Deep Packet Inspection (DPI) resistance. It randomizes packet headers and handshake sizes so VPN traffic is not fingerprinted by ISPs.",
  },
  wireguard: {
    ru: "Быстрый VPN-туннель на уровне ядра Linux (интерфейс wg0). Используется для защищенного соединения между узлами и клиентскими устройствами с минимальной задержкой.",
    en: "Fast Linux kernel-level VPN tunnel (wg0 interface). It provides encrypted point-to-point and client connectivity with minimal latency and low CPU overhead.",
  },
  headscale: {
    ru: "Собственный сервер управления координацией узлов Tailscale (self-hosted control plane). Позволяет объединять серверы и устройства в закрытую mesh-сеть без использования облака Tailscale.",
    en: "Self-hosted coordination server for the Tailscale mesh network. It connects your servers and client devices into a private encrypted mesh network without relying on Tailscale's cloud control plane.",
  },
  tailscale: {
    ru: "Клиент mesh-сети на базе WireGuard для прямого доступа между серверами и устройствами за NAT. Автоматически держит зашифрованные p2p-соединения внутри вашей инфраструктуры.",
    en: "WireGuard-based mesh VPN client providing direct connectivity between servers and devices behind NAT. It automatically maintains encrypted peer-to-peer links across your infrastructure.",
  },
  dnscrypt: {
    ru: "Два локальных шифрующих DNS-прокси (anon и fast) с поддержкой DoH и DNSCrypt. Защищают DNS-запросы сервера и VPN-клиентов от перехвата, подмены и утечек провайдерам.",
    en: "Dual local encrypted DNS proxies (anon and fast) supporting DNS-over-HTTPS and DNSCrypt. They protect server and VPN client DNS lookups from spoofing, interception, and ISP leaks.",
  },
  tor: {
    ru: "Локальный SOCKS-прокси и демон сети Tor (порт 9050). Используется сервисами и скриптами на сервере для маршрутизации отдельных исходящих запросов через цепочку узлов Tor.",
    en: "Local Tor network daemon and SOCKS proxy listening on port 9050. It allows server applications and scripts to route specific outbound requests through the Tor onion network.",
  },
  trusttunnel: {
    ru: "Клиент и эндпоинт защищенного туннелирования TrustTunnel в каталоге /opt/trusttunnel. На данный момент установлен на диске в качестве резервного инструмента, но в фоне не запущен.",
    en: "TrustTunnel secure endpoint binary installed in /opt/trusttunnel. It is currently kept on disk as a standby tunneling tool and is not running in the background.",
  },  vaultwarden: {
    ru: "Собственный защищенный сервер менеджера паролей Bitwarden (Vaultwarden в Docker). Хранит пароли, ключи и секреты в зашифрованном виде под вашим полным контролем.",
    en: "Self-hosted Bitwarden-compatible password manager server (Vaultwarden in Docker). It stores your encrypted vault, credentials, and secrets under your own infrastructure.",
  },
  "open-design": {
    ru: "Контейнер платформы Open Design для работы с дизайн-макетами и графическими ассетами. Крутится в Docker с постоянной проверкой состояния (healthcheck).",
    en: "Open Design platform container for inspecting and managing design files and visual assets. Runs in Docker with continuous health monitoring.",
  },
  microbin: {
    ru: "Легковесный приватный pastebin-сервис и файлообменник MicroBin в Docker. Позволяет быстро и безопасно делиться фрагментами кода, конфигами и временными ссылками.",
    en: "Lightweight self-hosted pastebin and file-sharing service (MicroBin in Docker). Used for securely sharing code snippets, configs, and expiring links.",
  },
  jesse: {
    ru: "Алгоритмический фреймворк Jesse для бэктестинга и автоматической крипто-торговли. Контейнер сохранен на сервере, но сейчас остановлен (запускается по необходимости).",
    en: "Jesse algorithmic crypto trading and backtesting framework. The Docker container is preserved on the server and is currently stopped until needed.",
  },
  "beszel-hub": {
    ru: "Центральный сервер мониторинга Beszel Hub вместе с модулем безопасности и управления портами (beszel-security-hub). Собирает метрики со всех подключенных серверов, проверяет стек и координирует ежедневные обновления безопасности.",
    en: "Central Beszel Hub monitoring server paired with the beszel-security-hub API. It aggregates real-time metrics across all connected servers, audits the software stack, and coordinates daily automated security updates.",
  },
  "beszel-agent": {
    ru: "Легковесный агент мониторинга Beszel, передающий в реальном времени загрузку CPU, памяти, диска, сети и список доступных обновлений в центральный хаб.",
    en: "Lightweight Beszel monitoring agent streaming real-time CPU, RAM, disk, network, and package update telemetry back to the central Beszel Hub.",
  },
  caddy: {
    ru: "Современный веб-сервер и обратный прокси Caddy с автоматическим выпуском и продлением SSL/TLS сертификатов (Let's Encrypt и QUIC/HTTP3). Принимает внешний HTTPS-трафик на портах 80/443 и направляет его на внутренние сервисы.",
    en: "Modern web server and reverse proxy with automatic HTTPS certificate provisioning and HTTP/3 support. It terminates public TLS traffic on ports 80/443 and routes requests to internal apps.",
  },
  nginx: {
    ru: "Высокопроизводительный обратный прокси Nginx (включая шлюз beszel-gateway и acme-companion). Маршрутизирует трафик контейнеров и встраивает панель безопасности прямо в интерфейс Beszel.",
    en: "High-performance Nginx reverse proxy (including beszel-gateway and acme-companion). It routes container traffic and injects the custom security and stack UI directly into Beszel.",
  },
  postgres: {
    ru: "Реляционная база данных PostgreSQL (системный кластер и Docker-контейнеры для ботов и сервисов). Хранит основные данные пользователей, транзакций и приложений.",
    en: "PostgreSQL relational database server (both host cluster and Docker instances). It stores persistent user data, bot state, and application records.",
  },
  redis: {
    ru: "Быстрое хранилище данных в оперативной памяти Redis. Используется ботами и веб-сервисами для кэширования, очередей задач, сессий и rate-лимитов.",
    en: "In-memory Redis data store used by bots and web apps for fast caching, job queues, user sessions, and rate limiting.",
  },
  docker: {
    ru: "Демон контейнеризации Docker Engine. Обеспечивает изолированный запуск контейнеров (VPN-ядер, ботов, баз данных и веб-сервисов) с автоматическим перезапуском.",
    en: "Docker Engine container runtime managing isolated containers across VPN cores, bots, databases, and web services with automatic restart policies.",
  },
  fail2ban: {
    ru: "Система защиты от перебора паролей и сетевых атак (Fail2ban). Анализирует системные логи в реальном времени и автоматически блокирует IP-адреса злоумышленников в файрволе.",
    en: "Intrusion prevention daemon (Fail2ban) that scans authentication logs in real time and automatically bans offending IP addresses in the firewall.",
  },
  ufw: {
    ru: "Межсетевой экран Uncomplicated Firewall (UFW), управляющий правилами фильтрации пакетов Netfilter/iptables. Блокирует все неразрешенные входящие подключения и управляется прямо из вкладки Порты.",
    en: "Uncomplicated Firewall (UFW) managing host packet filtering rules. It blocks unauthorized inbound connections and is controlled directly from the Ports tab.",
  },
  "youtube-mcp": {
    ru: "Постоянно работающий MCP-сервер YouTube в Docker. Позволяет AI-агентам искать видео, получать транскрипты, метаданные каналов и управлять плейлистами YouTube.",
    en: "Always-on YouTube Model Context Protocol (MCP) server running in Docker. It enables AI agents to search videos, fetch transcripts, inspect channel metadata, and manage playlists.",
  },
  "tiktok-mcp": {
    ru: "Постоянный MCP-сервер для работы с TikTok, Instagram и Threads (порт 8770, плюс таймер автообновления yt-dlp). Дает AI-агентам доступ к видео, постам и расшифровкам роликов.",
    en: "Persistent MCP server for TikTok, Instagram, and Threads (port 8770, paired with an automatic yt-dlp update timer). It lets AI agents fetch videos, posts, and transcripts.",
  },
  "tryhackme-mcp": {
    ru: "Постоянный MCP-сервер платформы кибербезопасности TryHackMe (порт 8775). Позволяет AI-агентам получать задания комнат, описания уязвимостей и учебные материалы TryHackMe.",
    en: "Persistent Model Context Protocol server for TryHackMe (port 8775). It allows AI agents to query cybersecurity rooms, tasks, and training labs.",
  },
  "playwright-mcp": {
    ru: "On-demand MCP-сервер браузерной автоматизации Playwright (слушает сокет на порту 8784). В режиме ожидания не тратит оперативную память: прокси автоматически запускает браузерный сервер только в момент реального запроса и выключает его через 5 минут простоя.",
    en: "On-demand Playwright browser automation MCP server listening on socket port 8784. To save RAM, the socket proxy automatically launches the service only when an actual request arrives and shuts it down after 5 minutes of inactivity.",
  },
  "github-mcp": {
    ru: "On-demand MCP-сервер для работы с репозиториями, пулл-реквестами и задачами GitHub (сокет на порту 8782). Запускается автоматически только при входящем запросе от AI-агента и засыпает через 5 минут бездействия.",
    en: "On-demand GitHub MCP server for managing repositories, pull requests, and issues (socket port 8782). It wakes up automatically when an AI agent sends a request and sleeps after 5 minutes of idle time.",
  },
  "firebase-mcp": {
    ru: "On-demand MCP-сервер Firebase Tools (сокет на порту 8783) для управления проектами Firebase, Firestore и хостингом. Активируется прокси-сокетом только на время выполнения реального запроса и отключается через 5 минут простоя.",
    en: "On-demand Firebase Tools MCP server (socket port 8783) for managing Firebase projects, Firestore, and hosting. Activated by its systemd socket only during live requests and stops after 5 minutes idle.",
  },
  "google-mcp": {
    ru: "On-demand MCP-сервер поисковой выдачи Google Search (сокет на порту 8781). Прокси держит порт открытым и поднимает процесс поиска только при реальном обращении агента, освобождая ресурсы через 5 минут.",
    en: "On-demand Google Search MCP server listening on socket port 8781. Its socket proxy spawns the search process only when a real query arrives and frees memory after 5 minutes idle.",
  },
  "pg-sync": {
    ru: "Фоновый контейнер синхронизации данных между локальными базами SQLite и сервером PostgreSQL (sqlite_pg_sync). Обеспечивает актуальность резервных копий и аналитических таблиц.",
    en: "Background container synchronizing records between local SQLite databases and PostgreSQL (sqlite_pg_sync). Keeps analytical tables and backups continuously in sync.",
  },
};

function decodeDomainPunycode(str) {
  if (!str) return "";
  const s = String(str).trim();
  if (!s.includes("xn--")) return s;
  return s.replace(/xn--[a-z0-9-]+/gi, (part) => {
    const p = part.toLowerCase();
    if (p === "xn--80aam7av" || p === "xn---80aam7av") return "насад";
    return part;
  });
}

function getInitialLang() {
  const beszelLang = localStorage.getItem("lang");
  if (beszelLang) {
    return beszelLang.toLowerCase().startsWith("en") ? "en" : "ru";
  }
  const saved = localStorage.getItem("bszl_sec_lang") || (document.documentElement.lang || "ru");
  return saved.toLowerCase().startsWith("en") ? "en" : "ru";
}

const DEFAULT_CHARTS_ORDER = [
  "cpu",
  "docker_cpu",
  "memory",
  "docker_memory",
  "disk",
  "disk_io",
  "bandwidth",
  "docker_net",
  "swap",
  "load",
];

const DEFAULT_CHECKS_ORDER = [
  "ssh_auth",
  "firewall",
  "fail2ban",
  "open_ports",
  "users_priv",
  "processes_integrity",
  "cron_timers",
  "kernel_sysctl",
  "inodes",
  "disk_trend",
  "cpu_steal",
  "oom_reboot",
];

const DEFAULT_CATS_ORDER = ["vpn", "bots", "servers", "utils"];

const DEFAULT_TABS_ORDER = ["overview", "ports", "docker", "net", "updates"];

const CHART_LABELS = {
  cpu: { ru: "CPU (Процессор)", en: "CPU Usage" },
  docker_cpu: { ru: "Docker CPU", en: "Docker CPU Usage" },
  memory: { ru: "Память (RAM)", en: "Memory Usage" },
  docker_memory: { ru: "Docker Память", en: "Docker Memory Usage" },
  disk: { ru: "Диск (Root Usage)", en: "Disk Usage" },
  disk_io: { ru: "Диск I/O (Root I/O)", en: "Disk I/O" },
  bandwidth: { ru: "Сеть (Bandwidth)", en: "Bandwidth" },
  docker_net: { ru: "Docker Сеть I/O", en: "Docker Network I/O" },
  swap: { ru: "Swap (Подкачка)", en: "Swap Usage" },
  load: { ru: "Нагрузка (Load Average)", en: "Load Average" },
};

function loadInitialLayouts() {
  try {
    const raw = localStorage.getItem("bszl_server_layouts_v1");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch (e) {
    // Ignore
  }
  return {};
}

const state = {
  lang: getInitialLang(),
  panelCollapsed: localStorage.getItem("bszl_sec_panel_collapsed") === "1",
  checksStripExpanded: localStorage.getItem("bszl_checks_expanded") === "1",
  reports: {},
  layouts: loadInitialLayouts(),
  rearrangeMode: false,
  rearrangeMenuTab: "charts",
  dragSourceType: null,
  dragSourceId: null,
  notifications: [],
  unreadCount: 0,
  notificationsPageOpen: window.location.hash === "#notifications",
  notifFilterType: "all",
  notifFilterServer: "all",
  expandedNotifIds: {},
  scanPatchBusy: false,
  seenNotifIds: null,
  activeTabBySystem: {},
  selectedProgramId: null,
  loadingSystem: null,
  portBusyKey: null,
  serviceBusyKey: null,
  configBusyKey: null,
  clickDebounceTimer: null,
  portFeedback: {},
  portFormDraft: { port: "", proto: "tcp", from_ip: "Anywhere", comment: "" },
  beszelCoreMod: null,
  flagAnimTimer: null,
  lastFaviconState: null,
};

function getDefaultServerLayout() {
  return {
    panelPos: "top",
    chartsOrder: [...DEFAULT_CHARTS_ORDER],
    hiddenCharts: [],
    checksOrder: [...DEFAULT_CHECKS_ORDER],
    hiddenChecks: [],
    catsOrder: [...DEFAULT_CATS_ORDER],
    hiddenCats: [],
    tabsOrder: [...DEFAULT_TABS_ORDER],
    hiddenTabs: [],
    itemsOrder: [],
  };
}

function normalizeOrder(arr, defaults) {
  const valid = Array.isArray(arr) ? arr.filter((x) => typeof x === "string" && x.length > 0) : [];
  for (const d of defaults) {
    if (!valid.includes(d)) valid.push(d);
  }
  return valid;
}

function getServerLayout(sysId) {
  const base = getDefaultServerLayout();
  const saved = (sysId && state.layouts[sysId]) || state.layouts._default || null;
  if (!saved || typeof saved !== "object") return base;
  return {
    panelPos: saved.panelPos === "bottom" ? "bottom" : "top",
    chartsOrder: normalizeOrder(saved.chartsOrder, DEFAULT_CHARTS_ORDER),
    hiddenCharts: Array.isArray(saved.hiddenCharts) ? [...saved.hiddenCharts] : [],
    checksOrder: normalizeOrder(saved.checksOrder, DEFAULT_CHECKS_ORDER),
    hiddenChecks: Array.isArray(saved.hiddenChecks) ? [...saved.hiddenChecks] : [],
    catsOrder: normalizeOrder(saved.catsOrder, DEFAULT_CATS_ORDER),
    hiddenCats: Array.isArray(saved.hiddenCats) ? [...saved.hiddenCats] : [],
    tabsOrder: normalizeOrder(saved.tabsOrder, DEFAULT_TABS_ORDER),
    hiddenTabs: Array.isArray(saved.hiddenTabs) ? [...saved.hiddenTabs] : [],
    itemsOrder: Array.isArray(saved.itemsOrder) ? [...saved.itemsOrder] : [],
  };
}

function persistLayoutsLocally() {
  try {
    localStorage.setItem("bszl_server_layouts_v1", JSON.stringify(state.layouts));
  } catch (e) {
    // Ignore
  }
}

function closeOpenRadixMenus() {
  try {
    const settingsBtn = document.querySelector("svg.lucide-settings2")?.closest("button");
    if (settingsBtn && settingsBtn.getAttribute("data-state") === "open") {
      settingsBtn.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0, ctrlKey: false }));
    } else if (document.querySelector('[role="menu"][data-state="open"]')) {
      document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0 }));
    }
    if (document.body.style.pointerEvents === "none") {
      document.body.style.pointerEvents = "";
    }
  } catch (e) {
    // Ignore
  }
}

function exitRearrangeMode() {
  state.rearrangeMode = false;
  closeOpenRadixMenus();
  const panel = document.getElementById("bszl-server-security-panel");
  if (panel) panel.removeAttribute("data-render-key");
  const gridWrapper = document.querySelector("div.grid.gap-4.mb-14");
  if (gridWrapper) gridWrapper.removeAttribute("data-bszl-applied-layout");
  const menuBox = document.getElementById("bszl-rearrange-menu");
  if (menuBox) menuBox.removeAttribute("data-rkey");
  document.querySelectorAll(".bszl-rearrange-banner").forEach((el) => el.remove());
  document.querySelectorAll(".bszl-chart-drag-bar").forEach((el) => el.remove());
  document.querySelectorAll(".bszl-rearrange-active-card").forEach((el) => {
    el.classList.remove("bszl-rearrange-active-card");
    el.removeAttribute("draggable");
  });
  renderAll();
}

async function saveServerLayout(sysId, nextLayout, applyToAll = false) {
  if (!sysId) return;
  const clean = {
    panelPos: nextLayout.panelPos === "bottom" ? "bottom" : "top",
    chartsOrder: normalizeOrder(nextLayout.chartsOrder, DEFAULT_CHARTS_ORDER),
    hiddenCharts: Array.isArray(nextLayout.hiddenCharts) ? [...nextLayout.hiddenCharts] : [],
    checksOrder: normalizeOrder(nextLayout.checksOrder, DEFAULT_CHECKS_ORDER),
    hiddenChecks: Array.isArray(nextLayout.hiddenChecks) ? [...nextLayout.hiddenChecks] : [],
    catsOrder: normalizeOrder(nextLayout.catsOrder, DEFAULT_CATS_ORDER),
    hiddenCats: Array.isArray(nextLayout.hiddenCats) ? [...nextLayout.hiddenCats] : [],
    tabsOrder: normalizeOrder(nextLayout.tabsOrder, DEFAULT_TABS_ORDER),
    hiddenTabs: Array.isArray(nextLayout.hiddenTabs) ? [...nextLayout.hiddenTabs] : [],
    itemsOrder: Array.isArray(nextLayout.itemsOrder) ? [...nextLayout.itemsOrder] : [],
  };
  state.layouts[sysId] = clean;
  if (applyToAll) {
    state.layouts._default = JSON.parse(JSON.stringify(clean));
    for (const k of Object.keys(state.reports)) {
      state.layouts[k] = JSON.parse(JSON.stringify(clean));
    }
  }
  persistLayoutsLocally();
  const panel = document.getElementById("bszl-server-security-panel");
  if (panel) panel.removeAttribute("data-render-key");
  const gridWrapper = document.querySelector("div.grid.gap-4.mb-14");
  if (gridWrapper) gridWrapper.removeAttribute("data-bszl-applied-layout");
  const menuBox = document.getElementById("bszl-rearrange-menu");
  if (menuBox) menuBox.removeAttribute("data-rkey");
  renderAll();

  try {
    await fetch("/api/security-layout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_id: applyToAll ? "all" : sysId,
        layout: clean,
      }),
    });
  } catch (e) {
    // Ignore
  }
}

function resetServerLayout(sysId) {
  const def = getDefaultServerLayout();
  saveServerLayout(sysId, def, false);
}

function moveArrayItem(arr, item, dirOrTargetId) {
  const list = [...arr];
  const fromIdx = list.indexOf(item);
  if (fromIdx === -1) return list;
  if (typeof dirOrTargetId === "number") {
    const toIdx = fromIdx + dirOrTargetId;
    if (toIdx < 0 || toIdx >= list.length) return list;
    const [removed] = list.splice(fromIdx, 1);
    list.splice(toIdx, 0, removed);
    return list;
  }
  const targetIdx = list.indexOf(dirOrTargetId);
  if (targetIdx === -1 || targetIdx === fromIdx) return list;
  const [removed] = list.splice(fromIdx, 1);
  list.splice(targetIdx, 0, removed);
  return list;
}

function toggleHiddenItem(hiddenList, id, allList) {
  const set = new Set(Array.isArray(hiddenList) ? hiddenList : []);
  if (set.has(id)) {
    set.delete(id);
  } else {
    if (allList && set.size >= allList.length - 1) {
      return Array.from(set);
    }
    set.add(id);
  }
  return Array.from(set);
}

function t(key) {
  return I18N[state.lang]?.[key] ?? I18N.ru[key] ?? key;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function syncBeszelNativeLang(lang) {
  try {
    if (!state.beszelCoreMod) {
      const mainScript = document.querySelector('script[type="module"][src*="/assets/index-"]');
      if (mainScript) {
        state.beszelCoreMod = await import(mainScript.getAttribute("src"));
      }
    }
    if (state.beszelCoreMod) {
      if (typeof state.beszelCoreMod.c5 === "function") {
        await state.beszelCoreMod.c5(lang);
      }
      if (typeof state.beszelCoreMod.ay === "function") {
        state.beszelCoreMod.ay({ lang });
      }
    }
  } catch (e) {
    // Ignore
  }
}

function playFlagAnimation(lang) {
  const flagSvg = lang === "en" ? ICONS.flagUS : ICONS.flagRU;
  if (state.flagAnimTimer) {
    clearTimeout(state.flagAnimTimer);
  }
  document.querySelectorAll(".bszl-lang-icon-btn").forEach((btn) => {
    const box = btn.querySelector(".bszl-lang-flag-box");
    if (box) box.innerHTML = flagSvg;
    btn.classList.remove("is-animating-flag");
    void btn.offsetWidth;
    btn.classList.add("is-animating-flag");
  });
  state.flagAnimTimer = setTimeout(() => {
    document.querySelectorAll(".bszl-lang-icon-btn").forEach((btn) => {
      btn.classList.remove("is-animating-flag");
    });
  }, 1160);
}

function normalizeRussianChartTitles() {
  if (state.lang !== "ru") return;
  const grid = document.querySelector("div.grid.xl\\:grid-cols-2.gap-4");
  if (!grid) return;
  grid.querySelectorAll("h3, p").forEach((el) => {
    if (el.children.length === 0 && !el.hasAttribute("data-bszl-norm")) {
      const t = el.textContent;
      let next = t;
      if (t.includes("Системный Использование")) {
        next = t.replace("Системный Использование", "Использование диска");
      } else if (t.includes("Ввод-вывод Системный")) {
        next = t.replace("Ввод-вывод Системный", "Ввод-вывод диска");
      } else if (t.includes("Использование диска системный")) {
        next = t.replace("Использование диска системный", "Использование системного диска");
      } else if (t.includes("Пропускная способность системный")) {
        next = t.replace("Пропускная способность системный", "Сетевой трафик системы");
      }
      if (next !== t) {
        el.textContent = next;
      }
      el.setAttribute("data-bszl-norm", "1");
    }
  });
}

async function setLanguage(lang) {
  const next = lang === "en" ? "en" : "ru";
  if (state.lang === next && localStorage.getItem("lang") === next) {
    document.querySelectorAll(".bszl-lang-menu.is-open").forEach((m) => m.classList.remove("is-open"));
    return;
  }
  state.lang = next;
  localStorage.setItem("bszl_sec_lang", next);
  localStorage.setItem("lang", next);
  document.documentElement.lang = next;

  try {
    const rawAuth = localStorage.getItem("pocketbase_auth");
    if (rawAuth) {
      const auth = JSON.parse(rawAuth);
      if (auth && auth.token) {
        const headers = {
          "Content-Type": "application/json",
          "Authorization": auth.token,
        };
        const settingsRes = await fetch("/api/collections/user_settings/records?perPage=1", { headers });
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          if (data.items && data.items.length > 0) {
            const item = data.items[0];
            await fetch(`/api/collections/user_settings/records/${item.id}`, {
              method: "PATCH",
              headers,
              body: JSON.stringify({ settings: { ...item.settings, lang: next } }),
            });
          }
        }
      }
    }
  } catch (e) {
    console.warn("Could not sync user_settings to PocketBase:", e);
  }

  try {
    await syncBeszelNativeLang(next);
  } catch (e) {}

  window.location.reload();
}

function togglePanelCollapsed() {
  state.panelCollapsed = !state.panelCollapsed;
  localStorage.setItem("bszl_sec_panel_collapsed", state.panelCollapsed ? "1" : "0");
  const panel = document.getElementById("bszl-server-security-panel");
  if (panel) panel.removeAttribute("data-render-key");
  renderAll();
}

function getReport(key) {
  if (!key) return null;
  if (state.reports[key]) return state.reports[key];
  const lower = String(key).toLowerCase();
  for (const rep of Object.values(state.reports)) {
    if (
      (rep.system_id && rep.system_id.toLowerCase() === lower) ||
      (rep.system_name && rep.system_name.toLowerCase() === lower) ||
      (rep.hostname && rep.hostname.toLowerCase() === lower)
    ) {
      return rep;
    }
  }
  return null;
}

function updateFaviconBadge() {
  let hasCrit = false;
  let hasWarn = false;
  for (const rep of Object.values(state.reports)) {
    const v = rep.vulnerabilities || rep.updates?.vulnerabilities || {};
    if ((v.open_vulns_count || 0) > 0 || rep.overall_status === "crit") {
      hasCrit = true;
    } else if (rep.overall_status === "warn") {
      hasWarn = true;
    }
  }
  const fState = hasCrit ? "crit" : hasWarn ? "warn" : "ok";
  if (state.lastFaviconState === fState) return;
  state.lastFaviconState = fState;
  try {
    let link = document.querySelector('link[rel*="icon"]');
    if (!link) return;
    const color = fState === "crit" ? "#ef4444" : fState === "warn" ? "#eab308" : "#10b981";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#18181b"/><path d="M16 5L7 9v7c0 6.2 3.8 11.8 9 13.5 5.2-1.7 9-7.3 9-13.5V9l-9-4z" fill="none" stroke="#e4e4e7" stroke-width="2.4"/><circle cx="24" cy="8" r="5.5" fill="${color}" stroke="#18181b" stroke-width="2"/></svg>`;
    link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  } catch (e) {
    // Ignore
  }
}

function applyReportsPayload(data) {
  if (!data) return;
  if (data.systems) {
    state.reports = data.systems;
  }
  if (data.layouts && typeof data.layouts === "object") {
    let changed = false;
    for (const [k, v] of Object.entries(data.layouts)) {
      if (!state.layouts[k] && v && typeof v === "object") {
        state.layouts[k] = v;
        changed = true;
      }
    }
    if (changed) persistLayoutsLocally();
  }
  updateFaviconBadge();
  if (Array.isArray(data.notifications)) {
    const incoming = data.notifications;
    if (state.seenNotifIds === null) {
      state.seenNotifIds = new Set(incoming.map((n) => n.id));
    } else {
      for (const n of incoming) {
        if (n.id && !state.seenNotifIds.has(n.id)) {
          state.seenNotifIds.add(n.id);
          const isEn = state.lang === "en";
          const title = `${n.system_name || ""} · ${isEn ? n.title_en || n.title_ru : n.title_ru || n.title_en}`;
          const desc = isEn ? n.summary_en || n.summary_ru : n.summary_ru || n.summary_en;
          const tag =
            n.type === "vuln_patched"
              ? "CVE PATCH"
              : n.type === "vuln_detected"
              ? "CVE"
              : n.type === "auto_rollback"
              ? "ROLLBACK"
              : "UPDATE";
          const stType =
            n.type === "vuln_detected" || n.type === "auto_rollback"
              ? "stopped"
              : n.type === "vuln_patched"
              ? "running"
              : "ondemand";
          showOverlayToast({ title, tagText: tag, statusType: stType, desc });
        }
      }
    }
    state.notifications = incoming;
    state.unreadCount =
      typeof data.unread_count === "number"
        ? data.unread_count
        : incoming.filter((n) => !n.read).length;
  }
}

async function fetchReports() {
  try {
    const res = await fetch("/api/security-reports", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    applyReportsPayload(data);
    renderAll();
  } catch (e) {
    // Ignore
  }
}

async function triggerAgentConfigUpdate(systemId, partialCfg) {
  if (!systemId || state.configBusyKey) return;
  const key = Object.keys(partialCfg)[0] || "cfg";
  state.configBusyKey = `${systemId}:${key}`;
  const panel = document.getElementById("bszl-server-security-panel");
  if (panel) panel.removeAttribute("data-render-key");
  renderSystemDetailPage();
  try {
    const res = await fetch("/api/security-agent-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system_id: systemId, config: partialCfg }),
    });
    const data = await res.json();
    if (data.reports && data.reports.systems) {
      applyReportsPayload(data.reports);
    } else {
      await fetchReports();
    }
    const rep = getReport(systemId);
    showOverlayToast({
      title: rep?.system_name || systemId,
      tagText: data.ok ? "CFG" : "ERR",
      statusType: data.ok ? "running" : "stopped",
      desc:
        state.lang === "en"
          ? `Agent setting updated (${key})`
          : `Настройка агента обновлена (${key})`,
    });
  } catch (e) {
    console.error(e);
  } finally {
    state.configBusyKey = null;
    const p = document.getElementById("bszl-server-security-panel");
    if (p) p.removeAttribute("data-render-key");
    renderAll();
  }
}

async function markNotificationsRead() {
  try {
    state.unreadCount = 0;
    state.notifications.forEach((n) => (n.read = true));
    renderTopNavbarLangSwitcher();
    const res = await fetch("/api/security-notifications-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark_read" }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.reports) applyReportsPayload(data.reports);
      renderAll();
    }
  } catch (e) {
    // Ignore
  }
}

async function triggerVulnScanAndPatch(systemId = "all") {
  if (state.scanPatchBusy) return;
  state.scanPatchBusy = true;
  const npage = document.getElementById("bszl-notifications-page");
  if (npage) npage.removeAttribute("data-render-key");
  renderAll();
  try {
    const res = await fetch("/api/security-notifications-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "scan_patch", system_id: systemId }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.reports) applyReportsPayload(data.reports);
      const isEn = state.lang === "en";
      showOverlayToast({
        title: isEn ? "CVE Scan & Instant Patch" : "Проверка CVE и мгновенный патч",
        tagText: "OK",
        statusType: "running",
        desc: isEn
          ? "Checked all servers for vulnerabilities and applied available security patches."
          : "Проверены все серверы на уязвимости, доступные патчи безопасности установлены.",
      });
    }
  } catch (e) {
    console.error(e);
  } finally {
    state.scanPatchBusy = false;
    const np = document.getElementById("bszl-notifications-page");
    if (np) np.removeAttribute("data-render-key");
    const panel = document.getElementById("bszl-server-security-panel");
    if (panel) panel.removeAttribute("data-render-key");
    renderAll();
  }
}

async function triggerNotificationRollback(notif) {
  if (!notif || state.rollbackNotifBusyId) return;
  state.rollbackNotifBusyId = notif.id;
  const npage = document.getElementById("bszl-notifications-page");
  if (npage) npage.removeAttribute("data-render-key");
  renderAll();
  try {
    const res = await fetch("/api/security-notifications-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "rollback_notif",
        id: notif.id,
        system_id: notif.system_id,
        packages: notif.packages || [],
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.reports) applyReportsPayload(data.reports);
      const isEn = state.lang === "en";
      showOverlayToast({
        title: notif.system_name || notif.system_id,
        tagText: data.ok ? "ROLLBACK" : "ERR",
        statusType: data.ok ? "running" : "stopped",
        desc: data.ok
          ? isEn
            ? `Patch rolled back (${data.message || "OK"})`
            : `Патч откачен (${data.message || "OK"})`
          : isEn
          ? `Rollback error: ${data.message || "failed"}`
          : `Ошибка отката: ${data.message || "сбой"}`,
      });
    }
  } catch (e) {
    console.error(e);
  } finally {
    state.rollbackNotifBusyId = null;
    const np = document.getElementById("bszl-notifications-page");
    if (np) np.removeAttribute("data-render-key");
    const panel = document.getElementById("bszl-server-security-panel");
    if (panel) panel.removeAttribute("data-render-key");
    renderAll();
  }
}

function toggleNotificationsPage(forceState, filterServer = null) {
  const next = typeof forceState === "boolean" ? forceState : !state.notificationsPageOpen;
  state.notificationsPageOpen = next;
  if (filterServer) {
    state.notifFilterServer = filterServer;
  }
  if (next) {
    if (window.location.hash !== "#notifications") {
      history.pushState(null, "", "#notifications");
    }
    if (state.unreadCount > 0) {
      markNotificationsRead();
    }
  } else if (window.location.hash === "#notifications") {
    history.pushState(null, "", window.location.pathname + window.location.search);
  }
  const npage = document.getElementById("bszl-notifications-page");
  if (npage) npage.removeAttribute("data-render-key");
  renderAll();
}

function updateToastStackLayout() {
  const stack = document.getElementById("bszl-toast-stack");
  if (!stack) return;
  const cards = Array.from(stack.querySelectorAll(".bszl-toast-card:not(.is-leaving)"));
  cards.forEach((card, idx) => {
    const revIdx = cards.length - 1 - idx;
    if (revIdx === 0) {
      card.style.transform = "translateY(0) scale(1)";
      card.style.opacity = "1";
      card.style.zIndex = "50";
    } else if (revIdx <= 2) {
      card.style.transform = `translateY(${revIdx * 10}px) scale(${1 - revIdx * 0.035})`;
      card.style.opacity = String(Math.max(0.35, 1 - revIdx * 0.28));
      card.style.zIndex = String(50 - revIdx);
    } else {
      card.classList.add("is-leaving");
      setTimeout(() => card.remove(), 180);
    }
  });
}

function showOverlayToast({ title, tagText = "ON", statusType = "running", desc = "", progId = null }) {
  let stack = document.getElementById("bszl-toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.id = "bszl-toast-stack";
    document.body.appendChild(stack);
  }

  const isOn = statusType === "running" || statusType === "ok";
  const isOd = statusType === "ondemand";
  const dotCls = isOn ? "bszl-dot--ok" : isOd ? "bszl-dot--ondemand" : "bszl-dot--crit";
  const tagCls = isOn ? "bszl-svc-tag--on" : isOd ? "bszl-svc-tag--ondemand" : "bszl-svc-tag--off";
  const barCls = isOn
    ? "bszl-toast-progress-bar--ok"
    : isOd
    ? "bszl-toast-progress-bar--ondemand"
    : "bszl-toast-progress-bar--crit";

  const card = document.createElement("div");
  card.className = "bszl-toast-card";
  card.innerHTML = `
    <div style="flex:1;min-width:0;">
      <div class="bszl-prog-info-title">
        <span class="bszl-dot ${dotCls}"></span>
        <span>${escapeHtml(title)}</span>
        ${tagText ? `<span class="bszl-svc-tag ${tagCls}">${escapeHtml(tagText)}</span>` : ""}
      </div>
      <div class="bszl-prog-info-desc">${escapeHtml(desc)}</div>
    </div>
    <button type="button" class="bszl-prog-info-close" title="Close">✕</button>
    <div class="bszl-toast-progress">
      <div class="bszl-toast-progress-bar ${barCls}"></div>
    </div>
  `;

  let dismissed = false;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    if (progId && state.selectedProgramId === progId) {
      state.selectedProgramId = null;
      const p = document.getElementById("bszl-server-security-panel");
      if (p) p.removeAttribute("data-render-key");
      renderSystemDetailPage();
    }
    card.classList.add("is-leaving");
    updateToastStackLayout();
    setTimeout(() => {
      card.remove();
      updateToastStackLayout();
    }, 200);
  };

  const closeBtn = card.querySelector(".bszl-prog-info-close");
  if (closeBtn) closeBtn.onclick = dismiss;

  stack.appendChild(card);
  updateToastStackLayout();
  setTimeout(dismiss, 3000);
}

async function triggerAudit(systemId = "all", mode = "check") {
  if (state.loadingSystem) return;
  state.loadingSystem = `${systemId}:${mode}`;
  const panel = document.getElementById("bszl-server-security-panel");
  if (panel) panel.removeAttribute("data-render-key");
  renderAll();
  try {
    const res = await fetch("/api/security-trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system_id: systemId, mode }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.reports && data.reports.systems) {
        applyReportsPayload(data.reports);
      } else {
        await fetchReports();
      }
      const rep = getReport(systemId);
      const srvName = rep?.system_name || systemId;
      const srvMsg = data.results?.[systemId]?.message || "";
      const modeTitle =
        mode === "rollback"
          ? state.lang === "en"
            ? `Rollback completed ${srvMsg ? `(${srvMsg})` : ""}`
            : `Откат выполнен ${srvMsg ? `(${srvMsg})` : ""}`
          : mode === "docker_update"
          ? state.lang === "en"
            ? `Docker updated ${srvMsg ? `(${srvMsg})` : ""}`
            : `Docker проверен и обновлен ${srvMsg ? `(${srvMsg})` : ""}`
          : mode === "docker_rollback"
          ? state.lang === "en"
            ? `Docker rolled back ${srvMsg ? `(${srvMsg})` : ""}`
            : `Откат Docker выполнен ${srvMsg ? `(${srvMsg})` : ""}`
          : mode === "docker_prune"
          ? state.lang === "en"
            ? `Docker cache & unused images pruned ${srvMsg ? `(${srvMsg})` : ""}`
            : `Кэш и неиспользуемые образы Docker очищены ${srvMsg ? `(${srvMsg})` : ""}`
          : mode === "speedtest"
          ? state.lang === "en"
            ? `Speedtest completed ${srvMsg ? `(${srvMsg})` : ""}`
            : `Speedtest завершен ${srvMsg ? `(${srvMsg})` : ""}`
          : mode === "agent_update"
          ? state.lang === "en"
            ? `Agent updated from Hub ${srvMsg ? `(${srvMsg})` : ""}`
            : `Агент обновлен с хаба ${srvMsg ? `(${srvMsg})` : ""}`
          : mode === "disk_cleanup"
          ? state.lang === "en"
            ? `Disk cleaned ${srvMsg ? `(${srvMsg})` : ""}`
            : `Диск очищен ${srvMsg ? `(${srvMsg})` : ""}`
          : mode === "update"
          ? state.lang === "en"
            ? "Packages updated"
            : "Пакеты обновлены"
          : state.lang === "en"
          ? "Security check completed"
          : "Проверка завершена";
      showOverlayToast({
        title: srvName,
        tagText: "OK",
        statusType: "running",
        desc: modeTitle,
      });
    }
  } catch (e) {
    console.error(e);
  } finally {
    state.loadingSystem = null;
    const p = document.getElementById("bszl-server-security-panel");
    if (p) p.removeAttribute("data-render-key");
    renderAll();
  }
}

async function triggerPortAction(systemId, payload, busyKey) {
  if (state.portBusyKey) return;
  state.portBusyKey = busyKey || "port";
  const panel = document.getElementById("bszl-server-security-panel");
  if (panel) panel.removeAttribute("data-render-key");
  renderSystemDetailPage();
  try {
    const res = await fetch("/api/security-port", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system_id: systemId, ...payload }),
    });
    const data = await res.json();
    if (data.reports && data.reports.systems) {
      applyReportsPayload(data.reports);
    } else {
      await fetchReports();
    }
    const msg = data.message || (data.ok ? "OK" : "Error");
    state.portFeedback[systemId] = {
      ok: !!data.ok,
      msg,
      ts: Date.now(),
    };
    showOverlayToast({
      title: `UFW · ${payload.port || "#" + (payload.rule_num || "")}`,
      tagText: data.ok ? "OK" : "ERR",
      statusType: data.ok ? "running" : "stopped",
      desc: msg,
    });
  } catch (e) {
    state.portFeedback[systemId] = { ok: false, msg: String(e), ts: Date.now() };
  } finally {
    state.portBusyKey = null;
    const p = document.getElementById("bszl-server-security-panel");
    if (p) p.removeAttribute("data-render-key");
    renderAll();
  }
}

async function triggerServiceToggle(systemId, serviceId, serviceName) {
  if (state.serviceBusyKey) return;
  const bKey = `${systemId}:${serviceId}`;
  state.serviceBusyKey = bKey;
  const panel = document.getElementById("bszl-server-security-panel");
  if (panel) panel.removeAttribute("data-render-key");
  renderSystemDetailPage();
  try {
    const res = await fetch("/api/security-service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system_id: systemId, service_id: serviceId, action: "toggle" }),
    });
    const data = await res.json();
    if (data.reports && data.reports.systems) {
      applyReportsPayload(data.reports);
    } else {
      await fetchReports();
    }
    const rep = getReport(systemId);
    const updatedItem = (rep?.stack?.items || []).find((i) => i.id === serviceId);
    const newSt = updatedItem?.status || (data.ok ? "running" : "stopped");
    const isOn = newSt === "running";
    const isOd = newSt === "ondemand";
    const stTag = isOn ? "ON" : isOd ? (state.lang === "en" ? "On-Demand" : "По запросу") : "OFF";
    const desc = !data.ok
      ? data.message || "Error"
      : state.lang === "en"
      ? isOn || isOd
        ? `${serviceName} started and active.`
        : `${serviceName} stopped.`
      : isOn || isOd
      ? `Сервис ${serviceName} включен и работает.`
      : `Сервис ${serviceName} остановлен.`;
    showOverlayToast({
      title: serviceName,
      tagText: data.ok ? stTag : "ERR",
      statusType: data.ok ? newSt : "stopped",
      desc,
    });
  } catch (e) {
    showOverlayToast({
      title: serviceName,
      tagText: "ERR",
      statusType: "stopped",
      desc: String(e),
    });
  } finally {
    state.serviceBusyKey = null;
    const p = document.getElementById("bszl-server-security-panel");
    if (p) p.removeAttribute("data-render-key");
    renderAll();
  }
}

async function triggerServiceDelete(systemId, serviceId, serviceName) {
  if (state.serviceBusyKey) return;
  const bKey = `${systemId}:${serviceId}`;
  state.serviceBusyKey = bKey;
  const panel = document.getElementById("bszl-server-security-panel");
  if (panel) panel.removeAttribute("data-render-key");
  renderSystemDetailPage();
  try {
    const res = await fetch("/api/security-service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system_id: systemId, service_id: serviceId, action: "delete" }),
    });
    const data = await res.json();
    if (data.reports && data.reports.systems) {
      applyReportsPayload(data.reports);
    } else {
      await fetchReports();
    }
    const desc = !data.ok
      ? data.message || "Error"
      : state.lang === "en"
      ? `${serviceName} has been stopped and removed from this server.`
      : `Сервис ${serviceName} остановлен и удален с сервера.`;
    showOverlayToast({
      title: serviceName,
      tagText: data.ok ? (state.lang === "en" ? "DEL" : "УДАЛЕН") : "ERR",
      statusType: "stopped",
      desc,
    });
  } catch (e) {
    showOverlayToast({
      title: serviceName,
      tagText: "ERR",
      statusType: "stopped",
      desc: String(e),
    });
  } finally {
    state.serviceBusyKey = null;
    const p = document.getElementById("bszl-server-security-panel");
    if (p) p.removeAttribute("data-render-key");
    renderAll();
  }
}

function openAgentInstallModal() {
  const existing = document.getElementById("bszl-agent-modal-overlay");
  if (existing) existing.remove();

  const isEn = state.lang === "en";
  const origin = window.location.origin;
  const cmd = `curl -sL ${origin}/install-agent.sh | bash`;
  const overlay = document.createElement("div");
  overlay.id = "bszl-agent-modal-overlay";
  overlay.className = "bszl-dialog-overlay";
  overlay.innerHTML = `
    <div class="bszl-dialog-card" role="dialog" aria-modal="true">
      <div class="bszl-dialog-hdr">
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="bszl-ico" style="padding:6px;border-radius:6px;background:var(--muted);color:var(--foreground);">${ICONS.terminal}</span>
          <div>
            <div class="bszl-dialog-title">${escapeHtml(t("agentModalTitle"))}</div>
            <div class="bszl-dialog-desc">${escapeHtml(t("agentModalSubtitle"))}</div>
          </div>
        </div>
        <button type="button" class="bszl-dialog-close" title="Close">✕</button>
      </div>

      <div class="bszl-dialog-cmd-box">
        <div class="bszl-dialog-cmd-label">
          <span>Linux Bash 1-Liner</span>
          <span class="bszl-chip">Root / Sudo</span>
        </div>
        <div class="bszl-cmd-pre-wrap">
          <pre class="bszl-cmd-pre"><code>${escapeHtml(cmd)}</code></pre>
          <button type="button" class="bszl-cmd-copy-btn" id="bszl-agent-copy-btn">
            ${ICONS.copy}
            <span class="js-copy-text">${escapeHtml(t("agentCopyBtn"))}</span>
          </button>
        </div>
      </div>

      <div class="bszl-dialog-features">
        <div class="bszl-feat-item">
          <span class="bszl-feat-dot"></span>
          <span>${escapeHtml(t("agentFeatureHw"))}</span>
        </div>
        <div class="bszl-feat-item">
          <span class="bszl-feat-dot"></span>
          <span>${escapeHtml(t("agentFeatureSec"))}</span>
        </div>
        <div class="bszl-feat-item">
          <span class="bszl-feat-dot"></span>
          <span>${escapeHtml(t("agentFeatureCve"))}</span>
        </div>
        <div class="bszl-feat-item">
          <span class="bszl-feat-dot"></span>
          <span>${escapeHtml(t("agentFeatureLive"))}</span>
        </div>
      </div>

      <div class="bszl-dialog-ftr">
        <div class="bszl-dialog-note">
          ${isEn ? "Compatible with Ubuntu 20.04/22.04/24.04, Debian 11/12, Rocky/Alma (x86_64 and arm64)." : "Поддерживаются Ubuntu 20.04/22.04/24.04, Debian 11/12, Rocky/Alma (x86_64 и arm64)."}
        </div>
        <button type="button" class="bszl-icon-btn bszl-dialog-btn-close">${escapeHtml(t("agentClose"))}</button>
      </div>
    </div>
  `;

  const close = () => overlay.remove();
  overlay.onclick = (e) => {
    if (e.target === overlay) close();
  };
  const closeBtn = overlay.querySelector(".bszl-dialog-close");
  const closeFtrBtn = overlay.querySelector(".bszl-dialog-btn-close");
  if (closeBtn) closeBtn.onclick = close;
  if (closeFtrBtn) closeFtrBtn.onclick = close;

  const copyBtn = overlay.querySelector("#bszl-agent-copy-btn");
  if (copyBtn) {
    copyBtn.onclick = () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(cmd).catch(() => {});
      }
      const txt = copyBtn.querySelector(".js-copy-text");
      if (txt) {
        txt.textContent = t("agentCopiedBtn");
        setTimeout(() => {
          txt.textContent = t("agentCopyBtn");
        }, 2200);
      }
    };
  }

  document.body.appendChild(overlay);
}

function openDeleteServiceModal(systemId, item) {
  const existing = document.getElementById("bszl-confirm-overlay");
  if (existing) existing.remove();

  const cleanName = String(item.name || item.id);
  const isEn = state.lang === "en";
  const titleText = isEn ? `Delete ${cleanName}?` : `Удалить ${cleanName}?`;
  const bodyText = isEn
    ? `Confirm that you want to delete ${cleanName}. Its service or container will be stopped, disabled, and removed from this server.`
    : `Подтвердите, что хотите удалить ${cleanName}. Сервис или контейнер будет остановлен, отключен из автозапуска и удален из стека сервера.`;
  const cancelLbl = isEn ? "Cancel" : "Отмена";
  const confirmLbl = isEn ? "Delete" : "Удалить";

  const overlay = document.createElement("div");
  overlay.id = "bszl-confirm-overlay";
  overlay.innerHTML = `
    <div class="bszl-confirm-dialog" role="dialog" aria-modal="true">
      <div class="bszl-confirm-title">
        <span class="bszl-dot bszl-dot--crit"></span>
        <span>${escapeHtml(titleText)}</span>
      </div>
      <div class="bszl-confirm-text">${escapeHtml(bodyText)}</div>
      <div class="bszl-confirm-actions">
        <button type="button" id="bszl-confirm-cancel" class="bszl-icon-btn">${escapeHtml(cancelLbl)}</button>
        <button type="button" id="bszl-confirm-delete" class="bszl-act-btn bszl-act-btn--close" style="height:34px;padding:0 14px;font-size:0.78rem;">${escapeHtml(confirmLbl)}</button>
      </div>
    </div>
  `;

  const close = () => overlay.remove();
  overlay.onclick = (e) => {
    if (e.target === overlay) close();
  };
  const btnCancel = overlay.querySelector("#bszl-confirm-cancel");
  const btnDelete = overlay.querySelector("#bszl-confirm-delete");
  if (btnCancel) btnCancel.onclick = close;
  if (btnDelete) {
    btnDelete.onclick = () => {
      close();
      triggerServiceDelete(systemId, item.id, cleanName);
    };
  }
  document.body.appendChild(overlay);
}

async function openServiceLogsModal(systemId, serviceId, serviceName) {
  const existing = document.getElementById("bszl-confirm-overlay");
  if (existing) existing.remove();

  const isEn = state.lang === "en";
  const overlay = document.createElement("div");
  overlay.id = "bszl-confirm-overlay";
  overlay.innerHTML = `
    <div class="bszl-logs-modal-card" role="dialog" aria-modal="true">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
        <div style="display:flex;align-items:center;gap:7px;font-weight:700;font-size:0.84rem;">
          <span class="bszl-dot bszl-dot--ok"></span>
          <span>${escapeHtml(serviceName)}</span>
          <span class="bszl-chip" style="font-size:0.66rem;height:19px;">Live Logs (60)</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <button type="button" id="bszl-logs-refresh" class="bszl-icon-btn" style="height:24px;padding:0 8px;font-size:0.72rem;">
            ${ICONS.sync(false)}
            <span>${isEn ? "Refresh" : "Обновить"}</span>
          </button>
          <button type="button" id="bszl-logs-copy" class="bszl-icon-btn" style="height:24px;padding:0 8px;font-size:0.72rem;">
            <span>${isEn ? "Copy" : "Копировать"}</span>
          </button>
          <button type="button" id="bszl-logs-close" class="bszl-icon-btn" style="height:24px;padding:0 8px;font-size:0.72rem;">✕</button>
        </div>
      </div>
      <pre id="bszl-logs-pre" class="bszl-logs-pre">${isEn ? "Loading logs..." : "Загрузка логов..."}</pre>
    </div>
  `;

  const close = () => overlay.remove();
  overlay.onclick = (e) => {
    if (e.target === overlay) close();
  };
  const btnClose = overlay.querySelector("#bszl-logs-close");
  if (btnClose) btnClose.onclick = close;

  const preEl = overlay.querySelector("#bszl-logs-pre");
  const loadLogs = async () => {
    if (!preEl) return;
    preEl.textContent = isEn ? "Loading logs..." : "Загрузка логов...";
    try {
      const res = await fetch("/api/security-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system_id: systemId, service_id: serviceId, lines: 60 }),
      });
      const data = await res.json();
      preEl.textContent = data.logs || (isEn ? "No log entries." : "Логи пусты.");
      preEl.scrollTop = preEl.scrollHeight;
    } catch (e) {
      preEl.textContent = String(e);
    }
  };

  const btnRefresh = overlay.querySelector("#bszl-logs-refresh");
  if (btnRefresh) btnRefresh.onclick = loadLogs;

  const btnCopy = overlay.querySelector("#bszl-logs-copy");
  if (btnCopy) {
    btnCopy.onclick = () => {
      if (preEl && navigator.clipboard) {
        navigator.clipboard.writeText(preEl.textContent || "");
        showOverlayToast({
          title: serviceName,
          tagText: "OK",
          statusType: "running",
          desc: isEn ? "Logs copied to clipboard" : "Логи скопированы в буфер обмена",
        });
      }
    };
  }

  document.body.appendChild(overlay);
  await loadLogs();
}

async function triggerFail2banAction(systemId, action, ipAddr) {
  if (!ipAddr || state.portBusyKey) return;
  state.portBusyKey = `f2b:${ipAddr}`;
  const panel = document.getElementById("bszl-server-security-panel");
  if (panel) panel.removeAttribute("data-render-key");
  renderSystemDetailPage();
  try {
    const res = await fetch("/api/security-fail2ban", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system_id: systemId, action, ip: ipAddr }),
    });
    const data = await res.json();
    if (data.reports && data.reports.systems) {
      applyReportsPayload(data.reports);
    } else {
      await fetchReports();
    }
    const isEn = state.lang === "en";
    showOverlayToast({
      title: `Fail2ban · ${ipAddr}`,
      tagText: data.ok ? (action === "ban" ? "BAN" : "UNBAN") : "ERR",
      statusType: data.ok ? "running" : "stopped",
      desc:
        data.message ||
        (action === "ban"
          ? isEn
            ? "IP banned in sshd jail"
            : "IP заблокирован в Fail2ban"
          : isEn
          ? "IP unbanned from sshd jail"
          : "IP разблокирован в Fail2ban"),
    });
  } catch (e) {
    console.error(e);
  } finally {
    state.portBusyKey = null;
    const p = document.getElementById("bszl-server-security-panel");
    if (p) p.removeAttribute("data-render-key");
    renderAll();
  }
}

function renderTopNavbarLangSwitcher() {
  document.querySelectorAll("#bszl-svg-defs, .bszl-lang-switch").forEach((el) => el.remove());

  const settingsLink = document.querySelector('a[aria-label="Settings"], button[aria-label="User Actions"]');
  const headerBar = settingsLink ? settingsLink.closest(".bg-card") || settingsLink.parentElement?.parentElement : document.querySelector(".bg-card.border");
  if (!headerBar) return;

  const brandLink = headerBar.querySelector('a[href="/"], a[aria-label="Home"]');
  if (brandLink && !brandLink.hasAttribute("data-bszl-bound")) {
    brandLink.setAttribute("data-bszl-bound", "1");
    brandLink.addEventListener("click", () => {
      if (state.notificationsPageOpen) {
        toggleNotificationsPage(false);
      }
    });
  }

  const baseClass =
    (settingsLink && settingsLink.className) ||
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-10 w-10";

  let openVulnsTotal = 0;
  for (const rep of Object.values(state.reports)) {
    const v = rep.vulnerabilities || rep.updates?.vulnerabilities || {};
    openVulnsTotal += v.open_vulns_count || 0;
  }

  // Place Notification Button right to the right of the Search bar
  const searchBtn =
    (brandLink && brandLink.nextElementSibling && brandLink.nextElementSibling.tagName === "BUTTON"
      ? brandLink.nextElementSibling
      : null) || headerBar.querySelector("button.hidden.md\\:block");

  headerBar.querySelectorAll(".ms-auto .bszl-notif-btn").forEach((el) => el.remove());

  let topNotifBtn = headerBar.querySelector("#bszl-top-notif-btn");
  if (!topNotifBtn) {
    topNotifBtn = document.createElement("button");
    topNotifBtn.id = "bszl-top-notif-btn";
    topNotifBtn.type = "button";
    if (searchBtn) {
      searchBtn.insertAdjacentElement("afterend", topNotifBtn);
    } else if (brandLink) {
      brandLink.insertAdjacentElement("afterend", topNotifBtn);
    }
  } else if (searchBtn && topNotifBtn.previousElementSibling !== searchBtn) {
    searchBtn.insertAdjacentElement("afterend", topNotifBtn);
  }

  const badgeCount = openVulnsTotal > 0 ? openVulnsTotal : state.unreadCount;
  const notifKey = `${state.lang}:${state.notificationsPageOpen ? 1 : 0}:${badgeCount}:${openVulnsTotal}:${state.notifications.length}`;
  if (topNotifBtn.getAttribute("data-nkey") !== notifKey) {
    topNotifBtn.setAttribute("data-nkey", notifKey);
    topNotifBtn.className = `${baseClass.replace(/\bhidden\b|\bmd:grid\b/g, "")} bszl-notif-btn ${
      state.notificationsPageOpen ? "is-active-page" : ""
    }`;
    topNotifBtn.title = t("notifBtnTitle");
    topNotifBtn.setAttribute("aria-label", t("notifBtnTitle"));
    const badgeHtml =
      badgeCount > 0
        ? `<span class="bszl-notif-badge ${openVulnsTotal > 0 ? "bszl-notif-badge--warn" : ""}">${badgeCount}</span>`
        : "";
    topNotifBtn.innerHTML = `${ICONS.bell}${badgeHtml}`;
    topNotifBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleNotificationsPage();
    };
  }

  headerBar.querySelectorAll(":scope > #bszl-top-agent-btn, :not(.ms-auto) > #bszl-top-agent-btn").forEach((el) => el.remove());

  const containers = headerBar.querySelectorAll(".ms-auto");
  containers.forEach((container, idx) => {
    container.querySelectorAll(":scope > .bszl-lang-icon-btn").forEach((el) => el.remove());

    let wrap = container.querySelector(".bszl-lang-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "bszl-lang-wrap";
      container.prepend(wrap);
    }

    let topAgentBtn = container.querySelector("#bszl-top-agent-btn");
    if (!topAgentBtn) {
      topAgentBtn = document.createElement("button");
      topAgentBtn.id = "bszl-top-agent-btn";
      topAgentBtn.type = "button";
      wrap.insertAdjacentElement("afterend", topAgentBtn);
    } else if (topAgentBtn.previousElementSibling !== wrap) {
      wrap.insertAdjacentElement("afterend", topAgentBtn);
    }

    const agentKey = `${state.lang}:${idx}`;
    if (topAgentBtn.getAttribute("data-key") !== agentKey) {
      topAgentBtn.setAttribute("data-key", agentKey);
      topAgentBtn.className = `${baseClass.replace(/\bhidden\b|\bmd:grid\b/g, "")} bszl-top-agent-btn`;
      topAgentBtn.title = t("agentBtnTitle");
      topAgentBtn.setAttribute("aria-label", t("agentBtnTitle"));
      topAgentBtn.innerHTML = ICONS.terminal;
      topAgentBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openAgentInstallModal();
      };
    }

    const key = `${state.lang}:${idx}`;
    if (wrap.getAttribute("data-lang") !== key) {
      wrap.setAttribute("data-lang", key);
      const btnClass = `${baseClass.replace(/\bhidden\b|\bmd:grid\b/g, "")} bszl-lang-icon-btn`;
      const curFlag = state.lang === "en" ? ICONS.flagUS : ICONS.flagRU;
      wrap.innerHTML = `
        <button type="button" class="${btnClass}" aria-label="Language">
          <span class="bszl-lang-ico-glyph">${ICONS.langGlobe}</span>
          <span class="bszl-lang-flag-anim">
            <span class="bszl-lang-flag-box">${curFlag}</span>
          </span>
        </button>
        <div class="bszl-lang-menu">
          <button type="button" class="bszl-lang-item ${state.lang === "en" ? "is-active" : ""}" data-l="en">
            <span style="display:inline-flex;align-items:center;gap:8px;">
              <span class="bszl-menu-flag">${ICONS.flagUS}</span>
              <span>English</span>
            </span>
            ${state.lang === "en" ? "<span>✓</span>" : ""}
          </button>
          <button type="button" class="bszl-lang-item ${state.lang === "ru" ? "is-active" : ""}" data-l="ru">
            <span style="display:inline-flex;align-items:center;gap:8px;">
              <span class="bszl-menu-flag">${ICONS.flagRU}</span>
              <span>Русский</span>
            </span>
            ${state.lang === "ru" ? "<span>✓</span>" : ""}
          </button>
        </div>
      `;

      const triggerBtn = wrap.querySelector(".bszl-lang-icon-btn");
      const menu = wrap.querySelector(".bszl-lang-menu");
      if (triggerBtn && menu) {
        triggerBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const wasOpen = menu.classList.contains("is-open");
          document.querySelectorAll(".bszl-lang-menu.is-open").forEach((m) => m.classList.remove("is-open"));
          if (!wasOpen) menu.classList.add("is-open");
        };
      }
      wrap.querySelectorAll(".bszl-lang-item").forEach((item) => {
        item.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          setLanguage(item.getAttribute("data-l"));
        };
      });
    }
  });
}

function renderNotificationsPage() {
  const mainEl = document.querySelector("div.container.relative") || document.querySelector("main");
  if (!mainEl) return;

  let npage = document.getElementById("bszl-notifications-page");
  if (!state.notificationsPageOpen) {
    if (npage) npage.remove();
    Array.from(mainEl.children).forEach((child) => {
      if (child.getAttribute("data-bszl-hidden") === "1") {
        child.style.display = "";
        child.removeAttribute("data-bszl-hidden");
      }
    });
    return;
  }

  Array.from(mainEl.children).forEach((child) => {
    if (child.id !== "bszl-notifications-page" && child.style.display !== "none") {
      child.style.display = "none";
      child.setAttribute("data-bszl-hidden", "1");
    }
  });

  if (!npage) {
    npage = document.createElement("div");
    npage.id = "bszl-notifications-page";
    mainEl.prepend(npage);
  }

  let openVulnsTotal = 0;
  const uniquePatchedCves = new Set();
  let totalUpgradedPkgs = 0;
  for (const rep of Object.values(state.reports)) {
    const up = rep.updates || {};
    const v = rep.vulnerabilities || up.vulnerabilities || {};
    openVulnsTotal += v.open_vulns_count || 0;
    (v.patched_cves || []).forEach((c) => uniquePatchedCves.add(c));
    totalUpgradedPkgs += (up.upgraded_24h?.length ? up.upgraded_24h.length : (up.upgraded_recent || []).length);
  }
  for (const n of state.notifications) {
    if (n.type === "vuln_patched") {
      (n.cves || []).forEach((c) => uniquePatchedCves.add(c));
    }
  }

  const expKey = Object.keys(state.expandedNotifIds)
    .filter((k) => state.expandedNotifIds[k])
    .sort()
    .join(",");
  const rbKey = `${state.rollbackNotifBusyId || ""}:${state.notifications.filter((x) => x.rolled_back).length}`;
  if (npage.getAttribute("data-render-key") === rKey) return;

  const isEn = state.lang === "en";
  const filtered = state.notifications.filter((n) => {
    if (state.notifFilterServer !== "all" && n.system_id !== state.notifFilterServer) {
      return false;
    }
    if (state.notifFilterType === "vulns") {
      return (
        n.type === "vuln_patched" ||
        n.type === "vuln_detected" ||
        n.type === "auto_rollback" ||
        n.type === "f2b_ban" ||
        n.type === "ssh_login"
      );
    }
    if (state.notifFilterType === "updates") {
      return n.type === "auto_update";
    }
    return true;
  });

  const serversList = [{ id: "all", name: t("allServers") }];
  const seenSrvIds = new Set();
  for (const [sid, rep] of Object.entries(state.reports || {})) {
    const sId = rep?.system_id || sid;
    if (sId && !seenSrvIds.has(sId)) {
      seenSrvIds.add(sId);
      serversList.push({ id: sId, name: rep?.system_name || rep?.hostname || sId });
    }
  }
  for (const n of state.notifications || []) {
    if (n.system_id && !seenSrvIds.has(n.system_id)) {
      seenSrvIds.add(n.system_id);
      serversList.push({ id: n.system_id, name: n.system_name || n.system_id });
    }
  }

  const cardsHtml = filtered.length
    ? filtered
        .map((n) => {
          const isSec = n.type === "vuln_patched" || n.type === "f2b_ban";
          const isCrit = n.type === "vuln_detected" || n.type === "auto_rollback";
          const isExp = !!state.expandedNotifIds[n.id];
          const borderCls = isCrit
            ? "bszl-notif-card--crit"
            : isSec
            ? "bszl-notif-card--sec"
            : "bszl-notif-card--info";
          const typeCls = isCrit
            ? "bszl-notif-type--crit"
            : isSec
            ? "bszl-notif-type--sec"
            : "bszl-notif-type--info";
          const typeLabel =
            n.type === "vuln_patched"
              ? t("typeVulnPatched")
              : n.type === "vuln_detected"
              ? t("typeVulnDetected")
              : n.type === "auto_rollback"
              ? t("typeAutoRollback")
              : n.type === "f2b_ban"
              ? "F2B"
              : n.type === "ssh_login"
              ? "SSH"
              : t("typeAutoUpdate");
          const rawTitle = isEn ? n.title_en || n.title_ru : n.title_ru || n.title_en;
          const title = String(rawTitle)
            .replace(/^Vulnerability Patched:\s*/i, "")
            .replace(/^Патч уязвимости:\s*/i, "")
            .replace(/^Security Patch:\s*/i, "")
            .replace(/^Патч безопасности:\s*/i, "");
          const summary = isEn ? n.summary_en || n.summary_ru : n.summary_ru || n.summary_en;
          const shortTime = String(n.timestamp || "")
            .replace(/^\d{4}-/, "")
            .replace(/:\d{2}\s+(UTC|DXB)$/, "");

          let detailsHtml = "";
          if (isExp) {
            const cvesHtml = (n.cves || []).length
              ? `<div class="bszl-cve-row">${n.cves
                  .map(
                    (cve) =>
                      `<a class="bszl-cve-tag js-cve-link" href="https://ubuntu.com/security/${encodeURIComponent(
                        cve
                      )}" target="_blank" rel="noopener noreferrer">${escapeHtml(cve)} ↗</a>`
                  )
                  .join("")}</div>`
              : "";
            const pkgsHtml = (n.packages || []).length
              ? `<div class="bszl-pkg-row">${n.packages
                  .slice(0, 10)
                  .map((p) => {
                    const ver =
                      p.old_version && p.new_version
                        ? `${p.old_version} → ${p.new_version}`
                        : p.new_version || "";
                    return `<span class="bszl-pkg-chip">${escapeHtml(p.name)}${
                      ver ? `: ${escapeHtml(ver)}` : ""
                    }</span>`;
                  })
                  .join("")}${
                  n.packages.length > 10
                    ? `<span class="bszl-pkg-chip">+${n.packages.length - 10}</span>`
                    : ""
                }</div>`
              : "";

            const canRollback =
              (n.type === "vuln_patched" || n.type === "auto_update") &&
              Array.isArray(n.packages) &&
              n.packages.some((p) => p.name && p.old_version);
            const isRbBusy = state.rollbackNotifBusyId === n.id;
            const guardBarHtml = canRollback
              ? `<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-top:2px;">
                  <span class="bszl-chip" style="font-size:0.68rem;height:21px;padding:0 7px;">
                    <span class="bszl-dot bszl-dot--ok"></span>
                    <span>${
                      isEn
                        ? "Auto-Rollback Guard: ports & services OK"
                        : "Авто-откат: порты и сервисы проверены"
                    }</span>
                  </span>
                  ${
                    n.rolled_back
                      ? `<span class="bszl-notif-type bszl-notif-type--crit">${
                          isEn ? "ROLLED BACK" : "ОТКАЧЕНО"
                        }</span>`
                      : `<button type="button" class="bszl-icon-btn js-notif-rollback" data-rb-id="${escapeHtml(
                          n.id
                        )}" style="height:22px;padding:0 8px;font-size:0.7rem;" ${
                          state.rollbackNotifBusyId ? "disabled" : ""
                        }>
                          ${ICONS.sync(isRbBusy)}
                          <span>${isEn ? "Rollback patch" : "Откатить патч"}</span>
                        </button>`
                  }
                </div>`
              : "";

            detailsHtml = `
              <div class="bszl-notif-details">
                ${summary ? `<div class="bszl-notif-summary">${escapeHtml(summary)}</div>` : ""}
                ${cvesHtml}
                ${pkgsHtml}
                ${guardBarHtml}
              </div>
            `;
          }

          return `
            <div class="bszl-notif-card ${borderCls}" data-nid="${escapeHtml(n.id)}">
              <div class="bszl-notif-top">
                <div class="bszl-notif-badges">
                  <span class="bszl-notif-type ${typeCls}">${escapeHtml(typeLabel)}</span>
                  ${
                    n.rolled_back
                      ? `<span class="bszl-notif-type bszl-notif-type--crit">${
                          isEn ? "ROLLED BACK" : "ОТКАТ"
                        }</span>`
                      : ""
                  }
                  <button type="button" class="bszl-notif-srv-btn js-notif-srv-jump" data-sid="${escapeHtml(
                    n.system_id || ""
                  )}">${escapeHtml(n.system_name || n.system_id)}</button>
                  <span class="bszl-notif-title">${escapeHtml(title)}</span>
                </div>
                <div class="bszl-notif-right">
                  <span class="bszl-notif-time">${escapeHtml(shortTime)}</span>
                  <span style="opacity:0.55;display:inline-flex;">${isExp ? ICONS.chevronUp : ICONS.chevronDown}</span>
                </div>
              </div>
              ${detailsHtml}
            </div>
          `;
        })
        .join("")
    : `<div style="text-align:center;padding:20px 12px;color:var(--muted-foreground);font-size:0.8rem;">${escapeHtml(
        t("emptyNotifs")
      )}</div>`;

  npage.innerHTML = `
    <div class="bszl-npage-shell">
      <div class="bszl-npage-hdr">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <div class="bszl-npage-title">
            ${ICONS.shield}
            <span>${escapeHtml(t("notifPageTitle"))}</span>
          </div>
          <span class="bszl-pill bszl-pill--ok">
            <span class="bszl-dot bszl-dot--ok"></span>
            <span>${escapeHtml(t("cveMonitorOn"))}</span>
          </span>
          <span class="bszl-pill bszl-pill--ok">
            <span class="bszl-dot bszl-dot--ok"></span>
            <span>${isEn ? "Auto-Rollback: ON" : "Авто-откат: ON"}</span>
          </span>
          <span class="bszl-chip">
            <span class="bszl-dot ${openVulnsTotal > 0 ? "bszl-dot--crit" : "bszl-dot--ok"}"></span>
            <span>${escapeHtml(t("kpiOpenVulns"))}: ${openVulnsTotal}</span>
          </span>
          <span class="bszl-chip">CVE: ${uniquePatchedCves.size}</span>
          <span class="bszl-chip">${escapeHtml(t("kpiAutoUpdates"))}: ${totalUpgradedPkgs}</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          <button type="button" id="bszl-btn-scan-patch" class="bszl-icon-btn" ${
            state.scanPatchBusy ? "disabled" : ""
          }>
            ${ICONS.sync(state.scanPatchBusy)}
            <span>${escapeHtml(t("scanPatchBtn"))}</span>
          </button>
          <button type="button" id="bszl-btn-npage-back" class="bszl-icon-btn">
            <span>${escapeHtml(t("backBtn"))}</span>
          </button>
        </div>
      </div>

      <div class="bszl-npage-filters">
        <div class="bszl-tabs-bar">
          <button type="button" data-nftype="all" class="bszl-tab-btn ${
            state.notifFilterType === "all" ? "is-active" : ""
          }">${escapeHtml(t("filterAll"))} (${state.notifications.length})</button>
          <button type="button" data-nftype="vulns" class="bszl-tab-btn ${
            state.notifFilterType === "vulns" ? "is-active" : ""
          }">${escapeHtml(t("filterVulns"))}</button>
          <button type="button" data-nftype="updates" class="bszl-tab-btn ${
            state.notifFilterType === "updates" ? "is-active" : ""
          }">${escapeHtml(t("filterUpdates"))}</button>
        </div>
        <div class="bszl-tabs-bar">
          ${serversList
            .map(
              (srv) => `
            <button type="button" data-nfsrv="${escapeHtml(srv.id)}" class="bszl-tab-btn ${
                state.notifFilterServer === srv.id ? "is-active" : ""
              }">${escapeHtml(srv.name)}</button>`
            )
            .join("")}
        </div>
      </div>

      <div class="bszl-npage-list">
        ${cardsHtml}
      </div>
    </div>
  `;

  const btnBack = npage.querySelector("#bszl-btn-npage-back");
  if (btnBack) btnBack.onclick = () => toggleNotificationsPage(false);

  const btnScanPatch = npage.querySelector("#bszl-btn-scan-patch");
  if (btnScanPatch) {
    btnScanPatch.onclick = () => triggerVulnScanAndPatch(state.notifFilterServer || "all");
  }

  npage.querySelectorAll("[data-nftype]").forEach((btn) => {
    btn.onclick = () => {
      state.notifFilterType = btn.getAttribute("data-nftype");
      npage.removeAttribute("data-render-key");
      renderNotificationsPage();
    };
  });

  npage.querySelectorAll("[data-nfsrv]").forEach((btn) => {
    btn.onclick = () => {
      state.notifFilterServer = btn.getAttribute("data-nfsrv");
      npage.removeAttribute("data-render-key");
      renderNotificationsPage();
    };
  });

  npage.querySelectorAll(".bszl-notif-card[data-nid]").forEach((card) => {
    card.onclick = (e) => {
      if (
        e.target.closest(".js-notif-srv-jump") ||
        e.target.closest(".js-cve-link") ||
        e.target.closest(".js-notif-rollback")
      ) {
        return;
      }
      const nid = card.getAttribute("data-nid");
      state.expandedNotifIds[nid] = !state.expandedNotifIds[nid];
      npage.removeAttribute("data-render-key");
      renderNotificationsPage();
    };
  });

  npage.querySelectorAll(".js-notif-rollback").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const rbId = btn.getAttribute("data-rb-id");
      const notifObj = state.notifications.find((x) => x.id === rbId);
      if (notifObj) {
        triggerNotificationRollback(notifObj);
      }
    };
  });

  npage.querySelectorAll(".js-notif-srv-jump").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const sid = btn.getAttribute("data-sid");
      const rep = getReport(sid);
      const targetName = rep?.system_name || sid;
      toggleNotificationsPage(false);
      if (targetName) {
        window.history.pushState(null, "", `/system/${encodeURIComponent(targetName)}`);
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
    };
  });

  npage.setAttribute("data-render-key", rKey);
}

function buildBriefTableCellHtml(rep) {
  const checksList = getExtendedChecksList(rep);
  if (!rep) {
    return `<span class="bszl-brief-status"><span class="bszl-dot bszl-dot--ok"></span><span>12/12</span></span>`;
  }
  const passed = checksList.filter((c) => c.status === "ok").length;
  const total = checksList.length;
  const st = rep.overall_status || "ok";
  const dotClass =
    st === "ok" ? "bszl-dot--ok" : st === "warn" ? "bszl-dot--warn" : "bszl-dot--crit";
  const stCount = rep.stack?.running ? ` · ${rep.stack.running} ON` : "";
  return `<span class="bszl-brief-status"><span class="bszl-dot ${dotClass}"></span><span>${passed}/${total}${stCount}</span></span>`;
}

function buildOsTableCellHtml(rep) {
  const sys = rep?.telemetry || rep?.system_telemetry || {};
  const disk = rep?.disk || {};
  const distroId = (sys.distro_id || "ubuntu").toLowerCase();
  const logoSvg = distroId.includes("debian")
    ? ICONS.debian
    : distroId.includes("ubuntu")
    ? ICONS.ubuntu
    : ICONS.linux;
  const osShort =
    sys.distro_short ||
    (sys.os_pretty ? sys.os_pretty.replace(/\s+LTS$/i, "") : "Ubuntu 24.04");
  const kernelShort = sys.kernel_short || (rep?.kernel || "").replace(/-generic$/, "") || "Linux";
  const inodesPct = disk.inodes_pct ?? 0;
  const swapPct = sys.swap_pct ?? 0;
  const subTag =
    swapPct > 0
      ? `Swap ${swapPct}%`
      : inodesPct > 0
      ? `Inode ${inodesPct}%`
      : "";
  return `
    <div class="bszl-os-cell">
      <span class="bszl-os-logo">${logoSvg}</span>
      <div class="bszl-os-meta">
        <span class="bszl-os-name">${escapeHtml(osShort)}</span>
        <span class="bszl-os-kern">${escapeHtml(kernelShort)}${subTag ? ` · ${escapeHtml(subTag)}` : ""}</span>
      </div>
    </div>
  `;
}

function navigateToSystemTab(sysId, tabId) {
  if (!sysId) return;
  const rep = getReport(sysId);
  const targetName = rep?.system_name || sysId;
  state.activeTabBySystem[rep?.system_id || sysId] = tabId;
  state.activeTabBySystem[targetName] = tabId;
  window.history.pushState(null, "", `/system/${encodeURIComponent(targetName)}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function renderHomeTable() {
  document
    .querySelectorAll("#bszl-fleet-banner, .bszl-hover-card, .bszl-th-update, .bszl-td-update, .bszl-upd-addon")
    .forEach((el) => el.remove());

  const isHome = window.location.pathname === "/" || window.location.pathname === "";
  if (!isHome) return;

  const table = document.querySelector("table");
  if (table) {
    const headerRow = table.querySelector("thead tr");
    if (headerRow) {
      let thOs = headerRow.querySelector(".bszl-th-os");
      if (!thOs) {
        const lastTh = headerRow.lastElementChild;
        thOs = document.createElement("th");
        thOs.className =
          "h-10 px-1.5 text-left align-middle font-medium text-muted-foreground bszl-sec-th bszl-th-os";
        if (lastTh) headerRow.insertBefore(thOs, lastTh);
        else headerRow.appendChild(thOs);
      }
      const osHeaderHtml = `<div class="flex items-center gap-1.5 px-3">${ICONS.linux}<span>${escapeHtml(
        t("osCol")
      )}</span></div>`;
      if (thOs.getAttribute("data-h") !== osHeaderHtml) {
        thOs.innerHTML = osHeaderHtml;
        thOs.setAttribute("data-h", osHeaderHtml);
      }

      let thSec = headerRow.querySelector(".bszl-th-security");
      if (!thSec) {
        const lastTh = headerRow.lastElementChild;
        thSec = document.createElement("th");
        thSec.className =
          "h-10 px-1.5 text-left align-middle font-medium text-muted-foreground bszl-sec-th bszl-th-security";
        if (lastTh) headerRow.insertBefore(thSec, lastTh);
        else headerRow.appendChild(thSec);
      }
      const secHeaderHtml = `<div class="flex items-center gap-1.5 px-3">${ICONS.shield}<span>${escapeHtml(
        t("secCol")
      )}</span></div>`;
      if (thSec.getAttribute("data-h") !== secHeaderHtml) {
        thSec.innerHTML = secHeaderHtml;
        thSec.setAttribute("data-h", secHeaderHtml);
      }
    }

    const bodyRows = table.querySelectorAll("tbody tr");
    bodyRows.forEach((tr) => {
      const sysLink = tr.querySelector('a[href*="/system/"]');
      if (!sysLink) return;
      const href = sysLink.getAttribute("href") || "";
      const sysId = decodeURIComponent(href.split("/system/")[1] || "").split("?")[0];
      if (!sysId) return;

      const rep = getReport(sysId);
      const lastTd = tr.lastElementChild;

      let tdOs = tr.querySelector(".bszl-td-os");
      if (!tdOs) {
        tdOs = document.createElement("td");
        tdOs.className = "py-0 ps-3 align-middle bszl-sec-td bszl-td-os";
        tdOs.style.cursor = "pointer";
        tdOs.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          navigateToSystemTab(sysId, "docker");
        };
        if (lastTd) tr.insertBefore(tdOs, lastTd);
        else tr.appendChild(tdOs);
      }
      const osHtml = buildOsTableCellHtml(rep);
      if (tdOs.getAttribute("data-hash") !== osHtml) {
        tdOs.innerHTML = osHtml;
        tdOs.setAttribute("data-hash", osHtml);
      }

      let tdSec = tr.querySelector(".bszl-td-security");
      if (!tdSec) {
        tdSec = document.createElement("td");
        tdSec.className = "py-0 ps-4.5 align-middle bszl-sec-td bszl-td-security";
        tdSec.style.cursor = "pointer";
        tdSec.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          navigateToSystemTab(sysId, "overview");
        };
        if (lastTd) tr.insertBefore(tdSec, lastTd);
        else tr.appendChild(tdSec);
      }

      const secHtml = buildBriefTableCellHtml(rep);
      if (tdSec.getAttribute("data-hash") !== secHtml) {
        tdSec.innerHTML = secHtml;
        tdSec.setAttribute("data-hash", secHtml);
      }
    });
  }
}

function getExtendedChecksList(rep) {
  if (!rep) return [];
  const baseChecks = Array.isArray(rep.checks) ? [...rep.checks] : [];
  const disk = rep.disk || {};
  const sys = rep.telemetry || rep.system_telemetry || {};
  const isEn = state.lang === "en";

  const inodesPct = disk.inodes_pct ?? 0;
  baseChecks.push({
    id: "inodes",
    title: "Inodes",
    status: inodesPct >= 90 ? "crit" : inodesPct >= 80 ? "warn" : "ok",
    metrics: {
      inodes_pct: inodesPct,
      inodes_used: disk.inodes_used || 0,
      inodes_total: disk.inodes_total || 0,
    },
    tooltip: `${isEn ? "Inodes usage" : "Использование Inodes"}: ${inodesPct}% (${disk.inodes_used || 0}/${disk.inodes_total || 0})`,
  });

  const estDays = disk.est_days_left ?? 365;
  const growthMb = disk.growth_mb_day ?? 0;
  baseChecks.push({
    id: "disk_trend",
    title: isEn ? "Trend" : "Прогноз",
    status: estDays <= 7 ? "crit" : estDays <= 21 ? "warn" : "ok",
    metrics: {
      est_days_left: estDays,
      growth_mb_day: growthMb,
    },
    tooltip: `${isEn ? "Disk trend" : "Тренд диска"}: ${growthMb >= 0 ? "+" : ""}${growthMb} MB/d · ${estDays >= 365 ? ">365d" : `~${estDays}d`}`,
  });

  const stealPct = sys.cpu_steal_pct ?? 0;
  const iowaitPct = sys.cpu_iowait_pct ?? 0;
  const freqMhz = sys.cpu_freq_mhz ?? 0;
  baseChecks.push({
    id: "cpu_steal",
    title: "Steal",
    status: stealPct >= 15 ? "crit" : stealPct >= 5 ? "warn" : "ok",
    metrics: {
      cpu_steal_pct: stealPct,
      cpu_iowait_pct: iowaitPct,
      cpu_freq_mhz: freqMhz,
    },
    tooltip: `CPU Steal: ${stealPct}% · IOWait: ${iowaitPct}%${freqMhz ? ` · ${freqMhz} MHz` : ""}`,
  });

  const oomCnt = sys.oom_count ?? 0;
  const rebChanged = !!(sys.reboot_detected || (sys.reboot_count || 0) > 0);
  const upMatch = String(rep.uptime || "").match(/(\d+)\s+day/i);
  const upDays = sys.uptime_days ?? (upMatch ? Number(upMatch[1]) : 0);
  baseChecks.push({
    id: "oom_reboot",
    title: "OOM",
    status: oomCnt > 0 ? "crit" : "ok",
    metrics: {
      oom_count: oomCnt,
      reboot_detected: false,
      uptime_days: upDays,
    },
    tooltip: `OOM Kills (7d): ${oomCnt} · Boot: ${sys.boot_since || rep.uptime || "OK"}`,
  });

  return baseChecks;
}

function getShortCheckValue(check) {
  const m = check.metrics || {};
  if (check.id === "ssh_auth") {
    return `:${(m.ports || [])[0] || "22"}`;
  }
  if (check.id === "firewall") {
    return `${m.rules_count ?? 0}`;
  }
  if (check.id === "fail2ban") {
    return `${m.currently_banned ?? 0}`;
  }
  if (check.id === "open_ports") {
    return `${m.total_external_ports ?? 0}`;
  }
  if (check.id === "users_priv") {
    return "OK";
  }
  if (check.id === "processes_integrity") {
    return (m.suspicious_processes || []).length === 0 ? "OK" : `${m.suspicious_processes.length}`;
  }
  if (check.id === "cron_timers") {
    return m.beszel_timer_active ? "ON" : "OK";
  }
  if (check.id === "kernel_sysctl") {
    return `${m.root_disk_percent ?? 0}%`;
  }
  if (check.id === "inodes") {
    return `${m.inodes_pct ?? 0}%`;
  }
  if (check.id === "disk_trend") {
    const d = m.est_days_left ?? 365;
    const unit = state.lang === "en" ? "d" : "д";
    return d >= 365 ? `>365${unit}` : `~${d}${unit}`;
  }
  if (check.id === "cpu_steal") {
    return `${m.cpu_steal_pct ?? 0}%`;
  }
  if (check.id === "oom_reboot") {
    if ((m.oom_count || 0) > 0) return `${m.oom_count} OOM`;
    if (m.reboot_detected) return "REBOOT";
    const unit = state.lang === "en" ? "d" : "д";
    return `${m.uptime_days ?? 0}${unit}`;
  }
  return "OK";
}

function detectNativeChartId(cardEl, fallbackIdx = 0) {
  const existing = cardEl.getAttribute("data-bszl-cid-v2");
  if (existing) return existing;
  const h3 = cardEl.querySelector("h3, .font-semibold, .text-base");
  const txt = (h3 ? h3.textContent : cardEl.textContent || "").trim().toLowerCase();
  const isDocker = txt.includes("docker") || txt.includes("контейнер");
  let id = null;
  if (isDocker && /\bcpu\b|\bцп\b|процессор/i.test(txt)) id = "docker_cpu";
  else if (isDocker && /memory|памят|озу/i.test(txt)) id = "docker_memory";
  else if (isDocker && /net|сет|трафик|ввод|i\/o/i.test(txt)) id = "docker_net";
  else if (/\bcpu\b|\bцп\b|процессор/i.test(txt)) id = "cpu";
  else if (/memory|памят|озу/i.test(txt)) id = "memory";
  else if (/i\/o|ввод[-\/]вывод/i.test(txt)) id = "disk_io";
  else if (/swap|подкачк/i.test(txt)) id = "swap";
  else if (/load|средняя загрузка|нагрузк/i.test(txt)) id = "load";
  else if (/bandwidth|пропускн|сетевой трафик|\bсеть\b/i.test(txt)) id = "bandwidth";
  else if (/disk|root usage|диск|файлов|системный использование/i.test(txt)) id = "disk";
  else id = `chart_${fallbackIdx}`;
  cardEl.setAttribute("data-bszl-cid-v2", id);
  return id;
}

function applySystemChartsLayout(sysId) {
  const gridWrapper = document.querySelector("div.grid.gap-4.mb-14");
  if (!gridWrapper) return;
  gridWrapper.setAttribute("data-bszl-sysid", sysId);
  const layout = getServerLayout(sysId);

  const children = Array.from(gridWrapper.children);
  const headerCard = children.find(
    (el) => el.id !== "bszl-server-security-panel" && !el.classList.contains("xl:grid-cols-2") && !el.classList.contains("contents")
  );
  const panelEl = document.getElementById("bszl-server-security-panel");
  const chartsGrid =
    children.find((el) => el.classList.contains("xl:grid-cols-2")) ||
    gridWrapper.querySelector("div.grid.xl\\:grid-cols-2.gap-4");

  const chartCardCount = chartsGrid ? chartsGrid.children.length : 0;
  const layoutKey = `${sysId}:${layout.panelPos}:${layout.chartsOrder.join(",")}:${(layout.hiddenCharts || []).join(",")}:${state.rearrangeMode ? 1 : 0}:${state.lang}:${chartCardCount}`;
  if (gridWrapper.getAttribute("data-bszl-applied-layout") === layoutKey) {
    normalizeRussianChartTitles();
    return;
  }
  gridWrapper.setAttribute("data-bszl-applied-layout", layoutKey);

  if (headerCard) headerCard.style.order = "";
  if (panelEl) panelEl.style.order = "";
  if (chartsGrid) chartsGrid.style.order = "";

  if (panelEl && headerCard && chartsGrid) {
    if (layout.panelPos === "bottom") {
      if (chartsGrid.nextElementSibling !== panelEl) {
        chartsGrid.insertAdjacentElement("afterend", panelEl);
      }
    } else {
      if (headerCard.nextElementSibling !== panelEl) {
        headerCard.insertAdjacentElement("afterend", panelEl);
      }
    }
  }

  if (chartsGrid) {
    const chartCards = Array.from(chartsGrid.children);
    const hiddenSet = new Set(layout.hiddenCharts || []);
    const rep = getReport(sysId);
    const hasDocker = Boolean(
      (rep && rep.docker_storage && rep.docker_storage.total_containers > 0) ||
      (rep && rep.stack?.items && rep.stack.items.some((i) => i.type === "docker"))
    );
    chartCards.forEach((card, fallbackIdx) => {
      const cid = detectNativeChartId(card, fallbackIdx);
      if (!hasDocker && (cid === "docker_cpu" || cid === "docker_memory" || cid === "docker_net")) {
        card.style.display = "none";
        return;
      }
      const orderIdx = layout.chartsOrder.indexOf(cid);
      card.style.order = String(orderIdx === -1 ? 50 + fallbackIdx : orderIdx + 1);
      card.style.display = hiddenSet.has(cid) && !state.rearrangeMode ? "none" : "";
      card.classList.toggle("bszl-chart-is-hidden", hiddenSet.has(cid));
      card.classList.toggle("bszl-rearrange-active-card", !!state.rearrangeMode);

      let handleBar = card.querySelector(".bszl-chart-drag-bar");
      if (state.rearrangeMode) {
        card.style.position = "relative";
        card.setAttribute("draggable", "true");
        if (!handleBar) {
          handleBar = document.createElement("div");
          handleBar.className = "bszl-chart-drag-bar";
          card.prepend(handleBar);
        }
        const isHidden = hiddenSet.has(cid);
        const barKey = `${cid}:${orderIdx}:${isHidden ? 1 : 0}:${state.lang}`;
        if (handleBar.getAttribute("data-bkey") !== barKey) {
          handleBar.setAttribute("data-bkey", barKey);
          const h3El = card.querySelector("h3, .font-semibold, .text-base");
          const fallbackLbl = h3El ? h3El.textContent.trim() : cid;
          const lbl = CHART_LABELS[cid]?.[state.lang] || fallbackLbl;
          handleBar.innerHTML = `
            <span class="bszl-drag-grip" title="Drag">${ICONS.grip}<span>${escapeHtml(lbl)}</span></span>
            <div style="display:inline-flex;align-items:center;gap:3px;">
              <button type="button" class="bszl-mini-move-btn js-chart-up" title="Move Up">↑</button>
              <button type="button" class="bszl-mini-move-btn js-chart-down" title="Move Down">↓</button>
              <button type="button" class="bszl-mini-move-btn ${isHidden ? "is-muted" : "is-vis"} js-chart-vis" title="${state.lang === "en" ? "Show/Hide chart" : "Показать/скрыть график"}">${isHidden ? "🚫" : "👁"}</button>
            </div>
          `;
          handleBar.querySelector(".js-chart-up").onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const curSysId = gridWrapper.getAttribute("data-bszl-sysid") || sysId;
            const cur = getServerLayout(curSysId);
            if (!cur.chartsOrder.includes(cid)) cur.chartsOrder.push(cid);
            cur.chartsOrder = moveArrayItem(cur.chartsOrder, cid, -1);
            saveServerLayout(curSysId, cur);
          };
          handleBar.querySelector(".js-chart-down").onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const curSysId = gridWrapper.getAttribute("data-bszl-sysid") || sysId;
            const cur = getServerLayout(curSysId);
            if (!cur.chartsOrder.includes(cid)) cur.chartsOrder.push(cid);
            cur.chartsOrder = moveArrayItem(cur.chartsOrder, cid, 1);
            saveServerLayout(curSysId, cur);
          };
          handleBar.querySelector(".js-chart-vis").onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const curSysId = gridWrapper.getAttribute("data-bszl-sysid") || sysId;
            const cur = getServerLayout(curSysId);
            cur.hiddenCharts = toggleHiddenItem(cur.hiddenCharts, cid, DEFAULT_CHARTS_ORDER);
            saveServerLayout(curSysId, cur);
          };
        }

        if (!card.hasAttribute("data-bszl-dnd-bound-v2")) {
          card.setAttribute("data-bszl-dnd-bound-v2", "1");
          card.addEventListener("dragstart", (e) => {
            if (!state.rearrangeMode) return;
            const curCid = card.getAttribute("data-bszl-cid-v2") || cid;
            state.dragSourceType = "chart";
            state.dragSourceId = curCid;
            card.classList.add("is-dragging");
            if (e.dataTransfer) {
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", curCid);
            }
          });
          card.addEventListener("dragend", () => {
            card.classList.remove("is-dragging");
            document.querySelectorAll(".is-drag-over").forEach((el) => el.classList.remove("is-drag-over"));
          });
          card.addEventListener("dragover", (e) => {
            const curCid = card.getAttribute("data-bszl-cid-v2") || cid;
            if (!state.rearrangeMode || state.dragSourceType !== "chart" || state.dragSourceId === curCid) return;
            e.preventDefault();
            card.classList.add("is-drag-over");
          });
          card.addEventListener("dragleave", () => {
            card.classList.remove("is-drag-over");
          });
          card.addEventListener("drop", (e) => {
            const curCid = card.getAttribute("data-bszl-cid-v2") || cid;
            if (!state.rearrangeMode || state.dragSourceType !== "chart" || !state.dragSourceId || state.dragSourceId === curCid) return;
            e.preventDefault();
            card.classList.remove("is-drag-over");
            const curSysId = gridWrapper.getAttribute("data-bszl-sysid") || sysId;
            const cur = getServerLayout(curSysId);
            if (!cur.chartsOrder.includes(state.dragSourceId)) cur.chartsOrder.push(state.dragSourceId);
            if (!cur.chartsOrder.includes(curCid)) cur.chartsOrder.push(curCid);
            cur.chartsOrder = moveArrayItem(cur.chartsOrder, state.dragSourceId, curCid);
            saveServerLayout(curSysId, cur);
          });
        }
      } else {
        card.removeAttribute("draggable");
        if (handleBar) handleBar.remove();
      }
    });
  }
  normalizeRussianChartTitles();
}

function enhanceSettings2Menu() {
  const m = window.location.pathname.match(/\/system\/([^/?#]+)/);
  if (!m) return;
  const rawKey = decodeURIComponent(m[1]);
  const rep = getReport(rawKey);
  const sysId = rep ? rep.system_id : rawKey;

  // Ensure the lucide-settings2 button next to time-range selector is always visible on /system/:id
  const settings2Svg = document.querySelector("svg.lucide-settings2");
  const settings2Btn = settings2Svg ? settings2Svg.closest("button") : null;
  if (settings2Btn) {
    if (settings2Btn.classList.contains("hidden") || settings2Btn.classList.contains("xl:flex")) {
      settings2Btn.classList.remove("hidden", "xl:flex");
      settings2Btn.classList.add("flex");
    }
    if (state.rearrangeMode) {
      settings2Btn.classList.add("bszl-settings2-active");
    } else {
      settings2Btn.classList.remove("bszl-settings2-active");
    }
  }

  // Check if Radix DropdownMenu for Settings2 is currently open in the DOM
  const openMenus = Array.from(
    document.querySelectorAll('[role="menu"][data-radix-menu-content][data-state="open"]')
  );
  if (!openMenus.length) return;

  // Identify the Display / Chart width menu opened by lucide-settings2
  const targetMenu = openMenus.find((menuEl) => {
    const txt = (menuEl.textContent || "").toLowerCase();
    return (
      txt.includes("display") ||
      txt.includes("chart") ||
      txt.includes("grid") ||
      txt.includes("tabs") ||
      txt.includes("отображ") ||
      txt.includes("ширин") ||
      txt.includes("вкладк") ||
      menuEl.querySelector("#bszl-rearrange-menu")
    );
  });
  if (!targetMenu) return;

  let box = targetMenu.querySelector("#bszl-rearrange-menu");
  if (!box) {
    box = document.createElement("div");
    box.id = "bszl-rearrange-menu";
    box.className = "bszl-rearrange-menu";
    // Stop Radix DropdownMenu from closing when interacting with rearrangement controls
    ["pointerdown", "mousedown", "mouseup", "click", "keydown"].forEach((evName) => {
      box.addEventListener(evName, (e) => {
        e.stopPropagation();
      });
    });
    targetMenu.appendChild(box);
  }

  const layout = getServerLayout(sysId);
  const isEn = state.lang === "en";
  const rTab = state.rearrangeMenuTab || "charts";
  const rKey = `${sysId}:${state.lang}:${rTab}:${state.rearrangeMode ? 1 : 0}:${JSON.stringify(layout)}`;
  if (box.getAttribute("data-rkey") === rKey) return;
  box.setAttribute("data-rkey", rKey);

  const titles = I18N[state.lang].checkTitles || {};
  const tabLabels = {
    overview: t("tabChecks"),
    ports: t("tabPorts"),
    docker: t("tabDocker"),
    net: t("tabNet"),
    updates: t("tabUpdates"),
  };
  const catLabels = {
    vpn: t("catVpn"),
    bots: t("catBots"),
    servers: t("catServers"),
    utils: t("catUtils"),
  };

  let itemsHtml = "";
  if (rTab === "charts") {
    const panelPosToggle = `
      <div class="bszl-rm-pos-row">
        <span class="bszl-rm-pos-lbl">${isEn ? "Security Panel:" : "Панель стека:"}</span>
        <div class="bszl-rm-seg">
          <button type="button" class="bszl-rm-seg-btn ${layout.panelPos !== "bottom" ? "is-active" : ""}" data-ppos="top">${isEn ? "Top" : "Сверху"}</button>
          <button type="button" class="bszl-rm-seg-btn ${layout.panelPos === "bottom" ? "is-active" : ""}" data-ppos="bottom">${isEn ? "Bottom" : "Снизу"}</button>
        </div>
      </div>
    `;
    const rows = layout.chartsOrder
      .map((cid, idx) => {
        const isHidden = layout.hiddenCharts.includes(cid);
        const lbl = CHART_LABELS[cid]?.[state.lang] || cid;
        return `
          <div class="bszl-rm-item ${isHidden ? "is-hidden-item" : ""}" draggable="true" data-rm-type="chart" data-rm-id="${escapeHtml(cid)}">
            <button type="button" class="bszl-rm-vis-btn js-rm-vis" data-type="chart" data-id="${escapeHtml(cid)}">${isHidden ? "" : "✓"}</button>
            <span class="bszl-rm-item-lbl">${escapeHtml(lbl)}</span>
            <div class="bszl-rm-arrows">
              <button type="button" class="bszl-rm-arr js-rm-move" data-type="chart" data-id="${escapeHtml(cid)}" data-dir="-1" ${idx === 0 ? "disabled" : ""}>↑</button>
              <button type="button" class="bszl-rm-arr js-rm-move" data-type="chart" data-id="${escapeHtml(cid)}" data-dir="1" ${idx === layout.chartsOrder.length - 1 ? "disabled" : ""}>↓</button>
            </div>
          </div>
        `;
      })
      .join("");
    itemsHtml = `${panelPosToggle}<div class="bszl-rm-list">${rows}</div>`;
  } else if (rTab === "checks") {
    const checkRows = layout.checksOrder
      .map((chkId, idx) => {
        const isHidden = layout.hiddenChecks.includes(chkId);
        const lbl = titles[chkId] || chkId;
        return `
          <div class="bszl-rm-item ${isHidden ? "is-hidden-item" : ""}" draggable="true" data-rm-type="check" data-rm-id="${escapeHtml(chkId)}">
            <button type="button" class="bszl-rm-vis-btn js-rm-vis" data-type="check" data-id="${escapeHtml(chkId)}">${isHidden ? "" : "✓"}</button>
            <span class="bszl-rm-item-lbl">${escapeHtml(lbl)}</span>
            <div class="bszl-rm-arrows">
              <button type="button" class="bszl-rm-arr js-rm-move" data-type="check" data-id="${escapeHtml(chkId)}" data-dir="-1" ${idx === 0 ? "disabled" : ""}>↑</button>
              <button type="button" class="bszl-rm-arr js-rm-move" data-type="check" data-id="${escapeHtml(chkId)}" data-dir="1" ${idx === layout.checksOrder.length - 1 ? "disabled" : ""}>↓</button>
            </div>
          </div>
        `;
      })
      .join("");
    const catRows = layout.catsOrder
      .map((catId, idx) => {
        const isHidden = layout.hiddenCats.includes(catId);
        const lbl = catLabels[catId] || catId;
        return `
          <div class="bszl-rm-item ${isHidden ? "is-hidden-item" : ""}" draggable="true" data-rm-type="cat" data-rm-id="${escapeHtml(catId)}">
            <button type="button" class="bszl-rm-vis-btn js-rm-vis" data-type="cat" data-id="${escapeHtml(catId)}">${isHidden ? "" : "✓"}</button>
            <span class="bszl-rm-item-lbl">${escapeHtml(lbl)}</span>
            <div class="bszl-rm-arrows">
              <button type="button" class="bszl-rm-arr js-rm-move" data-type="cat" data-id="${escapeHtml(catId)}" data-dir="-1" ${idx === 0 ? "disabled" : ""}>↑</button>
              <button type="button" class="bszl-rm-arr js-rm-move" data-type="cat" data-id="${escapeHtml(catId)}" data-dir="1" ${idx === layout.catsOrder.length - 1 ? "disabled" : ""}>↓</button>
            </div>
          </div>
        `;
      })
      .join("");
    itemsHtml = `
      <div class="bszl-rm-subhdr">${isEn ? "12 Status Indicators" : "12 индикаторов статуса"}</div>
      <div class="bszl-rm-list">${checkRows}</div>
      <div class="bszl-rm-subhdr" style="margin-top:6px;">${isEn ? "Stack Categories" : "Категории стека"}</div>
      <div class="bszl-rm-list">${catRows}</div>
    `;
  } else {
    const tabRows = layout.tabsOrder
      .map((tId, idx) => {
        const isHidden = layout.hiddenTabs.includes(tId);
        const lbl = tabLabels[tId] || tId;
        return `
          <div class="bszl-rm-item ${isHidden ? "is-hidden-item" : ""}" draggable="true" data-rm-type="tab" data-rm-id="${escapeHtml(tId)}">
            <button type="button" class="bszl-rm-vis-btn js-rm-vis" data-type="tab" data-id="${escapeHtml(tId)}">${isHidden ? "" : "✓"}</button>
            <span class="bszl-rm-item-lbl">${escapeHtml(lbl)}</span>
            <div class="bszl-rm-arrows">
              <button type="button" class="bszl-rm-arr js-rm-move" data-type="tab" data-id="${escapeHtml(tId)}" data-dir="-1" ${idx === 0 ? "disabled" : ""}>↑</button>
              <button type="button" class="bszl-rm-arr js-rm-move" data-type="tab" data-id="${escapeHtml(tId)}" data-dir="1" ${idx === layout.tabsOrder.length - 1 ? "disabled" : ""}>↓</button>
            </div>
          </div>
        `;
      })
      .join("");
    itemsHtml = `<div class="bszl-rm-list">${tabRows}</div>`;
  }

  const srvName = rep?.system_name || sysId;

  box.innerHTML = `
    <div class="bszl-rm-divider"></div>
    <div class="bszl-rm-hdr">
      <div style="display:flex;align-items:center;gap:6px;font-weight:600;font-size:0.78rem;">
        ${ICONS.sliders}
        <span>${escapeHtml(t("rearrangeTitle"))}</span>
      </div>
      <span class="bszl-chip" style="font-size:0.65rem;padding:1px 6px;">${escapeHtml(srvName)}</span>
    </div>

    <button type="button" class="bszl-rm-dnd-toggle ${state.rearrangeMode ? "is-on" : ""}" id="bszl-rm-btn-dnd">
      <span style="display:inline-flex;align-items:center;gap:6px;">
        ${ICONS.grip}
        <span>${escapeHtml(t("rearrangeDragMode"))}</span>
      </span>
      <span class="bszl-svc-tag ${state.rearrangeMode ? "bszl-svc-tag--on" : "bszl-svc-tag--off"}">${state.rearrangeMode ? "ON" : "OFF"}</span>
    </button>

    <div class="bszl-rm-tabs">
      <button type="button" class="bszl-rm-tab ${rTab === "charts" ? "is-active" : ""}" data-rtab="charts">${escapeHtml(t("rearrangeSecCharts"))}</button>
      <button type="button" class="bszl-rm-tab ${rTab === "checks" ? "is-active" : ""}" data-rtab="checks">${escapeHtml(t("rearrangeSecChecks"))}</button>
      <button type="button" class="bszl-rm-tab ${rTab === "tabs" ? "is-active" : ""}" data-rtab="tabs">${escapeHtml(t("rearrangeSecTabs"))}</button>
    </div>

    <div class="bszl-rm-body">
      ${itemsHtml}
    </div>

    <div class="bszl-rm-ftr">
      <button type="button" class="bszl-rm-act-btn" id="bszl-rm-apply-all">${escapeHtml(t("rearrangeApplyAll"))}</button>
      <button type="button" class="bszl-rm-act-btn" id="bszl-rm-reset">${escapeHtml(t("rearrangeReset"))}</button>
    </div>
  `;

  const btnDnd = box.querySelector("#bszl-rm-btn-dnd");
  if (btnDnd) {
    btnDnd.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (state.rearrangeMode) {
        exitRearrangeMode();
        return;
      }
      state.rearrangeMode = true;
      closeOpenRadixMenus();
      const p = document.getElementById("bszl-server-security-panel");
      if (p) p.removeAttribute("data-render-key");
      const gw = document.querySelector("div.grid.gap-4.mb-14");
      if (gw) gw.removeAttribute("data-bszl-applied-layout");
      box.removeAttribute("data-rkey");
      renderAll();
    };
  }

  box.querySelectorAll("[data-rtab]").forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      state.rearrangeMenuTab = btn.getAttribute("data-rtab");
      box.removeAttribute("data-rkey");
      enhanceSettings2Menu();
    };
  });

  box.querySelectorAll("[data-ppos]").forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const cur = getServerLayout(sysId);
      cur.panelPos = btn.getAttribute("data-ppos") === "bottom" ? "bottom" : "top";
      saveServerLayout(sysId, cur);
    };
  });

  box.querySelectorAll(".js-rm-move").forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const type = btn.getAttribute("data-type");
      const id = btn.getAttribute("data-id");
      const dir = Number(btn.getAttribute("data-dir"));
      const cur = getServerLayout(sysId);
      if (type === "chart") cur.chartsOrder = moveArrayItem(cur.chartsOrder, id, dir);
      else if (type === "check") cur.checksOrder = moveArrayItem(cur.checksOrder, id, dir);
      else if (type === "cat") cur.catsOrder = moveArrayItem(cur.catsOrder, id, dir);
      else if (type === "tab") cur.tabsOrder = moveArrayItem(cur.tabsOrder, id, dir);
      saveServerLayout(sysId, cur);
    };
  });

  box.querySelectorAll(".js-rm-vis").forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const type = btn.getAttribute("data-type");
      const id = btn.getAttribute("data-id");
      const cur = getServerLayout(sysId);
      if (type === "chart") cur.hiddenCharts = toggleHiddenItem(cur.hiddenCharts, id, DEFAULT_CHARTS_ORDER);
      else if (type === "check") cur.hiddenChecks = toggleHiddenItem(cur.hiddenChecks, id, DEFAULT_CHECKS_ORDER);
      else if (type === "cat") cur.hiddenCats = toggleHiddenItem(cur.hiddenCats, id, DEFAULT_CATS_ORDER);
      else if (type === "tab") cur.hiddenTabs = toggleHiddenItem(cur.hiddenTabs, id, DEFAULT_TABS_ORDER);
      saveServerLayout(sysId, cur);
    };
  });

  // Drag & Drop inside the menu list
  let menuDragType = null;
  let menuDragId = null;
  box.querySelectorAll(".bszl-rm-item[draggable='true']").forEach((row) => {
    row.addEventListener("dragstart", (e) => {
      e.stopPropagation();
      menuDragType = row.getAttribute("data-rm-type");
      menuDragId = row.getAttribute("data-rm-id");
      row.classList.add("is-dragging");
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", menuDragId);
      }
    });
    row.addEventListener("dragend", (e) => {
      e.stopPropagation();
      row.classList.remove("is-dragging");
      box.querySelectorAll(".is-drag-over").forEach((el) => el.classList.remove("is-drag-over"));
    });
    row.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const tType = row.getAttribute("data-rm-type");
      const tId = row.getAttribute("data-rm-id");
      if (menuDragType === tType && menuDragId !== tId) {
        row.classList.add("is-drag-over");
      }
    });
    row.addEventListener("dragleave", () => {
      row.classList.remove("is-drag-over");
    });
    row.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      row.classList.remove("is-drag-over");
      const tType = row.getAttribute("data-rm-type");
      const tId = row.getAttribute("data-rm-id");
      if (!menuDragId || menuDragType !== tType || menuDragId === tId) return;
      const rect = row.getBoundingClientRect();
      const isBefore = e.clientY < rect.top + rect.height / 2;
      const cur = getServerLayout(sysId);
      if (tType === "chart") cur.chartsOrder = moveArrayItem(cur.chartsOrder, menuDragId, tId, isBefore);
      else if (tType === "check") cur.checksOrder = moveArrayItem(cur.checksOrder, menuDragId, tId, isBefore);
      else if (tType === "cat") cur.catsOrder = moveArrayItem(cur.catsOrder, menuDragId, tId, isBefore);
      else if (tType === "tab") cur.tabsOrder = moveArrayItem(cur.tabsOrder, menuDragId, tId, isBefore);
      saveServerLayout(sysId, cur);
    });
  });

  const btnApplyAll = box.querySelector("#bszl-rm-apply-all");
  if (btnApplyAll) {
    btnApplyAll.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const cur = getServerLayout(sysId);
      saveServerLayout(sysId, cur, true);
      showOverlayToast({
        title: t("rearrangeTitle"),
        tagText: "ALL",
        statusType: "running",
        desc: isEn ? "Layout applied to all servers" : "Порядок параметров применен ко всем серверам",
      });
    };
  }

  const btnReset = box.querySelector("#bszl-rm-reset");
  if (btnReset) {
    btnReset.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      resetServerLayout(sysId);
      showOverlayToast({
        title: srvName,
        tagText: "OK",
        statusType: "running",
        desc: isEn ? "Server layout reset to default" : "Порядок параметров сброшен по умолчанию",
      });
    };
  }
}

function renderSystemDetailPage() {
  const m = window.location.pathname.match(/\/system\/([^/?#]+)/);
  const existingPanel = document.getElementById("bszl-server-security-panel");
  if (!m) {
    if (existingPanel) existingPanel.remove();
    return;
  }

  const rawKey = decodeURIComponent(m[1]);
  const rep = getReport(rawKey);
  const sysId = rep ? rep.system_id : rawKey;
  const gridWrapper = document.querySelector("div.grid.gap-4.mb-14");
  if (!gridWrapper) return;

  let panel = document.getElementById("bszl-server-security-panel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "bszl-server-security-panel";
    panel.className = "rounded-lg border border-border/60 bg-card text-card-foreground shadow-xs bszl-detail-shell";
    const nativeCards = Array.from(gridWrapper.children).filter(
      (el) => el.id !== "bszl-server-security-panel"
    );
    const firstCard = nativeCards[0];
    if (firstCard && firstCard.nextSibling) {
      gridWrapper.insertBefore(panel, firstCard.nextSibling);
    } else {
      gridWrapper.prepend(panel);
    }
  }

  applySystemChartsLayout(sysId);

  if (!rep) return;

  const layout = getServerLayout(sysId);
  const up = rep.updates || {};
  const pendingCount = up.pending_count || 0;
  const up24hCount = up.upgraded_24h_count || 0;
  const dockerStorage = rep.docker_storage || {};
  const dockerContainers = Array.isArray(dockerStorage.containers_io)
    ? dockerStorage.containers_io
    : Array.isArray(up.docker?.containers)
    ? up.docker.containers
    : [];
  const stack = rep.stack || { total: 0, running: 0, items: [] };
  const stackItems = stack.items || [];
  const hasDocker = Boolean(
    dockerContainers.length > 0 ||
    (dockerStorage.total_containers && dockerStorage.total_containers > 0) ||
    stackItems.some((i) => i.type === "docker")
  );
  const hasUpdates = Boolean(
    pendingCount > 0 || up24hCount > 0 || (up.packages && up.packages.length > 0)
  );

  const visibleTabs = layout.tabsOrder.filter((tId) => {
    if (layout.hiddenTabs.includes(tId)) return false;
    if (tId === "docker" && !hasDocker) return false;
    if (tId === "updates" && !hasUpdates && !up.pkg_manager?.includes("apt")) return false;
    return true;
  });
  let activeTab = state.activeTabBySystem[sysId] || visibleTabs[0] || "overview";
  if (!visibleTabs.includes(activeTab) && !state.rearrangeMode) {
    activeTab = visibleTabs[0] || "overview";
  }

  const isChecking = state.loadingSystem === `${sysId}:check`;
  const fb = state.portFeedback[sysId];
  const selectedItem = state.selectedProgramId
    ? stackItems.find((i) => i.id === state.selectedProgramId) || null
    : null;
  const renderKey = `${sysId}:${rep.checked_at_iso}:${activeTab}:${state.loadingSystem}:${state.portBusyKey}:${state.serviceBusyKey || ""}:${state.configBusyKey || ""}:${state.lang}:${state.panelCollapsed}:${state.checksStripExpanded ? 1 : 0}:${state.rearrangeMode ? 1 : 0}:${fb?.ts || 0}:${stackItems.length}:${selectedItem?.id || ""}:${hasDocker ? 1 : 0}:${JSON.stringify(layout)}`;
  if (panel.getAttribute("data-render-key") === renderKey) return;
  panel.setAttribute("data-render-key", renderKey);

  const allChecks = getExtendedChecksList(rep);
  const passedCount = allChecks.filter((c) => c.status === "ok").length;
  const portsCheck = allChecks.find((c) => c.id === "open_ports");
  const fwCheck = allChecks.find((c) => c.id === "firewall");
  const portsList = portsCheck?.metrics?.ports || [];
  const fwRules = fwCheck?.metrics?.rules || [];
  const netInfo = rep.network_health || rep.network || {};
  const stDot = rep.overall_status === "ok" ? "bszl-dot--ok" : "bszl-dot--warn";
  const isEn = state.lang === "en";

  const tabMetaMap = {
    overview: `${t("tabChecks")}${stack.total ? ` (${stack.running})` : ""}`,
    ports: `${t("tabPorts")} (${portsList.length})`,
    docker: `${t("tabDocker")} (${dockerContainers.length})`,
    net: `${t("tabNet")}${netInfo.speedtest?.download_mbps ? ` (${Math.round(netInfo.speedtest.download_mbps)}M)` : ""}`,
    updates: `${t("tabUpdates")} (${pendingCount > 0 ? pendingCount : `+${up24hCount}`})`,
  };

  const tabsToRender = (state.rearrangeMode ? layout.tabsOrder : visibleTabs).filter((tId) => {
    if (tId === "docker" && !hasDocker) return false;
    if (tId === "updates" && !hasUpdates && !up.pkg_manager?.includes("apt")) return false;
    return true;
  });
  const tabsButtonsHtml = tabsToRender
    .map((tId) => {
      const isHid = layout.hiddenTabs.includes(tId);
      return `
        <button type="button" data-tab="${escapeHtml(tId)}" ${state.rearrangeMode ? 'draggable="true"' : ""} class="bszl-tab-btn ${activeTab === tId ? "is-active" : ""} ${isHid ? "is-hidden-item" : ""}">
          ${state.rearrangeMode ? `<span class="bszl-inline-grip">${ICONS.grip}</span>` : ""}
          <span>${escapeHtml(tabMetaMap[tId] || tId)}</span>
        </button>
      `;
    })
    .join("");

  const rearrangeBannerHtml = state.rearrangeMode
    ? `
      <div class="bszl-rearrange-banner">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          ${ICONS.grip}
          <span style="font-weight:600;">${
            isEn
              ? "Rearrange Mode Active: drag checks, categories, tabs, or charts directly on this page"
              : "Режим сортировки активен: перетаскивайте параметры, категории, вкладки и графики прямо на странице"
          }</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <button type="button" id="bszl-btn-rearrange-pos" class="bszl-icon-btn" style="height:26px;padding:0 9px;font-size:0.72rem;">
            <span>${
              layout.panelPos === "bottom"
                ? isEn
                  ? "Panel: Bottom ↑"
                  : "Панель: Снизу ↑"
                : isEn
                ? "Panel: Top ↓"
                : "Панель: Сверху ↓"
            }</span>
          </button>
          <button type="button" id="bszl-btn-rearrange-reset" class="bszl-icon-btn" style="height:26px;padding:0 9px;font-size:0.72rem;">
            <span>${escapeHtml(t("rearrangeReset"))}</span>
          </button>
          <button type="button" id="bszl-btn-rearrange-done" class="bszl-act-btn bszl-act-btn--open" style="height:26px;padding:0 10px;font-size:0.73rem;">
            <span>${escapeHtml(t("rearrangeDone"))}</span>
          </button>
        </div>
      </div>
    `
    : "";

  const sysTelem = rep.telemetry || rep.system_telemetry || {};
  const distroId = (sysTelem.distro_id || "ubuntu").toLowerCase();
  const osBadgeSvg = distroId.includes("debian")
    ? ICONS.debian
    : distroId.includes("ubuntu")
    ? ICONS.ubuntu
    : ICONS.linux;
  const osShortBadge =
    sysTelem.distro_short ||
    (sysTelem.os_pretty ? sysTelem.os_pretty.replace(/\s+LTS$/i, "") : "");

  const topBarHtml = `
    ${rearrangeBannerHtml}
    <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;${state.panelCollapsed ? "" : "margin-bottom:10px;"}">
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
        <span class="bszl-pill ${rep.overall_status === "ok" ? "bszl-pill--ok" : "bszl-pill--warn"}">
          <span class="bszl-dot ${stDot}"></span>
          <span>${passedCount}/${allChecks.length}</span>
        </span>
        ${
          osShortBadge
            ? `<span class="bszl-chip" title="${escapeHtml(sysTelem.kernel_full || rep.kernel || "")}"><span style="display:inline-flex;width:13px;height:13px;">${osBadgeSvg}</span><span>${escapeHtml(osShortBadge)}</span></span>`
            : ""
        }
        ${
          stack.total > 0
            ? `<span class="bszl-chip"><span class="bszl-dot bszl-dot--ok"></span><span>${stack.running}/${stack.total} ON</span></span>`
            : ""
        }
        ${
          state.panelCollapsed
            ? `<span class="bszl-chip">${t("tabPorts")}: ${portsList.length}</span>`
            : `<div class="bszl-tabs-bar" style="flex-wrap:wrap;height:auto;min-height:2.25rem;">${tabsButtonsHtml}</div>`
        }
      </div>

      <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;">
        <button type="button" id="bszl-btn-srv-rearrange" class="bszl-icon-btn ${state.rearrangeMode ? "is-active" : ""}" title="${escapeHtml(t("rearrangeTitle"))}">
          ${ICONS.sliders}
          <span>${state.rearrangeMode ? escapeHtml(t("rearrangeDone")) : (isEn ? "Rearrange" : "Сортировка")}</span>
        </button>
        <button type="button" id="bszl-btn-srv-check" class="bszl-icon-btn" title="${escapeHtml(t("checkNow"))}" ${state.loadingSystem ? "disabled" : ""}>
          ${ICONS.sync(isChecking)}
          <span>${escapeHtml(t("checkNow"))}</span>
        </button>
        ${
          hasUpdates || (up.pkg_manager && up.pkg_manager.includes("apt"))
            ? `
        <button type="button" id="bszl-btn-srv-update" class="bszl-icon-btn" title="${escapeHtml(t("updateNow"))}" ${state.loadingSystem ? "disabled" : ""}>
          <span>${escapeHtml(t("updateNow"))}${pendingCount > 0 ? ` (${pendingCount})` : ""}</span>
        </button>
        <button type="button" id="bszl-btn-srv-rollback" class="bszl-icon-btn" title="${escapeHtml(t("rollbackNow"))}" ${state.loadingSystem || !up.rollback_available ? "disabled" : ""}>
          <span>${state.loadingSystem === `${sysId}:rollback` ? "..." : escapeHtml(t("rollbackNow"))}</span>
        </button>`
            : ""
        }
        <button type="button" id="bszl-btn-panel-collapse" class="bszl-icon-btn" title="${escapeHtml(state.panelCollapsed ? t("expand") : t("hide"))}">
          ${state.panelCollapsed ? ICONS.chevronDown : ICONS.chevronUp}
        </button>
      </div>
    </div>
  `;

  if (state.panelCollapsed) {
    panel.innerHTML = `<div class="bszl-detail-core is-collapsed">${topBarHtml}</div>`;
    bindHeaderButtons(panel, sysId);
    return;
  }

  let bodyHtml = "";
  if (activeTab === "overview") {
    const titles = I18N[state.lang].checkTitles;
    const checksMap = new Map(allChecks.map((c) => [c.id, c]));
    const orderedCheckIds = layout.checksOrder.filter(
      (cid) => checksMap.has(cid) && (state.rearrangeMode || !layout.hiddenChecks.includes(cid))
    );

    const stripHtml = orderedCheckIds
      .map((cid) => {
        const c = checksMap.get(cid);
        const isHid = layout.hiddenChecks.includes(cid);
        const dot = c.status === "ok" ? "bszl-dot--ok" : c.status === "warn" ? "bszl-dot--warn" : "bszl-dot--crit";
        return `
          <div class="bszl-mini-check ${isHid ? "is-hidden-item" : ""} ${state.rearrangeMode ? "is-draggable-item" : ""}" data-check-id="${escapeHtml(c.id)}" ${state.rearrangeMode ? 'draggable="true"' : ""} title="${escapeHtml(c.tooltip || c.title || "")}">
            <span style="display:inline-flex;align-items:center;gap:5px;min-width:0;">
              ${state.rearrangeMode ? `<span class="bszl-inline-grip">${ICONS.grip}</span>` : ""}
              <span class="bszl-dot ${dot}"></span>
              <span style="overflow:hidden;text-overflow:ellipsis;">${escapeHtml(titles[c.id] || c.title)}</span>
            </span>
            <span class="bszl-mini-check-val">${escapeHtml(getShortCheckValue(c))}</span>
          </div>
        `;
      })
      .join("");

    const catDefsMap = {
      vpn: { id: "vpn", title: t("catVpn"), icon: ICONS.sshLock },
      bots: { id: "bots", title: t("catBots"), icon: ICONS.procMemory },
      servers: { id: "servers", title: t("catServers"), icon: ICONS.kernelDisk },
      utils: { id: "utils", title: t("catUtils"), icon: ICONS.shield },
    };

    const orderedCats = layout.catsOrder
      .filter((catId) => catDefsMap[catId] && (state.rearrangeMode || !layout.hiddenCats.includes(catId)))
      .map((catId) => catDefsMap[catId]);

    const stackCatsHtml = orderedCats
      .map((cat) => {
        const items = stackItems
          .filter((i) => i.cat === cat.id)
          .sort((a, b) => {
            const ia = (layout.itemsOrder || []).indexOf(a.id);
            const ib = (layout.itemsOrder || []).indexOf(b.id);
            if (ia === -1 && ib === -1) return 0;
            if (ia === -1) return 1;
            if (ib === -1) return -1;
            return ia - ib;
          });
        if (!items.length) return "";
        const isHid = layout.hiddenCats.includes(cat.id);
        const runCnt = items.filter((i) => i.status === "running" || i.status === "ondemand").length;
        const pills = items
          .map((item) => {
            const isOn = item.status === "running";
            const isOd = item.status === "ondemand";
            const isSel = selectedItem && selectedItem.id === item.id;
            const isBusy = state.serviceBusyKey === `${sysId}:${item.id}`;
            const dotCls = isOn ? "bszl-dot--ok" : isOd ? "bszl-dot--ondemand" : "bszl-dot--crit";
            const tagCls = isOn ? "bszl-svc-tag--on" : isOd ? "bszl-svc-tag--ondemand" : "bszl-svc-tag--off";
            const stLabel = isBusy
              ? "..."
              : state.lang === "en"
              ? item.status_en || (isOn ? "ON" : isOd ? "On-Demand" : "OFF")
              : item.status_ru || (isOn ? "ON" : isOd ? "По запросу" : "OFF");
            return `
              <div class="bszl-svc-pill ${isOn || isOd ? "" : "is-off"} ${isSel ? "is-selected" : ""} ${state.rearrangeMode ? "is-draggable-item" : ""}" data-prog-id="${escapeHtml(item.id)}" ${state.rearrangeMode ? 'draggable="true"' : ""} style="cursor:${state.rearrangeMode ? "grab" : "pointer"};user-select:none;" title="${state.lang === "en" ? "Click: Info · Double-click: ON/OFF · Triple-click: Delete" : "Клик: Описание · Двойной клик: Вкл/Выкл · Тройной клик: Удалить"}">
                ${state.rearrangeMode ? `<span class="bszl-inline-grip">${ICONS.grip}</span>` : ""}
                <span class="bszl-dot ${dotCls}"></span>
                <span>${escapeHtml(item.name)}</span>
                <span class="bszl-svc-tag ${tagCls}">${escapeHtml(stLabel)}</span>
                <button type="button" class="bszl-svc-log-btn js-svc-logs" data-log-id="${escapeHtml(item.id)}" data-log-name="${escapeHtml(item.name)}" title="${state.lang === "en" ? "Live Logs" : "Логи программы"}">&gt;_</button>
              </div>
            `;
          })
          .join("");
        return `
          <div class="bszl-stack-cat ${isHid ? "is-hidden-item" : ""} ${state.rearrangeMode ? "is-draggable-item" : ""}" data-cat-id="${escapeHtml(cat.id)}" ${state.rearrangeMode ? 'draggable="true"' : ""}>
            <div class="bszl-stack-cat-hdr">
              <span style="display:inline-flex;align-items:center;gap:5px;">
                ${state.rearrangeMode ? `<span class="bszl-inline-grip">${ICONS.grip}</span>` : ""}
                ${cat.icon}
                <span>${escapeHtml(cat.title)}</span>
              </span>
              <span>${runCnt}/${items.length}</span>
            </div>
            <div class="bszl-svc-list">${pills}</div>
          </div>
        `;
      })
      .filter(Boolean)
      .join("");

    const sslInfo = rep.ssl_domains || {};
    const certsList = (sslInfo.certs || []);
    const epsList = sslInfo.endpoints || [];
    let sslStripHtml = "";
    if (certsList.length || epsList.length) {
      const epsChips = epsList
        .map((ep) => {
          const dot = ep.ok ? "bszl-dot--ok" : "bszl-dot--crit";
          const dName = decodeDomainPunycode(ep.name);
          return `<span class="bszl-chip"><span class="bszl-dot ${dot}"></span><span>${escapeHtml(dName)}: ${ep.code || "ERR"}</span></span>`;
        })
        .join("");
      const certsChips = certsList
        .slice(0, 8)
        .map((c) => {
          const dot = c.days_left <= 7 ? "bszl-dot--crit" : c.days_left <= 14 ? "bszl-dot--warn" : "bszl-dot--ok";
          const unit = state.lang === "en" ? "d" : "д";
          const dName = decodeDomainPunycode(c.domain);
          return `<span class="bszl-chip" title="${escapeHtml(c.expires_at)}"><span class="bszl-dot ${dot}"></span><span>${escapeHtml(dName)}: ${c.days_left}${unit}</span></span>`;
        })
        .join("");
      sslStripHtml = `
        <div class="bszl-sub-strip">
          <div class="bszl-sub-strip-group">
            <span class="bszl-sub-label">${state.lang === "en" ? "Domains:" : "Домены:"}</span>
            ${epsChips}
            <span class="bszl-sub-label" style="margin-left:6px;">SSL:</span>
            ${certsChips}
          </div>
        </div>
      `;
    }

    const isExpanded = state.checksStripExpanded || state.rearrangeMode;
    const checksToggleText = isExpanded
      ? (state.lang === "en" ? "Hide 12 Indicators ▲" : "Скрыть 12 индикаторов ▲")
      : (state.lang === "en" ? `All 12 Indicators (${passedCount}/${allChecks.length} OK) ▼` : `Все 12 индикаторов (${passedCount}/${allChecks.length} ОК) ▼`);

    const sshVal = checksMap.has("ssh_auth") ? getShortCheckValue(checksMap.get("ssh_auth")) : ":22";
    const ufwVal = checksMap.has("firewall") ? (checksMap.get("firewall").status === "ok" ? "OK" : "Warn") : "OK";
    const f2bVal = checksMap.has("fail2ban") ? getShortCheckValue(checksMap.get("fail2ban")) : "0";
    const diskVal = checksMap.has("kernel_sysctl") ? getShortCheckValue(checksMap.get("kernel_sysctl")) : "0%";
    const inodesVal = checksMap.has("inodes") ? getShortCheckValue(checksMap.get("inodes")) : "0%";
    const oomVal = checksMap.has("oom_reboot") ? getShortCheckValue(checksMap.get("oom_reboot")) : "0";

    const quickBarHtml = `
      <div class="bszl-checks-quick-bar">
        <div class="bszl-cq-left">
          <span class="bszl-cq-title">
            ${ICONS.shield}
            <span>${passedCount === allChecks.length ? (state.lang === "en" ? "12 Checks OK" : "12 проверок в норме") : `${passedCount}/${allChecks.length} ${state.lang === "en" ? "Checks OK" : "в норме"}`}</span>
          </span>
          <div class="bszl-cq-chips">
            <span class="bszl-cq-chip" title="SSH Port & Key Auth"><b>SSH:</b> ${escapeHtml(sshVal)}</span>
            <span class="bszl-cq-chip" title="UFW Firewall"><b>UFW:</b> ${escapeHtml(ufwVal)}</span>
            <span class="bszl-cq-chip" title="Fail2ban Jails & Bans"><b>F2B:</b> ${escapeHtml(f2bVal)}</span>
            <span class="bszl-cq-chip" title="Root Disk Usage"><b>Диск:</b> ${escapeHtml(diskVal)}</span>
            <span class="bszl-cq-chip" title="Inodes Usage"><b>Inodes:</b> ${escapeHtml(inodesVal)}</span>
            <span class="bszl-cq-chip" title="OOM Kills & Uptime"><b>OOM:</b> ${escapeHtml(oomVal)}</span>
          </div>
        </div>
        <button type="button" class="bszl-cq-toggle-btn" id="bszl-btn-toggle-checks" title="${state.lang === "en" ? "Toggle 12 detailed security check cards" : "Показать или скрыть подробную сетку из 12 проверок"}">
          <span>${checksToggleText}</span>
        </button>
      </div>
    `;

    bodyHtml = `
      ${quickBarHtml}
      ${isExpanded ? `<div class="bszl-checks-strip">${stripHtml}</div>` : ""}
      ${stackCatsHtml ? `<div class="bszl-stack-grid">${stackCatsHtml}</div>` : ""}
      ${sslStripHtml}
    `;
  } else if (activeTab === "ports") {
    const draft = state.portFormDraft;
    const portsRowsHtml = portsList
      .map((p) => {
        const isOpen = p.ufw_state === "open";
        const isRestr = p.ufw_state === "restricted";
        const stClass = isOpen ? "bszl-pill--ok" : isRestr ? "bszl-pill--warn" : "bszl-pill--crit";
        const stText = isOpen ? t("ufwOpen") : isRestr ? t("ufwRestricted") : t("ufwClosed");
        const bKey = `toggle:${p.port}:${p.proto}`;
        const isBusy = state.portBusyKey === bKey;

        let actionHtml = "";
        if (p.protected) {
          actionHtml = `<span style="opacity:0.5;font-size:11px;">🔒</span>`;
        } else if (isOpen) {
          actionHtml = `<button type="button" class="bszl-act-btn bszl-act-btn--close js-port-toggle" data-action="close" data-port="${p.port}" data-proto="${escapeHtml(p.proto.toLowerCase())}" data-bkey="${bKey}" ${state.portBusyKey ? "disabled" : ""}>${isBusy ? "..." : t("closeBtn")}</button>`;
        } else {
          actionHtml = `<button type="button" class="bszl-act-btn bszl-act-btn--open js-port-toggle" data-action="open" data-port="${p.port}" data-proto="${escapeHtml(p.proto.toLowerCase())}" data-comment="${escapeHtml(p.note || p.process)}" data-bkey="${bKey}" ${state.portBusyKey ? "disabled" : ""}>${isBusy ? "..." : t("openBtn")}</button>`;
        }

        return `
          <tr>
            <td style="font-weight:600;font-family:monospace;">${p.port}/${escapeHtml(p.proto)}</td>
            <td><span class="bszl-chip">${escapeHtml(p.note || p.process)}</span></td>
            <td><span class="bszl-pill ${stClass}" style="padding:1px 6px;font-size:10px;">${escapeHtml(stText)}</span></td>
            <td style="text-align:right;">${actionHtml}</td>
          </tr>
        `;
      })
      .join("");

    const fwRowsHtml = fwRules
      .map((r) => {
        const isAllow = r.action.toUpperCase().includes("ALLOW");
        const bKey = `del:${r.num}`;
        const isBusy = state.portBusyKey === bKey;
        const actBtn = r.protected
          ? `<span style="opacity:0.5;font-size:11px;">🔒</span>`
          : `<button type="button" class="bszl-act-btn bszl-act-btn--close js-rule-del" data-rnum="${r.num}" data-bkey="${bKey}" ${state.portBusyKey ? "disabled" : ""}>${isBusy ? "..." : "✕"}</button>`;
        return `
          <tr>
            <td style="opacity:0.55;font-family:monospace;">#${r.num}</td>
            <td style="font-weight:600;font-family:monospace;">${escapeHtml(r.to)}</td>
            <td><span class="bszl-pill ${isAllow ? "bszl-pill--ok" : "bszl-pill--crit"}" style="padding:1px 6px;font-size:10px;">${escapeHtml(r.action)}</span></td>
            <td style="font-family:monospace;font-size:11px;opacity:0.75;">${escapeHtml(r.from)}</td>
            <td style="text-align:right;">${actBtn}</td>
          </tr>
        `;
      })
      .join("");

    const f2b = rep.ssh_fail2ban || {};
    const bannedIps = f2b.banned_ips || [];
    const recentLogins = f2b.recent_logins || [];
    const loginsChips = recentLogins
      .slice(0, 4)
      .map(
        (lg) =>
          `<span class="bszl-chip" style="font-family:monospace;font-size:0.68rem;" title="${escapeHtml(lg.last_seen)}"><span class="bszl-dot ${Boolean(lg.is_hub_ip || lg.ip === "127.0.0.1") ? "bszl-dot--ok" : "bszl-dot--ondemand"}"></span><span>${escapeHtml(lg.user)}@${escapeHtml(lg.ip)} (${lg.count})</span></span>`
      )
      .join("");
    const bannedChips = bannedIps.length
      ? bannedIps
          .slice(0, 10)
          .map(
            (ip) =>
              `<span class="bszl-f2b-chip"><span>${escapeHtml(ip)}</span><button type="button" class="bszl-f2b-unban js-f2b-unban" data-ip="${escapeHtml(ip)}" title="${state.lang === "en" ? "Unban IP" : "Разбанить IP"}">✕</button></span>`
          )
          .join("")
      : `<span style="opacity:0.6;font-size:0.7rem;">${state.lang === "en" ? "0 banned" : "0 в бане"}</span>`;

    const sshF2bStripHtml = `
      <div class="bszl-sub-strip" style="margin-bottom:8px;margin-top:0;">
        <div class="bszl-sub-strip-group">
          <span class="bszl-sub-label">SSH:</span>
          ${loginsChips || `<span style="opacity:0.6;font-size:0.7rem;">OK</span>`}
          <span class="bszl-sub-label" style="margin-left:6px;">Fail2ban (${f2b.currently_banned || 0}):</span>
          ${bannedChips}
        </div>
        <div style="display:inline-flex;align-items:center;gap:5px;">
          <input type="text" id="bszl-inp-f2b-ip" class="bszl-input" style="width:128px;height:24px;font-size:0.72rem;" placeholder="IP (Ban)" />
          <button type="button" id="bszl-btn-f2b-ban" class="bszl-act-btn bszl-act-btn--close" style="height:24px;padding:0 8px;font-size:0.7rem;" ${state.portBusyKey ? "disabled" : ""}>${state.lang === "en" ? "Ban IP" : "Бан IP"}</button>
        </div>
      </div>
    `;

    bodyHtml = `
      <div>
        ${sshF2bStripHtml}
        <div class="bszl-port-bar">
          <input type="text" id="bszl-inp-port" class="bszl-input" style="width:148px;" placeholder="${escapeHtml(t("portPlaceholder"))}" value="${escapeHtml(draft.port)}" />
          <select id="bszl-sel-proto" class="bszl-select" style="width:108px;">
            <option value="tcp" ${draft.proto === "tcp" ? "selected" : ""}>TCP</option>
            <option value="udp" ${draft.proto === "udp" ? "selected" : ""}>UDP</option>
            <option value="both" ${draft.proto === "both" ? "selected" : ""}>TCP+UDP</option>
          </select>
          <input type="text" id="bszl-inp-from" class="bszl-input" style="flex:1 1 150px;min-width:140px;max-width:220px;" placeholder="${escapeHtml(t("ipPlaceholder"))}" value="${escapeHtml(draft.from_ip)}" />
          <input type="text" id="bszl-inp-comment" class="bszl-input" style="flex:1 1 160px;min-width:145px;max-width:240px;" placeholder="${escapeHtml(t("commentPlaceholder"))}" value="${escapeHtml(draft.comment)}" />
          <button type="button" id="bszl-btn-port-open" class="bszl-act-btn bszl-act-btn--open" ${state.portBusyKey ? "disabled" : ""}>
            ${state.portBusyKey === "form:open" ? "..." : escapeHtml(t("openPortBtn"))}
          </button>
          <button type="button" id="bszl-btn-port-close" class="bszl-act-btn bszl-act-btn--close" ${state.portBusyKey ? "disabled" : ""}>
            ${state.portBusyKey === "form:close" ? "..." : escapeHtml(t("closePortBtn"))}
          </button>
          ${
            fb && Date.now() - fb.ts < 8000
              ? `<span class="bszl-pill ${fb.ok ? "bszl-pill--ok" : "bszl-pill--crit"}">${escapeHtml(fb.msg.slice(0, 45))}</span>`
              : ""
          }
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:10px;">
          <div class="bszl-table-wrap">
            <table class="bszl-mini-table">
              <thead>
                <tr>
                  <th>${escapeHtml(t("colPort"))}</th>
                  <th>${escapeHtml(t("colService"))}</th>
                  <th>${escapeHtml(t("colUfw"))}</th>
                  <th style="text-align:right;">${escapeHtml(t("colAction"))}</th>
                </tr>
              </thead>
              <tbody>${portsRowsHtml}</tbody>
            </table>
          </div>

          <div class="bszl-table-wrap">
            <table class="bszl-mini-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>${escapeHtml(t("colRule"))}</th>
                  <th>UFW</th>
                  <th>${escapeHtml(t("colFrom"))}</th>
                  <th style="text-align:right;">${escapeHtml(t("colAction"))}</th>
                </tr>
              </thead>
              <tbody>${fwRowsHtml}</tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  } else if (activeTab === "docker") {
    const df = dockerStorage.df || dockerStorage || {};
    const disk = rep.disk || {};
    const diskPct = disk.used_pct ?? 0;
    const inodesPct = disk.inodes_pct ?? 0;
    const estDays = disk.est_days_left ?? 365;
    const growthMb = disk.growth_mb_day ?? 0;

    const imgInfo = df.images || { total: 0, active: 0, size: "0B", reclaimable: "0B" };
    const cntInfo = df.containers || { total: 0, active: 0, size: "0B", reclaimable: "0B" };
    const volInfo = df.volumes || { total: 0, active: 0, size: "0B", reclaimable: "0B" };
    const bcInfo = df.build_cache || { total: 0, active: 0, size: "0B", reclaimable: "0B" };

    const containerRowsHtml = dockerContainers.length
      ? dockerContainers
          .map(
            (c) => `
          <tr>
            <td style="font-weight:600;">${escapeHtml(c.name)}</td>
            <td style="font-family:monospace;font-size:11.5px;opacity:0.8;">${escapeHtml(c.image || "-")}</td>
            <td style="font-family:monospace;">${escapeHtml(c.cpu || c.cpu_pct || "0.0%")}</td>
            <td style="font-family:monospace;">${escapeHtml(c.mem || c.mem_usage || "-")}</td>
            <td style="font-family:monospace;font-size:11.5px;color:#10b981;">${escapeHtml(c.block_io || "0B / 0B")}</td>
            <td style="font-family:monospace;font-size:11.5px;color:#3b82f6;">${escapeHtml(c.net_io || "0B / 0B")}</td>
            <td><span class="bszl-pill ${c.state === "exited" ? "bszl-pill--warn" : "bszl-pill--ok"}" style="padding:1px 6px;font-size:10px;">${escapeHtml(c.status || "Up")}</span></td>
          </tr>
        `
          )
          .join("")
      : `<tr><td colspan="7" style="text-align:center;opacity:0.65;padding:12px;">${
          isEn ? "No active Docker containers on this host" : "Нет запущенных контейнеров Docker на этом сервере"
        }</td></tr>`;

    bodyHtml = `
      <div>
        <div class="bszl-kpi-grid" style="margin-bottom:10px;">
          <div class="bszl-kpi-card">
            <div class="bszl-kpi-hdr">
              <span>${isEn ? "Root Disk & Growth" : "Диск и тренд роста"}</span>
              <span class="bszl-pill ${diskPct >= 90 ? "bszl-pill--crit" : diskPct >= 80 ? "bszl-pill--warn" : "bszl-pill--ok"}">${diskPct}%</span>
            </div>
            <div class="bszl-kpi-val">${disk.used_gb ?? 0} / ${disk.total_gb ?? 0} GB</div>
            <div class="bszl-kpi-sub">
              ${isEn ? "Free:" : "Свободно:"} ${disk.free_gb ?? 0} GB · ${growthMb >= 0 ? `+${growthMb}` : growthMb} MB/d · ${estDays >= 365 ? (isEn ? ">365 days left" : ">365 дн. запаса") : `~${estDays}d`}
            </div>
          </div>

          <div class="bszl-kpi-card">
            <div class="bszl-kpi-hdr">
              <span>Inodes (Filesystem)</span>
              <span class="bszl-pill ${inodesPct >= 85 ? "bszl-pill--warn" : "bszl-pill--ok"}">${inodesPct}%</span>
            </div>
            <div class="bszl-kpi-val">${(disk.inodes_used || 0).toLocaleString()}</div>
            <div class="bszl-kpi-sub">
              ${isEn ? "Total Inodes:" : "Всего Inodes:"} ${(disk.inodes_total || 0).toLocaleString()}
            </div>
          </div>

          <div class="bszl-kpi-card">
            <div class="bszl-kpi-hdr">
              <span>Docker Images & Cache</span>
              <span class="bszl-chip">${imgInfo.active}/${imgInfo.total}</span>
            </div>
            <div class="bszl-kpi-val">${escapeHtml(imgInfo.size)}</div>
            <div class="bszl-kpi-sub">
              ${isEn ? "Reclaimable:" : "Можно очистить:"} ${escapeHtml(imgInfo.reclaimable)} · Cache: ${escapeHtml(bcInfo.size)}
            </div>
          </div>

          <div class="bszl-kpi-card">
            <div class="bszl-kpi-hdr">
              <span>Docker Volumes & Layer</span>
              <span class="bszl-chip">${volInfo.total} vol</span>
            </div>
            <div class="bszl-kpi-val">${escapeHtml(volInfo.size)}</div>
            <div class="bszl-kpi-sub">
              Containers RW: ${escapeHtml(cntInfo.size)}
            </div>
          </div>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <span class="bszl-sub-label">${isEn ? "Per-Container I/O & Telemetry" : "Диск I/O и ресурсы контейнеров"} (${dockerContainers.length})</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <button type="button" id="bszl-btn-docker-prune" class="bszl-icon-btn" ${state.loadingSystem ? "disabled" : ""}>
              ${ICONS.sync(state.loadingSystem === `${sysId}:docker_prune`)}
              <span>${escapeHtml(t("pruneDockerBtn"))}</span>
            </button>
            <button type="button" id="bszl-btn-docker-update" class="bszl-icon-btn" ${state.loadingSystem ? "disabled" : ""}>
              ${ICONS.sync(state.loadingSystem === `${sysId}:docker_update`)}
              <span>${isEn ? "Update Containers" : "Обновить контейнеры"}</span>
            </button>
            <button type="button" id="bszl-btn-disk-cleanup" class="bszl-icon-btn" ${state.loadingSystem ? "disabled" : ""}>
              ${ICONS.sync(state.loadingSystem === `${sysId}:disk_cleanup`)}
              <span>${isEn ? `Clean Disk (${diskPct}%)` : `Очистить диск (${diskPct}%)`}</span>
            </button>
          </div>
        </div>

        <div class="bszl-table-wrap">
          <table class="bszl-mini-table">
            <thead>
              <tr>
                <th>Container</th>
                <th>Image</th>
                <th>CPU</th>
                <th>RAM</th>
                <th>Block I/O (R / W)</th>
                <th>Net I/O (RX / TX)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>${containerRowsHtml}</tbody>
          </table>
        </div>
      </div>
    `;
  } else if (activeTab === "net") {
    const st = netInfo.speedtest || {};
    const hist = st.history || netInfo.history || [];

    const dlMbps = st.download_mbps ?? 0;
    const ulMbps = st.upload_mbps ?? 0;
    const pingMs = netInfo.ping_ms ?? st.ping_ms ?? 0;
    const jitterMs = netInfo.jitter_ms ?? st.jitter_ms ?? 0;
    const lossPct = netInfo.packet_loss_pct ?? 0;
    const ifaceName = netInfo.iface || "eth0";
    const rxDrop = netInfo.rx_dropped ?? 0;
    const txDrop = netInfo.tx_dropped ?? 0;
    const rxErr = netInfo.rx_errors ?? 0;
    const txErr = netInfo.tx_errors ?? 0;
    const dropsTotal = netInfo.total_dropped ?? rxDrop + txDrop;
    const errsTotal = netInfo.total_errors ?? rxErr + txErr;

    const histRowsHtml = hist.length
      ? hist
          .slice()
          .map(
            (h) => `
          <tr>
            <td style="font-family:monospace;">${escapeHtml(h.timestamp || "-")}</td>
            <td style="font-weight:600;color:#10b981;">↓ ${h.download_mbps ?? 0} Mbps</td>
            <td style="font-weight:600;color:#3b82f6;">↑ ${h.upload_mbps ?? 0} Mbps</td>
            <td style="font-family:monospace;">${h.ping_ms ?? 0} ms</td>
            <td style="font-family:monospace;opacity:0.8;">±${h.jitter_ms ?? 0} ms</td>
          </tr>
        `
          )
          .join("")
      : `<tr><td colspan="5" style="text-align:center;opacity:0.65;padding:12px;">${
          isEn
            ? "Click 'Run Speedtest' to measure live Download/Upload bandwidth"
            : "Нажмите «Запустить Speedtest» для замера скорости канала Download / Upload"
        }</td></tr>`;

    bodyHtml = `
      <div>
        <div class="bszl-kpi-grid" style="margin-bottom:10px;">
          <div class="bszl-kpi-card">
            <div class="bszl-kpi-hdr">
              <span>Download Bandwidth</span>
              <span class="bszl-chip">Cloudflare Edge</span>
            </div>
            <div class="bszl-kpi-val" style="color:#10b981;">${dlMbps > 0 ? `${dlMbps} Mbps` : "—"}</div>
            <div class="bszl-kpi-sub">${st.timestamp ? `${isEn ? "Tested:" : "Замер:"} ${escapeHtml(st.timestamp)}` : isEn ? "Ready to test" : "Готов к замеру"}</div>
          </div>

          <div class="bszl-kpi-card">
            <div class="bszl-kpi-hdr">
              <span>Upload Bandwidth</span>
              <span class="bszl-chip">HTTPS POST</span>
            </div>
            <div class="bszl-kpi-val" style="color:#3b82f6;">${ulMbps > 0 ? `${ulMbps} Mbps` : "—"}</div>
            <div class="bszl-kpi-sub">${isEn ? "Outbound throughput" : "Исходящий канал сервера"}</div>
          </div>

          <div class="bszl-kpi-card">
            <div class="bszl-kpi-hdr">
              <span>ICMP Ping & Jitter</span>
              <span class="bszl-pill ${lossPct > 0 ? "bszl-pill--warn" : "bszl-pill--ok"}">Loss ${lossPct}%</span>
            </div>
            <div class="bszl-kpi-val">${pingMs} ms</div>
            <div class="bszl-kpi-sub">Jitter: ±${jitterMs} ms · Target: 1.1.1.1</div>
          </div>

          <div class="bszl-kpi-card">
            <div class="bszl-kpi-hdr">
              <span>Interface (${escapeHtml(ifaceName)})</span>
              <span class="bszl-pill ${errsTotal > 0 ? "bszl-pill--warn" : "bszl-pill--ok"}">${errsTotal} err</span>
            </div>
            <div class="bszl-kpi-val">${dropsTotal} drops</div>
            <div class="bszl-kpi-sub">RX/TX Drops: ${rxDrop}/${txDrop} · Err: ${rxErr}/${txErr}</div>
          </div>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
          <span class="bszl-sub-label">${isEn ? "Speedtest History" : "История замеров Speedtest"}</span>
          <button type="button" id="bszl-btn-run-speedtest" class="bszl-act-btn bszl-act-btn--open" style="height:2rem;padding:0 12px;font-size:0.78rem;" ${state.loadingSystem ? "disabled" : ""}>
            ${ICONS.sync(state.loadingSystem === `${sysId}:speedtest`)}
            <span>${escapeHtml(t("runSpeedtestBtn"))}</span>
          </button>
        </div>

        <div class="bszl-table-wrap">
          <table class="bszl-mini-table">
            <thead>
              <tr>
                <th>${escapeHtml(t("colTime"))}</th>
                <th>Download</th>
                <th>Upload</th>
                <th>Ping</th>
                <th>Jitter</th>
              </tr>
            </thead>
            <tbody>${histRowsHtml}</tbody>
          </table>
        </div>
      </div>
    `;
  } else if (activeTab === "updates") {
    const pendingRowsHtml = (up.pending_packages || []).length
      ? up.pending_packages
          .map(
            (p) => `
          <tr>
            <td style="font-weight:600;">${escapeHtml(p.name)}</td>
            <td style="opacity:0.75;font-family:monospace;font-size:11.5px;">${escapeHtml(p.old_version)}</td>
            <td class="bszl-ver-pending">→ ${escapeHtml(p.new_version)}</td>
          </tr>`
          )
          .join("")
      : `<tr><td colspan="3" style="text-align:center;opacity:0.65;padding:12px;">${escapeHtml(t("noPending"))}</td></tr>`;

    const recentPkgs = up.upgraded_24h?.length ? up.upgraded_24h : up.upgraded_recent || [];
    const pkgsRowsHtml = recentPkgs.length
      ? recentPkgs
          .slice(0, 20)
          .map(
            (p) => `
          <tr>
            <td style="font-weight:600;">${escapeHtml(p.name)}</td>
            <td class="bszl-ver-new">${escapeHtml(p.new_version)}</td>
            <td style="opacity:0.65;font-size:11.5px;">${escapeHtml(p.timestamp)}</td>
          </tr>`
          )
          .join("")
      : `<tr><td colspan="3" style="text-align:center;opacity:0.65;padding:12px;">${escapeHtml(t("noRecent"))}</td></tr>`;

    const rbCount = up.rollback_packages_count || 0;
    const lastRb = up.last_rollback;
    const vulnInfo = rep.vulnerabilities || up.vulnerabilities || {};
    const patchedCvesCount = (vulnInfo.patched_cves || []).length;
    const dockerInfo = up.docker || {};
    const dockerCnt = (dockerInfo.containers || []).length || up.running_containers_count || 0;
    const diskInfo = rep.disk || {};
    const diskPct = diskInfo.used_pct ?? ((rep.checks || []).find((c) => c.id === "kernel_sysctl")?.metrics?.root_disk_percent ?? 0);
    const agCfg = rep.agent_config || {
      auto_patch_cve: true,
      auto_rollback: true,
      auto_docker_update: true,
      disk_cleanup_threshold_pct: 90,
    };

    bodyHtml = `
      <div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <button type="button" class="bszl-pill ${agCfg.auto_patch_cve ? "bszl-pill--ok" : "bszl-pill--warn"} js-agent-cfg-toggle" data-cfg-key="auto_patch_cve" data-cfg-val="${agCfg.auto_patch_cve ? "0" : "1"}" style="cursor:pointer;" title="${isEn ? "Click to toggle CVE Auto-Patch on this server" : "Клик: включить/выключить авто-патч CVE на этом сервере"}">
              <span class="bszl-dot ${agCfg.auto_patch_cve ? "bszl-dot--ok" : "bszl-dot--warn"}"></span>
              <span>CVE Auto-Patch: ${agCfg.auto_patch_cve ? "ON" : "OFF"}</span>
            </button>
            <button type="button" class="bszl-pill ${agCfg.auto_rollback ? "bszl-pill--ok" : "bszl-pill--warn"} js-agent-cfg-toggle" data-cfg-key="auto_rollback" data-cfg-val="${agCfg.auto_rollback ? "0" : "1"}" style="cursor:pointer;" title="${isEn ? "Click to toggle Auto-Rollback Guard" : "Клик: включить/выключить авто-откат при сбое"}">
              <span class="bszl-dot ${agCfg.auto_rollback ? "bszl-dot--ok" : "bszl-dot--warn"}"></span>
              <span>${isEn ? "Auto-Rollback" : "Авто-откат"}: ${agCfg.auto_rollback ? "ON" : "OFF"}</span>
            </button>
            <button type="button" class="bszl-pill ${agCfg.auto_docker_update ? "bszl-pill--ok" : "bszl-pill--warn"} js-agent-cfg-toggle" data-cfg-key="auto_docker_update" data-cfg-val="${agCfg.auto_docker_update ? "0" : "1"}" style="cursor:pointer;" title="${isEn ? "Click to toggle daily 04:00 Docker auto-update" : "Клик: включить/выключить автообновление Docker в 04:00"}">
              <span class="bszl-dot ${agCfg.auto_docker_update ? "bszl-dot--ok" : "bszl-dot--warn"}"></span>
              <span>Auto-Docker: ${agCfg.auto_docker_update ? "ON" : "OFF"}</span>
            </button>
            <span class="bszl-chip">${escapeHtml(t("snapshotCount"))}: ${rbCount}</span>
            ${
              patchedCvesCount > 0
                ? `<span class="bszl-chip">CVE: ${patchedCvesCount}</span>`
                : ""
            }
            ${
              lastRb
                ? `<span class="bszl-chip">${escapeHtml(lastRb.timestamp)} · ${lastRb.rolled_back_count || 0}</span>`
                : ""
            }
          </div>
          <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;">
            <button type="button" id="bszl-btn-agent-update" class="bszl-icon-btn" title="${isEn ? "Push latest agent script from Hub" : "Обновить скрипт агента с центрального хаба"}" ${state.loadingSystem ? "disabled" : ""}>
              ${ICONS.sync(state.loadingSystem === `${sysId}:agent_update`)}
              <span>${escapeHtml(t("updateAgentBtn"))}</span>
            </button>
            ${
              dockerCnt > 0
                ? `<button type="button" id="bszl-btn-docker-update" class="bszl-icon-btn" ${state.loadingSystem ? "disabled" : ""}>
                    ${ICONS.sync(state.loadingSystem === `${sysId}:docker_update`)}
                    <span>Docker (${dockerCnt})</span>
                  </button>`
                : ""
            }
            ${
              dockerInfo.rollback_available
                ? `<button type="button" id="bszl-btn-docker-rollback" class="bszl-icon-btn" ${state.loadingSystem ? "disabled" : ""}>
                    <span>${isEn ? "Rollback Docker" : "Откат Docker"}</span>
                  </button>`
                : ""
            }
            <button type="button" id="bszl-btn-disk-cleanup" class="bszl-icon-btn" title="Auto-cleanup <10% free" ${state.loadingSystem ? "disabled" : ""}>
              ${ICONS.sync(state.loadingSystem === `${sysId}:disk_cleanup`)}
              <span>${isEn ? `Disk ${diskPct}% · Clean` : `Диск ${diskPct}% · Очистить`}</span>
            </button>
            <button type="button" id="bszl-btn-open-notifs" class="bszl-icon-btn">
              ${ICONS.bell}
              <span>${escapeHtml(t("openNotifsBtn"))}</span>
            </button>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:10px;">
          <div class="bszl-table-wrap">
            <table class="bszl-mini-table">
              <thead>
                <tr><th>${escapeHtml(t("pendingUpdates"))} (${pendingCount})</th><th>${escapeHtml(t("colOld"))}</th><th>${escapeHtml(t("colNew"))}</th></tr>
              </thead>
              <tbody>${pendingRowsHtml}</tbody>
            </table>
          </div>
          <div class="bszl-table-wrap">
            <table class="bszl-mini-table">
              <thead>
                <tr><th>${escapeHtml(t("installedUpdates"))} (+${up24hCount})</th><th>${escapeHtml(t("colNew"))}</th><th>${escapeHtml(t("colTime"))}</th></tr>
              </thead>
              <tbody>${pkgsRowsHtml}</tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  panel.innerHTML = `
    <div class="bszl-detail-core">
      ${topBarHtml}
      ${bodyHtml}
    </div>
  `;

  bindHeaderButtons(panel, sysId);

  const btnToggleChecks = panel.querySelector("#bszl-btn-toggle-checks");
  if (btnToggleChecks) {
    btnToggleChecks.onclick = (e) => {
      e.preventDefault();
      state.checksStripExpanded = !state.checksStripExpanded;
      try {
        localStorage.setItem("bszl_checks_expanded", state.checksStripExpanded ? "1" : "0");
      } catch (err) {}
      panel.removeAttribute("data-render-key");
      renderAll();
    };
  }

  const btnOpenNotifs = panel.querySelector("#bszl-btn-open-notifs");
  if (btnOpenNotifs) {
    btnOpenNotifs.onclick = () => toggleNotificationsPage(true, sysId);
  }

  const btnAgentUpd = panel.querySelector("#bszl-btn-agent-update");
  if (btnAgentUpd) {
    btnAgentUpd.onclick = () => triggerAudit(sysId, "agent_update");
  }

  const btnDockerPrune = panel.querySelector("#bszl-btn-docker-prune");
  if (btnDockerPrune) {
    btnDockerPrune.onclick = () => triggerAudit(sysId, "docker_prune");
  }

  const btnRunSpeedtest = panel.querySelector("#bszl-btn-run-speedtest");
  if (btnRunSpeedtest) {
    btnRunSpeedtest.onclick = () => triggerAudit(sysId, "speedtest");
  }

  const btnDockerUpd = panel.querySelector("#bszl-btn-docker-update");
  if (btnDockerUpd) {
    btnDockerUpd.onclick = () => triggerAudit(sysId, "docker_update");
  }

  const btnDockerRb = panel.querySelector("#bszl-btn-docker-rollback");
  if (btnDockerRb) {
    btnDockerRb.onclick = () => triggerAudit(sysId, "docker_rollback");
  }

  const btnDiskClean = panel.querySelector("#bszl-btn-disk-cleanup");
  if (btnDiskClean) {
    btnDiskClean.onclick = () => triggerAudit(sysId, "disk_cleanup");
  }

  panel.querySelectorAll(".js-agent-cfg-toggle").forEach((btn) => {
    btn.onclick = () => {
      const k = btn.getAttribute("data-cfg-key");
      const v = btn.getAttribute("data-cfg-val") === "1";
      if (k) triggerAgentConfigUpdate(sysId, { [k]: v });
    };
  });

  panel.querySelectorAll(".js-svc-logs").forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const logId = btn.getAttribute("data-log-id");
      const logName = btn.getAttribute("data-log-name") || logId;
      openServiceLogsModal(sysId, logId, logName);
    };
  });

  panel.querySelectorAll(".js-f2b-unban").forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const ip = btn.getAttribute("data-ip");
      if (ip) triggerFail2banAction(sysId, "unban", ip);
    };
  });

  const btnF2bBan = panel.querySelector("#bszl-btn-f2b-ban");
  const inpF2bIp = panel.querySelector("#bszl-inp-f2b-ip");
  if (btnF2bBan && inpF2bIp) {
    btnF2bBan.onclick = () => {
      const ip = inpF2bIp.value.trim();
      if (ip) triggerFail2banAction(sysId, "ban", ip);
    };
  }

  panel.querySelectorAll(".bszl-tab-btn").forEach((btn) => {
    const tId = btn.getAttribute("data-tab");
    btn.onclick = () => {
      state.activeTabBySystem[sysId] = tId;
      panel.removeAttribute("data-render-key");
      renderSystemDetailPage();
    };
    if (state.rearrangeMode) {
      btn.addEventListener("dragstart", (e) => {
        state.dragSourceType = "tab";
        state.dragSourceId = tId;
        btn.classList.add("is-dragging");
        if (e.dataTransfer) e.dataTransfer.setData("text/plain", tId);
      });
      btn.addEventListener("dragend", () => btn.classList.remove("is-dragging"));
      btn.addEventListener("dragover", (e) => {
        if (state.dragSourceType === "tab" && state.dragSourceId !== tId) {
          e.preventDefault();
          btn.classList.add("is-drag-over");
        }
      });
      btn.addEventListener("dragleave", () => btn.classList.remove("is-drag-over"));
      btn.addEventListener("drop", (e) => {
        if (state.dragSourceType === "tab" && state.dragSourceId && state.dragSourceId !== tId) {
          e.preventDefault();
          btn.classList.remove("is-drag-over");
          const cur = getServerLayout(sysId);
          cur.tabsOrder = moveArrayItem(cur.tabsOrder, state.dragSourceId, tId);
          saveServerLayout(sysId, cur);
        }
      });
    }
  });

  panel.querySelectorAll(".bszl-mini-check[data-check-id]").forEach((c) => {
    const cid = c.getAttribute("data-check-id");
    if (["firewall", "open_ports", "fail2ban", "ssh_auth"].includes(cid)) {
      c.style.cursor = state.rearrangeMode ? "grab" : "pointer";
      c.onclick = () => {
        if (state.rearrangeMode) return;
        state.activeTabBySystem[sysId] = "ports";
        panel.removeAttribute("data-render-key");
        renderSystemDetailPage();
      };
    } else if (["kernel_sysctl", "inodes", "disk_trend"].includes(cid)) {
      c.style.cursor = state.rearrangeMode ? "grab" : "pointer";
      c.onclick = () => {
        if (state.rearrangeMode) return;
        state.activeTabBySystem[sysId] = "docker";
        panel.removeAttribute("data-render-key");
        renderSystemDetailPage();
      };
    } else if (cid === "cron_timers") {
      c.style.cursor = state.rearrangeMode ? "grab" : "pointer";
      c.onclick = () => {
        if (state.rearrangeMode) return;
        state.activeTabBySystem[sysId] = "updates";
        panel.removeAttribute("data-render-key");
        renderSystemDetailPage();
      };
    }
    if (state.rearrangeMode) {
      c.addEventListener("dragstart", (e) => {
        state.dragSourceType = "check";
        state.dragSourceId = cid;
        c.classList.add("is-dragging");
        if (e.dataTransfer) e.dataTransfer.setData("text/plain", cid);
      });
      c.addEventListener("dragend", () => c.classList.remove("is-dragging"));
      c.addEventListener("dragover", (e) => {
        if (state.dragSourceType === "check" && state.dragSourceId !== cid) {
          e.preventDefault();
          c.classList.add("is-drag-over");
        }
      });
      c.addEventListener("dragleave", () => c.classList.remove("is-drag-over"));
      c.addEventListener("drop", (e) => {
        if (state.dragSourceType === "check" && state.dragSourceId && state.dragSourceId !== cid) {
          e.preventDefault();
          c.classList.remove("is-drag-over");
          const cur = getServerLayout(sysId);
          cur.checksOrder = moveArrayItem(cur.checksOrder, state.dragSourceId, cid);
          saveServerLayout(sysId, cur);
        }
      });
    }
  });

  if (state.rearrangeMode) {
    panel.querySelectorAll(".bszl-stack-cat[data-cat-id]").forEach((catEl) => {
      const catId = catEl.getAttribute("data-cat-id");
      catEl.addEventListener("dragstart", (e) => {
        state.dragSourceType = "cat";
        state.dragSourceId = catId;
        catEl.classList.add("is-dragging");
        if (e.dataTransfer) e.dataTransfer.setData("text/plain", catId);
      });
      catEl.addEventListener("dragend", () => catEl.classList.remove("is-dragging"));
      catEl.addEventListener("dragover", (e) => {
        if (state.dragSourceType === "cat" && state.dragSourceId !== catId) {
          e.preventDefault();
          catEl.classList.add("is-drag-over");
        }
      });
      catEl.addEventListener("dragleave", () => catEl.classList.remove("is-drag-over"));
      catEl.addEventListener("drop", (e) => {
        if (state.dragSourceType === "cat" && state.dragSourceId && state.dragSourceId !== catId) {
          e.preventDefault();
          catEl.classList.remove("is-drag-over");
          const cur = getServerLayout(sysId);
          cur.catsOrder = moveArrayItem(cur.catsOrder, state.dragSourceId, catId);
          saveServerLayout(sysId, cur);
        }
      });
    });
  }

  panel.querySelectorAll(".bszl-svc-pill[data-prog-id]").forEach((pill) => {
    const pid = pill.getAttribute("data-prog-id");
    if (state.rearrangeMode) {
      pill.addEventListener("dragstart", (e) => {
        e.stopPropagation();
        state.dragSourceType = "svc";
        state.dragSourceId = pid;
        pill.classList.add("is-dragging");
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", pid);
        }
      });
      pill.addEventListener("dragend", (e) => {
        e.stopPropagation();
        pill.classList.remove("is-dragging");
      });
      pill.addEventListener("dragover", (e) => {
        if (state.dragSourceType === "svc" && state.dragSourceId !== pid) {
          e.preventDefault();
          e.stopPropagation();
          pill.classList.add("is-drag-over");
        }
      });
      pill.addEventListener("dragleave", () => pill.classList.remove("is-drag-over"));
      pill.addEventListener("drop", (e) => {
        if (state.dragSourceType === "svc" && state.dragSourceId && state.dragSourceId !== pid) {
          e.preventDefault();
          e.stopPropagation();
          pill.classList.remove("is-drag-over");
          const cur = getServerLayout(sysId);
          const allIds = stackItems.map((i) => i.id);
          const baseOrder =
            Array.isArray(cur.itemsOrder) && cur.itemsOrder.length
              ? [...cur.itemsOrder, ...allIds.filter((id) => !cur.itemsOrder.includes(id))]
              : allIds;
          cur.itemsOrder = moveArrayItem(baseOrder, state.dragSourceId, pid);
          saveServerLayout(sysId, cur);
        }
      });
    }

    pill.onclick = (e) => {
      if (state.rearrangeMode) return;
      if (e.target.closest(".js-svc-logs")) return;
      e.preventDefault();
      const item = stackItems.find((i) => i.id === pid);
      if (!item) return;

      if (state.clickPid !== pid) {
        state.clickPid = pid;
        state.clickCount = 0;
      }
      state.clickCount = (state.clickCount || 0) + 1;

      if (state.clickDebounceTimer) {
        clearTimeout(state.clickDebounceTimer);
        state.clickDebounceTimer = null;
      }

      if (state.clickCount >= 3) {
        state.clickCount = 0;
        state.clickPid = null;
        openDeleteServiceModal(sysId, item);
        return;
      }

      const currentCount = state.clickCount;
      state.clickDebounceTimer = setTimeout(() => {
        state.clickDebounceTimer = null;
        state.clickCount = 0;
        state.clickPid = null;

        if (currentCount === 2) {
          const cleanName = String(item.name || pid);
          triggerServiceToggle(sysId, item.id, cleanName);
          return;
        }

        state.selectedProgramId = pid;
        panel.removeAttribute("data-render-key");
        renderSystemDetailPage();
        const isOn = item.status === "running";
        const isOd = item.status === "ondemand";
        const stText =
          state.lang === "en"
            ? item.status_en || (isOn ? "ON" : isOd ? "On-Demand" : "OFF")
            : item.status_ru || (isOn ? "ON" : isOd ? "По запросу" : "OFF");
        const descObj = PROGRAM_INFO[item.id];
        const descText = descObj
          ? descObj[state.lang] || descObj.ru
          : state.lang === "en"
          ? `${item.name} service detected on this server.`
          : `Сервис ${item.name}, установленный на этом сервере.`;
        showOverlayToast({
          title: item.name,
          tagText: stText,
          statusType: item.status,
          desc: descText,
          progId: item.id,
        });
      }, 280);
    };
  });

  const inpPort = panel.querySelector("#bszl-inp-port");
  const selProto = panel.querySelector("#bszl-sel-proto");
  const inpFrom = panel.querySelector("#bszl-inp-from");
  const inpComment = panel.querySelector("#bszl-inp-comment");
  if (inpPort) inpPort.oninput = (e) => (state.portFormDraft.port = e.target.value);
  if (selProto) selProto.onchange = (e) => (state.portFormDraft.proto = e.target.value);
  if (inpFrom) inpFrom.oninput = (e) => (state.portFormDraft.from_ip = e.target.value);
  if (inpComment) inpComment.oninput = (e) => (state.portFormDraft.comment = e.target.value);

  const btnPortOpen = panel.querySelector("#bszl-btn-port-open");
  if (btnPortOpen) {
    btnPortOpen.onclick = () => {
      const p = (state.portFormDraft.port || "").trim();
      if (!p) return;
      triggerPortAction(
        sysId,
        {
          action: "open",
          port: p,
          proto: state.portFormDraft.proto || "tcp",
          from_ip: state.portFormDraft.from_ip || "Anywhere",
          comment: state.portFormDraft.comment || "",
        },
        "form:open"
      );
    };
  }

  const btnPortClose = panel.querySelector("#bszl-btn-port-close");
  if (btnPortClose) {
    btnPortClose.onclick = () => {
      const p = (state.portFormDraft.port || "").trim();
      if (!p) return;
      triggerPortAction(
        sysId,
        {
          action: "close",
          port: p,
          proto: state.portFormDraft.proto || "tcp",
          from_ip: state.portFormDraft.from_ip || "Anywhere",
        },
        "form:close"
      );
    };
  }

  panel.querySelectorAll(".js-port-toggle").forEach((btn) => {
    btn.onclick = () => {
      triggerPortAction(
        sysId,
        {
          action: btn.getAttribute("data-action"),
          port: btn.getAttribute("data-port"),
          proto: btn.getAttribute("data-proto"),
          comment: btn.getAttribute("data-comment") || "",
        },
        btn.getAttribute("data-bkey")
      );
    };
  });

  panel.querySelectorAll(".js-rule-del").forEach((btn) => {
    btn.onclick = () => {
      triggerPortAction(
        sysId,
        {
          action: "delete_rule",
          rule_num: Number(btn.getAttribute("data-rnum")),
        },
        btn.getAttribute("data-bkey")
      );
    };
  });
}

function bindHeaderButtons(panel, sysId) {
  const btnRearrange = panel.querySelector("#bszl-btn-srv-rearrange");
  if (btnRearrange) {
    btnRearrange.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      state.rearrangeMode = !state.rearrangeMode;
      renderAll();
    };
  }

  const btnCollapse = panel.querySelector("#bszl-btn-panel-collapse");
  if (btnCollapse) btnCollapse.onclick = togglePanelCollapsed;

  const btnCheck = panel.querySelector("#bszl-btn-srv-check");
  if (btnCheck) btnCheck.onclick = () => triggerAudit(sysId, "check");

  const btnUpdate = panel.querySelector("#bszl-btn-srv-update");
  if (btnUpdate) btnUpdate.onclick = () => triggerAudit(sysId, "update");

  const btnRollback = panel.querySelector("#bszl-btn-srv-rollback");
  if (btnRollback) btnRollback.onclick = () => triggerAudit(sysId, "rollback");

  const btnRearrangeDone = panel.querySelector("#bszl-btn-rearrange-done");
  if (btnRearrangeDone) {
    btnRearrangeDone.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      exitRearrangeMode();
    };
  }

  const btnRearrangeReset = panel.querySelector("#bszl-btn-rearrange-reset");
  if (btnRearrangeReset) {
    btnRearrangeReset.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      resetServerLayout(sysId);
    };
  }

  const btnRearrangePos = panel.querySelector("#bszl-btn-rearrange-pos");
  if (btnRearrangePos) {
    btnRearrangePos.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const cur = getServerLayout(sysId);
      cur.panelPos = cur.panelPos === "bottom" ? "top" : "bottom";
      saveServerLayout(sysId, cur);
    };
  }
}

function updateFooterLinks() {
  if (typeof globalThis !== "undefined" && globalThis.BESZEL) {
    globalThis.BESZEL.HUB_VERSION = "0.0.1";
  }
  const links = document.querySelectorAll('a[href*="github.com/henrygd/beszel"]');
  links.forEach((a) => {
    a.href = a.href.replace("github.com/henrygd/beszel", "github.com/bledny1099/beszel");
  });
  document.querySelectorAll('a[href*="/releases"]').forEach((a) => {
    if (a.textContent) {
      a.textContent = a.textContent.replace("0.21.0", "0.0.1").replace("0.21.1", "0.0.1");
    }
  });
}

function renderAll() {
  renderTopNavbarLangSwitcher();
  renderNotificationsPage();
  updateFooterLinks();
  if (!state.notificationsPageOpen) {
    renderHomeTable();
    renderSystemDetailPage();
    enhanceSettings2Menu();
  }
}

function init() {
  syncBeszelNativeLang(state.lang);
  fetchReports();
  setInterval(fetchReports, 45000);

  document.addEventListener("click", () => {
    document.querySelectorAll(".bszl-lang-menu.is-open").forEach((m) => m.classList.remove("is-open"));
  });

  // Global capture listener for Done button in Rearrange Mode so it always closes immediately
  ["pointerdown", "click"].forEach((evType) => {
    document.addEventListener(
      evType,
      (e) => {
        const doneBtn = e.target && e.target.nodeType === 1 ? e.target.closest("#bszl-btn-rearrange-done") : null;
        if (doneBtn) {
          e.preventDefault();
          e.stopPropagation();
          exitRearrangeMode();
        }
      },
      true
    );
  });

  let debounceTimer = null;
  const scheduleRender = (delay = 120) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      renderAll();
    }, delay);
  };

  const observer = new MutationObserver((mutations) => {
    let hasRelevantMutation = false;
    for (let i = 0; i < mutations.length; i++) {
      const m = mutations[i];
      const target = m.target;
      if (target && target.nodeType === 1) {
        if (
          target.closest(
            "#bszl-server-security-panel, .bszl-lang-wrap, .bszl-rearrange-banner, .bszl-notifications-modal, #bszl-notif-btn, .bszl-home-row-pill, #bszl-agent-modal, #bszl-svc-logs-modal, .bszl-toast-stack, #bszl-rearrange-menu, .bszl-chart-drag-bar"
          )
        ) {
          continue;
        }
      }
      hasRelevantMutation = true;
      break;
    }
    if (hasRelevantMutation) {
      scheduleRender(120);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  const onUrlChange = () => {
    state.notificationsPageOpen = window.location.hash === "#notifications";
    const npage = document.getElementById("bszl-notifications-page");
    if (npage) npage.removeAttribute("data-render-key");
    scheduleRender(50);
  };
  window.addEventListener("popstate", onUrlChange);
  window.addEventListener("hashchange", onUrlChange);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
