import { useEffect } from 'react'
import { initScroll, destroyScroll } from '@animations/scroll'
import { refreshScroll } from '@animations/helpers'

/**
 * Mounts the global Lenis instance and wires it into GSAP's ticker.
 * Also refreshes ScrollTrigger on font-load and initial paint so scrubbed
 * timelines snap to correct positions.
 */
export const ScrollProvider = ({ children }) => {
  useEffect(() => {
    initScroll()

    // Ensure trigger positions match final layout after fonts swap.
    const refreshOnFont = () => refreshScroll()
    if (document.fonts?.ready) {
      document.fonts.ready.then(refreshOnFont)
    }

    // Nudge once after the initial paint settles.
    const t = window.setTimeout(refreshScroll, 200)

    return () => {
      window.clearTimeout(t)
      destroyScroll()
    }
  }, [])

  return children
}

export default ScrollProvider
