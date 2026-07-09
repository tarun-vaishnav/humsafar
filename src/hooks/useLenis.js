import { useEffect, useState } from 'react'
import { getLenis } from '@animations/scroll'

/**
 * Access the global Lenis instance. Returns `null` if smooth scroll is
 * disabled (reduced-motion / feature-flag off).
 *
 * The instance is resolved lazily so components mounted before ScrollProvider
 * settles still get a live reference on the next microtask.
 */
export const useLenis = () => {
  const [lenis, setLenis] = useState(() => getLenis())

  useEffect(() => {
    if (lenis) return
    // Retry once on next tick — ScrollProvider mounts synchronously but the
    // singleton may not exist yet if this hook ran during the same render pass.
    const id = requestAnimationFrame(() => setLenis(getLenis()))
    return () => cancelAnimationFrame(id)
  }, [lenis])

  return lenis
}

export default useLenis
