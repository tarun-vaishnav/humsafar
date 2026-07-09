import { createContext, useContext, useMemo } from 'react'
import { MotionConfig, LazyMotion, domAnimation } from 'framer-motion'
import { useReducedMotion } from '@hooks/useReducedMotion'
import { duration } from '@styles/tokens'

/**
 * Global motion configuration:
 *
 * — `LazyMotion` defers Framer's animation engine into a code-split chunk so
 *   the initial JS bundle stays lean.
 * — `MotionConfig.reducedMotion` is set from the OS preference, keeping every
 *   `motion` element accessible without per-instance guards.
 * — A React context publishes `reducedMotion` so non-Framer animations can
 *   subscribe without reading `matchMedia` themselves.
 */
const MotionContext = createContext({ reducedMotion: false })

// eslint-disable-next-line react-refresh/only-export-components
export const useMotionContext = () => useContext(MotionContext)

// Convert token easing to Framer's cubic-bezier array format where possible.
const framerEase = [0.22, 1, 0.36, 1]

export const MotionProvider = ({ children }) => {
  // `useReducedMotion` is backed by `useSyncExternalStore` — no in-effect
  // setState, and it stays consistent through StrictMode double-invocation.
  const reduced = useReducedMotion()

  const value = useMemo(() => ({ reducedMotion: reduced }), [reduced])

  return (
    <MotionContext.Provider value={value}>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig
          reducedMotion={reduced ? 'always' : 'never'}
          transition={{
            duration: parseFloat(duration.smooth) / 1000 || 0.6,
            ease: framerEase,
          }}
        >
          {children}
        </MotionConfig>
      </LazyMotion>
    </MotionContext.Provider>
  )
}

export default MotionProvider
