import { useEffect, useRef, useCallback } from 'react'
import env from '@config/env'

/**
 * Cloudflare Turnstile widget (invisible/managed).
 *
 * Loads the Turnstile script once, renders a widget, and reports tokens back
 * via `onVerify`. If no site key is configured, it renders nothing and calls
 * `onVerify('')` so the form still works in local dev (server enforcement off).
 *
 * Docs: https://developers.cloudflare.com/turnstile/
 */

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
let scriptPromise = null

function loadScript() {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.turnstile) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', reject)
      return
    }
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = reject
    document.head.appendChild(script)
  })
  return scriptPromise
}

export const Turnstile = ({ onVerify, onExpire, className }) => {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)
  const siteKey = env.security.turnstileSiteKey

  const handleVerify = useCallback((token) => onVerify?.(token), [onVerify])
  const handleExpire = useCallback(() => onExpire?.(), [onExpire])

  useEffect(() => {
    // No key configured → allow form to proceed (dev / server not enforcing).
    if (!siteKey) {
      onVerify?.('')
      return
    }

    let cancelled = false
    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: handleVerify,
          'expired-callback': handleExpire,
          'error-callback': handleExpire,
          theme: 'light',
          appearance: 'interaction-only',
        })
      })
      .catch(() => {
        // Script failed to load — don't hard-block the user.
        onVerify?.('')
      })

    return () => {
      cancelled = true
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          /* noop */
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey])

  if (!siteKey) return null
  return <div ref={containerRef} className={className} aria-hidden="true" />
}

export default Turnstile
