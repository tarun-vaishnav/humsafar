import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@animations/gsap'
import { prefersReducedMotion } from '@utils/device'

/**
 * Scroll-linked parallax. Positive `speed` moves the element opposite scroll
 * direction (feels closer to the viewer); negative feels farther away.
 *
 * `axis` — 'y' (default) or 'x'.
 */
export const useParallax = ({ speed = 0.3, axis = 'y', scrub = true } = {}) => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const distance = 100 * speed // vh-ish translation across the trigger window
    const tween = gsap.fromTo(
      el,
      { [axis]: -distance },
      {
        [axis]: distance,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub,
        },
      },
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      ScrollTrigger.refresh()
    }
  }, [speed, axis, scrub])

  return ref
}

export default useParallax
