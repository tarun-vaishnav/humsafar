import { env } from './env.js'

/**
 * Cloudflare Turnstile server-side verification.
 *
 * The frontend widget produces a one-time token; we verify it against
 * Cloudflare's siteverify endpoint. Includes the client IP for extra signal.
 *
 * Behaviour:
 *  • If TURNSTILE_SECRET_KEY is unset AND enforcement is off → skip (dev).
 *  • If enforcement is on → a missing/invalid token fails the request.
 */

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export interface TurnstileResult {
  ok: boolean
  reason?: string
}

export async function verifyTurnstile(
  token: string | undefined,
  remoteIp?: string,
): Promise<TurnstileResult> {
  // Not configured → only allowed when enforcement is disabled.
  if (!env.TURNSTILE_SECRET_KEY) {
    return env.TURNSTILE_ENFORCE
      ? { ok: false, reason: 'captcha-not-configured' }
      : { ok: true }
  }

  if (!token) {
    return env.TURNSTILE_ENFORCE ? { ok: false, reason: 'missing-token' } : { ok: true }
  }

  try {
    const body = new URLSearchParams()
    body.append('secret', env.TURNSTILE_SECRET_KEY)
    body.append('response', token)
    if (remoteIp) body.append('remoteip', remoteIp)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const res = await fetch(SITEVERIFY, {
      method: 'POST',
      body,
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout))

    const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] }

    return data.success
      ? { ok: true }
      : { ok: false, reason: (data['error-codes'] || []).join(',') || 'verification-failed' }
  } catch {
    // Network/timeout — fail closed only when enforcing.
    return env.TURNSTILE_ENFORCE ? { ok: false, reason: 'verification-error' } : { ok: true }
  }
}
