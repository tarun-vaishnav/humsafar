import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from '@animations/gsap'

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * React 19–friendly GSAP context hook.
 *
 * All tweens created inside the callback are auto-scoped to the returned ref
 * and reverted on cleanup — no orphan ScrollTriggers, no double-play on
 * StrictMode remounts.
 *
 * Usage:
 *   const ref = useGSAP((ctx) => {
 *     gsap.from(ref.current.querySelector('.title'), { y: 40, autoAlpha: 0 })
 *   }, [deps])
 */
export const useGSAP = (setup, deps = []) => {
  const scopeRef = useRef(null)
  const setupRef = useRef(setup)

  // Keep the latest callback in a ref without touching it during render.
  useIso(() => {
    setupRef.current = setup
  }, [setup])

  useIso(() => {
    const ctx = gsap.context(() => setupRef.current?.(scopeRef.current), scopeRef)
    return () => ctx.revert()
  }, deps)

  return scopeRef
}

export default useGSAP
