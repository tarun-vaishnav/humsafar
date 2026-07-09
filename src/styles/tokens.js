/**
 * HumSafar Design System — Design Tokens
 * ═══════════════════════════════════════
 *
 * LOCKED DESIGN SYSTEM. Every visual value in the product flows from here.
 * Tailwind, GSAP, inline styles, and shaders all pull from this single source.
 *
 * DESIGN PRINCIPLES:
 * ─ Trust, Warmth, Exploration, Comfort, Adventure, Luxury, Movement
 * ─ Content first. Product first. Animation second. Background third.
 * ─ Light, warm, premium — never dark, never neon, never aggressive.
 *
 * DO NOT add: neon purple, neon red, cyber glow, gaming colors, aggressive contrast.
 * DO NOT hard-code colors, spacing, radius, duration, or easing anywhere else.
 */

// ─── Palette ────────────────────────────────────────────────────────────────
// Warm neutrals inspired by paper, parchment, and travel journals.
// Brand hue is warm coral — evokes warmth, human connection, sunsets.
// Accent is travel blue — trust, sky, open horizons.
// Golden amber — maps, compasses, premium feel.
// Forest green — nature, exploration, very subtle use only.
const palette = {
  // Warm neutral scale — ivory to deep charcoal (never pure black)
  neutral: {
    0: '#FFFFFF',
    50: '#FDFCFA',
    100: '#FAF8F5',
    150: '#F5F3EE',
    200: '#EFEDE8',
    250: '#E8E5DE',
    300: '#D9D5CC',
    400: '#B8B3A8',
    500: '#9A9488',
    600: '#7A756B',
    700: '#5C5850',
    800: '#3D3A34',
    900: '#2A2722',
    950: '#1A1815',
  },

  // Bone / ivory / parchment tones
  bone: {
    50: '#FAF7F2',
    100: '#F3EEE4',
    200: '#E8DFCE',
    300: '#D9CBB0',
    400: '#C4B08A',
    500: '#A8926A',
  },

  // Golden amber — maps, compasses, premium accents
  gold: {
    50: '#FBF6EA',
    100: '#F5E9C8',
    200: '#ECD48F',
    300: '#DFBC5B',
    400: '#C9A03A',
    500: '#A88028',
    600: '#856320',
    700: '#5F471A',
  },

  // Travel blue — trust, sky, open horizons
  blue: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },

  // Warm coral — human connection, warmth, sunsets
  coral: {
    50: '#FFF5F0',
    100: '#FFEBE0',
    200: '#FFD4BD',
    300: '#FFB899',
    400: '#E8735A',
    500: '#D95F4A',
    600: '#C44B3A',
    700: '#9E3828',
  },

  // Forest green — nature, exploration (very subtle)
  forest: {
    50: '#F0F7F4',
    100: '#D9EDE3',
    200: '#B0D9C5',
    300: '#7BBF9F',
    400: '#4A9E75',
    500: '#2D7D56',
    600: '#1F5E3F',
  },

  // Status (semantic only — not for decoration)
  positive: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
}

// ─── Semantic colors ────────────────────────────────────────────────────────
// WARM LIGHT PREMIUM THEME — travel-editorial, inviting, trustworthy.
// Component code should ONLY use these semantic tokens, not raw palette.
export const colors = {
  transparent: 'transparent',
  current: 'currentColor',
  inherit: 'inherit',

  // Direct palette access for edge cases / gradients only.
  palette,

  // ── Surfaces ── warm white / ivory
  surface: {
    base: '#FAFAF8',        // warm white — main page background
    raised: '#FFFFFF',       // pure white — cards, elevated panels
    overlay: '#F5F3EE',      // soft ivory — subtle section backgrounds
    inset: '#EFEDE8',        // warm gray — inset panels, inputs bg
    inverse: palette.neutral[900],
  },

  // ── Content ── deep charcoal, warm grays (never pure black)
  content: {
    primary: '#2A2722',      // deep warm charcoal
    secondary: '#4A4740',    // mid charcoal
    tertiary: '#7A756B',     // warm gray
    muted: '#9A9488',        // light warm gray
    disabled: '#B8B3A8',     // very light gray
    inverse: '#FAFAF8',      // for dark backgrounds
    onBrand: '#FFFFFF',      // text on brand buttons
    link: '#2563EB',         // travel blue
  },

  // ── Borders ── warm, subtle, never harsh
  border: {
    subtle: 'rgba(42,39,34,0.04)',
    default: 'rgba(42,39,34,0.08)',
    strong: 'rgba(42,39,34,0.14)',
    focus: '#2563EB',        // travel blue
  },

  // ── Brand ── warm coral (primary brand color)
  brand: {
    50: '#FFF5F0',
    100: '#FFEBE0',
    200: '#FFD4BD',
    300: '#FFB899',
    400: '#E8735A',
    500: '#D95F4A',
    600: '#C44B3A',
    700: '#9E3828',
    DEFAULT: '#E8735A',      // warm coral — primary brand
  },

  // ── Accent ── travel blue (CTAs, links, focus)
  accent: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',          // travel blue
    700: '#1D4ED8',
    DEFAULT: '#2563EB',
  },

  // ── Golden ── amber highlights, premium touches
  golden: {
    50: '#FBF6EA',
    100: '#F5E9C8',
    200: '#ECD48F',
    300: '#DFBC5B',
    400: '#C9A03A',
    500: '#A88028',
    DEFAULT: '#C9A03A',
  },

  // ── Forest ── subtle nature accent
  forest: {
    50: '#F0F7F4',
    100: '#D9EDE3',
    200: '#B0D9C5',
    300: '#7BBF9F',
    400: '#4A9E75',
    500: '#2D7D56',
    DEFAULT: '#4A9E75',
  },

  // ── Status ── semantic only
  status: {
    positive: palette.positive,
    warning: palette.warning,
    danger: palette.danger,
  },

  // Convenience
  white: '#FFFFFF',
  black: '#1A1815',          // warm black — never pure #000
}

// ─── Typography ─────────────────────────────────────────────────────────────
// Display: Fraunces (warm variable serif) for editorial headlines.
// Sans:   Inter — clean, trusted utility text.
// Mono:   JetBrains Mono — data, codes.
export const fontFamily = {
  sans: [
    'Inter',
    'ui-sans-serif',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  display: [
    'Fraunces',
    'ui-serif',
    'Georgia',
    'Cambria',
    'Times New Roman',
    'Times',
    'serif',
  ],
  mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
}

export const fontSize = {
  // [font-size, { lineHeight, letterSpacing }]
  '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],     // 11
  xs: ['0.75rem', { lineHeight: '1.125rem', letterSpacing: '0.01em' }],      // 12
  sm: ['0.875rem', { lineHeight: '1.35rem' }],                               // 14
  base: ['1rem', { lineHeight: '1.6' }],                                     // 16
  lg: ['1.125rem', { lineHeight: '1.6' }],                                   // 18
  xl: ['1.25rem', { lineHeight: '1.5' }],                                    // 20
  '2xl': ['1.5rem', { lineHeight: '1.35' }],                                 // 24
  '3xl': ['1.875rem', { lineHeight: '1.25' }],                               // 30
  '4xl': ['2.25rem', { lineHeight: '1.15' }],                                // 36
  '5xl': ['3rem', { lineHeight: '1.08' }],                                   // 48
  '6xl': ['3.75rem', { lineHeight: '1.04' }],                                // 60
  '7xl': ['4.5rem', { lineHeight: '1.02' }],                                 // 72
  '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.02em' }],            // 96
  '9xl': ['8rem', { lineHeight: '0.95', letterSpacing: '-0.03em' }],         // 128
  hero: ['clamp(3.5rem, 9vw, 10rem)', { lineHeight: '0.92', letterSpacing: '-0.035em' }],
  display: ['clamp(2.5rem, 6vw, 6rem)', { lineHeight: '1', letterSpacing: '-0.025em' }],
  headline: ['clamp(1.75rem, 3.2vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
  eyebrow: ['0.75rem', { lineHeight: '1', letterSpacing: '0.16em' }],
}

export const fontWeight = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
}

export const letterSpacing = {
  tighter: '-0.04em',
  tight: '-0.02em',
  snug: '-0.01em',
  normal: '0',
  wide: '0.02em',
  wider: '0.06em',
  widest: '0.16em',
}

export const lineHeight = {
  none: '1',
  tight: '1.1',
  snug: '1.2',
  normal: '1.5',
  relaxed: '1.7',
  loose: '2',
}

// ─── Spacing ────────────────────────────────────────────────────────────────
// 4px base; named tokens for common layout rhythm.
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  48: '12rem',
  56: '14rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
  // Semantic
  gutter: 'clamp(1.25rem, 4vw, 3rem)',
  section: 'clamp(4rem, 10vw, 10rem)',
  hero: 'clamp(6rem, 15vw, 14rem)',
}

// ─── Radius ─────────────────────────────────────────────────────────────────
export const radius = {
  none: '0',
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '28px',
  '4xl': '36px',
  pill: '999px',
  full: '9999px',
}

// ─── Shadows ────────────────────────────────────────────────────────────────
// Warm, soft, editorial. No neon glows. No cyber halos.
export const shadow = {
  none: 'none',
  xs: '0 1px 2px rgba(42,39,34,0.04)',
  sm: '0 1px 3px rgba(42,39,34,0.06), 0 1px 2px rgba(42,39,34,0.04)',
  md: '0 4px 16px -2px rgba(42,39,34,0.08), 0 2px 4px rgba(42,39,34,0.04)',
  lg: '0 12px 40px -8px rgba(42,39,34,0.10), 0 4px 8px rgba(42,39,34,0.04)',
  xl: '0 24px 60px -12px rgba(42,39,34,0.12), 0 8px 16px rgba(42,39,34,0.04)',
  '2xl': '0 40px 100px -20px rgba(42,39,34,0.14), 0 12px 24px rgba(42,39,34,0.06)',
  // Warm brand glow — subtle, inviting, NEVER aggressive
  glow: '0 4px 24px rgba(232,115,90,0.12), 0 0 0 1px rgba(232,115,90,0.06)',
  glowAccent: '0 4px 24px rgba(37,99,235,0.10), 0 0 0 1px rgba(37,99,235,0.05)',
  glowGolden: '0 4px 24px rgba(201,160,58,0.10), 0 0 0 1px rgba(201,160,58,0.05)',
  inset: 'inset 0 1px 0 rgba(42,39,34,0.02)',
  ring: '0 0 0 1px rgba(42,39,34,0.06)',
  focus: '0 0 0 3px rgba(37,99,235,0.20)',
}

// ─── z-index ────────────────────────────────────────────────────────────────
// Semantic scale — never use ad-hoc integers.
export const zIndex = {
  hide: '-1',
  base: '0',
  raised: '1',
  dropdown: '10',
  sticky: '20',
  overlay: '30',
  scene: '40',
  header: '50',
  modal: '60',
  toast: '70',
  cursor: '80',
  loader: '90',
  max: '100',
}

// ─── Motion ─────────────────────────────────────────────────────────────────
// Shared between CSS/Tailwind, GSAP, and Framer.
// Use named motion (`smooth`, `hero`, `expressive`) — never raw ms.
export const duration = {
  0: '0ms',
  75: '75ms',
  100: '100ms',
  150: '150ms',
  200: '200ms',
  300: '300ms',
  400: '400ms',
  500: '500ms',
  700: '700ms',
  900: '900ms',
  1200: '1200ms',
  1600: '1600ms',
  2400: '2400ms',
  instant: '0ms',
  quick: '150ms',
  base: '300ms',
  smooth: '500ms',
  slow: '900ms',
  hero: '1600ms',
}

// Named CSS cubic-bezier easings.
export const easing = {
  linear: 'linear',
  in: 'cubic-bezier(0.4, 0.0, 1, 1)',
  out: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  // Editorial / cinematic — hero reveals, smooth transitions
  smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
  expressive: 'cubic-bezier(0.16, 1, 0.3, 1)',
  swift: 'cubic-bezier(0.65, 0, 0.35, 1)',
  glide: 'cubic-bezier(0.83, 0, 0.17, 1)',
  // Micro-interactions — gentle spring
  overshoot: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  bounceOut: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
}

// GSAP-friendly easing strings.
export const gsapEasing = {
  linear: 'none',
  in: 'power2.in',
  out: 'power2.out',
  inOut: 'power2.inOut',
  smooth: 'expo.out',
  expressive: 'expo.inOut',
  swift: 'circ.inOut',
  glide: 'quart.inOut',
  overshoot: 'back.out(1.6)',
  bounceOut: 'elastic.out(1, 0.5)',
}

// GSAP-friendly numeric durations (seconds).
export const gsapDuration = {
  quick: 0.15,
  base: 0.3,
  smooth: 0.5,
  slow: 0.9,
  hero: 1.6,
  cinematic: 2.4,
}

// ─── Gradients ──────────────────────────────────────────────────────────────
// Warm, light, travel-editorial. Never dark. Never neon.
export const gradients = {
  // Warm surfaces
  'warm-ivory': `linear-gradient(180deg, #FAFAF8 0%, #F5F3EE 100%)`,
  'warm-paper': `linear-gradient(180deg, ${palette.bone[50]} 0%, ${palette.bone[100]} 100%)`,
  'warm-sand': `linear-gradient(135deg, ${palette.bone[50]} 0%, ${palette.gold[50]} 50%, ${palette.bone[100]} 100%)`,

  // Brand gradients (subtle, warm)
  'brand-warm': `linear-gradient(135deg, ${palette.coral[50]} 0%, ${palette.coral[100]} 100%)`,
  'brand-sunset': `linear-gradient(135deg, ${palette.coral[100]} 0%, ${palette.gold[100]} 100%)`,

  // Accent (subtle blue)
  'accent-sky': `linear-gradient(135deg, ${palette.blue[50]} 0%, ${palette.blue[100]} 100%)`,

  // Section fades
  'fade-down': `linear-gradient(180deg, transparent 0%, #FAFAF8 100%)`,
  'fade-up': `linear-gradient(0deg, transparent 0%, #FAFAF8 100%)`,

  // Decorative (very subtle)
  'hero-ambient': `radial-gradient(ellipse at 30% 20%, rgba(232,115,90,0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(37,99,235,0.03) 0%, transparent 50%)`,
  'travel-warm': `radial-gradient(ellipse at center, rgba(201,160,58,0.04) 0%, transparent 60%)`,

  // Sheen for premium cards
  sheen: `linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)`,
}

// ─── Layout ─────────────────────────────────────────────────────────────────
export const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
}

export const container = {
  max: '1440px',
  prose: '68ch',
}

export const aspect = {
  square: '1 / 1',
  video: '16 / 9',
  cinema: '21 / 9',
  portrait: '3 / 4',
  poster: '2 / 3',
  ultrawide: '32 / 9',
}

export const blur = {
  none: '0',
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '24px',
  '2xl': '40px',
  '3xl': '64px',
}

// ─── Root export ────────────────────────────────────────────────────────────
export const tokens = {
  colors,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  spacing,
  radius,
  shadow,
  zIndex,
  duration,
  easing,
  gsapEasing,
  gsapDuration,
  gradients,
  breakpoints,
  container,
  aspect,
  blur,
}

export default tokens
