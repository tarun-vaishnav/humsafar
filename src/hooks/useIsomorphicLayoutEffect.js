import { useEffect, useLayoutEffect } from 'react'

/**
 * `useLayoutEffect` client-side, `useEffect` server-side — silences React's
 * SSR warning while preserving DOM-measurement behavior in the browser.
 */
export const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

export default useIsomorphicLayoutEffect
