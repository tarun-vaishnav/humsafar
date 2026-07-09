import { useEffect, useRef, useState } from 'react'
import { getLenis } from '@animations/scroll'
import { rafThrottle } from '@utils/timing'

/**
 * Global scroll progress (0..1). Sources from Lenis when available, falls back
 * to window scroll math otherwise. `subscribe: false` skips React updates and
 * returns only the ref — use that inside animation loops.
 */
export const useScrollProgress = ({ subscribe = true } = {}) => {
  const [progress, setProgress] = useState(0)
  const ref = useRef(0)

  useEffect(() => {
    const lenis = getLenis()

    const compute = () => {
      if (lenis) return lenis.progress ?? 0
      const scrollTop = window.scrollY
      const height = document.documentElement.scrollHeight - window.innerHeight
      return height > 0 ? scrollTop / height : 0
    }

    const update = rafThrottle(() => {
      const p = compute()
      ref.current = p
      if (subscribe) setProgress(p)
    })

    if (lenis) {
      lenis.on('scroll', update)
      return () => lenis.off('scroll', update)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [subscribe])

  return { progress, ref }
}

export default useScrollProgress
