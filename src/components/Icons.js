import React from 'react';
import { Path, Circle, Rect, Svg, G } from 'react-native-svg';

const Ic = ({ children, size = 20, sw = 1.6, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={style}>
    {children}
  </Svg>
);

// We need to pass color since RN SVG doesn't support currentColor
const IcC = ({ children, size = 20, sw = 1.6, color = '#000', style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={style}>
    {children}
  </Svg>
);

export const Icons = {
  home: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M3 10.5 12 3l9 7.5" />
      <Path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
    </IcC>
  ),
  capsule: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Rect x="2.8" y="9" width="18.4" height="6" rx="3" transform="rotate(-30 12 12)" />
      <Path d="M9.4 7.3l4.8 8.3" />
    </IcC>
  ),
  truck: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M2.5 6.5h11v9h-11z" />
      <Path d="M13.5 9.5h4l3 3v3h-7z" />
      <Circle cx="6" cy="17.5" r="1.8" />
      <Circle cx="17" cy="17.5" r="1.8" />
    </IcC>
  ),
  bell: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M6 9a6 6 0 0 1 12 0c0 4 1.2 5.5 2 6.5H4c.8-1 2-2.5 2-6.5Z" />
      <Path d="M10 19a2 2 0 0 0 4 0" />
    </IcC>
  ),
  user: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Circle cx="12" cy="8" r="3.5" />
      <Path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </IcC>
  ),
  check: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M4.5 12.5 10 18 20 6.5" />
    </IcC>
  ),
  checkSm: ({ size = 20, color = '#000', sw = 2.2 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M5 12.5 10 17.5 19 7" />
    </IcC>
  ),
  left: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M15 5 8 12l7 7" />
    </IcC>
  ),
  right: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M9 5l7 7-7 7" />
    </IcC>
  ),
  down: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M5 9l7 7 7-7" />
    </IcC>
  ),
  plus: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M12 5v14M5 12h14" />
    </IcC>
  ),
  x: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M6 6l12 12M18 6 6 18" />
    </IcC>
  ),
  arrowRight: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M4 12h15M13 6l6 6-6 6" />
    </IcC>
  ),
  clock: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Circle cx="12" cy="12" r="8.5" />
      <Path d="M12 7.5V12l3 2" />
    </IcC>
  ),
  mapPin: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M12 21c4-4.5 7-7.8 7-11a7 7 0 1 0-14 0c0 3.2 3 6.5 7 11Z" />
      <Circle cx="12" cy="10" r="2.6" />
    </IcC>
  ),
  phone: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M6 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5.5a2 2 0 0 1 2-2Z" />
    </IcC>
  ),
  alert: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M12 4 21 19.5H3L12 4Z" />
      <Path d="M12 10v4.5M12 17.4v.1" />
    </IcC>
  ),
  lock: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <Path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </IcC>
  ),
  shield: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M12 3 5 6v5c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6l-7-3Z" />
    </IcC>
  ),
  globe: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Circle cx="12" cy="12" r="8.5" />
      <Path d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.6 0 17M12 3.5c-2.5 2.4-2.5 14.6 0 17" />
    </IcC>
  ),
  logout: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
      <Path d="M10 12H3m4-4-4 4 4 4" />
    </IcC>
  ),
  search: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Circle cx="11" cy="11" r="6.5" />
      <Path d="m16 16 4 4" />
    </IcC>
  ),
  activity: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M3 12h4l2.5-7 5 14L17 12h4" />
    </IcC>
  ),
  package: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="m12 3 8 4.2v9.6L12 21l-8-4.2V7.2L12 3Z" />
      <Path d="M4 7.2 12 11.5l8-4.3M12 11.5V21" />
    </IcC>
  ),
  edit: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M5 19h14M6.5 15.5l9-9 3 3-9 9H6.5v-3Z" />
    </IcC>
  ),
  message: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M4 5.5h16v11H9l-4 3.5v-3.5H4Z" />
    </IcC>
  ),
  flag: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M6 21V4M6 4h11l-2 4 2 4H6" />
    </IcC>
  ),
  refresh: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M20 9a8 8 0 0 0-14-3L4 8M4 4v4h4" />
      <Path d="M4 15a8 8 0 0 0 14 3l2-2M20 20v-4h-4" />
    </IcC>
  ),
  heartPulse: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M12 20S4 14.5 4 9a4.2 4.2 0 0 1 8-1 4.2 4.2 0 0 1 8 1c0 1.2-.4 2.3-1 3.4h-3l-1.5 2.5L11 8.5 9.5 12H7.5" />
    </IcC>
  ),
  droplet: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M12 3.5c3.2 4 6 6.7 6 10a6 6 0 0 1-12 0c0-3.3 2.8-6 6-10Z" />
    </IcC>
  ),
  chevronR: ({ size = 20, color = '#000', sw = 1.8 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M9 6l6 6-6 6" />
    </IcC>
  ),
  building: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M5 21V5l8-2v18M13 21V9l6 2v10M5 21h16" />
    </IcC>
  ),
  sun: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Circle cx="12" cy="12" r="4" />
      <Path d="M12 2.5v2.5M12 19v2.5M21.5 12H19M5 12H2.5M18.4 5.6 16.6 7.4M7.4 16.6l-1.8 1.8M18.4 18.4l-1.8-1.8M7.4 7.4 5.6 5.6" />
    </IcC>
  ),
  moon: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M20 13.5A8 8 0 1 1 10.5 4 6.5 6.5 0 0 0 20 13.5Z" />
    </IcC>
  ),
  info: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Circle cx="12" cy="12" r="8.5" />
      <Path d="M12 11v5M12 7.8v.1" />
    </IcC>
  ),
  stethoscope: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M5 3v5a4 4 0 0 0 8 0V3" />
      <Path d="M9 16a5 5 0 0 0 9 3" />
      <Circle cx="19" cy="14" r="2.2" />
    </IcC>
  ),
  pencil: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M5 19h3l9-9-3-3-9 9v3Z" />
      <Path d="M13.5 6.5l3 3" />
    </IcC>
  ),
  inbox: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M3.5 13.5 6 6h12l2.5 7.5V19a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1Z" />
      <Path d="M3.5 13.5H8l1.5 2.5h5L16 13.5h4.5" />
    </IcC>
  ),
  send: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M4 12 20 4l-6 16-3-7-7-1Z" />
    </IcC>
  ),
  dots: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Circle cx="5" cy="12" r="1.3" />
      <Circle cx="12" cy="12" r="1.3" />
      <Circle cx="19" cy="12" r="1.3" />
    </IcC>
  ),
  minus: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M5 12h14" />
    </IcC>
  ),
  users: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Circle cx="9" cy="8" r="3.2" />
      <Path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <Path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M17.5 14.4A5.5 5.5 0 0 1 20.5 19" />
    </IcC>
  ),
  x: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M18 6 6 18M6 6l12 12" />
    </IcC>
  ),
  mail: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Rect x="2" y="4" width="20" height="16" rx="2" />
      <Path d="m2 7 10 7 10-7" />
    </IcC>
  ),
  eye: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
      <Circle cx="12" cy="12" r="3" />
    </IcC>
  ),
  eyeOff: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M17.9 17.9A9.9 9.9 0 0 1 12 19c-6.4 0-10-7-10-7a17.2 17.2 0 0 1 4.1-5.4M9.9 4.2A9.4 9.4 0 0 1 12 4c6.4 0 10 7 10 7a17.6 17.6 0 0 1-2 2.9M2 2l20 20" />
      <Path d="M9 9a3 3 0 0 0 5.1 2.1" />
    </IcC>
  ),
  ban: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Circle cx="12" cy="12" r="8.5" />
      <Path d="M5.5 18.5 18.5 5.5" />
    </IcC>
  ),
  key: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Circle cx="9" cy="10" r="4.5" />
      <Path d="M13 14l8 8M17 14l-2 2" />
    </IcC>
  ),
  userPlus: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Circle cx="10" cy="8" r="3.5" />
      <Path d="M4.5 20a5.5 5.5 0 0 1 11 0" />
      <Path d="M18 9v6M15 12h6" />
    </IcC>
  ),
  idBadge: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Rect x="4" y="2" width="16" height="20" rx="2" />
      <Circle cx="12" cy="9" r="2.5" />
      <Path d="M7.5 19a4.5 4.5 0 0 1 9 0" />
      <Path d="M9 4h6" />
    </IcC>
  ),
  shieldCheck: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M12 3 5 6v5c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6l-7-3Z" />
      <Path d="m9 12 2 2 4-4" />
    </IcC>
  ),
  sliders: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M4 6h16M4 12h16M4 18h16" />
      <Circle cx="8" cy="6" r="2" />
      <Circle cx="16" cy="12" r="2" />
      <Circle cx="10" cy="18" r="2" />
    </IcC>
  ),
  copy: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Rect x="9" y="9" width="12" height="12" rx="2" />
      <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </IcC>
  ),
  file: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <Path d="M14 3v5h5" />
      <Path d="M9 12h6M9 16h4" />
    </IcC>
  ),
  calendar: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Rect x="3" y="4" width="18" height="17" rx="2" />
      <Path d="M8 2v4M16 2v4M3 10h18" />
    </IcC>
  ),
  trash: ({ size = 20, color = '#000', sw = 1.6 }) => (
    <IcC size={size} color={color} sw={sw}>
      <Path d="M3 6h18M19 6l-1.3 14H6.3L5 6" />
      <Path d="M10 11v5M14 11v5M9 6V4h6v2" />
    </IcC>
  ),
};
