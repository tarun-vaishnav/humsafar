/**
 * Typed accessor for Vite environment variables.
 *
 * Vite exposes `import.meta.env.*` as strings. Never read them directly from
 * components — go through this module so casting, defaults, and feature flag
 * naming all live in one place.
 */

const raw = import.meta.env

const bool = (v, fallback = false) => {
  if (v === undefined || v === null || v === '') return fallback
  return String(v).toLowerCase() === 'true' || v === '1'
}

const num = (v, fallback) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

const str = (v, fallback = '') => (typeof v === 'string' && v.length > 0 ? v : fallback)

export const env = {
  mode: raw.MODE,
  isDev: raw.DEV === true,
  isProd: raw.PROD === true,
  isSSR: raw.SSR === true,

  app: {
    name: str(raw.VITE_APP_NAME, 'HumSafar'),
    url: str(raw.VITE_APP_URL, 'http://localhost:5173'),
  },

  api: {
    baseUrl: str(raw.VITE_API_BASE_URL, ''),
    timeoutMs: num(raw.VITE_API_TIMEOUT_MS, 15000),
  },

  admin: {
    // Obscure URL segment for the hidden admin panel. MUST match the server's
    // ADMIN_PATH_SECRET. Never linked publicly; keep it out of source control.
    path: str(raw.VITE_ADMIN_PATH, 'panel-9f3c2a'),
  },


  security: {
    // Cloudflare Turnstile public site key (safe to expose)
    turnstileSiteKey: str(raw.VITE_TURNSTILE_SITE_KEY, ''),
  },


  features: {
    analytics: bool(raw.VITE_ENABLE_ANALYTICS, false),
    sceneStats: bool(raw.VITE_ENABLE_SCENE_STATS, false),
    lenis: bool(raw.VITE_ENABLE_LENIS, true),
  },

  rendering: {
    dprMin: num(raw.VITE_DPR_MIN, 1),
    dprMax: num(raw.VITE_DPR_MAX, 2),
  },
}

export default env
