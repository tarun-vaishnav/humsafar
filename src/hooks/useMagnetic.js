import { useEffect, useRef } from 'react'
import { gsap } from '@animations/gsap'
import { isPointerFine, prefersReducedMotion } from '@utils/device'
import { gsapEasing } from '@styles/tokens'

/**
 * Attach a magnetic hover effect: the element eases toward the pointer within
 * `radius` px, then springs back on leave.
 *
 * No-op on touch devices and when reduced-motion is preferred.
 */
export const useMagnetic = ({ strength = 0.35, radius = 120, ease = gsapEasing.smooth } = {}) => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !isPointerFine() || prefersReducedMotion()) return

    const setX = gsap.quickTo(el, 'x', { duration: 0.6, ease })
    const setY = gsap.quickTo(el, 'y', { duration: 0.6, ease })

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      if (dist > radius) {
        setX(0)
        setY(0)
        return
      }
      setX(dx * strength)
      setY(dy * strength)
    }

    const onLeave = () => {
      setX(0)
      setY(0)
    }

    // Listen at window level so the pointer can be tracked before it enters —
    // the actual magnetic engagement is gated by the `radius` check.
    window.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.set(el, { x: 0, y: 0 })
    }
  }, [strength, radius, ease])

  return ref
}

export default useMagnetic
