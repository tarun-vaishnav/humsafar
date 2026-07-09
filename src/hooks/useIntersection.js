import { useEffect, useRef, useState } from 'react'

/**
 * IntersectionObserver hook. Fires with `{ isIntersecting, ratio, entry }` on
 * each observed change.
 *
 * `once: true` unobserves after the first intersection — the common "reveal on
 * enter" pattern.
 */
export const useIntersection = ({
  root = null,
  rootMargin = '0px',
  threshold = 0,
  once = false,
} = {}) => {
  const ref = useRef(null)
  const [state, setState] = useState({ isIntersecting: false, ratio: 0, entry: null })

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setState({
          isIntersecting: entry.isIntersecting,
          ratio: entry.intersectionRatio,
          entry,
        })
        if (once && entry.isIntersecting) observer.unobserve(el)
      },
      { root, rootMargin, threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [root, rootMargin, threshold, once])

  return [ref, state]
}

export default useIntersection
