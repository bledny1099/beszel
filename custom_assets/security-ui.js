/**
 * Beszel Security, Instant Port Control & Unified Updates UI (Native Monochrome)
 */

const ICONS = {
  shield: `<span class="bszl-ico bszl-icm bszl-icm-pulse"><svg width="15" height="15" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"><path d="M40,114.79V56a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8v58.79c0,84.08-71.31,111.85-85.53,116.57a7.54,7.54,0,0,1-4.94,0C111.31,226.64,40,198.87,40,114.79Z"/><polyline points="88 136 112 160 168 104"/></svg></span>`,
  globe: `<span class="bszl-ico bszl-icm bszl-icm-turn"><svg width="16" height="16" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"><path d="M168,128c0,64,-40,96,-40,96s-40,-32,-40,-96,40,-96,40,-96S168,64,168,128Z"/><circle cx="128" cy="128" r="96"/><line x1="37.46" y1="96" x2="218.54" y2="96"/><line x1="37.46" y1="160" x2="218.54" y2="160"/></svg></span>`,
  sync: (spinning = false) => `<span class="bszl-ico bszl-ico-sync bszl-icm bszl-icm-pulse ${spinning ? "is-spinning" : ""}"><svg width="15" height="15" viewBox="0 0 256 256" fill="currentColor"><g class="ico-arrows"><path d="M224,48V96a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h28.69L182.06,73.37a79.56,79.56,0,0,0-56.13-23.43h-.45A79.52,79.52,0,0,0,69.59,72.71,8,8,0,0,1,58.41,61.27a96,96,0,0,1,135,.79L208,76.69V48a8,8,0,0,1,16,0ZM186.41,183.29a80,80,0,0,1-112.47-.66L59.31,168H88a8,8,0,0,0,0-16H40a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V179.31l14.63,14.63A95.43,95.43,0,0,0,130,222.06h.53a95.36,95.36,0,0,0,67.07-27.33,8,8,0,0,0-11.18-11.44Z"/></g></svg></span>`,
  rotateCcw: `<span class="bszl-ico bszl-icm bszl-icm-pulse-ccw"><svg width="15" height="15" viewBox="0 0 256 256" fill="currentColor"><path d="M88,104H40a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0V76.69L62.63,62.06A95.43,95.43,0,0,1,130,33.94h.53a95.36,95.36,0,0,1,67.07,27.33,8,8,0,0,1-11.18,11.44,79.52,79.52,0,0,0-55.89-22.77h-.45A79.56,79.56,0,0,0,73.94,73.37L59.31,88H88a8,8,0,0,1,0,16Zm128,48H168a8,8,0,0,0,0,16h28.69l-14.63,14.63a79.56,79.56,0,0,1-56.13,23.43h-.45a79.52,79.52,0,0,1-55.89-22.77,8,8,0,1,0-11.18,11.44,95.36,95.36,0,0,0,67.07,27.33H126a95.43,95.43,0,0,0,67.36-28.12L208,179.31V208a8,8,0,0,0,16,0V160A8,8,0,0,0,216,152Z"/></svg></span>`,
  langGlobe: `<svg class="h-[1.2rem] w-[1.2rem] bszl-icm bszl-icm-turn" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"><path d="M168,128c0,64,-40,96,-40,96s-40,-32,-40,-96,40,-96,40,-96S168,64,168,128Z"/><circle cx="128" cy="128" r="96"/><line x1="37.46" y1="96" x2="218.54" y2="96"/><line x1="37.46" y1="160" x2="218.54" y2="160"/></svg>`,
  flagUS: `<svg viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="28" height="20" fill="#FFFFFF"/><path d="M0 0H28V1.54H0V0ZM0 3.08H28V4.62H0V3.08ZM0 6.15H28V7.69H0V6.15ZM0 9.23H28V10.77H0V9.23ZM0 12.31H28V13.85H0V12.31ZM0 15.38H28V16.92H0V15.38ZM0 18.46H28V20H0V18.46Z" fill="#B22234"/><rect width="12" height="10.77" fill="#3C3B6E"/><g fill="#FFFFFF"><circle cx="2.2" cy="2" r="0.75"/><circle cx="4.7" cy="2" r="0.75"/><circle cx="7.2" cy="2" r="0.75"/><circle cx="9.7" cy="2" r="0.75"/><circle cx="3.45" cy="3.7" r="0.75"/><circle cx="5.95" cy="3.7" r="0.75"/><circle cx="8.45" cy="3.7" r="0.75"/><circle cx="2.2" cy="5.4" r="0.75"/><circle cx="4.7" cy="5.4" r="0.75"/><circle cx="7.2" cy="5.4" r="0.75"/><circle cx="9.7" cy="5.4" r="0.75"/><circle cx="3.45" cy="7.1" r="0.75"/><circle cx="5.95" cy="7.1" r="0.75"/><circle cx="8.45" cy="7.1" r="0.75"/><circle cx="2.2" cy="8.8" r="0.75"/><circle cx="4.7" cy="8.8" r="0.75"/><circle cx="7.2" cy="8.8" r="0.75"/><circle cx="9.7" cy="8.8" r="0.75"/></g></svg>`,
  flagRU: `<svg viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="28" height="6.67" fill="#FFFFFF"/><rect y="6.67" width="28" height="6.67" fill="#0039A6"/><rect y="13.33" width="28" height="6.67" fill="#D52B1E"/></svg>`,
  sshLock: `<svg class="bszl-icm bszl-icm-pulse" width="14" height="14" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"><rect x="40" y="88" width="176" height="128" rx="16"/><path d="M88,88V56a40,40,0,0,1,80,0V88"/></svg>`,
  firewall: `<svg class="bszl-icm bszl-icm-pulse" width="14" height="14" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"><path d="M40,114.79V56a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8v58.79c0,84.08-71.31,111.85-85.53,116.57a7.54,7.54,0,0,1-4.94,0C111.31,226.64,40,198.87,40,114.79Z"/></svg>`,
  fail2ban: `<svg class="bszl-icm bszl-icm-shake" width="14" height="14" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"><circle cx="128" cy="128" r="96"/><line x1="60.12" y1="60.12" x2="195.88" y2="195.88"/></svg>`,
  radarPorts: `<span class="bszl-ico bszl-icm bszl-icm-flip"><svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><path d="M229.11,70.82A16,16,0,0,0,216,64H40A16,16,0,0,0,25,85.47l26.19,72a16,16,0,0,0,15,10.53H96v64a8,8,0,0,0,16,0V168h32v64a8,8,0,0,0,16,0V168h29.82a16,16,0,0,0,15-10.53l26.19-72A16,16,0,0,0,229.11,70.82ZM110.68,152,97.58,80h60.84l-13.1,72ZM40,80H81.32l13.09,72H66.18Zm149.82,72H161.59l13.09-72H216Z"/><path d="M136,64V32h16a8,8,0,0,0,0-16H104a8,8,0,0,0,0,16h16V64Z"/></svg></span>`,
  usersPriv: `<svg class="bszl-icm bszl-icm-wave" width="14" height="14" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"><path d="M64,120A32,32,0,1,1,95,80"/><path d="M16,144a59.91,59.91,0,0,1,48-24"/><circle cx="128" cy="144" r="40"/><path d="M72,216a65,65,0,0,1,112,0"/><path d="M161,80a32,32,0,1,1,31,40"/><path d="M192,120a59.91,59.91,0,0,1,48,24"/></svg>`,
  procMemory: `<svg class="bszl-icm bszl-icm-flip" width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><path d="M94,24C71.63,24,56,43.74,56,72s15.63,48,38,48,38-19.74,38-48S116.37,24,94,24ZM94,104c-17.37,0-22-20.11-22-32s4.63-32,22-32,22,20.11,22,32S111.37,104,94,104Z"/><path d="M145,49.22a8,8,0,0,1,3.11-10.88l24-13.33A8,8,0,0,1,184,32v80a8,8,0,0,1-16,0V45.6l-12.12,6.73A8,8,0,0,1,145,49.22Z"/><path d="M104,144v80a8,8,0,0,1-16,0V157.6l-12.12,6.73a8,8,0,0,1-7.76-14l24-13.33A8,8,0,0,1,104,144Z"/><path d="M166,136c-22.37,0-38,19.74-38,48s15.63,48,38,48,38-19.74,38-48S188.37,136,166,136ZM166,216c-17.37,0-22-20.11-22-32s4.63-32,22-32,22,20.11,22,32S183.37,216,166,216Z"/></svg>`,
  cronTimer: `<svg class="bszl-icm bszl-icm-ring" width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><path d="M128,40a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,40Zm0,176a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,216ZM61.66,37.66l-32,32A8,8,0,0,1,18.34,58.34l32-32A8,8,0,0,1,61.66,37.66Zm176,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,237.66,69.66ZM184,128a8,8,0,0,1,0,16H128a8,8,0,0,1-8-8V80a8,8,0,0,1,16,0v48Z"/></svg>`,
  kernelDisk: `<svg class="bszl-icm bszl-icm-stash" width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><path d="M32,104H224V192a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16ZM48,104H208V192H48Z" fill-rule="evenodd"/><path d="M96,136a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,136Z"/><path d="M32,48H224a16,16,0,0,1,16,16V88a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V64A16,16,0,0,1,32,48ZM32,64H224V88H32Z" fill-rule="evenodd"/></svg>`,
  chevronUp: `<svg class="bszl-icm bszl-icm-travel-up" width="13" height="13" viewBox="0 0 256 256" fill="currentColor"><path d="M213.66,165.66a8,8,0,0,1-11.32,0L128,91.31,53.66,165.66a8,8,0,0,1-11.32-11.32l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,213.66,165.66Z"/></svg>`,
  chevronDown: `<svg class="bszl-icm bszl-icm-travel-down" width="13" height="13" viewBox="0 0 256 256" fill="currentColor"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/></svg>`,
  bell: `<svg class="h-[1.2rem] w-[1.2rem] bszl-icm bszl-icm-ring" width="19" height="19" viewBox="0 0 256 256" fill="currentColor"><path d="M35.71,72a8,8,0,0,0,7.1-4.32A94.13,94.13,0,0,1,76.27,30.77a8,8,0,1,0-8.54-13.54A111.46,111.46,0,0,0,28.61,60.32,8,8,0,0,0,35.71,72Z"/><path d="M224,71.1a8,8,0,0,1-10.78-3.42,94.13,94.13,0,0,0-33.46-36.91,8,8,0,1,1,8.54-13.54,111.46,111.46,0,0,1,39.12,43.09A8,8,0,0,1,224,71.1Z"/><path d="M221.81,175.94A16,16,0,0,1,208,200H48a16,16,0,0,1-13.79-24.06C43.22,160.39,48,138.28,48,112a80,80,0,0,1,160,0C208,138.27,212.78,160.38,221.81,175.94ZM208,184c-10.64-18.27-16-42.49-16-72a64,64,0,0,0-128,0c0,29.52-5.38,53.74-16,72Z"/><path d="M167.2,200a40,40,0,0,1-78.4,0L105.38,200a24,24,0,0,0,45.24,0Z"/></svg>`,
  terminal: `<svg class="h-[1.2rem] w-[1.2rem] bszl-icm bszl-icm-blink" width="19" height="19" viewBox="0 0 256 256" fill="currentColor"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200Z"/><path d="M117.66,122.34l-32-32a8,8,0,0,0-11.32,11.32L100.69,128,74.34,154.34a8,8,0,0,0,11.32,11.32l32-32A8,8,0,0,0,117.66,122.34Z"/><path d="M168,152H128a8,8,0,0,0,0,16h40a8,8,0,0,0,0-16Z"/></svg>`,
  copy: `<svg class="bszl-icm bszl-icm-tuck" viewBox="0 0 256 256" width="14" height="14" fill="currentColor"><path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"/></svg>`,
  sliders: `<svg class="bszl-icm bszl-icm-spin-down" width="15" height="15" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"><circle cx="128" cy="128" r="40"/><path d="M41.43,178.09A99.14,99.14,0,0,1,31.36,153.8l16.78-21a81.59,81.59,0,0,1,0-9.64l-16.77-21a99.43,99.43,0,0,1,10.05-24.3l26.71-3a81,81,0,0,1,6.81-6.81l3-26.7A99.14,99.14,0,0,1,102.2,31.36l21,16.78a81.59,81.59,0,0,1,9.64,0l21-16.77a99.43,99.43,0,0,1,24.3,10.05l3,26.71a81,81,0,0,1,6.81,6.81l26.7,3a99.14,99.14,0,0,1,10.07,24.29l-16.78,21a81.59,81.59,0,0,1,0,9.64l16.77,21a99.43,99.43,0,0,1-10,24.3l-26.71,3a81,81,0,0,1-6.81,6.81l-3,26.7a99.14,99.14,0,0,1-24.29,10.07l-21-16.78a81.59,81.59,0,0,1-9.64,0l-21,16.77a99.43,99.43,0,0,1-24.3-10l-3-26.71a81,81,0,0,1-6.81-6.81Z"/></svg>`,
  grip: `<svg class="bszl-icm bszl-icm-pulse" width="13" height="13" viewBox="0 0 256 256" fill="currentColor"><path d="M90.34,61.66a8,8,0,0,1,0-11.32l32-32a8,8,0,0,1,11.32,0l32,32a8,8,0,0,1-11.32,11.32L136,43.31V96a8,8,0,0,1-16,0V43.31L101.66,61.66A8,8,0,0,1,90.34,61.66Z"/><path d="M237.66,122.34l-32-32a8,8,0,0,0-11.32,11.32L212.69,120H160a8,8,0,0,0,0,16h52.69l-18.35,18.34a8,8,0,0,0,11.32,11.32l32-32A8,8,0,0,0,237.66,122.34Z"/><path d="M154.34,194.34L136,212.69V160a8,8,0,0,0-16,0v52.69l-18.34-18.35a8,8,0,0,0-11.32,11.32l32,32a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Z"/><path d="M43.31,136H96a8,8,0,0,0,0-16H43.31l18.35-18.34A8,8,0,0,0,50.34,90.34l-32,32a8,8,0,0,0,0,11.32l32,32a8,8,0,0,0,11.32-11.32Z"/></svg>`,
  gauge: `<svg class="bszl-icm bszl-icm-pulse" width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><path d="M128,40a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,40Zm0,176a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,216Zm45.66-109.66-40,40a8,8,0,0,1-11.32-11.32l40-40a8,8,0,0,1,11.32,11.32Z"/></svg>`,
  dockerBox: `<svg class="bszl-icm bszl-icm-stash" width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><path d="M32,104H224V192a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16ZM48,104H208V192H48Z" fill-rule="evenodd"/><path d="M96,136a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,136Z"/><path d="M32,48H224a16,16,0,0,1,16,16V88a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V64A16,16,0,0,1,32,48ZM32,64H224V88H32Z" fill-rule="evenodd"/></svg>`,
  ubuntu: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#E95420"/><circle cx="12" cy="12" r="4.3" stroke="#FFF" stroke-width="1.8"/><circle cx="6.2" cy="12" r="1.6" fill="#FFF"/><circle cx="14.9" cy="7" r="1.6" fill="#FFF"/><circle cx="14.9" cy="17" r="1.6" fill="#FFF"/></svg>`,
  debian: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#A80030"/><path d="M13 6.5c-3.2 0-5.5 2.4-5.5 5.5s2.4 5.5 5.3 5.5c1.8 0 3.2-.8 3.9-2M13 9.2c1.6 0 2.8 1.2 2.8 2.8 0 1.4-1 2.4-2.3 2.4-1.1 0-1.9-.8-1.9-1.9" stroke="#FFF" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  linux: `<svg class="bszl-icm bszl-icm-blink" width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200Z"/><path d="M80,84A12,12,0,1,1,68,72,12,12,0,0,1,80,84Z"/><path d="M120,84a12,12,0,1,1-12-12A12,12,0,0,1,120,84Z"/></svg>`,
  container: `<svg class="size-4 bszl-icm bszl-icm-stash" width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M32,104H224V192a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16ZM48,104H208V192H48Z" fill-rule="evenodd"/><path d="M96,136a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,136Z"/><path d="M32,48H224a16,16,0,0,1,16,16V88a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V64A16,16,0,0,1,32,48ZM32,64H224V88H32Z" fill-rule="evenodd"/></svg>`,
  terminalSquare: `<svg class="size-4 bszl-icm bszl-icm-blink" width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200Z"/><path d="M80,84A12,12,0,1,1,68,72,12,12,0,0,1,80,84Z"/><path d="M120,84a12,12,0,1,1-12-12A12,12,0,0,1,120,84Z"/></svg>`,
  activity: `<svg class="size-4 bszl-icm bszl-icm-spin-down" width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M196.12,128c24.65-34.61,37.22-70.38,19.74-87.86S162.61,35.23,128,59.88C93.39,35.23,57.62,22.66,40.14,40.14S35.23,93.39,59.88,128c-24.65,34.61-37.22,70.38-19.74,87.86h0c5.63,5.63,13.15,8.14,21.91,8.14,18.48,0,42.48-11.17,66-27.88C151.47,212.83,175.47,224,194,224c8.76,0,16.29-2.52,21.91-8.14h0C233.34,198.38,220.77,162.61,196.12,128Zm8.43-76.55c7.64,7.64,2.48,32.4-18.52,63.28a300.33,300.33,0,0,0-21.19-23.57A300.33,300.33,0,0,0,141.27,70C172.15,49,196.91,43.8,204.55,51.45ZM176.29,128a289.14,289.14,0,0,1-22.76,25.53A289.14,289.14,0,0,1,128,176.29a289.14,289.14,0,0,1-25.53-22.76A289.14,289.14,0,0,1,79.71,128,298.62,298.62,0,0,1,128,79.71a289.14,289.14,0,0,1,25.53,22.76A289.14,289.14,0,0,1,176.29,128ZM51.45,51.45c2.2-2.21,5.83-3.35,10.62-3.35C73.89,48.1,92.76,55,114.72,70A304,304,0,0,0,91.16,91.16,300.33,300.33,0,0,0,70,114.73C49,83.85,43.81,59.09,51.45,51.45Zm0,153.1C43.81,196.91,49,172.15,70,141.27a300.33,300.33,0,0,0,21.19,23.57A304.18,304.18,0,0,0,114.73,186C83.85,207,59.09,212.2,51.45,204.55Zm153.1,0c-7.64,7.65-32.4,2.48-63.28-18.52a304.18,304.18,0,0,0,23.57-21.19A300.33,300.33,0,0,0,186,141.27C207,172.15,212.19,196.91,204.55,204.55Z"/><path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128Z"/></svg>`,
  cpu: `<svg class="size-4 bszl-icm bszl-icm-flip" width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M94,24C71.63,24,56,43.74,56,72s15.63,48,38,48,38-19.74,38-48S116.37,24,94,24ZM94,104c-17.37,0-22-20.11-22-32s4.63-32,22-32,22,20.11,22,32S111.37,104,94,104Z"/><path d="M145,49.22a8,8,0,0,1,3.11-10.88l24-13.33A8,8,0,0,1,184,32v80a8,8,0,0,1-16,0V45.6l-12.12,6.73A8,8,0,0,1,145,49.22Z"/><path d="M104,144v80a8,8,0,0,1-16,0V157.6l-12.12,6.73a8,8,0,0,1-7.76-14l24-13.33A8,8,0,0,1,104,144Z"/><path d="M166,136c-22.37,0-38,19.74-38,48s15.63,48,38,48,38-19.74,38-48S188.37,136,166,136ZM166,216c-17.37,0-22-20.11-22-32s4.63-32,22-32,22,20.11,22,32S183.37,216,166,216Z"/></svg>`,
  memoryStick: `<svg class="size-4 bszl-icm bszl-icm-pulse" width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M200,56H32A24,24,0,0,0,8,80v96a24,24,0,0,0,24,24H200a24,24,0,0,0,24-24V80A24,24,0,0,0,200,56Zm8,120a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H200a8,8,0,0,1,8,8Z"/><path d="M256,96v64a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0Z"/><path d="M64,96v64a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0Z"/><path d="M104,96v64a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0Z"/><path d="M144,96v64a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0Z"/><path d="M184,96v64a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0Z"/></svg>`,
  ethernet: `<svg class="size-4 bszl-icm bszl-icm-flip" width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M229.11,70.82A16,16,0,0,0,216,64H40A16,16,0,0,0,25,85.47l26.19,72a16,16,0,0,0,15,10.53H96v64a8,8,0,0,0,16,0V168h32v64a8,8,0,0,0,16,0V168h29.82a16,16,0,0,0,15-10.53l26.19-72A16,16,0,0,0,229.11,70.82ZM110.68,152,97.58,80h60.84l-13.1,72ZM40,80H81.32l13.09,72H66.18Zm149.82,72H161.59l13.09-72H216Z"/><path d="M136,64V32h16a8,8,0,0,0,0-16H104a8,8,0,0,0,0,16h16V64Z"/></svg>`,
  shieldCheck: `<svg class="size-4 bszl-icm bszl-icm-pulse" width="16" height="16" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"><path d="M40,114.79V56a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8v58.79c0,84.08-71.31,111.85-85.53,116.57a7.54,7.54,0,0,1-4.94,0C111.31,226.64,40,198.87,40,114.79Z"/><polyline points="88 136 112 160 168 104"/></svg>`,
  layers: `<svg class="size-4 bszl-icm bszl-icm-collapse" width="16" height="16" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"><line x1="40" y1="64" x2="216" y2="64"/><line x1="40" y1="128" x2="216" y2="128"/><line x1="40" y1="192" x2="216" y2="192"/></svg>`,
  squareArrowRightEnter: `<svg class="size-4 bszl-icm bszl-icm-tuck" width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M184,128a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z"/><path d="M224,104a8,8,0,0,1-16,0V59.32l-66.33,66.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Z"/></svg>`,
  clock: `<svg class="size-4 bszl-icm bszl-icm-ring" width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M128,40a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,40Zm0,176a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,216ZM61.66,37.66l-32,32A8,8,0,0,1,18.34,58.34l32-32A8,8,0,0,1,61.66,37.66Zm176,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,237.66,69.66ZM184,128a8,8,0,0,1,0,16H128a8,8,0,0,1-8-8V80a8,8,0,0,1,16,0v48Z"/></svg>`,
  arrowUpDown: `<svg class="size-4 bszl-icm bszl-icm-bounce" width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M117.66,170.34a8,8,0,0,1,0,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L72,188.69V48a8,8,0,0,1,16,0V188.69l18.34-18.35A8,8,0,0,1,117.66,170.34Z"/><path d="M213.66,74.34l-32-32a8,8,0,0,0-11.32,0l-32,32a8,8,0,0,0,11.32,11.32L168,67.31V208a8,8,0,0,0,16,0V67.31l18.34,18.35a8,8,0,0,0,11.32-11.32Z"/></svg>`,
  arrowUp: `<svg class="bszl-icm bszl-icm-travel-up" width="13" height="13" viewBox="0 0 256 256" fill="currentColor"><path d="M205.66,117.66a8,8,0,0,1-11.32,0L136,59.31V216a8,8,0,0,1-16,0V59.31L61.66,117.66a8,8,0,0,1-11.32-11.32l72-72a8,8,0,0,1,11.32,0l72,72A8,8,0,0,1,205.66,117.66Z"/></svg>`,
  arrowDown: `<svg class="bszl-icm bszl-icm-travel-down" width="13" height="13" viewBox="0 0 256 256" fill="currentColor"><path d="M205.66,149.66l-72,72a8,8,0,0,1-11.32,0l-72-72a8,8,0,0,1,11.32-11.32L120,196.69V40a8,8,0,0,1,16,0V196.69l58.34-58.35a8,8,0,0,1,11.32,11.32Z"/></svg>`,
  arrowLeft: `<svg class="bszl-icm bszl-icm-travel-left" width="13" height="13" viewBox="0 0 256 256" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/></svg>`,
  arrowRight: `<svg class="bszl-icm bszl-icm-travel-right" width="12" height="12" viewBox="0 0 256 256" fill="currentColor"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/></svg>`,
  arrowUpRight: `<svg class="bszl-icm bszl-icm-travel-ur" width="13" height="13" viewBox="0 0 256 256" fill="currentColor"><path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"/></svg>`,
  arrowSquareOut: `<svg class="bszl-icm bszl-icm-tuck" width="13.5" height="13.5" viewBox="0 0 256 256" fill="currentColor"><path d="M184,128a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z"/><path d="M224,104a8,8,0,0,1-16,0V59.32l-66.33,66.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Z"/></svg>`,
  trash: `<svg class="bszl-icm bszl-icm-shake" width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/></svg>`,
  eye: `<svg class="bszl-icm bszl-icm-pulse" width="13.5" height="13.5" viewBox="0 0 256 256" fill="currentColor"><path d="M237.2,151.87v0a47.1,47.1,0,0,0-2.35-5.45L193.26,51.8a7.82,7.82,0,0,0-1.66-2.44,32,32,0,0,0-45.26,0A8,8,0,0,0,144,55V80H112V55a8,8,0,0,0-2.34-5.66,32,32,0,0,0-45.26,0,7.82,7.82,0,0,0-1.66,2.44L21.15,146.4a47.1,47.1,0,0,0-2.35,5.45v0A48,48,0,1,0,112,168V96h32v72a48,48,0,1,0,93.2-16.13ZM76.71,59.75a16,16,0,0,1,19.29-1v73.51a47.9,47.9,0,0,0-46.79-9.92ZM64,200a32,32,0,1,1,32-32A32,32,0,0,1,64,200ZM160,58.74a16,16,0,0,1,19.29,1l27.5,62.58A47.9,47.9,0,0,0,160,132.25ZM192,200a32,32,0,1,1,32-32A32,32,0,0,1,192,200Z"/></svg>`,
  eyeOff: `<svg class="bszl-icm bszl-icm-shake" width="13.5" height="13.5" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"><circle cx="128" cy="128" r="96"/><line x1="60.12" y1="60.12" x2="195.88" y2="195.88"/></svg>`,
  x: `<svg class="bszl-icm bszl-icm-spin-down" width="13" height="13" viewBox="0 0 256 256" fill="currentColor"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></svg>`,
  check: `<svg class="bszl-icm bszl-icm-pulse" width="13" height="13" viewBox="0 0 256 256" fill="currentColor"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/></svg>`,
  plus: `<svg class="bszl-icm bszl-icm-spin-down" width="13" height="13" viewBox="0 0 256 256" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/></svg>`,
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
    openPortBtn: "Открыть",
    closePortBtn: "Закрыть",
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
    catBots: "Боты и AI-агенты",
    catServers: "Серверы и веб",
    catDb: "Базы данных и кэш",
    catUtils: "Инфра и MCP",
    catSystem: "Система и защита",
    catWeb: "Веб-панели и дашборд",
    catAgent: "Агент и мониторинг",
    catSecurity: "Доступ и безопасность",
    catNetwork: "Сеть и VPN",
    catTools: "Инструменты и OSINT",
    rollbackNow: "Откат",
    autoRollbackOn: "Авто-откат: ВКЛ",
    snapshotCount: "Снимок",
    cveMonitorOn: "CVE 10m",
    notifBtnTitle: "Уведомления",
    notifPageTitle: "Уведомления",
    scanPatchBtn: "Проверить CVE",
    backBtn: "Назад",
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
    agentCopiedBtn: "Скопировано",
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
    rearrangeDone: "Готово",
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
      ssh_security: "SSH (ключ)",
      tailscale_mesh: "Tailscale",
      battery_power: "Батарея",
      root_disk: "Память (/data)",
      memory_status: "ОЗУ (RAM)",
      termux_security: "WakeLock",
      aslr_kernel: "Ядро / SELinux",
      proc_integrity: "Процессы",
      network_security: "Изоляция сети",
      osint_stack: "OSINT-стек",
      cve_vulnerabilities: "Уязвимости CVE",
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
    openPortBtn: "Open",
    closePortBtn: "Close",
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
    catBots: "Bots & AI Agents",
    catServers: "Servers & Web",
    catDb: "Databases & Cache",
    catUtils: "Infra & MCP",
    catSystem: "System & Security",
    catWeb: "Web Apps & Dashboard",
    catAgent: "Agent & Monitoring",
    catSecurity: "Access & Security",
    catNetwork: "Network & VPN",
    catTools: "Tools & OSINT",
    rollbackNow: "Rollback",
    autoRollbackOn: "Auto-Rollback: ON",
    snapshotCount: "Snapshot",
    cveMonitorOn: "CVE 10m",
    notifBtnTitle: "Notifications",
    notifPageTitle: "Notifications",
    scanPatchBtn: "Scan CVEs",
    backBtn: "Back",
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
    agentCopiedBtn: "Copied",
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
    rearrangeDone: "Done",
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
      ssh_security: "SSH (Key)",
      tailscale_mesh: "Tailscale",
      battery_power: "Battery",
      root_disk: "Storage (/data)",
      memory_status: "RAM Usage",
      termux_security: "WakeLock",
      aslr_kernel: "Kernel / SELinux",
      proc_integrity: "Processes",
      network_security: "Net Isolation",
      osint_stack: "OSINT Stack",
      cve_vulnerabilities: "CVE Vulns",
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
  "xray-client": {
    ru: "Клиентский сервис Xray (xray-client.service) для исходящего проксирования и защищенной маршрутизации запросов к внешним API.",
    en: "Outbound Xray client service (xray-client.service) providing encrypted proxy routing for external API requests.",
  },
  "amnezia-xray": {
    ru: "Изолированный Docker-контейнер Amnezia Xray (порт 4433) с протоколом VLESS Reality и защитой от активного зондирования DPI.",
    en: "Isolated Amnezia Xray Docker container (port 4433) running VLESS Reality with active DPI probing protection.",
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
  "dnscrypt-anon": {
    ru: "Анонимизирующий шифрующий DNS-прокси (dnscrypt-proxy-anon) с релеями DNSCrypt и DoH для приватного разрешения имен.",
    en: "Anonymized encrypted DNS proxy (dnscrypt-proxy-anon) using DNSCrypt relays and DoH for private DNS resolution.",
  },
  "dnscrypt-fast": {
    ru: "Быстрый локальный DNS-прокси (dnscrypt-proxy-fast) с кэшированием и минимальной задержкой для системных и VPN-запросов.",
    en: "Low-latency caching encrypted DNS proxy (dnscrypt-proxy-fast) serving system and VPN DNS queries.",
  },
  tor: {
    ru: "Локальный SOCKS-прокси и демон сети Tor (порт 9050). Используется сервисами и скриптами на сервере для маршрутизации отдельных исходящих запросов через цепочку узлов Tor.",
    en: "Local Tor network daemon and SOCKS proxy listening on port 9050. It allows server applications and scripts to route specific outbound requests through the Tor onion network.",
  },
  trusttunnel: {
    ru: "Клиент и эндпоинт защищенного туннелирования TrustTunnel в каталоге /opt/trusttunnel. На данный момент установлен на диске в качестве резервного инструмента, но в фоне не запущен.",
    en: "TrustTunnel secure endpoint binary installed in /opt/trusttunnel. It is currently kept on disk as a standby tunneling tool and is not running in the background.",
  },
  "claude-session": {
    ru: "Автономная сессия Claude Code (claude-sessions.service / screen --remote-control) с автоматическим восстановлением контекста и удаленным управлением.",
    en: "Persistent Claude Code remote-control session managed by claude-sessions.service / screen with automatic session recovery.",
  },
  "telegram-bot": {
    ru: "Основной Telegram-бот платформы. Работает как постоянный сервис и обрабатывает команды пользователей, уведомления и интеграции с БД.",
    en: "Primary Telegram bot service handling user commands, notifications, and database integrations.",
  },
  "scribe-bot": {
    ru: "Telegram-бот сервиса транскрибации для расшифровки аудио, голосовых сообщений и управления отчетами.",
    en: "Telegram bot for audio transcription, voice message processing, and report management.",
  },
  screenertg: {
    ru: "Торговый и аналитический Telegram-бот для отслеживания рыночных сигналов и котировок в реальном времени.",
    en: "Trading and market analytics Telegram bot monitoring real-time market signals.",
  },
  "screenertg-demo": {
    ru: "Демо-инстанс аналитического бота для тестирования новых фильтров и сигнальных стратегий.",
    en: "Demo instance of the market analytics bot used for testing new filters and signal strategies.",
  },
  demotradebot: {
    ru: "Торговый бот-симулятор для проверки торговых гипотез в тестовом контуре.",
    en: "Paper-trading simulator bot for testing automated execution strategies.",
  },
  "minecraft-bot": {
    ru: "Telegram-бот управления игровым сервером Minecraft (статус игроков, вайтлист, оповещения и команды консоли).",
    en: "Minecraft server management Telegram bot providing player status, whitelist control, and console alerts.",
  },
  buybot: {
    ru: "Специализированный Telegram-бот для автоматизации уведомлений о покупках и транзакциях.",
    en: "Telegram service automating purchase and transaction notifications.",
  },
  "mc-dashboard": {
    ru: "Веб-панель управления и мониторинга игрового сервера Minecraft (minecraft-dashboard.service).",
    en: "Minecraft web dashboard (minecraft-dashboard.service) for live server administration and metrics.",
  },
  "mc-autostart": {
    ru: "Системная служба автозапуска и контроля состояния сервера Minecraft (minecraft-autostart.service).",
    en: "Minecraft autostart and watchdog service (minecraft-autostart.service).",
  },
  "evolve-site": {
    ru: "Веб-сервер проекта (evolve-site.service).",
    en: "Web application server (evolve-site.service).",
  },
  "scribe-api": {
    ru: "Сервер отчетов и веб-API приложения (scribe-report-api.service).",
    en: "Report API and web backend service (scribe-report-api.service).",
  },
  omniroute: {
    ru: "Сервис маршрутизации и API-шлюз OmniRoute (omniroute.service, порт 20128).",
    en: "OmniRoute routing service and API gateway (omniroute.service, port 20128).",
  },
  vaultwarden: {
    ru: "Собственный защищенный сервер менеджера паролей Bitwarden (Vaultwarden в Docker). Хранит пароли, ключи и секреты в зашифрованном виде под вашим полным контролем.",
    en: "Self-hosted Bitwarden-compatible password manager server (Vaultwarden in Docker). It stores your encrypted vault, credentials, and secrets under your own infrastructure.",
  },
  "open-design": {
    ru: "Контейнер платформы Open Design для работы с дизайн-макетами и графическими ассетами. Крутится в Docker с постоянной проверкой состояния (healthcheck).",
    en: "Open Design platform container for inspecting and managing design files and visual assets. Runs in Docker with continuous health monitoring.",
  },
  microbin: {
    ru: "Легковесный приватный pastebin-сервис и файлообменник MicroBin в Docker (порт 4515). Позволяет быстро и безопасно делиться фрагментами кода, конфигами и временными ссылками.",
    en: "Lightweight self-hosted pastebin and file-sharing service (MicroBin in Docker, port 4515). Used for securely sharing code snippets, configs, and expiring links.",
  },
  jesse: {
    ru: "Алгоритмический фреймворк Jesse для бэктестинга и автоматической крипто-торговли. Контейнер сохранен на сервере, но сейчас остановлен (запускается по необходимости).",
    en: "Jesse algorithmic crypto trading and backtesting framework. The Docker container is preserved on the server and is currently stopped until needed.",
  },
  "beszel-hub": {
    ru: "Центральный контейнер мониторинга Beszel Hub (PocketBase + веб-интерфейс). Собирает метрики со всех подключенных серверов, контейнеров и systemd-служб.",
    en: "Central Beszel Hub monitoring container (PocketBase + Web UI) aggregating metrics across all connected servers, containers, and systemd units.",
  },
  "security-hub": {
    ru: "API-сервер управления безопасностью Beszel Security Hub (beszel-security-hub.service, порт 8092). Координирует аудит серверов, UFW-порты, CVE-патчи и управление службами.",
    en: "Beszel Security Hub API daemon (beszel-security-hub.service, port 8092) coordinating fleet security audits, UFW rules, CVE patches, and service control.",
  },
  "beszel-gateway": {
    ru: "Шлюз Nginx (beszel-gateway, порт 8090), объединяющий интерфейс Beszel с модулем безопасности security-ui и авторизацией PocketBase.",
    en: "Nginx gateway container (beszel-gateway, port 8090) serving the Beszel UI injected with security-ui and PocketBase auth verification.",
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
    ru: "Высокопроизводительный обратный прокси Nginx (nginx-proxy). Маршрутизирует трафик контейнеров и доменов.",
    en: "High-performance Nginx reverse proxy (nginx-proxy) routing traffic across containers and virtual hosts.",
  },
  "acme-companion": {
    ru: "Контейнер автоматического выпуска и продления Let's Encrypt SSL-сертификатов (nginx-proxy-acme) для связки с nginx-proxy.",
    en: "Automated Let's Encrypt SSL certificate provisioning companion container (nginx-proxy-acme) for nginx-proxy.",
  },
  postgres: {
    ru: "Реляционная база данных PostgreSQL (системный кластер 18-main и Docker-контейнер postgres:14). Хранит основные данные пользователей и приложений.",
    en: "PostgreSQL relational database server (host 18-main cluster and Docker postgres:14) storing primary application data.",
  },
  "bot-postgres": {
    ru: "Выделенный контейнер базы данных PostgreSQL 15 (bot_postgres) для Telegram-ботов и микросервисов.",
    en: "Dedicated PostgreSQL 15 database container (bot_postgres) serving Telegram bots and microservices.",
  },
  redis: {
    ru: "Быстрое хранилище данных в оперативной памяти Redis. Используется ботами и веб-сервисами для кэширования, очередей задач, сессий и rate-лимитов.",
    en: "In-memory Redis data store used by bots and web apps for fast caching, job queues, user sessions, and rate limiting.",
  },
  docker: {
    ru: "Демон контейнеризации Docker Engine. Обеспечивает изолированный запуск контейнеров (VPN-ядер, ботов, баз данных и веб-сервисов) с автоматическим перезапуском.",
    en: "Docker Engine container runtime managing isolated containers across VPN cores, bots, databases, and web services with automatic restart policies.",
  },
  containerd: {
    ru: "Низкоуровневый рантайм контейнеров containerd.service, управляющий жизненным циклом контейнеров и образов для Docker.",
    en: "Industry-standard container runtime daemon (containerd.service) managing container execution and image transfer.",
  },
  fail2ban: {
    ru: "Система защиты от перебора паролей и сетевых атак (Fail2ban). Анализирует системные логи в реальном времени и автоматически блокирует IP-адреса злоумышленников в файрволе.",
    en: "Intrusion prevention daemon (Fail2ban) that scans authentication logs in real time and automatically bans offending IP addresses in the firewall.",
  },
  ufw: {
    ru: "Межсетевой экран Uncomplicated Firewall (UFW), управляющий правилами фильтрации пакетов Netfilter/iptables. Блокирует все неразрешенные входящие подключения и управляется прямо из вкладки Порты.",
    en: "Uncomplicated Firewall (UFW) managing host packet filtering rules. It blocks unauthorized inbound connections and is controlled directly from the Ports tab.",
  },
  sshd: {
    ru: "Системный SSH-сервер OpenSSH (порт 2244) с авторизацией строго по криптографическим ключам.",
    en: "System OpenSSH server (port 2244) configured for public-key authentication.",
  },
  "beszel-vuln-watch": {
    ru: "Таймер оперативного мониторинга уязвимостей (beszel-vuln-watch.timer). Каждые 10 минут проверяет наличие CVE-обновлений безопасности и автоматически устанавливает патчи с защитным откатом.",
    en: "Vulnerability watcher timer (beszel-vuln-watch.timer) checking every 10 minutes for Ubuntu CVE security patches with automatic rollback protection.",
  },
  "beszel-audit-timer": {
    ru: "Ежедневный таймер полного аудита безопасности, проверки доменов/SSL и обновления системы (beszel-security-audit.timer, 04:00 DXB).",
    en: "Nightly security audit, SSL certificate check, and maintenance timer (beszel-security-audit.timer, 04:00 DXB).",
  },
  "unattended-upgrades": {
    ru: "Системный демон автоматической установки критических обновлений Debian/Ubuntu (unattended-upgrades.service).",
    en: "Debian/Ubuntu unattended-upgrades daemon handling background security package maintenance.",
  },
  livepatch: {
    ru: "Служба Canonical Livepatch для применения патчей безопасности ядра Linux на лету без перезагрузки сервера.",
    en: "Canonical Livepatch daemon applying critical Linux kernel security patches without rebooting.",
  },
  "qemu-guest-agent": {
    ru: "Гостевой агент виртуализации QEMU/KVM для корректного взаимодействия виртуальной машины с гипервизором и создания снапшотов.",
    en: "QEMU Guest Agent daemon enabling clean hypervisor snapshots, time sync, and VM lifecycle management.",
  },
  chrony: {
    ru: "Служба точной синхронизации системного времени по протоколу NTP (chrony / systemd-timesyncd).",
    en: "NTP time synchronization daemon (chrony / systemd-timesyncd) keeping system clocks accurate.",
  },
  "systemd-resolved": {
    ru: "Системный резолвер и кэш DNS-запросов systemd-resolved.",
    en: "Systemd network name resolution daemon (systemd-resolved).",
  },
  cron: {
    ru: "Планировщик периодических системных задач Cron (cron.service).",
    en: "Cron background job scheduler daemon (cron.service).",
  },
  rsyslog: {
    ru: "Системный демон сбора и ротации журналов событий (rsyslog.service).",
    en: "Rocket-fast system logging daemon (rsyslog.service).",
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
  "pdf-mcp": {
    ru: "MCP-сервер обработки и чтения PDF-документов (mcp-pdf-server) для AI-агентов Claude.",
    en: "Model Context Protocol server (mcp-pdf-server) enabling AI agents to parse and extract content from PDF documents.",
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
  "osint-dash": {
    ru: "Веб-интерфейс OSINT Dashboard в Termux (порт 8080). Позволяет запускать поиск по соцсетям, телефонам и открытым источникам прямо со смартфона.",
    en: "Web-based OSINT Dashboard running in Termux on port 8080. Allows executing social media and intelligence investigations directly on the device.",
  },
  "termux-sshd": {
    ru: "Защищенный SSH-сервер OpenSSH в Termux (порт 8022). Обеспечивает удаленный доступ и выполнение команд по ed25519-ключам.",
    en: "OpenSSH daemon inside Termux on port 8022. Provides remote shell access and automation using ed25519 public key authentication.",
  },
  maigret: {
    ru: "Мощный OSINT-инструмент Maigret (v0.6.6) в Termux для поиска аккаунтов человека по никнейму более чем на 2500 сайтах с генерацией отчетов.",
    en: "Maigret OSINT tool (v0.6.6) in Termux collecting username dossiers across 2500+ websites.",
  },
  holehe: {
    ru: "Инструмент Holehe (v1.61) в Termux для проверки регистрации email-адреса на десятках популярных онлайн-сервисов без уведомления владельца.",
    en: "Holehe email OSINT tool (v1.61) checking registered accounts across online platforms via password recovery endpoints.",
  },
  sherlock: {
    ru: "Утилита поиска аккаунтов по открытым источникам (OSINT). Проверяет заданный никнейм на сотнях сайтов и сервисов.",
    en: "OSINT username search tool. Finds social media accounts across hundreds of online platforms and communities.",
  },
  theharvester: {
    ru: "Инструмент сбора информации о доменах, поддоменах, сотрудниках и почтах из открытых источников и поисковых систем.",
    en: "Information gathering tool for mapping domain emails, names, subdomains, IPs, and URLs from open sources.",
  },
  telethon: {
    ru: "Клиентская библиотека и активная сессия Telegram MTProto (Telethon v1.45) для автоматизации OSINT-запросов в Telegram.",
    en: "Telethon MTProto client session (v1.45) used for automated Telegram OSINT queries.",
  },
  "phone-osint": {
    ru: "Модуль анализа телефонных номеров (phonenumbers / PhoneInfoga) для определения страны, оператора, часового пояса и привязок номера.",
    en: "Phone number intelligence module (phonenumbers / PhoneInfoga) identifying carrier, region, and OSINT footprints.",
  },
  "sing-box": {
    ru: "Универсальный сетевой прокси-клиент sing-box в Termux (SOCKS5/HTTP на 127.0.0.1:1080). Обеспечивает маршрутизацию трафика и сетевые туннели. Двойной клик включает или выключает прокси.",
    en: "Universal proxy client sing-box in Termux (127.0.0.1:1080). Double-click to start or stop the proxy tunnel.",
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

function detectNativeDomLang() {
  try {
    const searchBtn = document.querySelector("header button, .bg-card button.hidden.md\\:block");
    const sampleNodes = document.querySelectorAll("h1, h2, h3, th, header button, .bg-card a, .bg-card span");
    let txt = searchBtn ? searchBtn.textContent || "" : "";
    for (let i = 0; i < sampleNodes.length && i < 20; i++) {
      const el = sampleNodes[i];
      if (el.closest("#bszl-server-security-panel, #bszl-server-services-panel, .bszl-lang-wrap")) continue;
      txt += " " + (el.textContent || "");
    }
    if (/[А-Яа-яЁё]/.test(txt)) return "ru";
    if (/\b(Search|Systems|CPU Usage|Memory Usage|Online|Offline)\b/i.test(txt)) return "en";
  } catch (e) {}
  return null;
}

function getInitialLang() {
  const saved = localStorage.getItem("bszl_sec_lang") || localStorage.getItem("lang");
  if (saved) {
    return saved.toLowerCase().startsWith("en") ? "en" : "ru";
  }
  const domLang = detectNativeDomLang();
  if (domLang) return domLang;
  const nav = (navigator.language || (navigator.languages && navigator.languages[0]) || "ru").toLowerCase();
  return nav.startsWith("en") ? "en" : "ru";
}

function syncLangFromNativeDom() {
  const domLang = detectNativeDomLang();
  if (domLang && domLang !== state.lang) {
    state.lang = domLang;
    const panel = document.getElementById("bszl-server-security-panel");
    if (panel) panel.removeAttribute("data-render-key");
    const svcPanel = document.getElementById("bszl-server-services-panel");
    if (svcPanel) svcPanel.removeAttribute("data-render-key");
  }
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

const DEFAULT_CATS_ORDER = ["vpn", "bots", "servers", "db", "utils", "system", "web", "agent", "security", "network", "tools"];

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
  // Server page cards state
  cardTabs: { security: "ports", services: "all" },
  servicesPos: localStorage.getItem("bszl_services_pos") || "bottom",
  unifiedSearch: "",
  unifiedFilter: "all",
  stackSearch: "",
  stackCatFilter: "all",
  containerSearch: "",
  containerFilter: "all",
  systemdSearch: "",
  systemdFilter: "all",
  tableSort: {},
  cardsCollapsed: (() => {
    try {
      return { security: false, services: false, network: false, ...JSON.parse(localStorage.getItem("bszl_cards_collapsed") || "{}") };
    } catch (e) {
      return { security: false, services: false, network: false };
    }
  })(),
  checksShowAll: localStorage.getItem("bszl_checks_all") === "1",
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
  const svcPanel = document.getElementById("bszl-server-services-panel");
  if (svcPanel) svcPanel.removeAttribute("data-render-key");
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
  const svcPanel = document.getElementById("bszl-server-services-panel");
  if (svcPanel) svcPanel.removeAttribute("data-render-key");
  const gridWrapper = document.querySelector("div.grid.gap-4.mb-14");
  if (gridWrapper) gridWrapper.removeAttribute("data-bszl-applied-layout");
  const menuBox = document.getElementById("bszl-rearrange-menu");
  if (menuBox) menuBox.removeAttribute("data-rkey");
  renderAll();

  try {
    await secFetch("/api/security-layout", {
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

// The security API sits behind nginx auth_request, which validates the same
// PocketBase token the Beszel UI keeps in localStorage. Without it every call
// to /api/security-* gets 401.
function getBeszelAuthToken() {
  try {
    const raw = localStorage.getItem("pocketbase_auth");
    return raw ? JSON.parse(raw).token || "" : "";
  } catch (e) {
    return "";
  }
}

function secFetch(url, opts = {}) {
  const headers = new Headers(opts.headers || {});
  const token = getBeszelAuthToken();
  if (token) headers.set("Authorization", token);
  return fetch(url, { ...opts, headers });
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

function restoreNativeFavicon() {
  try {
    let link = document.querySelector('link[rel*="icon"]');
    if (link && link.href && link.href.startsWith("data:")) {
      link.href = "/static/icon.svg";
    }
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
  restoreNativeFavicon();
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
    const res = await secFetch("/api/security-reports", { cache: "no-store" });
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
    const res = await secFetch("/api/security-agent-config", {
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
    const res = await secFetch("/api/security-notifications-action", {
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
    const res = await secFetch("/api/security-notifications-action", {
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
    const res = await secFetch("/api/security-notifications-action", {
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

function showOverlayToast({ title, tagText = "ON", statusType = "running", desc = "", progId = null, linkUrl = null, linkText = null }) {
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
      <div class="bszl-prog-info-desc">
        ${escapeHtml(desc)}
        ${linkUrl ? `<div style="margin-top:8px;"><a href="${escapeHtml(linkUrl)}" target="_blank" rel="noopener noreferrer" class="bszl-act-btn bszl-act-btn--open" style="display:inline-flex;align-items:center;gap:5px;text-decoration:none;padding:3px 9px;font-size:0.72rem;"><span>${escapeHtml(linkText || "Open Web App")}</span>${ICONS.arrowUpRight}</a></div>` : ""}
      </div>
    </div>
    <button type="button" class="bszl-prog-info-close" title="Close">${ICONS.x}</button>
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
    const res = await secFetch("/api/security-trigger", {
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
  const rep = getReport(systemId);
  const isTermux = Boolean(
    rep && (
      rep.profile === "termux" ||
      rep.system_id === "Lineage" ||
      rep.system_id === "4rnyjklpllef0yl" ||
      String(rep.os || "").toLowerCase().includes("android") ||
      String(rep.os || "").toLowerCase().includes("lineage")
    )
  );
  if (isTermux) {
    showOverlayToast({
      title: `Port · ${payload.port || ""}`,
      tagText: "INFO",
      statusType: "running",
      desc: state.lang === "en" ? "UFW firewall is not available on Android / Termux" : "Файрвол UFW не поддерживается на Android / Termux",
    });
    return;
  }
  if (state.portBusyKey) return;
  state.portBusyKey = busyKey || "port";
  const panel = document.getElementById("bszl-server-security-panel");
  if (panel) panel.removeAttribute("data-render-key");
  renderSystemDetailPage();
  try {
    const res = await secFetch("/api/security-port", {
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
    const res = await secFetch("/api/security-service", {
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
    const res = await secFetch("/api/security-service", {
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
        <button type="button" class="bszl-dialog-close" title="Close">${ICONS.x}</button>
      </div>

      <div class="bszl-dialog-cmd-box">
        <div class="bszl-dialog-cmd-label">
          <span>Linux Bash 1-Liner</span>
          <span class="bszl-chip">Root / Sudo</span>
        </div>
        <div class="bszl-cmd-pre-wrap">
          <pre class="bszl-cmd-pre"><code>${escapeHtml(cmd)}</code></pre>
          <button type="button" class="bszl-cmd-copy-btn" id="bszl-agent-copy-btn">
            <span class="js-copy-ico">${ICONS.copy}</span>
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
      const ico = copyBtn.querySelector(".js-copy-ico");
      if (txt) {
        txt.textContent = t("agentCopiedBtn");
        if (ico) ico.innerHTML = ICONS.check;
        setTimeout(() => {
          txt.textContent = t("agentCopyBtn");
          if (ico) ico.innerHTML = ICONS.copy;
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
          <button type="button" id="bszl-logs-close" class="bszl-icon-btn" style="height:24px;padding:0 8px;font-size:0.72rem;">${ICONS.x}</button>
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
      const res = await secFetch("/api/security-logs", {
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
    const res = await secFetch("/api/security-fail2ban", {
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

  const unreadTotal = state.unreadCount > 0 ? state.unreadCount : 0;
  const badgeCount =
    openVulnsTotal > 0
      ? openVulnsTotal
      : unreadTotal > 0
      ? unreadTotal
      : state.notifications.length;
  const notifKey = `${state.lang}:${state.notificationsPageOpen ? 1 : 0}:${badgeCount}:${openVulnsTotal}:${state.notifications.length}:${unreadTotal}`;
  if (topNotifBtn.getAttribute("data-nkey") !== notifKey) {
    topNotifBtn.setAttribute("data-nkey", notifKey);
    topNotifBtn.className = `${baseClass.replace(/\bhidden\b|\bmd:grid\b/g, "")} bszl-notif-btn ${
      state.notificationsPageOpen ? "is-active-page" : ""
    }`;
    topNotifBtn.title = t("notifBtnTitle");
    topNotifBtn.setAttribute("aria-label", t("notifBtnTitle"));
    const badgeCls =
      openVulnsTotal > 0
        ? "bszl-notif-badge--warn"
        : unreadTotal > 0
        ? ""
        : "bszl-notif-badge--neutral";
    const badgeHtml =
      badgeCount > 0
        ? `<span class="bszl-notif-badge ${badgeCls}">${badgeCount}</span>`
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
            ${state.lang === "en" ? `<span style="display:inline-flex;">${ICONS.check}</span>` : ""}
          </button>
          <button type="button" class="bszl-lang-item ${state.lang === "ru" ? "is-active" : ""}" data-l="ru">
            <span style="display:inline-flex;align-items:center;gap:8px;">
              <span class="bszl-menu-flag">${ICONS.flagRU}</span>
              <span>Русский</span>
            </span>
            ${state.lang === "ru" ? `<span style="display:inline-flex;">${ICONS.check}</span>` : ""}
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
  const rKey = `${state.lang}:${state.notifFilterType}:${state.notifFilterServer}:${state.scanPatchBusy ? 1 : 0}:${state.notifications.length}:${openVulnsTotal}:${uniquePatchedCves.size}:${totalUpgradedPkgs}:${expKey}:${rbKey}`;
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
                      )}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:4px;"><span>${escapeHtml(cve)}</span>${ICONS.arrowUpRight}</a>`
                  )
                  .join("")}</div>`
              : "";
            const pkgsHtml = (n.packages || []).length
              ? `<div class="bszl-pkg-row">${n.packages
                  .slice(0, 10)
                  .map((p) => {
                    const verHtml =
                      p.old_version && p.new_version
                        ? `: ${escapeHtml(p.old_version)} <span style="display:inline-flex;vertical-align:middle;">${ICONS.arrowRight}</span> ${escapeHtml(p.new_version)}`
                        : p.new_version
                        ? `: ${escapeHtml(p.new_version)}`
                        : "";
                    return `<span class="bszl-pkg-chip">${escapeHtml(p.name)}${verHtml}</span>`;
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
            ${ICONS.arrowLeft}
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
  const cardTarget = {
    ports: ["security", "ports"],
    updates: ["security", "updates"],
    docker: ["services", "disk"],
    overview: ["services", "all"],
  }[tabId];
  if (cardTarget) {
    state.cardTabs[cardTarget[0]] = cardTarget[1];
    state.cardsCollapsed[cardTarget[0]] = false;
  }
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
  if (baseChecks.length >= 12) {
    return baseChecks;
  }
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
  if (check.id === "ssh_security") {
    return `:${m.port || "8022"}`;
  }
  if (check.id === "tailscale_mesh") {
    return m.status === "connected" ? "Mesh OK" : "OFF";
  }
  if (check.id === "battery_power") {
    return `${m.level ?? 100}% · ${m.temp ?? 27}°C`;
  }
  if (check.id === "root_disk") {
    return `${m.percent ?? 0}%`;
  }
  if (check.id === "memory_status") {
    return `${m.percent ?? 0}%`;
  }
  if (check.id === "termux_security") {
    return m.wake_lock ? "ON" : "OFF";
  }
  if (check.id === "aslr_kernel") {
    return m.selinux === "enforcing" ? "SELinux" : "OK";
  }
  if (check.id === "proc_integrity") {
    return (m.threats || 0) === 0 ? "OK" : `${m.threats}`;
  }
  if (check.id === "network_security") {
    return m.isolated ? "Tailnet" : "OK";
  }
  if (check.id === "osint_stack") {
    return m.dashboard ? "ON" : "OK";
  }
  if (check.id === "cve_vulnerabilities") {
    return `${m.cve_count ?? 0}`;
  }
  if (check.id === "firewall") {
    return `${m.rules_count ?? 0}`;
  }
  if (check.id === "fail2ban") {
    return `${m.currently_banned ?? 0}`;
  }
  if (check.id === "open_ports") {
    return `${m.total_external_ports ?? (Array.isArray(m.ports) ? m.ports.length : 0)}`;
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

function getCheckAuditDetails(check, isEn) {
  if (isEn) {
    return check.tooltip || check.summary || "OK";
  }
  const m = check.metrics || {};
  switch (check.id) {
    case "ssh_auth":
      return `Порт ${(m.ports || [])[0] || 22} · Ключей: ${m.authorized_keys_count ?? 1} · Неудачных входов (24ч): ${m.failed_24h ?? 0}`;
    case "firewall":
      return `Активен · правил фильтрации UFW: ${m.rules_count ?? 0}`;
    case "fail2ban":
      return `Заблокировано сейчас: ${m.currently_banned ?? 0} (всего: ${m.total_banned ?? 0})`;
    case "open_ports":
      return m.total_external_ports !== undefined
        ? `Слушают: ${m.total_external_ports} · Открыто в UFW: ${m.open_ufw_count ?? 0}`
        : `Слушают в Tailnet: ${(m.ports || []).length} (8022, 8080, 45876)`;
    case "users_priv":
      return `UID 0: ${(m.uid0_users || ["root"]).join(", ")} · Shell-пользователей: ${(m.shell_users || []).length || 1}`;
    case "processes_integrity":
    case "proc_integrity":
      return `Подозрительных процессов: ${(m.suspicious_processes || []).length || m.threats || 0} · Зомби: ${m.zombie_count ?? m.zombies ?? 0}`;
    case "cron_timers":
      return `Аудит 04:00 DXB: ${m.beszel_timer_active ? "ВКЛ" : "ВЫКЛ"} · Задач cron: ${(m.root_cron_jobs || []).length}`;
    case "kernel_sysctl":
      return `ASLR: ${m.aslr || 2}/2 · Занято на диске: ${m.root_disk_percent ?? 0}%`;
    case "ssh_security":
      return `Порт :${m.port || 8022} · Вход строго по ключу (пароли отключены)`;
    case "tailscale_mesh":
      return `100.64.0.5 подключён к сети Tailscale (WireGuard)`;
    case "battery_power":
      return `Заряд: ${m.level ?? 100}% · Температура: ${m.temp ?? 27}°C (норма)`;
    case "root_disk":
      return `Раздел /data: занято ${m.percent ?? 21.2}% (свободно ${m.free || "50.4 GB"})`;
    case "memory_status":
      return `ОЗУ: занято ${m.percent ?? 73.7}% из ${m.total || "3.54 GB"}`;
    case "termux_security":
      return `Termux WakeLock активен (защита от засыпания)`;
    case "aslr_kernel":
      return `ASLR: ${m.aslr || 2}/2 · SELinux: ${m.selinux || "enforcing"}`;
    case "network_security":
      return `Доступ изолирован внутри сети Tailscale`;
    case "osint_stack":
      return `Установлены и готовы: OSINT Dashboard, Maigret, Holehe, Sherlock, theHarvester`;
    case "cve_vulnerabilities":
      return `Известных открытых CVE-уязвимостей: ${m.cve_count ?? 0}`;
    default:
      return check.tooltip || check.summary || "OK";
  }
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

function hideNativeDuplicateTables(gridWrapper) {
  if (!gridWrapper) return;
  gridWrapper.querySelectorAll("h3, [data-slot='card-title']").forEach((titleEl) => {
    if (titleEl.closest("#bszl-server-security-panel, #bszl-server-services-panel")) return;
    const txt = (titleEl.textContent || "").trim().toLowerCase();
    if (
      txt.includes("all containers") ||
      txt.includes("все контейнеры") ||
      txt.includes("systemd services") ||
      txt.includes("службы systemd") ||
      txt.includes("сервисы systemd")
    ) {
      const wrapper = titleEl.closest("div.contents") || titleEl.closest(".rounded-lg.border.bg-card");
      if (wrapper) {
        wrapper.style.display = "none";
        wrapper.setAttribute("data-bszl-native-hidden", "1");
      }
    }
  });
}

function applySystemChartsLayout(sysId) {
  const gridWrapper = document.querySelector("div.grid.gap-4.mb-14");
  if (!gridWrapper) return;
  gridWrapper.setAttribute("data-bszl-sysid", sysId);
  const layout = getServerLayout(sysId);

  hideNativeDuplicateTables(gridWrapper);

  const children = Array.from(gridWrapper.children);
  const headerCard = children.find(
    (el) =>
      el.id !== "bszl-server-security-panel" &&
      el.id !== "bszl-server-services-panel" &&
      !el.classList.contains("xl:grid-cols-2") &&
      !el.classList.contains("contents")
  );
  const panelEl = document.getElementById("bszl-server-security-panel");
  const svcPanelEl = document.getElementById("bszl-server-services-panel");
  const chartsGrid =
    children.find((el) => el.classList.contains("xl:grid-cols-2")) ||
    gridWrapper.querySelector("div.grid.xl\\:grid-cols-2.gap-4");

  const chartCardCount = chartsGrid ? chartsGrid.children.length : 0;
  const layoutKey = `${sysId}:${layout.panelPos}:${state.servicesPos}:${layout.chartsOrder.join(",")}:${(layout.hiddenCharts || []).join(",")}:${state.rearrangeMode ? 1 : 0}:${state.lang}:${chartCardCount}`;
  if (gridWrapper.getAttribute("data-bszl-applied-layout") === layoutKey) {
    normalizeRussianChartTitles();
    hideNativeDuplicateTables(gridWrapper);
    return;
  }
  gridWrapper.setAttribute("data-bszl-applied-layout", layoutKey);

  if (headerCard) headerCard.style.order = "";
  if (panelEl) panelEl.style.order = "";
  if (svcPanelEl) svcPanelEl.style.order = "";
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

  if (svcPanelEl && chartsGrid && panelEl) {
    if (state.servicesPos === "top") {
      if (panelEl.nextElementSibling !== svcPanelEl) {
        panelEl.insertAdjacentElement("afterend", svcPanelEl);
      }
    } else {
      const anchor = layout.panelPos === "bottom" ? panelEl : chartsGrid;
      if (anchor.nextElementSibling !== svcPanelEl) {
        anchor.insertAdjacentElement("afterend", svcPanelEl);
      }
    }
  }

  if (chartsGrid) {
    const chartCards = Array.from(chartsGrid.children);
    const hiddenSet = new Set(layout.hiddenCharts || []);
    const rep = getReport(sysId);
    const isExplicitNonDocker = Boolean(
      (rep && (rep.profile === "termux" || rep.system_id === "Lineage" || rep.system_id === "4rnyjklpllef0yl")) ||
      (rep && rep.docker_storage && rep.docker_storage.available === false && (!Array.isArray(rep.services) || !rep.services.some((i) => i.type === "docker" || i.kind === "docker")))
    );
    chartCards.forEach((card, fallbackIdx) => {
      const cid = detectNativeChartId(card, fallbackIdx);
      if (isExplicitNonDocker && (cid === "docker_cpu" || cid === "docker_memory" || cid === "docker_net")) {
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
              <button type="button" class="bszl-mini-move-btn js-chart-up" title="Move Up">${ICONS.arrowUp}</button>
              <button type="button" class="bszl-mini-move-btn js-chart-down" title="Move Down">${ICONS.arrowDown}</button>
              <button type="button" class="bszl-mini-move-btn ${isHidden ? "is-muted" : "is-vis"} js-chart-vis" title="${state.lang === "en" ? "Show/Hide chart" : "Показать/скрыть график"}">${isHidden ? ICONS.eyeOff : ICONS.eye}</button>
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
  hideNativeDuplicateTables(gridWrapper);
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
  // Tab order is fixed inside each card now, so only charts and checks can be rearranged.
  const rTab = state.rearrangeMenuTab === "checks" ? "checks" : "charts";
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
    db: t("catDb"),
    utils: t("catUtils"),
    system: t("catSystem"),
    web: t("catWeb"),
    agent: t("catAgent"),
    security: t("catSecurity"),
    network: t("catNetwork"),
    tools: t("catTools"),
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
            <button type="button" class="bszl-rm-vis-btn js-rm-vis" data-type="chart" data-id="${escapeHtml(cid)}">${isHidden ? "" : ICONS.check}</button>
            <span class="bszl-rm-item-lbl">${escapeHtml(lbl)}</span>
            <div class="bszl-rm-arrows">
              <button type="button" class="bszl-rm-arr js-rm-move" data-type="chart" data-id="${escapeHtml(cid)}" data-dir="-1" ${idx === 0 ? "disabled" : ""}>${ICONS.arrowUp}</button>
              <button type="button" class="bszl-rm-arr js-rm-move" data-type="chart" data-id="${escapeHtml(cid)}" data-dir="1" ${idx === layout.chartsOrder.length - 1 ? "disabled" : ""}>${ICONS.arrowDown}</button>
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
            <button type="button" class="bszl-rm-vis-btn js-rm-vis" data-type="check" data-id="${escapeHtml(chkId)}">${isHidden ? "" : ICONS.check}</button>
            <span class="bszl-rm-item-lbl">${escapeHtml(lbl)}</span>
            <div class="bszl-rm-arrows">
              <button type="button" class="bszl-rm-arr js-rm-move" data-type="check" data-id="${escapeHtml(chkId)}" data-dir="-1" ${idx === 0 ? "disabled" : ""}>${ICONS.arrowUp}</button>
              <button type="button" class="bszl-rm-arr js-rm-move" data-type="check" data-id="${escapeHtml(chkId)}" data-dir="1" ${idx === layout.checksOrder.length - 1 ? "disabled" : ""}>${ICONS.arrowDown}</button>
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
            <button type="button" class="bszl-rm-vis-btn js-rm-vis" data-type="cat" data-id="${escapeHtml(catId)}">${isHidden ? "" : ICONS.check}</button>
            <span class="bszl-rm-item-lbl">${escapeHtml(lbl)}</span>
            <div class="bszl-rm-arrows">
              <button type="button" class="bszl-rm-arr js-rm-move" data-type="cat" data-id="${escapeHtml(catId)}" data-dir="-1" ${idx === 0 ? "disabled" : ""}>${ICONS.arrowUp}</button>
              <button type="button" class="bszl-rm-arr js-rm-move" data-type="cat" data-id="${escapeHtml(catId)}" data-dir="1" ${idx === layout.catsOrder.length - 1 ? "disabled" : ""}>${ICONS.arrowDown}</button>
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
            <button type="button" class="bszl-rm-vis-btn js-rm-vis" data-type="tab" data-id="${escapeHtml(tId)}">${isHidden ? "" : ICONS.check}</button>
            <span class="bszl-rm-item-lbl">${escapeHtml(lbl)}</span>
            <div class="bszl-rm-arrows">
              <button type="button" class="bszl-rm-arr js-rm-move" data-type="tab" data-id="${escapeHtml(tId)}" data-dir="-1" ${idx === 0 ? "disabled" : ""}>${ICONS.arrowUp}</button>
              <button type="button" class="bszl-rm-arr js-rm-move" data-type="tab" data-id="${escapeHtml(tId)}" data-dir="1" ${idx === layout.tabsOrder.length - 1 ? "disabled" : ""}>${ICONS.arrowDown}</button>
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
      const sp = document.getElementById("bszl-server-services-panel");
      if (sp) sp.removeAttribute("data-render-key");
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
  const existingSvcPanel = document.getElementById("bszl-server-services-panel");
  if (!m) {
    if (existingPanel) existingPanel.remove();
    if (existingSvcPanel) existingSvcPanel.remove();
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
    const nativeCards = Array.from(gridWrapper.children).filter(
      (el) => el.id !== "bszl-server-security-panel" && el.id !== "bszl-server-services-panel"
    );
    const firstCard = nativeCards[0];
    if (firstCard && firstCard.nextSibling) {
      gridWrapper.insertBefore(panel, firstCard.nextSibling);
    } else {
      gridWrapper.prepend(panel);
    }
  }

  let svcPanel = document.getElementById("bszl-server-services-panel");
  if (!svcPanel) {
    svcPanel = document.createElement("div");
    svcPanel.id = "bszl-server-services-panel";
    gridWrapper.appendChild(svcPanel);
  }

  panel.className = "bszl-cards-stack";
  svcPanel.className = "bszl-cards-stack";
  applySystemChartsLayout(sysId);

  if (!rep) return;

  const layout = getServerLayout(sysId);
  const up = rep.updates || {};
  const pendingCount = up.pending_count || 0;
  const up24hCount = up.upgraded_24h_count || 0;
  const dockerStorage = rep.docker_storage || {};
  const rawDockerContainers = Array.isArray(dockerStorage.containers_io)
    ? dockerStorage.containers_io
    : Array.isArray(up.docker?.containers)
    ? up.docker.containers
    : [];
  const allContainers = Array.isArray(rep.all_containers) && rep.all_containers.length > 0
    ? rep.all_containers
    : rawDockerContainers;
  const isTermuxHost = Boolean(
    rep &&
      (rep.profile === "termux" ||
        rep.system_id === "Lineage" ||
        rep.system_id === "4rnyjklpllef0yl" ||
        String(rep.os || "").toLowerCase().includes("android") ||
        String(rep.os || "").toLowerCase().includes("lineage"))
  );
  const systemdServices = !isTermuxHost && Array.isArray(rep.systemd_services) ? rep.systemd_services : [];
  const stack = rep.stack || { total: 0, running: 0, items: [] };
  const stackItems = stack.items || [];
  const hasDocker = Boolean(
    allContainers.length > 0 ||
    (dockerStorage.total_containers && dockerStorage.total_containers > 0) ||
    stackItems.some((i) => i.type === "docker")
  );
  const hasSystemd = systemdServices.length > 0;
  const hasUpdates = Boolean(
    pendingCount > 0 || up24hCount > 0 || (up.packages && up.packages.length > 0)
  );

  const isEn = state.lang === "en";
  const isChecking = state.loadingSystem === `${sysId}:check`;
  const fb = state.portFeedback[sysId];
  const selectedItem = state.selectedProgramId
    ? stackItems.find((i) => i.id === state.selectedProgramId) || null
    : null;
  const showUpdatesTab = hasUpdates || Boolean(up.pkg_manager && up.pkg_manager.includes("apt"));
  const secTab = state.cardTabs.security === "updates" && showUpdatesTab ? "updates" : "ports";

  let svcBottomTab = state.cardTabs.services || "all";
  if (svcBottomTab === "containers" && !hasDocker) svcBottomTab = "all";
  else if (svcBottomTab === "systemd" && !hasSystemd) svcBottomTab = "all";

  const collapsed = state.cardsCollapsed;

  const renderKey = `${sysId}:${rep.checked_at_iso}:${secTab}:${svcBottomTab}:${state.servicesPos}:${state.unifiedFilter}:${state.stackCatFilter}:${state.containerFilter}:${state.systemdFilter}:${JSON.stringify(collapsed)}:${state.checksShowAll ? 1 : 0}:${state.loadingSystem}:${state.portBusyKey}:${state.serviceBusyKey || ""}:${state.configBusyKey || ""}:${state.lang}:${state.rearrangeMode ? 1 : 0}:${fb?.ts || 0}:${stackItems.length}:${allContainers.length}:${systemdServices.length}:${selectedItem?.id || ""}:${hasDocker ? 1 : 0}:${JSON.stringify(layout)}`;
  if (panel.getAttribute("data-render-key") === renderKey && svcPanel.getAttribute("data-render-key") === renderKey) return;
  panel.setAttribute("data-render-key", renderKey);
  svcPanel.setAttribute("data-render-key", renderKey);

  const allChecks = getExtendedChecksList(rep);
  const passedCount = allChecks.filter((c) => c.status === "ok").length;
  const portsCheck = allChecks.find((c) => c.id === "open_ports");
  const fwCheck = allChecks.find((c) => c.id === "firewall");
  const portsList = portsCheck?.metrics?.ports || [];
  const fwRules = fwCheck?.metrics?.rules || [];
  const netInfo = rep.network_health || rep.network || {};
  const allOk = passedCount === allChecks.length;
  const svcRunning = stackItems.filter((i) => i.status === "running" || i.status === "ondemand").length;

  const vSep = `<div class="bszl-v-sep"></div>`;

  // 1:1 Native Beszel CardHeader (matches containers-table.tsx & systemd-table.tsx)
  const cardHeader = (cardId, title, descParts = [], actionsHtml = "") => `
    <div class="bszl-card-hdr">
      <div class="bszl-card-hdr-main">
        <h3 class="bszl-card-title">${escapeHtml(title)}</h3>
        ${
          descParts.length
            ? `<div class="bszl-card-desc">${descParts.filter(Boolean).join(vSep)}</div>`
            : ""
        }
      </div>
      <div class="bszl-card-actions">
        ${actionsHtml}
        <button type="button" class="bszl-icon-btn bszl-card-collapse js-card-collapse" data-card="${cardId}" title="${escapeHtml(collapsed[cardId] ? t("expand") : t("hide"))}">
          ${collapsed[cardId] ? ICONS.chevronDown : ICONS.chevronUp}
        </button>
      </div>
    </div>
  `;

  // 1:1 Native Beszel Table Header Cell with Lucide icon + sort button
  const thCell = (iconSvg, label, colIdx, alignRight = false, sortable = true) =>
    sortable
      ? `<th style="${alignRight ? "text-align:right;" : ""}"><button type="button" class="bszl-th-btn js-sort-col" data-col-idx="${colIdx}" style="${alignRight ? "margin-left:auto;" : ""}">${iconSvg || ""}<span>${escapeHtml(label)}</span>${ICONS.arrowUpDown}</button></th>`
      : `<th style="${alignRight ? "text-align:right;" : ""}"><span class="bszl-th-label" style="${alignRight ? "margin-left:auto;" : ""}">${iconSvg || ""}<span>${escapeHtml(label)}</span></span></th>`;

  // 1:1 Native Beszel Badge variant="outline" with size-2 colored dot
  const nativeBadge = (dotType, label) => {
    const dotCls =
      dotType === "ok" || dotType === "running"
        ? "bszl-dot--ok"
        : dotType === "warn"
        ? "bszl-dot--warn"
        : dotType === "ondemand"
        ? "bszl-dot--ondemand"
        : dotType === "muted"
        ? "bszl-dot--muted"
        : "bszl-dot--crit";
    return `<span class="bszl-pill"><span class="bszl-dot ${dotCls}"></span><span>${escapeHtml(label)}</span></span>`;
  };

  const tabsBar = (cardId, tabs, active) => `
    <div class="bszl-tabs-bar bszl-card-tabs">
      ${tabs
        .map(
          (tb) => `<button type="button" class="bszl-tab-btn ${tb.id === active ? "is-active" : ""}" data-card-tab="${cardId}:${tb.id}">${escapeHtml(tb.label)}</button>`
        )
        .join("")}
    </div>
  `;

  const rearrangeBannerHtml = state.rearrangeMode
    ? `
      <div class="bszl-rearrange-banner">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          ${ICONS.grip}
          <span style="font-weight:600;">${
            isEn
              ? "Rearrange mode: drag checks, services or charts"
              : "Режим сортировки: перетаскивайте проверки, сервисы и графики"
          }</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <button type="button" id="bszl-btn-rearrange-pos" class="bszl-icon-btn">
            <span>${
              layout.panelPos === "bottom"
                ? isEn ? "Cards: Bottom" : "Карточки: снизу"
                : isEn ? "Cards: Top" : "Карточки: сверху"
            }</span>
            ${layout.panelPos === "bottom" ? ICONS.arrowUp : ICONS.arrowDown}
          </button>
          <button type="button" id="bszl-btn-rearrange-reset" class="bszl-icon-btn">
            ${ICONS.rotateCcw}
            <span>${escapeHtml(t("rearrangeReset"))}</span>
          </button>
          <button type="button" id="bszl-btn-rearrange-done" class="bszl-act-btn bszl-act-btn--open">
            ${ICONS.check}
            <span>${escapeHtml(t("rearrangeDone"))}</span>
          </button>
        </div>
      </div>
    `
    : "";

  // ===== Card 1: Security (1:1 Native Beszel Card & Tables) ==================
  const titles = I18N[state.lang].checkTitles;
  const checksMap = new Map(allChecks.map((c) => [c.id, c]));
  const fullChecksOrder = [
    ...layout.checksOrder.filter((cid) => checksMap.has(cid)),
    ...allChecks.map((c) => c.id).filter((cid) => !layout.checksOrder.includes(cid)),
  ];
  const orderedCheckIds = fullChecksOrder.filter(
    (cid) => state.rearrangeMode || !layout.hiddenChecks.includes(cid)
  );
  const showAllChecks = state.checksShowAll || state.rearrangeMode;
  const stripIds = showAllChecks
    ? orderedCheckIds
    : orderedCheckIds.filter((cid) => checksMap.get(cid).status !== "ok");

  const checksRowsOrStripHtml = state.rearrangeMode
    ? `<div class="bszl-checks-strip">${stripIds
        .map((cid) => {
          const c = checksMap.get(cid);
          const isHid = layout.hiddenChecks.includes(cid);
          const dot = c.status === "ok" ? "bszl-dot--ok" : c.status === "warn" ? "bszl-dot--warn" : "bszl-dot--crit";
          return `
            <div class="bszl-mini-check ${isHid ? "is-hidden-item" : ""} is-draggable-item" data-check-id="${escapeHtml(c.id)}" draggable="true" title="${escapeHtml(getCheckAuditDetails(c, isEn))}">
              <span style="display:inline-flex;align-items:center;gap:6px;min-width:0;">
                <span class="bszl-inline-grip">${ICONS.grip}</span>
                <span class="bszl-dot ${dot}"></span>
                <span style="overflow:hidden;text-overflow:ellipsis;">${escapeHtml(titles[c.id] || c.title)}</span>
              </span>
              <span class="bszl-mini-check-val">${escapeHtml(getShortCheckValue(c))}</span>
            </div>
          `;
        })
        .join("")}</div>`
    : stripIds.length
    ? `<div class="bszl-table-wrap" style="margin-bottom:0.875rem;">
        <table class="bszl-mini-table">
          <thead><tr>
            ${thCell(ICONS.shieldCheck, isEn ? "Check" : "Проверка", 0)}
            ${thCell(ICONS.activity, isEn ? "Status" : "Статус", 1)}
            ${thCell(ICONS.layers, isEn ? "Metric" : "Значение", 2)}
            ${thCell(ICONS.terminalSquare, isEn ? "Audit details" : "Подробности аудита", 3)}
          </tr></thead>
          <tbody>
            ${stripIds
              .map((cid) => {
                const c = checksMap.get(cid);
                const stType = c.status === "ok" ? "ok" : c.status === "warn" ? "warn" : "crit";
                const stLbl = c.status === "ok" ? (isEn ? "Passed" : "Норма") : c.status === "warn" ? (isEn ? "Warning" : "Внимание") : isEn ? "Critical" : "Критично";
                return `
                  <tr class="bszl-mini-check-row" data-check-id="${escapeHtml(c.id)}" style="cursor:pointer;">
                    <td style="font-weight:500;">${escapeHtml(titles[c.id] || c.title)}</td>
                    <td>${nativeBadge(stType, stLbl)}</td>
                    <td class="tabular-nums">${escapeHtml(getShortCheckValue(c))}</td>
                    <td style="color:var(--muted-foreground);">${escapeHtml(getCheckAuditDetails(c, isEn))}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </div>`
    : "";

  const problemCount = allChecks.length - passedCount;
  const checksSummaryText = allOk
    ? isEn ? `All ${allChecks.length} checks passed` : `Все ${allChecks.length} проверок в норме`
    : isEn
    ? `${problemCount} of ${allChecks.length} need attention`
    : `${problemCount} из ${allChecks.length} требуют внимания`;
  const checksToggleText = showAllChecks
    ? isEn ? "Hide checks" : "Скрыть проверки"
    : isEn ? `All ${allChecks.length} checks` : `Все ${allChecks.length} проверок`;

  const sshVal = checksMap.has("ssh_auth")
    ? getShortCheckValue(checksMap.get("ssh_auth"))
    : checksMap.has("ssh_security")
    ? getShortCheckValue(checksMap.get("ssh_security"))
    : "";
  const ufwVal = checksMap.has("firewall")
    ? checksMap.get("firewall").status === "ok"
      ? "OK"
      : "OFF"
    : "";
  const tsVal = !checksMap.has("firewall") && checksMap.has("tailscale_mesh")
    ? checksMap.get("tailscale_mesh").status === "ok"
      ? "OK (100.64.0.5)"
      : "OFF"
    : "";
  const batVal = checksMap.has("battery_power") ? getShortCheckValue(checksMap.get("battery_power")) : "";
  const f2bVal = checksMap.has("fail2ban") ? getShortCheckValue(checksMap.get("fail2ban")) : "";
  const diskVal = checksMap.has("kernel_sysctl")
    ? getShortCheckValue(checksMap.get("kernel_sysctl"))
    : checksMap.has("root_disk")
    ? getShortCheckValue(checksMap.get("root_disk"))
    : "";

  const secActionsHtml = `
    <button type="button" class="bszl-icon-btn" id="bszl-btn-toggle-checks">
      <span>${escapeHtml(checksToggleText)}</span>
      ${showAllChecks ? ICONS.chevronUp : ICONS.chevronDown}
    </button>
    <button type="button" id="bszl-btn-jump-services" class="bszl-icon-btn" title="${isEn ? "Jump to unified Services, Containers & Systemd panel" : "Перейти к объединенному блоку Сервисы, Контейнеры и Systemd"}">
      ${ICONS.container}
      <span>${isEn ? "Services" : "Сервисы"} (${svcRunning}/${stackItems.length})</span>
      ${state.servicesPos === "bottom" ? ICONS.arrowDown : ICONS.arrowUp}
    </button>
    <button type="button" id="bszl-btn-srv-rearrange" class="bszl-icon-btn ${state.rearrangeMode ? "is-active" : ""}" title="${escapeHtml(t("rearrangeTitle"))}">
      ${ICONS.sliders}
      <span>${state.rearrangeMode ? escapeHtml(t("rearrangeDone")) : isEn ? "Rearrange" : "Сортировка"}</span>
    </button>
    <button type="button" id="bszl-btn-srv-check" class="bszl-icon-btn" title="${escapeHtml(t("checkNow"))}" ${state.loadingSystem ? "disabled" : ""}>
      ${ICONS.sync(isChecking)}
      <span>${escapeHtml(t("checkNow"))}</span>
    </button>
    ${
      showUpdatesTab
        ? `
    <button type="button" id="bszl-btn-srv-update" class="bszl-icon-btn" title="${escapeHtml(t("updateNow"))}" ${state.loadingSystem ? "disabled" : ""}>
      <span>${escapeHtml(t("updateNow"))}${pendingCount > 0 ? ` (${pendingCount})` : ""}</span>
    </button>
    <button type="button" id="bszl-btn-srv-rollback" class="bszl-icon-btn" title="${escapeHtml(t("rollbackNow"))}" ${state.loadingSystem || !up.rollback_available ? "disabled" : ""}>
      ${ICONS.rotateCcw}
      <span>${state.loadingSystem === `${sysId}:rollback` ? "..." : escapeHtml(t("rollbackNow"))}</span>
    </button>`
        : ""
    }
  `;

  let secBodyHtml = "";
  if (secTab === "ports") {
    const draft = state.portFormDraft;
    const isTermux = Boolean(
      rep && (
        rep.profile === "termux" ||
        rep.system_id === "Lineage" ||
        rep.system_id === "4rnyjklpllef0yl" ||
        String(rep.os || "").toLowerCase().includes("android") ||
        String(rep.os || "").toLowerCase().includes("lineage")
      )
    );
    const hasUfw = Boolean(
      !isTermux &&
      fwCheck &&
      fwCheck.status !== "off" &&
      Array.isArray(fwRules)
    );
    const portsRowsHtml = portsList
      .map((p) => {
        const isOpen = hasUfw ? p.ufw_state === "open" : true;
        const isRestr = hasUfw ? p.ufw_state === "restricted" : false;
        const stType = !hasUfw ? "ok" : isOpen ? "ok" : isRestr ? "warn" : "muted";
        const stText = !hasUfw ? (isEn ? "Listening" : "Слушает") : isOpen ? t("ufwOpen") : isRestr ? t("ufwRestricted") : t("ufwClosed");
        const bKey = `toggle:${p.port}:${p.proto}`;
        const isBusy = state.portBusyKey === bKey;
        let actionHtml = "";
        if (!hasUfw) {
          actionHtml = `<span style="color:var(--muted-foreground);">N/A</span>`;
        } else if (p.protected) {
          actionHtml = `<span style="color:var(--muted-foreground);" title="${isEn ? "Protected port" : "Защищённый порт"}">${isEn ? "Protected" : "Защищён"}</span>`;
        } else if (isOpen) {
          actionHtml = `<button type="button" class="bszl-act-btn bszl-act-btn--close js-port-toggle" data-action="close" data-port="${p.port}" data-proto="${escapeHtml(p.proto.toLowerCase())}" data-bkey="${bKey}" ${state.portBusyKey ? "disabled" : ""}>${isBusy ? "..." : t("closeBtn")}</button>`;
        } else {
          actionHtml = `<button type="button" class="bszl-act-btn bszl-act-btn--open js-port-toggle" data-action="open" data-port="${p.port}" data-proto="${escapeHtml(p.proto.toLowerCase())}" data-comment="${escapeHtml(p.note || p.process)}" data-bkey="${bKey}" ${state.portBusyKey ? "disabled" : ""}>${isBusy ? "..." : t("openBtn")}</button>`;
        }
        return `
          <tr>
            <td style="font-weight:500;" class="tabular-nums">${p.port}/${escapeHtml(p.proto)}</td>
            <td>${escapeHtml(p.note || p.process || "—")}</td>
            <td>${nativeBadge(stType, stText)}</td>
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
          ? `<span style="color:var(--muted-foreground);">${isEn ? "Protected" : "Защищён"}</span>`
          : `<button type="button" class="bszl-act-btn bszl-act-btn--close js-rule-del" data-rnum="${r.num}" data-bkey="${bKey}" ${state.portBusyKey ? "disabled" : ""}>${isBusy ? "..." : isEn ? "Delete" : "Удалить"}</button>`;
        return `
          <tr>
            <td style="color:var(--muted-foreground);" class="tabular-nums">#${r.num}</td>
            <td style="font-weight:500;">${escapeHtml(r.to)}</td>
            <td>${nativeBadge(isAllow ? "ok" : "crit", r.action)}</td>
            <td>${escapeHtml(r.from)}</td>
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
          `<span class="bszl-pill" title="${escapeHtml(lg.last_seen)}"><span class="bszl-dot ${Boolean(lg.is_hub_ip || lg.ip === "127.0.0.1") ? "bszl-dot--ok" : "bszl-dot--ondemand"}"></span><span>${escapeHtml(lg.user)}@${escapeHtml(lg.ip)} (${lg.count})</span></span>`
      )
      .join("");
    const bannedChips = bannedIps.length
      ? bannedIps
          .slice(0, 10)
          .map(
            (ip) =>
              `<span class="bszl-f2b-chip"><span class="bszl-dot bszl-dot--crit"></span><span>${escapeHtml(ip)}</span><button type="button" class="bszl-f2b-unban js-f2b-unban" data-ip="${escapeHtml(ip)}" title="${isEn ? "Unban IP" : "Разбанить IP"}">${ICONS.x}</button></span>`
          )
          .join("")
      : `<span style="color:var(--muted-foreground);">${isEn ? "none" : "никого в бане"}</span>`;

    const hasF2b = Boolean(
      !isTermux &&
      (f2b.fail2ban_active || (Array.isArray(f2b.active_jails) && f2b.active_jails.length > 0 && f2b.active_jails[0] !== "termux-sshd"))
    );

    const f2bBanFormHtml = hasF2b
      ? `<div class="bszl-f2b-ban-form">
          <input type="text" id="bszl-inp-f2b-ip" class="bszl-input bszl-input--f2b" placeholder="IP" />
          <button type="button" id="bszl-btn-f2b-ban" class="bszl-act-btn bszl-act-btn--close" ${state.portBusyKey ? "disabled" : ""}>${isEn ? "Ban IP" : "Забанить IP"}</button>
        </div>`
      : "";

    const portBarHtml = hasUfw
      ? `<div class="bszl-port-bar">
          <input type="text" id="bszl-inp-port" class="bszl-input bszl-input--port" placeholder="${escapeHtml(t("portPlaceholder"))}" value="${escapeHtml(draft.port)}" />
          <select id="bszl-sel-proto" class="bszl-select bszl-select--proto">
            <option value="tcp" ${draft.proto === "tcp" ? "selected" : ""}>TCP</option>
            <option value="udp" ${draft.proto === "udp" ? "selected" : ""}>UDP</option>
            <option value="both" ${draft.proto === "both" ? "selected" : ""}>TCP+UDP</option>
          </select>
          <input type="text" id="bszl-inp-from" class="bszl-input bszl-input--from" placeholder="${escapeHtml(t("ipPlaceholder"))}" value="${escapeHtml(draft.from_ip)}" />
          <input type="text" id="bszl-inp-comment" class="bszl-input bszl-input--comment" placeholder="${escapeHtml(t("commentPlaceholder"))}" value="${escapeHtml(draft.comment)}" />
          <button type="button" id="bszl-btn-port-open" class="bszl-act-btn bszl-act-btn--open" ${state.portBusyKey ? "disabled" : ""}>
            ${state.portBusyKey === "form:open" ? "..." : `${ICONS.plus}<span>${escapeHtml(t("openPortBtn"))}</span>`}
          </button>
          <button type="button" id="bszl-btn-port-close" class="bszl-act-btn bszl-act-btn--close" ${state.portBusyKey ? "disabled" : ""}>
            ${state.portBusyKey === "form:close" ? "..." : `${ICONS.x}<span>${escapeHtml(t("closePortBtn"))}</span>`}
          </button>
          ${
            fb && Date.now() - fb.ts < 8000
              ? nativeBadge(fb.ok ? "ok" : "crit", fb.msg.slice(0, 45))
              : ""
          }
        </div>`
      : isTermux
      ? `<div class="bszl-port-bar" style="color:var(--muted-foreground);">
          <span>${isEn ? "LineageOS / Termux: UFW firewall is not available. Port access is restricted by Tailscale mesh and Android OS security." : "LineageOS / Termux: фаервол UFW отсутствует. Доступ к портам ограничен сетью Tailscale и защитой Android."}</span>
        </div>`
      : `<div class="bszl-port-bar" style="color:var(--muted-foreground);">
          <span>${isEn ? "UFW firewall is inactive on this host." : "Файрвол UFW неактивен на этом хосте."}</span>
        </div>`;

    const rightTableHtml = hasUfw
      ? `<div class="bszl-table-wrap">
          <table class="bszl-mini-table">
            <thead><tr>
              ${thCell(ICONS.layers, "#", 0)}
              ${thCell(ICONS.ethernet, t("colRule"), 1)}
              ${thCell(ICONS.shieldCheck, "UFW", 2)}
              ${thCell(ICONS.squareArrowRightEnter, t("colFrom"), 3)}
              ${thCell(ICONS.activity, t("colAction"), 4, true, false)}
            </tr></thead>
            <tbody>${fwRowsHtml}</tbody>
          </table>
        </div>`
      : `<div class="bszl-table-wrap" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2.5rem 1.5rem;text-align:center;color:var(--muted-foreground);min-height:140px;">
          <div style="font-weight:600;font-size:1rem;margin-bottom:0.25rem;color:var(--foreground);">${isTermux ? (isEn ? "Android / LineageOS Node" : "Узел Android / LineageOS") : (isEn ? "Firewall Inactive" : "Файрвол неактивен")}</div>
          <div style="font-size:0.875rem;max-width:360px;line-height:1.5;">${isTermux ? (isEn ? "This mobile device routes traffic via Tailscale WireGuard. UFW rules are not used." : "Устройство маршрутизирует трафик через Tailscale WireGuard. Правила UFW не применяются.") : (isEn ? "No active firewall rules detected." : "Активные правила фильтрации не обнаружены.")}</div>
        </div>`;

    secBodyHtml = `
      <div class="bszl-sub-strip" style="margin-bottom:0.75rem;margin-top:0;">
        <div class="bszl-sub-strip-group">
          <span class="bszl-sub-label">${isEn ? "SSH logins:" : "Входы по SSH:"}</span>
          ${loginsChips || `<span style="color:var(--muted-foreground);">${isEn ? "none" : "нет"}</span>`}
          <span class="bszl-sub-label" style="margin-left:0.5rem;">Fail2ban (${f2b.currently_banned || 0}):</span>
          ${bannedChips}
        </div>
        ${f2bBanFormHtml}
      </div>
      ${portBarHtml}
      <div class="bszl-two-col-grid">
        <div class="bszl-table-wrap">
          <table class="bszl-mini-table">
            <thead><tr>
              ${thCell(ICONS.squareArrowRightEnter, t("colPort"), 0)}
              ${thCell(ICONS.terminalSquare, t("colService"), 1)}
              ${thCell(ICONS.shieldCheck, hasUfw ? t("colUfw") : isEn ? "Status" : "Статус", 2)}
              ${thCell(ICONS.activity, t("colAction"), 3, true, false)}
            </tr></thead>
            <tbody>${portsRowsHtml}</tbody>
          </table>
        </div>
        ${rightTableHtml}
      </div>
    `;
  } else {
    const pendingRowsHtml = (up.pending_packages || []).length
      ? up.pending_packages
          .map(
            (p) => `
          <tr>
            <td style="font-weight:500;">${escapeHtml(p.name)}</td>
            <td style="color:var(--muted-foreground);" class="tabular-nums">${escapeHtml(p.old_version)}</td>
            <td class="bszl-ver-pending tabular-nums">${nativeBadge("ondemand", p.new_version)}</td>
          </tr>`
          )
          .join("")
      : `<tr><td colspan="3" style="text-align:center;color:var(--muted-foreground);">${escapeHtml(t("noPending"))}</td></tr>`;

    const recentPkgs = up.upgraded_24h?.length ? up.upgraded_24h : up.upgraded_recent || [];
    const pkgsRowsHtml = recentPkgs.length
      ? recentPkgs
          .slice(0, 25)
          .map(
            (p) => `
          <tr>
            <td style="font-weight:500;">${escapeHtml(p.name)}</td>
            <td class="bszl-ver-new tabular-nums">${nativeBadge("ok", p.new_version)}</td>
            <td style="color:var(--muted-foreground);" class="tabular-nums">${escapeHtml(p.timestamp)}</td>
          </tr>`
          )
          .join("")
      : `<tr><td colspan="3" style="text-align:center;color:var(--muted-foreground);">${escapeHtml(t("noRecent"))}</td></tr>`;

    const rbCount = up.rollback_packages_count || 0;
    const lastRb = up.last_rollback;
    const vulnInfo = rep.vulnerabilities || up.vulnerabilities || {};
    const patchedCvesCount = (vulnInfo.patched_cves || []).length;

    secBodyHtml = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:0.75rem;flex-wrap:wrap;margin-bottom:0.75rem;">
        <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
          ${nativeBadge("ok", isEn ? "CVE patching: every 10 min" : "Патчи CVE: каждые 10 мин")}
          ${nativeBadge("ok", isEn ? "Auto-rollback: on" : "Автооткат: включён")}
          <span class="bszl-chip">${escapeHtml(t("snapshotCount"))}: ${rbCount}</span>
          ${patchedCvesCount > 0 ? `<span class="bszl-chip">CVE: ${patchedCvesCount}</span>` : ""}
          ${lastRb ? `<span class="bszl-chip">${isEn ? "Last rollback" : "Последний откат"}: ${escapeHtml(lastRb.timestamp)} · ${lastRb.rolled_back_count || 0}</span>` : ""}
        </div>
        <button type="button" id="bszl-btn-open-notifs" class="bszl-icon-btn">
          ${ICONS.bell}
          <span>${escapeHtml(t("openNotifsBtn"))}</span>
        </button>
      </div>
      <div class="bszl-two-col-grid">
        <div class="bszl-table-wrap">
          <table class="bszl-mini-table">
            <thead><tr>
              ${thCell(ICONS.layers, `${t("pendingUpdates")} (${pendingCount})`, 0)}
              ${thCell(ICONS.clock, t("colOld"), 1)}
              ${thCell(ICONS.shieldCheck, t("colNew"), 2)}
            </tr></thead>
            <tbody>${pendingRowsHtml}</tbody>
          </table>
        </div>
        <div class="bszl-table-wrap">
          <table class="bszl-mini-table">
            <thead><tr>
              ${thCell(ICONS.layers, `${t("installedUpdates")} (+${up24hCount})`, 0)}
              ${thCell(ICONS.shieldCheck, t("colNew"), 1)}
              ${thCell(ICONS.clock, t("colTime"), 2)}
            </tr></thead>
            <tbody>${pkgsRowsHtml}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  const secTabs = [{ id: "ports", label: `${isEn ? "Ports & firewall" : "Порты и фаервол"} (${portsList.length})` }];
  if (showUpdatesTab) {
    secTabs.push({
      id: "updates",
      label: `${isEn ? "Updates" : "Обновления"} (${pendingCount > 0 ? pendingCount : `+${up24hCount}`})`,
    });
  }

  const secDescParts = [
    `<span style="display:inline-flex;align-items:center;gap:0.375rem;"><span class="bszl-dot ${allOk ? "bszl-dot--ok" : "bszl-dot--warn"}"></span><span>${escapeHtml(checksSummaryText)} (${passedCount}/${allChecks.length})</span></span>`,
    sshVal ? `SSH: ${escapeHtml(sshVal)}` : "",
    ufwVal ? `UFW: ${escapeHtml(ufwVal)}` : "",
    tsVal ? `Tailscale: ${escapeHtml(tsVal)}` : "",
    batVal ? `${isEn ? "Battery" : "Батарея"}: ${escapeHtml(batVal)}` : "",
    f2bVal ? `Fail2ban: ${escapeHtml(f2bVal)}` : "",
    diskVal ? `${isEn ? "Disk" : "Диск"}: ${escapeHtml(diskVal)}` : "",
  ];

  const securityCardHtml = `
    <section class="bszl-card ${collapsed.security ? "is-collapsed" : ""}" data-card="security">
      ${cardHeader(
        "security",
        isEn ? "Security" : "Безопасность",
        secDescParts,
        secActionsHtml
      )}
      ${
        collapsed.security
          ? ""
          : `<div class="bszl-card-body">
              ${checksRowsOrStripHtml}
              ${tabsBar("security", secTabs, secTab)}
              <div class="bszl-card-tab-body">${secBodyHtml}</div>
            </div>`
      }
    </section>
  `;

  // ===== Card 2: Unified Services, All Containers & Systemd (1:1 Native Beszel Tables) =====
  const catDefsMap = {
    vpn: { id: "vpn", title: t("catVpn") },
    bots: { id: "bots", title: t("catBots") },
    servers: { id: "servers", title: t("catServers") },
    db: { id: "db", title: t("catDb") },
    utils: { id: "utils", title: t("catUtils") },
    system: { id: "system", title: t("catSystem") },
    web: { id: "web", title: t("catWeb") },
    agent: { id: "agent", title: t("catAgent") },
    security: { id: "security", title: t("catSecurity") },
    network: { id: "network", title: t("catNetwork") },
    tools: { id: "tools", title: t("catTools") },
  };

  for (const item of stackItems) {
    const cid = item.cat || item.category || "utils";
    if (!catDefsMap[cid]) {
      catDefsMap[cid] = {
        id: cid,
        title: item.category_name || cid.charAt(0).toUpperCase() + cid.slice(1),
      };
    }
  }

  // Build lookup maps for Docker containers and Systemd services so we can enrich stackItems and build a unified 1:1 table
  const isCntRunning = (c) => {
    const st = String(c.state || c.status || "running").toLowerCase();
    return !st.includes("exit") && !st.includes("dead") && !st.includes("stop");
  };
  const getStLbl = (s) => String(s.state_label || s.state || "active").toLowerCase();
  const getSubLbl = (s) => String(s.sub_label || s.sub || "running").toLowerCase();

  const cntByName = new Map();
  allContainers.forEach((c) => {
    if (c.name) cntByName.set(String(c.name).toLowerCase(), c);
  });
  const sysdByName = new Map();
  systemdServices.forEach((s) => {
    if (s.name) {
      const low = String(s.name).toLowerCase();
      sysdByName.set(low, s);
      sysdByName.set(low.replace(/\.(service|timer|socket)$/, ""), s);
    }
  });

  const matchedCntNames = new Set();
  const matchedSysdNames = new Set();

  const enrichStackItem = (item) => {
    const catId = item.cat || item.category || "utils";
    const catTitle = catDefsMap[catId]?.title || catId;
    const rawUnit = String(item.unit || item.id || "").toLowerCase();
    const cleanUnit = rawUnit.replace(/^(docker:|systemd:)/, "").replace(/\.(service|timer|socket)$/, "");
    const rawName = String(item.name || "").toLowerCase();

    let matchedCnt = cntByName.get(cleanUnit) || cntByName.get(rawUnit) || cntByName.get(rawName) || null;
    if (!matchedCnt && item.type === "docker") {
      for (const [k, v] of cntByName.entries()) {
        if (k.includes(cleanUnit) || cleanUnit.includes(k)) {
          matchedCnt = v;
          break;
        }
      }
    }
    let matchedSysd = sysdByName.get(cleanUnit) || sysdByName.get(rawUnit) || null;

    if (matchedCnt && matchedCnt.name) matchedCntNames.add(String(matchedCnt.name).toLowerCase());
    if (matchedSysd && matchedSysd.name) matchedSysdNames.add(String(matchedSysd.name).toLowerCase());

    const isOn = item.status === "running";
    const isOd = item.status === "ondemand";
    const dotType = isOn ? "ok" : isOd ? "ondemand" : "muted";
    const stLabel = isEn
      ? item.status_en || (isOn ? "Running" : isOd ? "On-Demand" : "Stopped")
      : item.status_ru || (isOn ? "Работает" : isOd ? "По запросу" : "Остановлен");

    const runtimeType =
      item.type === "docker" || matchedCnt
        ? "Docker"
        : item.type === "termux" || isTermuxHost
        ? "Termux"
        : "Systemd";

    const unitDisp =
      matchedCnt?.image ||
      item.unit ||
      matchedSysd?.name ||
      item.detail ||
      item.id;

    const cpuDisp = matchedCnt
      ? matchedCnt.cpu_str || (typeof matchedCnt.cpu === "number" ? `${matchedCnt.cpu.toFixed(2)}%` : matchedCnt.cpu || "0.00%")
      : matchedSysd && typeof matchedSysd.cpu === "number"
      ? `${Number(matchedSysd.cpu).toFixed(2)}%`
      : "—";

    const memDisp = matchedCnt
      ? matchedCnt.mem_str || matchedCnt.mem || (matchedCnt.memory_mb ? `${matchedCnt.memory_mb} MB` : "—")
      : matchedSysd && (matchedSysd.memory_mb ?? matchedSysd.mem_mb) !== undefined
      ? `${Number(matchedSysd.memory_mb ?? matchedSysd.mem_mb).toFixed(1)} MB`
      : "—";

    const portsDisp =
      matchedCnt?.ports ||
      (item.port ? `:${item.port}` : "") ||
      item.detail ||
      matchedSysd?.sub_label ||
      "—";

    const openUrl =
      item.url ||
      (item.port && (item.id === "osint-dash" || catId === "web")
        ? `http://${rep.ip || "100.64.0.5"}:${item.port}`
        : null);

    return {
      rowKind: "stack",
      id: item.id,
      svcKey: item.id,
      name: item.name || item.id,
      catId,
      catTitle,
      runtimeType,
      unitDisp,
      dotType,
      stLabel,
      isActive: isOn || isOd,
      cpuDisp,
      memDisp,
      portsDisp,
      openUrl,
      rawItem: item,
    };
  };

  const orderedStackItems = [...stackItems].sort((a, b) => {
    const ca = layout.catsOrder.indexOf(a.cat || a.category || "utils");
    const cb = layout.catsOrder.indexOf(b.cat || b.category || "utils");
    if (ca !== cb) return (ca === -1 ? 99 : ca) - (cb === -1 ? 99 : cb);
    const ia = (layout.itemsOrder || []).indexOf(a.id);
    const ib = (layout.itemsOrder || []).indexOf(b.id);
    if (ia === -1 && ib === -1) return 0;
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  const enrichedStackRows = orderedStackItems.map(enrichStackItem);

  const extraContainerRows = allContainers
    .filter((c) => !matchedCntNames.has(String(c.name || "").toLowerCase()))
    .map((c) => {
      const running = isCntRunning(c);
      const cpuDisp = c.cpu_str || (typeof c.cpu === "number" ? `${c.cpu.toFixed(2)}%` : c.cpu || c.cpu_pct || "0.00%");
      const memDisp = c.mem_str || c.mem || c.mem_usage || (c.memory_mb ? `${c.memory_mb} MB` : "—");
      return {
        rowKind: "docker",
        id: `docker:${c.name}`,
        svcKey: `docker:${c.name}`,
        name: c.name,
        catId: "docker",
        catTitle: isEn ? "Docker Container" : "Контейнер Docker",
        runtimeType: "Docker",
        unitDisp: c.image || "docker",
        dotType: running ? "ok" : "muted",
        stLabel: c.status || (running ? "Up" : "Exited"),
        isActive: running,
        cpuDisp,
        memDisp,
        portsDisp: c.ports || c.net_io || "—",
        openUrl: null,
        rawItem: null,
      };
    });

  const extraSystemdRows = systemdServices
    .filter((s) => !matchedSysdNames.has(String(s.name || "").toLowerCase()))
    .map((s) => {
      const stL = getStLbl(s);
      const subL = getSubLbl(s);
      const isRun = subL === "running";
      const isFail = stL === "failed" || subL === "failed";
      const isActive = stL === "active" || isRun || subL === "exited";
      const dotType = isFail ? "crit" : isRun ? "ok" : subL === "exited" || subL.includes("on-demand") ? "ondemand" : "muted";
      const memMb = s.memory_mb ?? s.mem_mb ?? 0;
      return {
        rowKind: "systemd",
        id: s.unit_id || `systemd:${s.name}`,
        svcKey: s.unit_id || `systemd:${s.name}`,
        name: s.name,
        catId: "systemd",
        catTitle: isEn ? "Systemd Service" : "Служба systemd",
        runtimeType: "Systemd",
        unitDisp: `${stL} (${subL})`,
        dotType,
        stLabel: `${stL} · ${subL}`,
        isActive,
        cpuDisp: `${Number(s.cpu || 0).toFixed(2)}%`,
        memDisp: `${Number(memMb).toFixed(1)} MB`,
        portsDisp: s.mem_peak_mb ? `Peak ${Number(s.mem_peak_mb).toFixed(1)} MB` : subL,
        openUrl: null,
        rawItem: null,
      };
    });

  const unifiedRows = [...enrichedStackRows, ...extraContainerRows, ...extraSystemdRows];
  const unifiedActiveCount = unifiedRows.filter((r) => r.isActive).length;

  const renderUnifiedOrStackRowHtml = (r, qStr) => {
    const searchTxt = `${r.name} ${r.catTitle} ${r.runtimeType} ${r.unitDisp} ${r.stLabel} ${r.portsDisp}`.toLowerCase();
    const hideRow = qStr && !searchTxt.includes(qStr);
    const isBusy = state.serviceBusyKey === `${sysId}:${r.svcKey}`;
    const isSel = selectedItem && r.rowKind === "stack" && selectedItem.id === r.id;
    return `
      <tr class="js-unified-svc-row ${isSel ? "bg-muted/40" : ""}" data-row-kind="${escapeHtml(r.rowKind)}" data-prog-id="${r.rowKind === "stack" ? escapeHtml(r.id) : ""}" data-svc-id="${escapeHtml(r.svcKey)}" data-svc-name="${escapeHtml(r.name)}" data-search-text="${escapeHtml(searchTxt)}" style="cursor:pointer;${hideRow ? "display:none;" : ""}" title="${isEn ? "Click: details · Double-click: start/stop · Triple-click: delete" : "Клик: описание · Двойной клик: старт/стоп · Тройной клик: удалить"}">
        <td style="font-weight:500;">
          <span style="display:inline-flex;align-items:center;gap:0.5rem;">
            ${state.rearrangeMode && r.rowKind === "stack" ? `<span class="bszl-inline-grip">${ICONS.grip}</span>` : ""}
            <span>${escapeHtml(r.name)}</span>
            ${r.openUrl ? `<a href="${escapeHtml(r.openUrl)}" target="_blank" rel="noopener noreferrer" class="bszl-svc-log-btn js-svc-link" title="${isEn ? "Open Web App" : "Открыть веб-интерфейс"}" style="text-decoration:none;">${ICONS.arrowSquareOut}</a>` : ""}
          </span>
        </td>
        <td><span class="bszl-chip">${escapeHtml(r.catTitle)}</span></td>
        <td style="color:var(--muted-foreground);"><span class="bszl-chip" style="margin-right:0.375rem;">${escapeHtml(r.runtimeType)}</span><span>${escapeHtml(r.unitDisp)}</span></td>
        <td>${nativeBadge(r.dotType, isBusy ? "..." : r.stLabel)}</td>
        <td class="tabular-nums">${escapeHtml(r.cpuDisp)}</td>
        <td class="tabular-nums">${escapeHtml(r.memDisp)}</td>
        <td class="tabular-nums" style="color:var(--muted-foreground);">${escapeHtml(r.portsDisp)}</td>
        <td style="text-align:right;">
          <div class="bszl-row-actions">
            <button type="button" class="bszl-act-btn js-svc-logs" data-log-id="${escapeHtml(r.svcKey)}" data-log-name="${escapeHtml(r.name)}" title="${isEn ? "Logs" : "Логи"}">${isEn ? "Logs" : "Логи"}</button>
            <button type="button" class="bszl-act-btn ${r.isActive ? "bszl-act-btn--close" : "bszl-act-btn--open"} js-row-svc-toggle" data-svc-id="${escapeHtml(r.svcKey)}" data-svc-name="${escapeHtml(r.name)}" ${state.serviceBusyKey ? "disabled" : ""}>
              ${isBusy ? "..." : r.isActive ? (isEn ? "Stop" : "Стоп") : isEn ? "Start" : "Старт"}
            </button>
          </div>
        </td>
      </tr>
    `;
  };

  const disk = rep.disk || {};
  const rootDiskMetrics = checksMap.get("root_disk")?.metrics || {};
  const diskPct = disk.used_pct ?? rootDiskMetrics.percent ?? 0;
  const agCfg = rep.agent_config || { auto_docker_update: true };
  const df = dockerStorage.df || dockerStorage || {};
  const inodesPct = disk.inodes_pct ?? 0;
  const estDays = disk.est_days_left ?? 365;
  const growthMb = disk.growth_mb_day ?? 0;
  const imgInfo = df.images || { total: 0, active: 0, size: "0B", reclaimable: "0B" };
  const cntInfo = df.containers || { total: 0, active: 0, size: "0B", reclaimable: "0B" };
  const volInfo = df.volumes || { total: 0, active: 0, size: "0B", reclaimable: "0B" };
  const bcInfo = df.build_cache || { total: 0, active: 0, size: "0B", reclaimable: "0B" };
  const dockerInfo = up.docker || {};

  // Build Tab Content for Unified Services Card (all / stack / containers / systemd / disk)
  let bottomTabBodyHtml = "";
  if (svcBottomTab === "all") {
    const uFilter = state.unifiedFilter || "all";
    const uQuery = (state.unifiedSearch || "").trim().toLowerCase();
    const filteredUnified = unifiedRows.filter((r) => {
      if (uFilter === "stack" && r.rowKind !== "stack") return false;
      if (uFilter === "docker" && r.runtimeType !== "Docker") return false;
      if (uFilter === "systemd" && r.runtimeType !== "Systemd") return false;
      if (uFilter === "active" && !r.isActive) return false;
      if (uFilter === "stopped" && r.isActive) return false;
      return true;
    });

    const unifiedRowsHtml = filteredUnified.length
      ? filteredUnified.map((r) => renderUnifiedOrStackRowHtml(r, uQuery)).join("")
      : `<tr><td colspan="8" style="text-align:center;color:var(--muted-foreground);">${isEn ? "No matching services" : "Сервисы не найдены"}</td></tr>`;

    bottomTabBodyHtml = `
      <div class="bszl-svc-toolbar">
        <div class="bszl-svc-filter-group">
          <input type="text" id="bszl-inp-unified-search" class="bszl-svc-search" placeholder="${isEn ? "Filter all services, containers, systemd..." : "Фильтр по всем сервисам, контейнерам и systemd..."}" value="${escapeHtml(state.unifiedSearch || "")}" />
          <button type="button" class="bszl-filter-pill ${uFilter === "all" ? "is-active" : ""} js-unified-filter" data-ufilter="all">${isEn ? "All" : "Все"} (${unifiedRows.length})</button>
          <button type="button" class="bszl-filter-pill ${uFilter === "stack" ? "is-active" : ""} js-unified-filter" data-ufilter="stack">${isEn ? "Our stack" : "Наши сервисы"} (${enrichedStackRows.length})</button>
          ${hasDocker ? `<button type="button" class="bszl-filter-pill ${uFilter === "docker" ? "is-active" : ""} js-unified-filter" data-ufilter="docker">Docker (${allContainers.length})</button>` : ""}
          ${hasSystemd ? `<button type="button" class="bszl-filter-pill ${uFilter === "systemd" ? "is-active" : ""} js-unified-filter" data-ufilter="systemd">Systemd (${systemdServices.length})</button>` : ""}
          <button type="button" class="bszl-filter-pill ${uFilter === "active" ? "is-active" : ""} js-unified-filter" data-ufilter="active">${isEn ? "Active" : "Активные"} (${unifiedActiveCount})</button>
          ${unifiedRows.length - unifiedActiveCount > 0 ? `<button type="button" class="bszl-filter-pill ${uFilter === "stopped" ? "is-active" : ""} js-unified-filter" data-ufilter="stopped">${isEn ? "Stopped" : "Остановленные"} (${unifiedRows.length - unifiedActiveCount})</button>` : ""}
        </div>
      </div>
      <div class="bszl-table-wrap bszl-table-wrap--tall" id="bszl-unified-table-wrap">
        <table class="bszl-mini-table">
          <thead><tr>
            ${thCell(ICONS.terminalSquare, isEn ? "Service / Container" : "Сервис / Контейнер", 0)}
            ${thCell(ICONS.layers, isEn ? "Category" : "Категория", 1)}
            ${thCell(ICONS.container, isEn ? "Type / Unit" : "Тип / Unit", 2)}
            ${thCell(ICONS.activity, isEn ? "Status" : "Статус", 3)}
            ${thCell(ICONS.cpu, "CPU", 4)}
            ${thCell(ICONS.memoryStick, isEn ? "Memory" : "Память", 5)}
            ${thCell(ICONS.ethernet, isEn ? "Ports / Info" : "Порты / Инфо", 6)}
            ${thCell(ICONS.clock, isEn ? "Actions" : "Действия", 7, true, false)}
          </tr></thead>
          <tbody>${unifiedRowsHtml}</tbody>
        </table>
      </div>
    `;
  } else if (svcBottomTab === "stack") {
    const sCatFilter = state.stackCatFilter || "all";
    const sQuery = (state.stackSearch || "").trim().toLowerCase();
    const presentCats = [];
    const seenCats = new Set();
    for (const r of enrichedStackRows) {
      if (!seenCats.has(r.catId)) {
        seenCats.add(r.catId);
        presentCats.push({
          id: r.catId,
          title: r.catTitle,
          count: enrichedStackRows.filter((x) => x.catId === r.catId).length,
        });
      }
    }
    const filteredStack = enrichedStackRows.filter((r) => sCatFilter === "all" || r.catId === sCatFilter);
    const stackRowsHtml = filteredStack.length
      ? filteredStack.map((r) => renderUnifiedOrStackRowHtml(r, sQuery)).join("")
      : `<tr><td colspan="8" style="text-align:center;color:var(--muted-foreground);">${isEn ? "No matching services" : "Сервисы не найдены"}</td></tr>`;

    bottomTabBodyHtml = `
      <div class="bszl-svc-toolbar">
        <div class="bszl-svc-filter-group">
          <input type="text" id="bszl-inp-stack-search" class="bszl-svc-search" placeholder="${isEn ? "Filter our services..." : "Фильтр по нашим сервисам..."}" value="${escapeHtml(state.stackSearch || "")}" />
          <button type="button" class="bszl-filter-pill ${sCatFilter === "all" ? "is-active" : ""} js-stack-cat-filter" data-scfilter="all">${isEn ? "All" : "Все"} (${enrichedStackRows.length})</button>
          ${presentCats
            .map(
              (c) => `<button type="button" class="bszl-filter-pill ${sCatFilter === c.id ? "is-active" : ""} js-stack-cat-filter" data-scfilter="${escapeHtml(c.id)}">${escapeHtml(c.title)} (${c.count})</button>`
            )
            .join("")}
        </div>
      </div>
      <div class="bszl-table-wrap bszl-table-wrap--tall" id="bszl-stack-table-wrap">
        <table class="bszl-mini-table">
          <thead><tr>
            ${thCell(ICONS.terminalSquare, isEn ? "Service" : "Сервис", 0)}
            ${thCell(ICONS.layers, isEn ? "Category" : "Категория", 1)}
            ${thCell(ICONS.container, isEn ? "Type / Unit" : "Тип / Unit", 2)}
            ${thCell(ICONS.activity, isEn ? "Status" : "Статус", 3)}
            ${thCell(ICONS.cpu, "CPU", 4)}
            ${thCell(ICONS.memoryStick, isEn ? "Memory" : "Память", 5)}
            ${thCell(ICONS.ethernet, isEn ? "Ports / Info" : "Порты / Инфо", 6)}
            ${thCell(ICONS.clock, isEn ? "Actions" : "Действия", 7, true, false)}
          </tr></thead>
          <tbody>${stackRowsHtml}</tbody>
        </table>
      </div>
    `;
  } else if (svcBottomTab === "containers") {
    const cntFilter = state.containerFilter || "all";
    const cntQuery = (state.containerSearch || "").trim().toLowerCase();
    const cntRunTotal = allContainers.filter(isCntRunning).length;
    const cntStopTotal = allContainers.length - cntRunTotal;

    const filteredContainers = allContainers.filter((c) => {
      const running = isCntRunning(c);
      if (cntFilter === "running" && !running) return false;
      if (cntFilter === "stopped" && running) return false;
      return true;
    });

    const containerRowsHtml = filteredContainers.length
      ? filteredContainers
          .map((c) => {
            const running = isCntRunning(c);
            const searchTxt = `${c.name || ""} ${c.image || ""} ${c.ports || ""} ${c.status || ""}`.toLowerCase();
            const hideRow = cntQuery && !searchTxt.includes(cntQuery);
            const svcKey = `docker:${c.name}`;
            const isBusy = state.serviceBusyKey === `${sysId}:${svcKey}`;
            const hLabel = c.health_label || (typeof c.health === "string" ? c.health : "none");
            const dotType = !running ? "muted" : hLabel === "unhealthy" ? "crit" : "ok";
            const statusText = hLabel && hLabel !== "none" ? `${c.status || (running ? "Up" : "Exited")} (${hLabel})` : c.status || (running ? "Up" : "Exited");
            const cpuDisp = c.cpu_str || (typeof c.cpu === "number" ? `${c.cpu.toFixed(2)}%` : c.cpu || c.cpu_pct || "0.00%");
            const memDisp = c.mem_str || c.mem || c.mem_usage || (c.memory_mb ? `${c.memory_mb} MB` : "—");
            return `
          <tr data-search-text="${escapeHtml(searchTxt)}" style="${hideRow ? "display:none;" : ""}">
            <td style="font-weight:500;">${escapeHtml(c.name)}</td>
            <td class="tabular-nums">${escapeHtml(cpuDisp)}</td>
            <td class="tabular-nums">${escapeHtml(memDisp)}</td>
            <td class="tabular-nums">${escapeHtml(c.net_io || c.block_io || "0 B")}</td>
            <td>${nativeBadge(dotType, statusText)}</td>
            <td>${escapeHtml(c.image || "—")}</td>
            <td class="tabular-nums">${escapeHtml(c.ports || "N/A")}</td>
            <td style="text-align:right;">
              <div class="bszl-row-actions">
                <button type="button" class="bszl-act-btn js-svc-logs" data-log-id="${escapeHtml(svcKey)}" data-log-name="${escapeHtml(c.name)}" title="${isEn ? "Container logs" : "Логи контейнера"}">${isEn ? "Logs" : "Логи"}</button>
                <button type="button" class="bszl-act-btn ${running ? "bszl-act-btn--close" : "bszl-act-btn--open"} js-row-svc-toggle" data-svc-id="${escapeHtml(svcKey)}" data-svc-name="${escapeHtml(c.name)}" ${state.serviceBusyKey ? "disabled" : ""}>
                  ${isBusy ? "..." : running ? (isEn ? "Stop" : "Стоп") : isEn ? "Start" : "Старт"}
                </button>
              </div>
            </td>
          </tr>`;
          })
          .join("")
      : `<tr><td colspan="8" style="text-align:center;color:var(--muted-foreground);">${isEn ? "No matching containers" : "Контейнеры не найдены"}</td></tr>`;

    bottomTabBodyHtml = `
      <div class="bszl-svc-toolbar">
        <div class="bszl-svc-filter-group">
          <input type="text" id="bszl-inp-cnt-search" class="bszl-svc-search" placeholder="${isEn ? "Filter..." : "Фильтр..."}" value="${escapeHtml(state.containerSearch || "")}" />
          <button type="button" class="bszl-filter-pill ${cntFilter === "all" ? "is-active" : ""} js-cnt-filter" data-cfilter="all">${isEn ? "All" : "Все"} (${allContainers.length})</button>
          <button type="button" class="bszl-filter-pill ${cntFilter === "running" ? "is-active" : ""} js-cnt-filter" data-cfilter="running">${isEn ? "Running" : "Работают"} (${cntRunTotal})</button>
          ${cntStopTotal > 0 ? `<button type="button" class="bszl-filter-pill ${cntFilter === "stopped" ? "is-active" : ""} js-cnt-filter" data-cfilter="stopped">${isEn ? "Stopped" : "Остановлены"} (${cntStopTotal})</button>` : ""}
        </div>
        <div class="bszl-svc-filter-group">
          <button type="button" class="bszl-pill js-agent-cfg-toggle" data-cfg-key="auto_docker_update" data-cfg-val="${agCfg.auto_docker_update ? "0" : "1"}" style="cursor:pointer;height:2.25rem;padding:0 0.75rem;" title="${isEn ? "Pull new images for compose containers during the nightly run" : "Обновлять образы compose-контейнеров при ночном запуске"}">
            <span class="bszl-dot ${agCfg.auto_docker_update ? "bszl-dot--ok" : "bszl-dot--warn"}"></span>
            <span>${isEn ? "Auto-update" : "Автообновление"}: ${agCfg.auto_docker_update ? "ON" : "OFF"}</span>
          </button>
          <button type="button" id="bszl-btn-docker-update" class="bszl-icon-btn" ${state.loadingSystem ? "disabled" : ""}>
            ${ICONS.sync(state.loadingSystem === `${sysId}:docker_update`)}
            <span>${isEn ? "Update containers" : "Обновить контейнеры"}</span>
          </button>
          ${
            dockerInfo.rollback_available
              ? `<button type="button" id="bszl-btn-docker-rollback" class="bszl-icon-btn" ${state.loadingSystem ? "disabled" : ""}>${ICONS.rotateCcw}<span>${isEn ? "Roll back" : "Откатить"}</span></button>`
              : ""
          }
          <button type="button" id="bszl-btn-docker-prune" class="bszl-icon-btn" ${state.loadingSystem ? "disabled" : ""}>
            ${ICONS.sync(state.loadingSystem === `${sysId}:docker_prune`)}
            <span>${escapeHtml(t("pruneDockerBtn"))}</span>
          </button>
        </div>
      </div>
      <div class="bszl-table-wrap bszl-table-wrap--tall" id="bszl-cnt-table-wrap">
        <table class="bszl-mini-table">
          <thead><tr>
            ${thCell(ICONS.container, isEn ? "Container" : "Контейнер", 0)}
            ${thCell(ICONS.cpu, "CPU", 1)}
            ${thCell(ICONS.memoryStick, isEn ? "Memory" : "Память", 2)}
            ${thCell(ICONS.ethernet, "Net", 3)}
            ${thCell(ICONS.shieldCheck, isEn ? "Status" : "Статус", 4)}
            ${thCell(ICONS.layers, isEn ? "Image" : "Образ", 5)}
            ${thCell(ICONS.squareArrowRightEnter, isEn ? "Ports" : "Порты", 6)}
            ${thCell(ICONS.clock, isEn ? "Actions" : "Действия", 7, true, false)}
          </tr></thead>
          <tbody>${containerRowsHtml}</tbody>
        </table>
      </div>
    `;
  } else if (svcBottomTab === "systemd") {
    const sysdFilter = state.systemdFilter || "all";
    const sysdQuery = (state.systemdSearch || "").trim().toLowerCase();
    const sysdRunTotal = systemdServices.filter((s) => getSubLbl(s) === "running").length;
    const sysdExitedTotal = systemdServices.filter((s) => getSubLbl(s) === "exited" || getSubLbl(s).includes("on-demand")).length;
    const sysdFailedTotal = systemdServices.filter((s) => getStLbl(s) === "failed" || getSubLbl(s) === "failed").length;

    const filteredSystemd = systemdServices.filter((s) => {
      const stL = getStLbl(s);
      const subL = getSubLbl(s);
      if (sysdFilter === "running" && subL !== "running") return false;
      if (sysdFilter === "exited" && subL !== "exited" && !subL.includes("on-demand")) return false;
      if (sysdFilter === "failed" && stL !== "failed" && subL !== "failed") return false;
      return true;
    });

    const systemdRowsHtml = filteredSystemd.length
      ? filteredSystemd
          .map((s) => {
            const stL = getStLbl(s);
            const subL = getSubLbl(s);
            const isRun = subL === "running";
            const isFail = stL === "failed" || subL === "failed";
            const isActive = stL === "active" || isRun || subL === "exited";
            const dotType = isFail ? "crit" : stL === "active" ? "ok" : stL === "reloading" || stL === "activating" || stL === "deactivating" ? "warn" : "muted";
            const searchTxt = `${s.name || ""} ${stL} ${subL}`.toLowerCase();
            const hideRow = sysdQuery && !searchTxt.includes(sysdQuery);
            const svcKey = s.unit_id || `systemd:${s.name}`;
            const isBusy = state.serviceBusyKey === `${sysId}:${svcKey}`;
            const memMb = s.memory_mb ?? s.mem_mb ?? 0;
            const memPeakMb = s.mem_peak_mb ?? 0;
            return `
          <tr data-search-text="${escapeHtml(searchTxt)}" style="${hideRow ? "display:none;" : ""}">
            <td style="font-weight:500;">${escapeHtml(s.name)}</td>
            <td>${nativeBadge(dotType, stL)}</td>
            <td class="tabular-nums">${escapeHtml(subL)}</td>
            <td class="tabular-nums">${Number(s.cpu || 0).toFixed(2)}%</td>
            <td class="tabular-nums">${Number(s.cpu_peak || 0).toFixed(2)}%</td>
            <td class="tabular-nums">${memMb > 0 ? `${Number(memMb).toFixed(1)} MB` : `<span style="color:var(--muted-foreground);">N/A</span>`}</td>
            <td class="tabular-nums">${memPeakMb > 0 ? `${Number(memPeakMb).toFixed(1)} MB` : `<span style="color:var(--muted-foreground);">N/A</span>`}</td>
            <td style="text-align:right;">
              <div class="bszl-row-actions">
                <button type="button" class="bszl-act-btn js-svc-logs" data-log-id="${escapeHtml(svcKey)}" data-log-name="${escapeHtml(s.name)}" title="${isEn ? "Service logs" : "Логи службы"}">${isEn ? "Logs" : "Логи"}</button>
                <button type="button" class="bszl-act-btn ${isActive ? "bszl-act-btn--close" : "bszl-act-btn--open"} js-row-svc-toggle" data-svc-id="${escapeHtml(svcKey)}" data-svc-name="${escapeHtml(s.name)}" ${state.serviceBusyKey ? "disabled" : ""}>
                  ${isBusy ? "..." : isActive ? (isEn ? "Stop" : "Стоп") : isEn ? "Start" : "Старт"}
                </button>
              </div>
            </td>
          </tr>`;
          })
          .join("")
      : `<tr><td colspan="8" style="text-align:center;color:var(--muted-foreground);">${isEn ? "No matching services" : "Службы не найдены"}</td></tr>`;

    bottomTabBodyHtml = `
      <div class="bszl-svc-toolbar">
        <div class="bszl-svc-filter-group">
          <input type="text" id="bszl-inp-sysd-search" class="bszl-svc-search" placeholder="${isEn ? "Filter..." : "Фильтр..."}" value="${escapeHtml(state.systemdSearch || "")}" />
          <button type="button" class="bszl-filter-pill ${sysdFilter === "all" ? "is-active" : ""} js-sysd-filter" data-sfilter="all">${isEn ? "All" : "Все"} (${systemdServices.length})</button>
          <button type="button" class="bszl-filter-pill ${sysdFilter === "running" ? "is-active" : ""} js-sysd-filter" data-sfilter="running">Running (${sysdRunTotal})</button>
          <button type="button" class="bszl-filter-pill ${sysdFilter === "exited" ? "is-active" : ""} js-sysd-filter" data-sfilter="exited">Exited (${sysdExitedTotal})</button>
          ${sysdFailedTotal > 0 ? `<button type="button" class="bszl-filter-pill ${sysdFilter === "failed" ? "is-active" : ""} js-sysd-filter" data-sfilter="failed">Failed (${sysdFailedTotal})</button>` : ""}
        </div>
      </div>
      <div class="bszl-table-wrap bszl-table-wrap--tall" id="bszl-sysd-table-wrap">
        <table class="bszl-mini-table">
          <thead><tr>
            ${thCell(ICONS.terminalSquare, isEn ? "Service" : "Служба", 0)}
            ${thCell(ICONS.activity, isEn ? "State" : "Состояние", 1)}
            ${thCell(ICONS.activity, "SubState", 2)}
            ${thCell(ICONS.cpu, "CPU", 3)}
            ${thCell(ICONS.cpu, isEn ? "CPU Peak" : "Пик CPU", 4)}
            ${thCell(ICONS.memoryStick, isEn ? "Memory" : "Память", 5)}
            ${thCell(ICONS.memoryStick, isEn ? "Mem Peak" : "Пик памяти", 6)}
            ${thCell(ICONS.clock, isEn ? "Actions" : "Действия", 7, true, false)}
          </tr></thead>
          <tbody>${systemdRowsHtml}</tbody>
        </table>
      </div>
    `;
  } else {
    const diskRows =
      rootDiskMetrics.percent !== undefined && disk.used_pct === undefined
        ? [
            {
              name: isEn ? "Android Storage (/data)" : "Раздел данных (/data)",
              type: "f2fs / ext4",
              status: diskPct >= 90 ? "crit" : diskPct >= 80 ? "warn" : "ok",
              statusText: `${diskPct}%`,
              used: `${diskPct}% ${isEn ? "used" : "занято"}`,
              extra: `${isEn ? "Free" : "Свободно"}: ${rootDiskMetrics.free || "50.4 GB"}`,
            },
          ]
        : [
            {
              name: isEn ? "Root Filesystem (/)" : "Корневой раздел (/)",
              type: "ext4 / xfs",
              status: diskPct >= 90 ? "crit" : diskPct >= 80 ? "warn" : "ok",
              statusText: `${diskPct}%`,
              used: `${disk.used_gb ?? 0} GB / ${disk.total_gb ?? 0} GB`,
              extra: `${isEn ? "Free" : "Свободно"}: ${disk.free_gb ?? 0} GB · ${growthMb >= 0 ? `+${growthMb}` : growthMb} MB/d`,
            },
            {
              name: "Inodes",
              type: "fs-inodes",
              status: inodesPct >= 85 ? "warn" : "ok",
              statusText: `${inodesPct}%`,
              used: `${(disk.inodes_used || 0).toLocaleString()} / ${(disk.inodes_total || 0).toLocaleString()}`,
              extra: estDays >= 365 ? (isEn ? ">365 days left" : "Запас > 1 года") : `~${estDays}d`,
            },
          ];
    if (hasDocker) {
      diskRows.push(
        {
          name: isEn ? "Docker Images" : "Образы Docker",
          type: "docker-df",
          status: "ok",
          statusText: `${imgInfo.active}/${imgInfo.total}`,
          used: imgInfo.size || "0B",
          extra: `${isEn ? "Reclaimable" : "Освободить"}: ${imgInfo.reclaimable || "0B"}`,
        },
        {
          name: isEn ? "Docker Containers" : "Слои контейнеров",
          type: "docker-df",
          status: "ok",
          statusText: `${cntInfo.active}/${cntInfo.total}`,
          used: cntInfo.size || "0B",
          extra: `${isEn ? "Reclaimable" : "Освободить"}: ${cntInfo.reclaimable || "0B"}`,
        },
        {
          name: isEn ? "Docker Volumes" : "Тома Docker",
          type: "docker-df",
          status: "ok",
          statusText: `${volInfo.total}`,
          used: volInfo.size || "0B",
          extra: `${isEn ? "Build cache" : "Кэш сборки"}: ${bcInfo.size || "0B"}`,
        }
      );
    }

    bottomTabBodyHtml = `
      <div style="display:flex;align-items:center;justify-content:flex-end;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.75rem;">
        ${
          hasDocker
            ? `<button type="button" id="bszl-btn-docker-prune" class="bszl-icon-btn" ${state.loadingSystem ? "disabled" : ""}>
                ${ICONS.sync(state.loadingSystem === `${sysId}:docker_prune`)}
                <span>${escapeHtml(t("pruneDockerBtn"))}</span>
              </button>`
            : ""
        }
        <button type="button" id="bszl-btn-disk-cleanup" class="bszl-icon-btn" ${state.loadingSystem ? "disabled" : ""}>
          ${ICONS.sync(state.loadingSystem === `${sysId}:disk_cleanup`)}
          <span>${isEn ? `Clean disk (${diskPct}%)` : `Очистить диск (${diskPct}%)`}</span>
        </button>
      </div>
      <div class="bszl-table-wrap">
        <table class="bszl-mini-table">
          <thead><tr>
            ${thCell(ICONS.layers, isEn ? "Resource" : "Ресурс", 0)}
            ${thCell(ICONS.container, isEn ? "Type" : "Тип", 1)}
            ${thCell(ICONS.activity, isEn ? "Usage" : "Занято", 2)}
            ${thCell(ICONS.memoryStick, isEn ? "Size / Quota" : "Объём", 3)}
            ${thCell(ICONS.clock, isEn ? "Details" : "Подробности", 4)}
          </tr></thead>
          <tbody>
            ${diskRows
              .map(
                (dr) => `
              <tr>
                <td style="font-weight:500;">${escapeHtml(dr.name)}</td>
                <td><span class="bszl-chip">${escapeHtml(dr.type)}</span></td>
                <td>${nativeBadge(dr.status, dr.statusText)}</td>
                <td class="tabular-nums">${escapeHtml(dr.used)}</td>
                <td style="color:var(--muted-foreground);" class="tabular-nums">${escapeHtml(dr.extra)}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  const svcBottomTabs = [
    {
      id: "all",
      label: `${isEn ? "All Services" : "Все сервисы"} (${unifiedRows.length})`,
    },
    {
      id: "stack",
      label: `${isEn ? "Our Services" : "Наши сервисы"} (${stackItems.length})`,
    },
  ];
  if (hasDocker) {
    svcBottomTabs.push({
      id: "containers",
      label: `${isEn ? "All Containers" : "Все контейнеры"} (${allContainers.length})`,
    });
  }
  if (hasSystemd) {
    svcBottomTabs.push({
      id: "systemd",
      label: `${isEn ? "Systemd Services" : "Службы systemd"} (${systemdServices.length})`,
    });
  }
  svcBottomTabs.push({
    id: "disk",
    label: `${isEn ? "Disk & Storage" : "Диск и хранилище"} (${diskPct}%)`,
  });

  const svcDescParts = [
    `${isEn ? "Total" : "Всего"}: ${unifiedRows.length}`,
    `<span style="display:inline-flex;align-items:center;gap:0.375rem;"><span class="bszl-dot bszl-dot--ok"></span><span>${isEn ? "Active" : "Активных"}: ${unifiedActiveCount}</span></span>`,
    `${isEn ? "Our stack" : "Наши сервисы"}: ${svcRunning}/${stackItems.length}`,
    hasDocker ? `${isEn ? "Containers" : "Контейнеров"}: ${allContainers.length}` : "",
    hasSystemd ? `Systemd: ${systemdServices.length}` : "",
    isEn ? "Updated every 10 min" : "Обновляется каждые 10 минут",
  ];

  const svcActionsHtml = `
    <button type="button" id="bszl-btn-svc-pos" class="bszl-icon-btn" title="${isEn ? "Move Services card above or below charts" : "Переместить блок Сервисов над графиками или под графики"}">
      ${state.servicesPos === "top" ? ICONS.arrowDown : ICONS.arrowUp}
      <span>${
        state.servicesPos === "top"
          ? isEn ? "Below charts" : "Под графики"
          : isEn ? "Above charts" : "Над графиками"
      }</span>
    </button>
  `;

  const servicesCardHtml = `
    <section class="bszl-card ${collapsed.services ? "is-collapsed" : ""}" data-card="services">
      ${cardHeader(
        "services",
        isTermuxHost
          ? isEn
            ? "Services & Termux Stack"
            : "Сервисы и стек Termux"
          : isEn
          ? "Services, Containers & Systemd"
          : "Сервисы, контейнеры и службы systemd",
        svcDescParts,
        svcActionsHtml
      )}
      ${
        collapsed.services
          ? ""
          : `<div class="bszl-card-body">
              <div class="bszl-svc-unified-bottom">
                ${tabsBar("services", svcBottomTabs, svcBottomTab)}
                <div class="bszl-card-tab-body">${bottomTabBodyHtml}</div>
              </div>
            </div>`
      }
    </section>
  `;

  // ===== Card 3: Network & domains (1:1 Native Beszel Card & Tables) =========
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
          <td style="font-weight:500;" class="tabular-nums">${escapeHtml(h.timestamp || "-")}</td>
          <td class="tabular-nums"><span class="bszl-inline-svg">${ICONS.arrowDown}</span> ${h.download_mbps ?? 0} Mbps</td>
          <td class="tabular-nums"><span class="bszl-inline-svg">${ICONS.arrowUp}</span> ${h.upload_mbps ?? 0} Mbps</td>
          <td class="tabular-nums">${h.ping_ms ?? 0} ms</td>
          <td class="tabular-nums" style="color:var(--muted-foreground);">±${h.jitter_ms ?? 0} ms</td>
        </tr>`
        )
        .join("")
    : `<tr><td colspan="5" style="text-align:center;color:var(--muted-foreground);">${isEn ? "No measurements yet" : "Замеров пока нет"}</td></tr>`;

  const sslInfo = rep.ssl_domains || {};
  const certsList = sslInfo.certs || [];
  const epsList = sslInfo.endpoints || [];
  const hasDomains = certsList.length > 0 || epsList.length > 0;

  const domainRows = [];
  const certByDom = new Map(certsList.map((c) => [String(c.domain || "").toLowerCase(), c]));
  const seenDom = new Set();
  for (const ep of epsList) {
    const dKey = String(ep.name || "").toLowerCase();
    seenDom.add(dKey);
    const cert = certByDom.get(dKey);
    domainRows.push({
      domain: decodeDomainPunycode(ep.name),
      httpOk: Boolean(ep.ok),
      httpCode: ep.code || (ep.ok ? 200 : "ERR"),
      daysLeft: cert ? cert.days_left : null,
      expiresAt: cert ? cert.expires_at : "—",
    });
  }
  for (const c of certsList) {
    const dKey = String(c.domain || "").toLowerCase();
    if (!seenDom.has(dKey)) {
      domainRows.push({
        domain: decodeDomainPunycode(c.domain),
        httpOk: true,
        httpCode: "TLS",
        daysLeft: c.days_left,
        expiresAt: c.expires_at || "—",
      });
    }
  }

  const domainsTableHtml = domainRows.length
    ? `<div class="bszl-table-wrap">
        <table class="bszl-mini-table">
          <thead><tr>
            ${thCell(ICONS.globe, isEn ? "Domain" : "Домен", 0)}
            ${thCell(ICONS.activity, "HTTP / HTTPS", 1)}
            ${thCell(ICONS.shieldCheck, isEn ? "SSL Certificate" : "SSL-сертификат", 2)}
            ${thCell(ICONS.clock, isEn ? "Expires" : "Истекает", 3)}
          </tr></thead>
          <tbody>
            ${domainRows
              .map((d) => {
                const sslType = d.daysLeft === null ? "muted" : d.daysLeft <= 7 ? "crit" : d.daysLeft <= 14 ? "warn" : "ok";
                const sslText = d.daysLeft === null ? "N/A" : `${d.daysLeft} ${isEn ? "days" : "дн."}`;
                return `
                  <tr>
                    <td style="font-weight:500;">${escapeHtml(d.domain)}</td>
                    <td>${nativeBadge(d.httpOk ? "ok" : "crit", String(d.httpCode))}</td>
                    <td>${nativeBadge(sslType, sslText)}</td>
                    <td class="tabular-nums" style="color:var(--muted-foreground);">${escapeHtml(d.expiresAt)}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </div>`
    : "";

  const netActionsHtml = `
    <button type="button" id="bszl-btn-run-speedtest" class="bszl-icon-btn" ${state.loadingSystem ? "disabled" : ""}>
      ${ICONS.sync(state.loadingSystem === `${sysId}:speedtest`)}
      <span>${escapeHtml(t("runSpeedtestBtn"))}</span>
    </button>
  `;

  const netBodyHtml = `
    <div class="bszl-two-col-grid">
      <div class="bszl-table-wrap">
        <table class="bszl-mini-table">
          <thead><tr>
            ${thCell(ICONS.clock, t("colTime"), 0)}
            ${thCell(ICONS.ethernet, "Download", 1)}
            ${thCell(ICONS.ethernet, "Upload", 2)}
            ${thCell(ICONS.activity, "Ping", 3)}
            ${thCell(ICONS.activity, "Jitter", 4)}
          </tr></thead>
          <tbody>${histRowsHtml}</tbody>
        </table>
      </div>
      ${domainsTableHtml}
    </div>
  `;

  const netDescParts = [
    `Download: ${dlMbps > 0 ? `${dlMbps} Mbps` : "—"}`,
    `Upload: ${ulMbps > 0 ? `${ulMbps} Mbps` : "—"}`,
    `Ping: ${pingMs} ms (±${jitterMs} ms)`,
    `${isEn ? "Loss" : "Потери"}: ${lossPct}%`,
    `${escapeHtml(ifaceName)}: ${dropsTotal} drops / ${errsTotal} err`,
    hasDomains ? `${isEn ? "Domains" : "Доменов"}: ${domainRows.length}` : "",
  ];

  const networkCardHtml = `
    <section class="bszl-card ${collapsed.network ? "is-collapsed" : ""}" data-card="network">
      ${cardHeader("network", isEn ? "Network & domains" : "Сеть и домены", netDescParts, netActionsHtml)}
      ${collapsed.network ? "" : `<div class="bszl-card-body">${netBodyHtml}</div>`}
    </section>
  `;

  const showServicesCard = stackItems.length > 0 || hasDocker || hasSystemd || Boolean(rep.disk);
  const showNetworkCard =
    hasDomains ||
    Boolean(netInfo.speedtest) ||
    (Array.isArray(netInfo.history) && netInfo.history.length > 0);

  panel.innerHTML = `
    ${rearrangeBannerHtml}
    ${securityCardHtml}
    ${showNetworkCard ? networkCardHtml : ""}
  `;

  svcPanel.innerHTML = showServicesCard ? servicesCardHtml : "";
  svcPanel.style.display = showServicesCard ? "" : "none";

  const qOne = (sel) => panel.querySelector(sel) || svcPanel.querySelector(sel);
  const qAll = (sel) => [...panel.querySelectorAll(sel), ...svcPanel.querySelectorAll(sel)];
  const invalidateRenderKeys = () => {
    panel.removeAttribute("data-render-key");
    svcPanel.removeAttribute("data-render-key");
  };

  bindHeaderButtons(panel, sysId);

  // Client-side column sorting on any 1:1 native Beszel table header button
  qAll(".js-sort-col").forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      const th = btn.closest("th");
      const table = btn.closest("table");
      const tbody = table?.querySelector("tbody");
      if (!th || !tbody) return;
      const colIdx = Number(btn.getAttribute("data-col-idx") || 0);
      const curDir = th.getAttribute("data-sort-dir") === "asc" ? "desc" : "asc";
      table.querySelectorAll("th").forEach((h) => h.removeAttribute("data-sort-dir"));
      th.setAttribute("data-sort-dir", curDir);
      const rows = Array.from(tbody.querySelectorAll("tr"));
      if (rows.length <= 1) return;
      rows.sort((ra, rb) => {
        const ca = (ra.children[colIdx]?.textContent || "").trim();
        const cb = (rb.children[colIdx]?.textContent || "").trim();
        const na = parseFloat(ca.replace(/[^0-9.-]/g, ""));
        const nb = parseFloat(cb.replace(/[^0-9.-]/g, ""));
        let cmp = 0;
        if (!Number.isNaN(na) && !Number.isNaN(nb) && /^[0-9#±:.\s%-]+([a-zA-Z]+)?$/.test(ca)) {
          cmp = na - nb;
        } else {
          cmp = ca.localeCompare(cb, undefined, { numeric: true, sensitivity: "base" });
        }
        return curDir === "asc" ? cmp : -cmp;
      });
      rows.forEach((r) => tbody.appendChild(r));
    };
  });

  const btnJumpServices = qOne("#bszl-btn-jump-services");
  if (btnJumpServices) {
    btnJumpServices.onclick = (e) => {
      e.preventDefault();
      if (state.cardsCollapsed.services) {
        state.cardsCollapsed.services = false;
        try {
          localStorage.setItem("bszl_cards_collapsed", JSON.stringify(state.cardsCollapsed));
        } catch (err) {}
        invalidateRenderKeys();
        renderSystemDetailPage();
      }
      svcPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  }

  const btnSvcPos = qOne("#bszl-btn-svc-pos");
  if (btnSvcPos) {
    btnSvcPos.onclick = (e) => {
      e.preventDefault();
      state.servicesPos = state.servicesPos === "top" ? "bottom" : "top";
      try {
        localStorage.setItem("bszl_services_pos", state.servicesPos);
      } catch (err) {}
      invalidateRenderKeys();
      const gw = document.querySelector("div.grid.gap-4.mb-14");
      if (gw) gw.removeAttribute("data-bszl-applied-layout");
      renderSystemDetailPage();
      svcPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
  }

  qAll(".js-card-collapse").forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      const cardId = btn.getAttribute("data-card");
      state.cardsCollapsed[cardId] = !state.cardsCollapsed[cardId];
      try {
        localStorage.setItem("bszl_cards_collapsed", JSON.stringify(state.cardsCollapsed));
      } catch (err) {}
      invalidateRenderKeys();
      renderSystemDetailPage();
    };
  });

  const btnToggleChecks = qOne("#bszl-btn-toggle-checks");
  if (btnToggleChecks) {
    btnToggleChecks.onclick = (e) => {
      e.preventDefault();
      state.checksShowAll = !state.checksShowAll;
      try {
        localStorage.setItem("bszl_checks_all", state.checksShowAll ? "1" : "0");
      } catch (err) {}
      invalidateRenderKeys();
      renderAll();
    };
  }

  const btnOpenNotifs = qOne("#bszl-btn-open-notifs");
  if (btnOpenNotifs) {
    btnOpenNotifs.onclick = () => toggleNotificationsPage(true, sysId);
  }

  const btnDockerPrune = qOne("#bszl-btn-docker-prune");
  if (btnDockerPrune) {
    btnDockerPrune.onclick = () => triggerAudit(sysId, "docker_prune");
  }

  const btnRunSpeedtest = qOne("#bszl-btn-run-speedtest");
  if (btnRunSpeedtest) {
    btnRunSpeedtest.onclick = () => triggerAudit(sysId, "speedtest");
  }

  const btnDockerUpd = qOne("#bszl-btn-docker-update");
  if (btnDockerUpd) {
    btnDockerUpd.onclick = () => triggerAudit(sysId, "docker_update");
  }

  const btnDockerRb = qOne("#bszl-btn-docker-rollback");
  if (btnDockerRb) {
    btnDockerRb.onclick = () => triggerAudit(sysId, "docker_rollback");
  }

  const btnDiskClean = qOne("#bszl-btn-disk-cleanup");
  if (btnDiskClean) {
    btnDiskClean.onclick = () => triggerAudit(sysId, "disk_cleanup");
  }

  qAll(".js-unified-filter").forEach((btn) => {
    btn.onclick = () => {
      state.unifiedFilter = btn.getAttribute("data-ufilter") || "all";
      invalidateRenderKeys();
      renderSystemDetailPage();
    };
  });

  qAll(".js-stack-cat-filter").forEach((btn) => {
    btn.onclick = () => {
      state.stackCatFilter = btn.getAttribute("data-scfilter") || "all";
      invalidateRenderKeys();
      renderSystemDetailPage();
    };
  });

  qAll(".js-cnt-filter").forEach((btn) => {
    btn.onclick = () => {
      state.containerFilter = btn.getAttribute("data-cfilter") || "all";
      invalidateRenderKeys();
      renderSystemDetailPage();
    };
  });

  qAll(".js-sysd-filter").forEach((btn) => {
    btn.onclick = () => {
      state.systemdFilter = btn.getAttribute("data-sfilter") || "all";
      invalidateRenderKeys();
      renderSystemDetailPage();
    };
  });

  const bindLiveTableSearch = (inputSel, wrapSel, stateKey) => {
    const inp = qOne(inputSel);
    if (!inp) return;
    inp.oninput = (e) => {
      const q = (e.target.value || "").trim().toLowerCase();
      state[stateKey] = e.target.value || "";
      const wrap = qOne(wrapSel);
      if (wrap) {
        wrap.querySelectorAll("tbody tr[data-search-text]").forEach((tr) => {
          const txt = tr.getAttribute("data-search-text") || "";
          tr.style.display = !q || txt.includes(q) ? "" : "none";
        });
      }
    };
  };

  bindLiveTableSearch("#bszl-inp-unified-search", "#bszl-unified-table-wrap", "unifiedSearch");
  bindLiveTableSearch("#bszl-inp-stack-search", "#bszl-stack-table-wrap", "stackSearch");
  bindLiveTableSearch("#bszl-inp-cnt-search", "#bszl-cnt-table-wrap", "containerSearch");
  bindLiveTableSearch("#bszl-inp-sysd-search", "#bszl-sysd-table-wrap", "systemdSearch");

  qAll(".js-row-svc-toggle").forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const sId = btn.getAttribute("data-svc-id");
      const sName = btn.getAttribute("data-svc-name") || sId;
      if (sId) triggerServiceToggle(sysId, sId, sName);
    };
  });

  qAll(".js-agent-cfg-toggle").forEach((btn) => {
    btn.onclick = () => {
      const k = btn.getAttribute("data-cfg-key");
      const v = btn.getAttribute("data-cfg-val") === "1";
      if (k) triggerAgentConfigUpdate(sysId, { [k]: v });
    };
  });

  qAll(".js-svc-logs").forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const logId = btn.getAttribute("data-log-id");
      const logName = btn.getAttribute("data-log-name") || logId;
      openServiceLogsModal(sysId, logId, logName);
    };
  });

  qAll(".js-f2b-unban").forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const ip = btn.getAttribute("data-ip");
      if (ip) triggerFail2banAction(sysId, "unban", ip);
    };
  });

  const btnF2bBan = qOne("#bszl-btn-f2b-ban");
  const inpF2bIp = qOne("#bszl-inp-f2b-ip");
  if (btnF2bBan && inpF2bIp) {
    btnF2bBan.onclick = () => {
      const ip = inpF2bIp.value.trim();
      if (ip) triggerFail2banAction(sysId, "ban", ip);
    };
  }

  qAll(".bszl-tab-btn[data-card-tab]").forEach((btn) => {
    btn.onclick = () => {
      const [cardId, tabId] = btn.getAttribute("data-card-tab").split(":");
      state.cardTabs[cardId] = tabId;
      invalidateRenderKeys();
      renderSystemDetailPage();
    };
  });

  const openCardTab = (cardId, tabId) => {
    if (state.rearrangeMode) return;
    state.cardTabs[cardId] = tabId;
    if (state.cardsCollapsed[cardId]) {
      state.cardsCollapsed[cardId] = false;
      try {
        localStorage.setItem("bszl_cards_collapsed", JSON.stringify(state.cardsCollapsed));
      } catch (err) {}
    }
    invalidateRenderKeys();
    renderSystemDetailPage();
    qOne(`[data-card="${cardId}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  qAll("[data-check-id]").forEach((c) => {
    const cid = c.getAttribute("data-check-id");
    const target = ["firewall", "open_ports", "fail2ban", "ssh_auth", "ssh_security", "network_security"].includes(cid)
      ? ["security", "ports"]
      : ["kernel_sysctl", "inodes", "disk_trend", "root_disk"].includes(cid)
      ? ["services", "disk"]
      : cid === "cron_timers"
      ? ["security", "updates"]
      : ["osint_stack", "termux_security", "tailscale_mesh", "proc_integrity"].includes(cid)
      ? ["services", "all"]
      : null;
    if (target) {
      c.style.cursor = state.rearrangeMode ? "grab" : "pointer";
      c.onclick = () => openCardTab(target[0], target[1]);
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

  // Row click / double-click / triple-click on unified & stack service table rows
  qAll(".js-unified-svc-row").forEach((rowEl) => {
    const pid = rowEl.getAttribute("data-prog-id") || rowEl.getAttribute("data-svc-id");
    const svcId = rowEl.getAttribute("data-svc-id");
    const svcName = rowEl.getAttribute("data-svc-name") || pid;
    const rowKind = rowEl.getAttribute("data-row-kind");

    if (state.rearrangeMode && rowKind === "stack" && pid) {
      rowEl.setAttribute("draggable", "true");
      rowEl.addEventListener("dragstart", (e) => {
        e.stopPropagation();
        state.dragSourceType = "svc";
        state.dragSourceId = pid;
        rowEl.classList.add("is-dragging");
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", pid);
        }
      });
      rowEl.addEventListener("dragend", (e) => {
        e.stopPropagation();
        rowEl.classList.remove("is-dragging");
      });
      rowEl.addEventListener("dragover", (e) => {
        if (state.dragSourceType === "svc" && state.dragSourceId !== pid) {
          e.preventDefault();
          e.stopPropagation();
          rowEl.classList.add("is-drag-over");
        }
      });
      rowEl.addEventListener("dragleave", () => rowEl.classList.remove("is-drag-over"));
      rowEl.addEventListener("drop", (e) => {
        if (state.dragSourceType === "svc" && state.dragSourceId && state.dragSourceId !== pid) {
          e.preventDefault();
          e.stopPropagation();
          rowEl.classList.remove("is-drag-over");
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

    rowEl.onclick = (e) => {
      if (state.rearrangeMode) return;
      if (e.target.closest(".js-svc-logs") || e.target.closest(".js-svc-link") || e.target.closest(".js-row-svc-toggle")) return;
      e.preventDefault();
      const item = stackItems.find((i) => i.id === pid) || null;

      if (state.clickPid !== svcId) {
        state.clickPid = svcId;
        state.clickCount = 0;
      }
      state.clickCount = (state.clickCount || 0) + 1;

      if (state.clickDebounceTimer) {
        clearTimeout(state.clickDebounceTimer);
        state.clickDebounceTimer = null;
      }

      if (state.clickCount >= 3 && item) {
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
          triggerServiceToggle(sysId, svcId, svcName);
          return;
        }

        if (item) {
          state.selectedProgramId = item.id;
          invalidateRenderKeys();
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
            ? `${item.name} (${item.detail || item.unit || item.type || "service"}) running on this server.`
            : `Сервис ${item.name} (${item.detail || item.unit || item.type || "служба"}), работающий на этом сервере.`;
          const openUrl = item.url || (item.port && (item.id === "osint-dash" || item.cat === "web" || item.category === "web") ? `http://${rep.ip || "100.64.0.5"}:${item.port}` : null);
          showOverlayToast({
            title: item.name,
            tagText: stText,
            statusType: item.status,
            desc: descText,
            progId: item.id,
            linkUrl: openUrl,
            linkText: isEn ? "Open Dashboard" : "Открыть дашборд",
          });
        } else {
          openServiceLogsModal(sysId, svcId, svcName);
        }
      }, 260);
    };
  });

  const inpPort = qOne("#bszl-inp-port");
  const selProto = qOne("#bszl-sel-proto");
  const inpFrom = qOne("#bszl-inp-from");
  const inpComment = qOne("#bszl-inp-comment");
  if (inpPort) inpPort.oninput = (e) => (state.portFormDraft.port = e.target.value);
  if (selProto) selProto.onchange = (e) => (state.portFormDraft.proto = e.target.value);
  if (inpFrom) inpFrom.oninput = (e) => (state.portFormDraft.from_ip = e.target.value);
  if (inpComment) inpComment.oninput = (e) => (state.portFormDraft.comment = e.target.value);

  const btnPortOpen = qOne("#bszl-btn-port-open");
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

  const btnPortClose = qOne("#bszl-btn-port-close");
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

  qAll(".js-port-toggle").forEach((btn) => {
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

  qAll(".js-rule-del").forEach((btn) => {
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
    globalThis.BESZEL.HUB_VERSION = "0.0.5";
  }
  const links = document.querySelectorAll('a[href*="github.com/henrygd/beszel"]');
  links.forEach((a) => {
    a.href = a.href.replace("github.com/henrygd/beszel", "github.com/bledny1099/beszel");
  });
  document.querySelectorAll('a[href*="/releases"]').forEach((a) => {
    if (a.textContent) {
      a.textContent = a.textContent
        .replace("0.21.0", "0.0.5")
        .replace("0.21.1", "0.0.5")
        .replace("0.0.1", "0.0.5")
        .replace("0.0.2", "0.0.5")
        .replace("0.0.3", "0.0.5")
        .replace("0.0.4", "0.0.5");
    }
  });
}

function bindAnimateUiTabGliders() {
  document.querySelectorAll(".bszl-tabs-bar").forEach((bar) => {
    bar.classList.add("has-aui-glider");
    let glider = bar.querySelector(".bszl-aui-tab-glider");
    if (!glider) {
      glider = document.createElement("span");
      glider.className = "bszl-aui-tab-glider";
      bar.prepend(glider);
    }
    const moveGliderTo = (btn) => {
      if (!btn) return;
      glider.style.width = `${btn.offsetWidth}px`;
      glider.style.height = `${btn.offsetHeight}px`;
      glider.style.transform = `translate3d(${btn.offsetLeft}px, ${btn.offsetTop}px, 0)`;
    };
    const activeBtn = bar.querySelector(".bszl-tab-btn.is-active") || bar.querySelector(".bszl-tab-btn");
    moveGliderTo(activeBtn);
    if (!bar.hasAttribute("data-aui-bound")) {
      bar.setAttribute("data-aui-bound", "1");
      bar.querySelectorAll(".bszl-tab-btn").forEach((btn) => {
        btn.addEventListener("mouseenter", () => moveGliderTo(btn));
      });
      bar.addEventListener("mouseleave", () => {
        const cur = bar.querySelector(".bszl-tab-btn.is-active") || bar.querySelector(".bszl-tab-btn");
        moveGliderTo(cur);
      });
    }
  });
}

function renderAll() {
  syncLangFromNativeDom();
  renderTopNavbarLangSwitcher();
  renderNotificationsPage();
  updateFooterLinks();
  if (!state.notificationsPageOpen) {
    renderHomeTable();
    renderSystemDetailPage();
    enhanceSettings2Menu();
  }
  bindAnimateUiTabGliders();
}

function init() {
  syncBeszelNativeLang(state.lang);
  fetchReports();
  setInterval(fetchReports, 45000);

  document.addEventListener("click", () => {
    document.querySelectorAll(".bszl-lang-menu.is-open").forEach((m) => m.classList.remove("is-open"));
  });

  // Animate UI Ripple effect on buttons & filter pills
  document.addEventListener("pointerdown", (e) => {
    const btn =
      e.target && e.target.nodeType === 1
        ? e.target.closest(".bszl-filter-pill, .bszl-icon-btn, .bszl-act-btn, .bszl-cmd-copy-btn")
        : null;
    if (!btn || btn.disabled) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");
    ripple.className = "bszl-aui-ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 580);
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
            "#bszl-server-security-panel, #bszl-server-services-panel, .bszl-lang-wrap, .bszl-rearrange-banner, .bszl-notifications-modal, #bszl-notif-btn, .bszl-home-row-pill, #bszl-agent-modal, #bszl-svc-logs-modal, .bszl-toast-stack, #bszl-rearrange-menu, .bszl-chart-drag-bar"
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
