import { useSyncExternalStore } from 'react'

/**
 * Subscribe to a CSS media query using React 19's official external-store hook.
 * SSR-safe — the server snapshot is always `false`, matching before hydration.
 */
const noop = () => () => {}
const falseSnapshot = () => false

export const useMediaQuery = (query) => {
  const subscribe = (callback) => {
    if (typeof window === 'undefined' || !window.matchMedia) return () => {}
    const mql = window.matchMedia(query)
    mql.addEventListener('change', callback)
    return () => mql.removeEventListener('change', callback)
  }
  const getSnapshot = () => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia(query).matches
  }
  // Second `subscribe`/snapshot arg is the SSR pair — always false server-side.
  return useSyncExternalStore(
    typeof window === 'undefined' ? noop : subscribe,
    getSnapshot,
    falseSnapshot,
  )
}

export default useMediaQuery
