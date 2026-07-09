import { randomInt } from 'node:crypto'
import { env } from './env.js'

/**
 * Public tracking reference — short, uppercase, unambiguous (no 0/O/1/I),
 * prefixed for brand recognition. Combined with the customer's email as a
 * second factor on the /track endpoint, so references need not be secret.
 *
 * Format: HS-XXXXXX (e.g. HS-7Q4KF2)
 */
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // 32 chars, no lookalikes

export function generateReference(): string {
  let out = ''
  for (let i = 0; i < 6; i += 1) out += ALPHABET[randomInt(0, ALPHABET.length)]
  return `HS-${out}`
}

export interface GeoResult {
  country?: string
  city?: string
}

/**
 * Best-effort coarse geolocation for abuse tracking. Uses the free, keyless
 * ipapi.co endpoint. Never throws — geo is a nice-to-have, not critical path.
 * Disabled by default (ENABLE_GEO_LOOKUP=false) to avoid outbound calls.
 */
export async function lookupGeo(ip?: string): Promise<GeoResult> {
  if (!env.ENABLE_GEO_LOOKUP || !ip) return {}
  // Skip private / loopback addresses.
  if (/^(::1|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip)) return {}
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 2500)
    const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
    clearTimeout(timer)
    if (!res.ok) return {}
    const data = (await res.json()) as { country_name?: string; city?: string }
    return { country: data.country_name, city: data.city }
  } catch {
    return {}
  }
}
