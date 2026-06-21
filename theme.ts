// S.T.R.I.D.E. Design Tokens
export const Colors = {
  background: '#0A0A0F',
  cardBg: '#141420',
  cardBgAlt: '#1A1A28',
  border: '#1E1E30',
  borderLight: '#2A2A40',

  primary: '#00E5A0',
  primaryDim: '#00B87A',
  primaryMuted: '#003D2B',

  warning: '#FFB800',
  warningMuted: '#3D2D00',
  danger: '#FF4444',
  dangerMuted: '#3D0000',

  textPrimary: '#FFFFFF',
  textSecondary: '#888888',
  textTertiary: '#555566',
  textInverse: '#0A0A0F',

  success: '#00E5A0',
  info: '#4A9FFF',

  tabBar: '#0D0D18',
  overlay: 'rgba(10,10,15,0.85)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  hero: 42,
};

export const FontWeight: Record<string, '400' | '500' | '600' | '700' | '800'> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};
