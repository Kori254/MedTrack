// MedTrack — outline icon set. Stroke-based (Lucide/Tabler style), currentColor.
// Default 20px, 24px for nav. Never filled.
const Ic = ({ d, size = 20, sw = 1.6, fill, children, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={style} aria-hidden="true">
    {d ? <path d={d} /> : children}
  </svg>
);

const Icon = {
  home: (p) => <Ic {...p}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" /></Ic>,
  pill: (p) => <Ic {...p}><rect x="3.2" y="8.5" width="17.6" height="7" rx="3.5" /><path d="M12 8.7v6.6" /></Ic>,
  capsule: (p) => <Ic {...p}><rect x="2.8" y="9" width="18.4" height="6" rx="3" transform="rotate(-30 12 12)" /><path d="M9.4 7.3l4.8 8.3" /></Ic>,
  truck: (p) => <Ic {...p}><path d="M2.5 6.5h11v9h-11z" /><path d="M13.5 9.5h4l3 3v3h-7z" /><circle cx="6" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></Ic>,
  bell: (p) => <Ic {...p}><path d="M6 9a6 6 0 0 1 12 0c0 4 1.2 5.5 2 6.5H4c.8-1 2-2.5 2-6.5Z" /><path d="M10 19a2 2 0 0 0 4 0" /></Ic>,
  user: (p) => <Ic {...p}><circle cx="12" cy="8" r="3.5" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></Ic>,
  check: (p) => <Ic {...p}><path d="M4.5 12.5 10 18 20 6.5" /></Ic>,
  checkSm: (p) => <Ic sw={2.2} {...p}><path d="M5 12.5 10 17.5 19 7" /></Ic>,
  left: (p) => <Ic {...p}><path d="M15 5 8 12l7 7" /></Ic>,
  right: (p) => <Ic {...p}><path d="M9 5l7 7-7 7" /></Ic>,
  down: (p) => <Ic {...p}><path d="M5 9l7 7 7-7" /></Ic>,
  up: (p) => <Ic {...p}><path d="M5 15l7-7 7 7" /></Ic>,
  plus: (p) => <Ic {...p}><path d="M12 5v14M5 12h14" /></Ic>,
  x: (p) => <Ic {...p}><path d="M6 6l12 12M18 6 6 18" /></Ic>,
  arrowRight: (p) => <Ic {...p}><path d="M4 12h15M13 6l6 6-6 6" /></Ic>,
  calendar: (p) => <Ic {...p}><rect x="3.5" y="5" width="17" height="16" rx="3" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /></Ic>,
  clock: (p) => <Ic {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></Ic>,
  mapPin: (p) => <Ic {...p}><path d="M12 21c4-4.5 7-7.8 7-11a7 7 0 1 0-14 0c0 3.2 3 6.5 7 11Z" /><circle cx="12" cy="10" r="2.6" /></Ic>,
  phone: (p) => <Ic {...p}><path d="M6 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5.5a2 2 0 0 1 2-2Z" /></Ic>,
  alert: (p) => <Ic {...p}><path d="M12 4 21 19.5H3L12 4Z" /><path d="M12 10v4.5M12 17.4v.1" /></Ic>,
  settings: (p) => <Ic {...p}><circle cx="12" cy="12" r="3" /><path d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4M18.7 18.7l-1.4-1.4M6.7 6.7 5.3 5.3" /></Ic>,
  lock: (p) => <Ic {...p}><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></Ic>,
  shield: (p) => <Ic {...p}><path d="M12 3 5 6v5c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6l-7-3Z" /></Ic>,
  globe: (p) => <Ic {...p}><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.6 0 17M12 3.5c-2.5 2.4-2.5 14.6 0 17" /></Ic>,
  logout: (p) => <Ic {...p}><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" /><path d="M10 12H3m4-4-4 4 4 4" /></Ic>,
  search: (p) => <Ic {...p}><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></Ic>,
  activity: (p) => <Ic {...p}><path d="M3 12h4l2.5-7 5 14L17 12h4" /></Ic>,
  package: (p) => <Ic {...p}><path d="m12 3 8 4.2v9.6L12 21l-8-4.2V7.2L12 3Z" /><path d="M4 7.2 12 11.5l8-4.3M12 11.5V21" /></Ic>,
  edit: (p) => <Ic {...p}><path d="M5 19h14M6.5 15.5l9-9 3 3-9 9H6.5v-3Z" /></Ic>,
  message: (p) => <Ic {...p}><path d="M4 5.5h16v11H9l-4 3.5v-3.5H4Z" /></Ic>,
  file: (p) => <Ic {...p}><path d="M7 3h7l4 4v14H7Z" /><path d="M14 3v4h4M10 13h6M10 16.5h6" /></Ic>,
  flag: (p) => <Ic {...p}><path d="M6 21V4M6 4h11l-2 4 2 4H6" /></Ic>,
  refresh: (p) => <Ic {...p}><path d="M20 9a8 8 0 0 0-14-3L4 8M4 4v4h4" /><path d="M4 15a8 8 0 0 0 14 3l2-2M20 20v-4h-4" /></Ic>,
  heartPulse: (p) => <Ic {...p}><path d="M12 20S4 14.5 4 9a4.2 4.2 0 0 1 8-1 4.2 4.2 0 0 1 8 1c0 1.2-.4 2.3-1 3.4h-3l-1.5 2.5L11 8.5 9.5 12H7.5" /></Ic>,
  droplet: (p) => <Ic {...p}><path d="M12 3.5c3.2 4 6 6.7 6 10a6 6 0 0 1-12 0c0-3.3 2.8-6 6-10Z" /></Ic>,
  camera: (p) => <Ic {...p}><path d="M4.5 7.5h3l1.5-2h6l1.5 2h3v11h-15Z" /><circle cx="12" cy="13" r="3.2" /></Ic>,
  chevronR: (p) => <Ic sw={1.8} {...p}><path d="M9 6l6 6-6 6" /></Ic>,
  signature: (p) => <Ic {...p}><path d="M3 17c2-1 3-7 4.5-7s.8 5 2 5 1.5-3 3-3 1 2 2.2 2c1 0 2-1.2 3.3-1.2" /><path d="M4 20.5h16" /></Ic>,
  keypad: (p) => <Ic {...p}><circle cx="7" cy="7" r="1.3" /><circle cx="12" cy="7" r="1.3" /><circle cx="17" cy="7" r="1.3" /><circle cx="7" cy="12" r="1.3" /><circle cx="12" cy="12" r="1.3" /><circle cx="17" cy="12" r="1.3" /><circle cx="12" cy="17" r="1.3" /></Ic>,
  building: (p) => <Ic {...p}><path d="M5 21V5l8-2v18M13 21V9l6 2v10M5 21h16" /><path d="M8 8v0M8 12v0M8 16v0M16 13v0M16 17v0" /></Ic>,
  sun: (p) => <Ic {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2.5M12 19v2.5M21.5 12H19M5 12H2.5M18.4 5.6 16.6 7.4M7.4 16.6l-1.8 1.8M18.4 18.4l-1.8-1.8M7.4 7.4 5.6 5.6" /></Ic>,
  moon: (p) => <Ic {...p}><path d="M20 13.5A8 8 0 1 1 10.5 4 6.5 6.5 0 0 0 20 13.5Z" /></Ic>,
  info: (p) => <Ic {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 7.8v.1" /></Ic>,
};

window.Icon = Icon;
