import { useEffect, useRef } from 'react'
import { gsap } from '@animations/gsap'
import { isPointerFine, prefersReducedMotion } from '@utils/device'
import { cn } from '@utils/cn'

/**
 * Custom cursor — warm, subtle ring that trails the pointer.
 *
 * DESIGN SYSTEM: Warm coral tint. NO mix-blend-difference (causes cyber/invert
 * effects). Gentle, premium feel.
 *
 * Renders nothing on touch or reduced-motion.
 */
export const Cursor = ({ className }) => {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (!isPointerFine() || prefersReducedMotion()) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const setDotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' })
    const setDotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' })
    const setRingX = gsap.quickTo(ring, 'x', { duration: 0.4, ease: 'power3.out' })
    const setRingY = gsap.quickTo(ring, 'y', { duration: 0.4, ease: 'power3.out' })

    const onMove = (e) => {
      setDotX(e.clientX)
      setDotY(e.clientY)
      setRingX(e.clientX)
      setRingY(e.clientY)
    }

    const grow = () => gsap.to(ring, { scale: 2.2, opacity: 0.15, duration: 0.35, ease: 'power3.out' })
    const shrink = () => gsap.to(ring, { scale: 1, opacity: 0.25, duration: 0.35, ease: 'power3.out' })

    const onOver = (e) => {
      if (e.target.closest?.('[data-cursor="hover"], a, button')) grow()
    }
    const onOut = (e) => {
      if (e.target.closest?.('[data-cursor="hover"], a, button')) shrink()
    }

    document.body.classList.add('has-custom-cursor')
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerout', onOut)

    return () => {
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
    }
  }, [])

  return (
    <>
      {/* Outer ring — warm coral tint, NO mix-blend-difference */}
      <div
        ref={ringRef}
        aria-hidden
        className={cn(
          'pointer-events-none fixed left-0 top-0 z-cursor -translate-x-1/2 -translate-y-1/2',
          'h-9 w-9 rounded-full border border-brand-500/25 opacity-25',
          className,
        )}
      />
      {/* Center dot */}
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-cursor -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-brand-500/40"
      />
    </>
  )
}

export default Cursor
