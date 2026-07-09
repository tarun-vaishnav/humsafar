/**
 * Runtime device / capability detection. All checks are SSR-safe (guard `window`)
 * so this module can be imported from anywhere.
 */

const hasWindow = typeof window !== 'undefined'
const hasNavigator = typeof navigator !== 'undefined'

export const isBrowser = hasWindow

export const isTouch = () =>
  hasWindow &&
  ('ontouchstart' in window || (hasNavigator && navigator.maxTouchPoints > 0))

export const isPointerFine = () =>
  hasWindow && window.matchMedia?.('(pointer: fine)').matches

export const isMobile = () => {
  if (!hasNavigator) return false
  return /android|iphone|ipad|ipod|iemobile|blackberry|opera mini/i.test(navigator.userAgent)
}

export const isSafari = () => {
  if (!hasNavigator) return false
  const ua = navigator.userAgent
  return /^((?!chrome|android).)*safari/i.test(ua)
}

export const isFirefox = () => hasNavigator && /firefox/i.test(navigator.userAgent)

export const prefersReducedMotion = () =>
  hasWindow && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export const prefersDarkMode = () =>
  hasWindow && window.matchMedia?.('(prefers-color-scheme: dark)').matches

/**
 * A very rough GPU tier heuristic (0 low, 1 mid, 2 high). Used to gate expensive
 * post-processing and choose DPR ceilings. Prefer @pmndrs/detect-gpu when we ship
 * shaders that truly need it; this is enough for the foundation.
 */
export const getPerfTier = () => {
  if (!hasNavigator) return 1
  const cores = navigator.hardwareConcurrency || 4
  const memory = navigator.deviceMemory || 4
  const mobile = isMobile()

  if (mobile && (cores <= 4 || memory <= 2)) return 0
  if (mobile) return 1
  if (cores >= 8 && memory >= 8) return 2
  return 1
}

export const getDevicePixelRatio = (min = 1, max = 2) => {
  if (!hasWindow) return 1
  return Math.max(min, Math.min(max, window.devicePixelRatio || 1))
}

/**
 * Semantic wrapper around `getPerfTier` — returns `'low' | 'medium' | 'high'`
 * so calling code stays readable at the site of use.
 */
export const getDevicePerformanceTier = () => {
  const t = getPerfTier()
  if (t === 0) return 'low'
  if (t === 2) return 'high'
  return 'medium'
}

/**
 * Cheap WebGL 1/2 support probe. Cached after first call — creating a probe
 * context is not free, and the answer doesn't change during a session.
 */
let _webglCache
export const isWebGLAvailable = () => {
  if (_webglCache !== undefined) return _webglCache
  if (!hasWindow) return (_webglCache = false)
  try {
    const canvas = document.createElement('canvas')
    _webglCache = !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    _webglCache = false
  }
  return _webglCache
}
