export const light = {
  appBg: '#F4F7F5',
  surface: '#FFFFFF',
  surface2: '#EDF3F0',
  surfaceSunken: '#F0F4F2',

  primary: '#0F6E56',
  primary600: '#0B5946',
  primaryTint: '#E1EEE9',
  primaryTint2: '#CDE3DB',
  onPrimary: '#FFFFFF',

  amber: '#EF9F27',
  amberTint: '#FBEFD7',
  amberText: '#8A5A12',

  coral: '#E05546',
  coralTint: '#FBE3DF',
  coralText: '#AE3729',

  text: '#14211D',
  text2: '#51625B',
  text3: '#82948B',
  textOnTint: '#0F6E56',

  border: '#E4EAE7',
  border2: '#D4DED9',
  hairline: 'rgba(20,40,32,0.08)',

  tabbarBg: 'rgba(255,255,255,0.95)',
  scrim: 'rgba(18,30,26,0.42)',
};

export const dark = {
  appBg: '#0C1411',
  surface: '#15201B',
  surface2: '#1C2822',
  surfaceSunken: '#111A16',

  primary: '#2FA587',
  primary600: '#3CB395',
  primaryTint: '#16302A',
  primaryTint2: '#1E4138',
  onPrimary: '#06221B',

  amber: '#F2B04A',
  amberTint: '#2C2214',
  amberText: '#F2B04A',

  coral: '#F0726A',
  coralTint: '#2E1A18',
  coralText: '#F0726A',

  text: '#EAF1ED',
  text2: '#9FB1A9',
  text3: '#6F8179',
  textOnTint: '#6FD3B7',

  border: '#25332D',
  border2: '#30403A',
  hairline: 'rgba(255,255,255,0.07)',

  tabbarBg: 'rgba(18,26,22,0.95)',
  scrim: 'rgba(0,0,0,0.55)',
};

export function supplyStatus(days) {
  if (days < 7) return 'critical';
  if (days <= 14) return 'low';
  return 'healthy';
}

export const STATUS_LABEL = {
  healthy: 'Healthy supply',
  low: 'Refill soon',
  critical: 'Critical — refill on the way',
};

export function supplyColor(status, t) {
  if (status === 'critical') return t.coral;
  if (status === 'low') return t.amber;
  return t.primary;
}

export function supplyTextColor(status, t) {
  if (status === 'critical') return t.coralText;
  if (status === 'low') return t.amberText;
  return t.primary;
}

export function supplyTintColor(status, t) {
  if (status === 'critical') return t.coralTint;
  if (status === 'low') return t.amberTint;
  return t.primaryTint;
}
