/**
 * Shader chunk library.
 *
 * Every material in the app should compose from these primitives instead of
 * inlining GLSL in component files. Import as strings and interpolate via
 * template literals in `onBeforeCompile` or drei's `shaderMaterial`.
 *
 * Available chunks:
 *   – noise2D/noise3D  — GLSL simplex noise
 *   – fresnel           — rim / atmosphere approximation
 *   – hsv               — HSV↔RGB
 *   – dither            — 8x8 Bayer ordered dither for banding-free gradients
 */

// Chunks are imported via ?raw so tree-shaking works and comments are stripped
// by vite-plugin-glsl at build time.
import noise2D from './noise2D.glsl?raw'
import noise3D from './noise3D.glsl?raw'
import fresnel from './fresnel.glsl?raw'
import hsv from './hsv.glsl?raw'
import dither from './dither.glsl?raw'

export const chunks = { noise2D, noise3D, fresnel, hsv, dither }

/**
 * Build a shader `defines` block from a plain object. Filters out falsy values
 * so passing `{ USE_FOG: enabled }` cleanly conditionally enables the flag.
 */
export const makeDefines = (defs = {}) =>
  Object.entries(defs)
    .filter(([, v]) => v !== false && v !== null && v !== undefined)
    .map(([k, v]) => (v === true ? `#define ${k}` : `#define ${k} ${v}`))
    .join('\n')

export { default as vertBase } from './base.vert?raw'
export { default as fragBase } from './base.frag?raw'
