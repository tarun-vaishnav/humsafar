/**
 * Runtime-accessible theme values.
 *
 * `tokens.js` powers the Tailwind config (build-time, CSS-only). This file
 * re-exports the *same* raw values with JS-friendly access patterns for
 * consumers that live outside CSS — e.g. Three.js material colors, GSAP
 * timelines that read hex strings, or Framer variants that interpolate hues.
 *
 * Keep this file a thin projection of `tokens`; never diverge.
 */
import {
  colors,
  fontFamily,
  fontSize,
  spacing,
  radius,
  duration,
  easing,
  breakpoints,
  zIndex,
  shadow,
  gsapEasing,
} from './tokens.js'

export const theme = {
  colors,
  fontFamily,
  fontSize,
  spacing,
  radius,
  duration,
  easing,
  gsapEasing,
  breakpoints,
  zIndex,
  shadow,
}

// Named re-exports so `import { colors } from '@styles/theme'` works too.
export { colors, fontFamily, fontSize, spacing, radius, duration, easing, gsapEasing, breakpoints, zIndex, shadow }
