/**
 * Design Branch 2: "KHU Crimson"
 * 경희대 상징색(적색) + 골드 포인트 — 프리미엄 대학 커뮤니티
 * 마스코트 쿠옹(사자) 레드 기반
 */

export const Colors = {
  // Primary — 경희 크림슨
  primary: '#C41230',
  primaryDark: '#8C0C22',
  primaryLight: '#FFF0F3',
  primaryMuted: '#E8A0AE',

  // Accent — 경희 골드
  accent: '#C8951C',
  accentLight: '#FFF8E6',
  accentDark: '#9A7015',

  // Semantic
  success: '#2D8A5E',
  successLight: '#EDFAF3',
  warning: '#D97706',
  warningLight: '#FFFBEB',
  error: '#DC2626',
  errorLight: '#FEF2F2',

  // Backgrounds — 따뜻한 크림 톤 (학교 분위기)
  background: '#FAF8F6',
  surface: '#FFFFFF',
  surfaceSecondary: '#F5F2F0',
  surfaceWarm: '#FDF6F0',

  // Text
  textPrimary: '#1A0A0E',
  textSecondary: '#6B5459',
  textTertiary: '#A08A8F',
  textInverse: '#FFFFFF',

  // Border & divider
  border: '#E8DFE1',
  borderFocus: '#C41230',
  divider: '#F0EAEB',

  // Tab bar
  tabActive: '#C41230',
  tabInactive: '#A08A8F',

  // Overlays
  overlay: 'rgba(28, 8, 14, 0.55)',
  overlayLight: 'rgba(196, 18, 48, 0.06)',
} as const;

export const Typography = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,

  thin: '100' as const,
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,

  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export const Spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const Radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const Shadow = {
  sm: {
    shadowColor: '#8C0C22',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#8C0C22',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#C41230',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  gold: {
    shadowColor: '#C8951C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;
