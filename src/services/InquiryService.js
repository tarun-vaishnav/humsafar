/**
 * InquiryService — submits booking inquiries to the HumSafar API.
 *
 * - Sends JSON to POST /api/inquiries.
 * - Aborts on timeout so the UI never hangs.
 * - Normalizes server responses into a predictable shape for the UI.
 */
import env from '@config/env'

const API_URL = env.api.baseUrl || 'http://localhost:3001'

class InquiryServiceImpl {
  /**
   * @param {object} payload  Inquiry fields (already trimmed by the form).
   * @param {object} [opts]
   * @param {string} [opts.turnstileToken]  Cloudflare Turnstile token.
   * @param {string} [opts.honeypot]        Hidden field — must be empty.
   * @returns {Promise<{ ok: boolean, reference?: string, message?: string,
   *   error?: string, fieldError?: string, status?: number }>}
   */
  async submit(payload, { turnstileToken, honeypot = '' } = {}) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), env.api.timeoutMs)

    try {
      const res = await fetch(`${API_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          turnstileToken,
          company: honeypot, // server-side honeypot field name
        }),
        signal: controller.signal,
      })

      const body = await res.json().catch(() => ({}))

      if (!res.ok) {
        return {
          ok: false,
          status: res.status,
          error: body.error || 'server_error',
          message:
            body.message ||
            (res.status === 429
              ? 'Too many requests. Please try again in a little while.'
              : 'Something went wrong. Please try again.'),
        }
      }

      return { ok: true, reference: body.reference, message: body.message }
    } catch (err) {
      const aborted = err?.name === 'AbortError'
      return {
        ok: false,
        error: aborted ? 'timeout' : 'network_error',
        message: aborted
          ? 'The request timed out. Please check your connection and try again.'
          : 'Connection failed. Check your internet and try again.',
      }
    } finally {
      clearTimeout(timeout)
    }
  }
}

export const InquiryService = new InquiryServiceImpl()
export default InquiryService
