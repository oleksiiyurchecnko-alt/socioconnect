export const COLORS = {
  primary: '#0057ff',
  primaryHover: '#0046cc',
  background: '#ffffff',
  surface: '#f8fafc',
  text: '#101828',
  textMuted: '#475467',
  border: '#d0d5dd',
  onPrimary: '#ffffff',
  focus: '#84adff',
} as const;

export const DARK_COLORS = {
  primary: '#6ea8ff',
  primaryHover: '#8ab8ff',
  background: '#0b1220',
  surface: '#111927',
  text: '#f8fafc',
  textMuted: '#98a2b3',
  border: '#344054',
  onPrimary: '#081120',
  focus: '#b2ccff',
} as const;

export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  xxl: '2rem',
  control: '2.75rem',
} as const;

export const RADIUS = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  pill: '9999px',
} as const;

export const Z_INDEX = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  modal: 400,
  toast: 500,
} as const;

export const TYPOGRAPHY = {
  fontFamilyBase: "'Inter', system-ui, sans-serif",
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemibold: 600,
  fontSizeSm: '0.875rem',
  fontSizeMd: '1rem',
  fontSizeLg: '1.125rem',
  fontSizeXl: '1.5rem',
  lineHeightTight: 1.2,
  lineHeightBase: 1.5,
} as const;
