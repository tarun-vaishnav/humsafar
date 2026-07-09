/**
 * TrackingService — public inquiry status lookup.
 *
 * Two-factor lookup: reference + email. No auth required, but the pair must
 * match, so references alone are useless to an attacker.
 */
import env from '@config/env'

const API_URL = env.api.baseUrl || 'http://localhost:3001'

class TrackingServiceImpl {
  /**
   * @param {{ reference: string, email: string }} input
   * @returns {Promise<{ ok: boolean, inquiry?: object, message?: string }>}
   */
  async track({ reference, email }) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), env.api.timeoutMs)
    try {
      const res = await fetch(`${API_URL}/api/inquiries/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, email }),
        signal: controller.signal,
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        return {
          ok: false,
          message:
            body.message ||
            (res.status === 429
              ? 'Too many requests. Please try again shortly.'
              : 'No inquiry found for that reference and email.'),
        }
      }
      return { ok: true, inquiry: body.inquiry }
    } catch (err) {
      const aborted = err?.name === 'AbortError'
      return {
        ok: false,
        message: aborted
          ? 'The request timed out. Please try again.'
          : 'Connection failed. Check your internet and try again.',
      }
    } finally {
      clearTimeout(timeout)
    }
  }
}

export const TrackingService = new TrackingServiceImpl()
export default TrackingService
