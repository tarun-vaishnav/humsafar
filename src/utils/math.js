/**
 * Small, dependency-free math helpers used across animations and shaders.
 * Match GLSL semantics where names overlap (`clamp`, `mix`, `smoothstep`, `fract`).
 */

export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v))

export const lerp = (a, b, t) => a + (b - a) * t

export const mix = lerp

export const inverseLerp = (a, b, v) => (b === a ? 0 : (v - a) / (b - a))

export const remap = (v, inMin, inMax, outMin, outMax) =>
  lerp(outMin, outMax, inverseLerp(inMin, inMax, v))

export const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

export const fract = (v) => v - Math.floor(v)

export const degToRad = (deg) => (deg * Math.PI) / 180
export const radToDeg = (rad) => (rad * 180) / Math.PI

export const round = (v, precision = 0) => {
  const p = 10 ** precision
  return Math.round(v * p) / p
}

// Framerate-independent damping. Use in useFrame loops for camera / mouse eases.
// factor: higher = snappier. Typical 6–14.
export const damp = (current, target, factor, delta) =>
  lerp(current, target, 1 - Math.exp(-factor * delta))

export const random = (min = 0, max = 1) => min + Math.random() * (max - min)

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

export const wrap = (v, min, max) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}
