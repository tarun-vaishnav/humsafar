import { useRef, useEffect, useState, useCallback } from 'react'
import { gsap } from '@animations/gsap'

/**
 * HumSafar Preloader — "The Journey Writes Itself"
 * ═════════════════════════════════════════════════
 *
 *   1. A bold 3D-tilted route line draws slowly across a map-like stage while a
 *      glowing train head runs along it and station nodes light up.
 *   2. The compass monogram assembles at the destination with a soft pulse.
 *   3. "HumSafar" is WRITTEN in calligraphy — a pen nib glides left-to-right and
 *      the script is revealed in its wake (clip-path wipe), "Safar" in coral.
 *   4. A hairline gradient progress bar tracks real page-load (props.ready).
 *   5. Exit: the scene lifts and dissolves upward into the hero.
 *
 * Timing is deliberately unhurried, with a MIN_DISPLAY floor so the animation is
 * always fully seen even on fast connections. Respects prefers-reduced-motion.
 */

const MIN_DISPLAY_MS = 5200 // never exit before the story has played out

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

// Map-like route across a 340×140 stage.
const ROUTE_D = 'M24 104 C 90 104, 100 40, 170 48 S 254 108, 316 34'
const STATIONS = [
  { cx: 24, cy: 104 },
  { cx: 170, cy: 48 },
  { cx: 316, cy: 34 },
]

export const Preloader = ({ ready, onComplete }) => {
  const containerRef = useRef(null)
  const stageRef = useRef(null)
  const routeRef = useRef(null)
  const trainRef = useRef(null)
  const stationsRef = useRef([])
  const monogramRef = useRef(null)
  const wordRef = useRef(null)
  const penRef = useRef(null)
  const taglineRef = useRef(null)
  const barRef = useRef(null)
  const masterTl = useRef(null)
  const mountedAt = useRef(0)

  const [progress, setProgress] = useState(0)
  const completedRef = useRef(false)

  useEffect(() => {
    mountedAt.current = Date.now()
  }, [])


  /* ── Entrance ─────────────────────────────────────────── */
  useEffect(() => {
    const reduced = prefersReducedMotion()
    const route = routeRef.current
    const train = trainRef.current
    const monogram = monogramRef.current
    const word = wordRef.current
    const pen = penRef.current
    const tagline = taglineRef.current
    const stations = stationsRef.current.filter(Boolean)
    if (!route || !word) return

    const routeLen = route.getTotalLength()

    gsap.set(route, { strokeDasharray: routeLen, strokeDashoffset: routeLen })
    gsap.set(stations, { scale: 0, transformOrigin: 'center', opacity: 0 })
    gsap.set(monogram, { autoAlpha: 0, scale: 0.5, y: -8 })
    gsap.set(word, { clipPath: 'inset(0 100% 0 0)' })
    gsap.set(pen, { autoAlpha: 0, x: 0 })
    if (tagline) gsap.set(tagline, { autoAlpha: 0, y: 8 })
    if (train) gsap.set(train, { autoAlpha: 0 })

    if (reduced) {
      gsap.set(route, { strokeDashoffset: 0 })
      gsap.set(stations, { scale: 1, opacity: 1 })
      gsap.set(monogram, { autoAlpha: 1, scale: 1, y: 0 })
      gsap.set(word, { clipPath: 'inset(0 0% 0 0)' })
      if (tagline) gsap.set(tagline, { autoAlpha: 1, y: 0 })
      return
    }

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

    // Slow, deliberate route draw
    tl.to(route, { strokeDashoffset: 0, duration: 2.6, ease: 'power1.inOut' }, 0.3)

    // Stations light up as the line passes
    stations.forEach((s, i) => {
      tl.to(s, { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(3)' }, 0.6 + i * 0.85)
    })

    // Monogram assembles at destination
    tl.to(monogram, { autoAlpha: 1, scale: 1, y: 0, duration: 1.0, ease: 'back.out(1.8)' }, 2.9)
    tl.to(monogram, { scale: 1.12, duration: 0.32, yoyo: true, repeat: 1, ease: 'power2.out' }, 3.7)

    // Calligraphy writes itself: pen glides in, script revealed in its wake
    const wordWidth = word.getBoundingClientRect().width || 260
    tl.set(pen, { autoAlpha: 1, x: 0 }, 3.5)
    tl.to(word, { clipPath: 'inset(0 0% 0 0)', duration: 1.9, ease: 'power1.inOut' }, 3.5)
    tl.to(pen, { x: wordWidth, duration: 1.9, ease: 'power1.inOut' }, 3.5)
    tl.to(pen, { autoAlpha: 0, duration: 0.4 }, 5.4)

    // Tagline
    if (tagline) tl.to(tagline, { autoAlpha: 1, y: 0, duration: 0.7 }, 5.4)

    // Gentle float loop on the stage
    tl.to(stageRef.current, { y: -7, duration: 2.4, ease: 'sine.inOut', repeat: -1, yoyo: true }, 5.6)

    masterTl.current = tl
    return () => tl.kill()
  }, [])

  /* Train head glides along the route (plugin-free) */
  useEffect(() => {
    if (prefersReducedMotion()) return
    const route = routeRef.current
    const train = trainRef.current
    if (!route || !train) return
    const len = route.getTotalLength()
    const obj = { t: 0 }
    gsap.set(train, { autoAlpha: 1 })
    const tween = gsap.to(obj, {
      t: 1,
      duration: 2.6,
      delay: 0.3,
      ease: 'power1.inOut',
      onUpdate: () => {
        const p = route.getPointAtLength(obj.t * len)
        gsap.set(train, { attr: { cx: p.x, cy: p.y } })
      },
      onComplete: () => gsap.to(train, { autoAlpha: 0, duration: 0.5 }),
    })
    return () => tween.kill()
  }, [])

  /* ── Progress tied to real ready state (paced to MIN_DISPLAY) ── */
  useEffect(() => {
    if (progress >= 100) return
    const elapsed = Date.now() - mountedAt.current
    const floor = Math.min(96, (elapsed / MIN_DISPLAY_MS) * 100)
    // progress can't outrun the story; only hits 100 once ready AND min time passed
    const canFinish = ready && elapsed >= MIN_DISPLAY_MS
    const target = canFinish ? 100 : Math.min(progress + Math.random() * 6 + 3, floor)
    const delay = 200 + Math.random() * 160
    const timer = setTimeout(() => setProgress(Math.round(Math.max(progress, target))), delay)
    return () => clearTimeout(timer)
  }, [progress, ready])

  useEffect(() => {
    if (barRef.current) gsap.to(barRef.current, { scaleX: progress / 100, duration: 0.6, ease: 'power2.out' })
  }, [progress])

  /* ── Exit ─────────────────────────────────────────────── */
  const handleExit = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    const reduced = prefersReducedMotion()
    const container = containerRef.current
    const stage = stageRef.current
    if (!container) { onComplete?.(); return }
    masterTl.current?.kill()

    if (reduced) {
      gsap.set(container, { autoAlpha: 0 })
      onComplete?.()
      return
    }

    const tl = gsap.timeline({ onComplete: () => onComplete?.() })
    tl.to(stage, { y: -34, scale: 1.06, autoAlpha: 0, duration: 0.8, ease: 'power3.in' }, 0)
    tl.to(container, { autoAlpha: 0, duration: 0.7, ease: 'power2.inOut' }, 0.4)
    tl.to(container, { yPercent: -100, duration: 0.8, ease: 'expo.inOut' }, 0.45)
  }, [onComplete])

  useEffect(() => {
    if (progress >= 100 && ready && !completedRef.current) {
      const timer = setTimeout(handleExit, 650)
      return () => clearTimeout(timer)
    }
  }, [progress, ready, handleExit])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-loader flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_35%,#FFFFFF_0%,#FAFAF8_45%,#F3EEE4_100%)]"
      role="status"
      aria-label="Loading HumSafar"
      aria-live="polite"
    >
      {/* Ambient warm glow */}
      <div className="pointer-events-none absolute h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(232,115,90,0.12)_0%,transparent_65%)] blur-2xl" aria-hidden="true" />

      <div ref={stageRef} className="relative flex flex-col items-center px-6" style={{ willChange: 'transform, opacity' }}>
        {/* 3D route stage */}
        <div style={{ perspective: '1000px' }}>
          <div style={{ transform: 'rotateX(42deg)', transformStyle: 'preserve-3d' }}>
            <svg width="340" height="140" viewBox="0 0 340 140" fill="none" aria-hidden="true" className="w-[80vw] max-w-[340px] h-auto drop-shadow-[0_22px_28px_rgba(232,115,90,0.22)]">
              {/* dashed base track */}
              <path d={ROUTE_D} stroke="rgba(232,115,90,0.22)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 9" />
              {/* drawn route — bold */}
              <path ref={routeRef} d={ROUTE_D} stroke="url(#routeGrad)" strokeWidth="4.5" strokeLinecap="round" style={{ willChange: 'stroke-dashoffset' }} />
              {/* station nodes */}
              {STATIONS.map((s, i) => (
                <g key={i} ref={(el) => (stationsRef.current[i] = el)}>
                  <circle cx={s.cx} cy={s.cy} r="8" fill="white" stroke="#E8735A" strokeWidth="3" />
                  <circle cx={s.cx} cy={s.cy} r="3" fill="#C44B3A" />
                </g>
              ))}
              {/* moving train head */}
              <circle ref={trainRef} r="6" fill="#C44B3A" className="drop-shadow-[0_0_10px_rgba(232,115,90,1)]" />
              <defs>
                <linearGradient id="routeGrad" x1="0" y1="0" x2="340" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E8735A" />
                  <stop offset="1" stopColor="#C9A03A" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Compass monogram */}
        <div ref={monogramRef} className="-mt-3 grid place-items-center h-16 w-16 rounded-3xl bg-[linear-gradient(135deg,#E8735A_0%,#C9A03A_100%)] shadow-[0_12px_34px_-8px_rgba(232,115,90,0.65)]" style={{ willChange: 'transform, opacity' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2.5c-3.7 0-6.7 3-6.7 6.7 0 4.5 5.2 9.6 6.7 11.3 1.5-1.7 6.7-6.8 6.7-11.3 0-3.7-3-6.7-6.7-6.7Z" fill="white" />
            <circle cx="9.5" cy="9" r="1.7" fill="#E8735A" />
            <circle cx="14.5" cy="9" r="1.7" fill="#C9A03A" />
            <path d="M8.4 13.2c.9-1 2.3-1 3.6-1s2.7 0 3.6 1" stroke="#E8735A" strokeWidth="1.4" strokeLinecap="round" />
          </svg>

        </div>

        {/* Calligraphy wordmark — written by the pen */}
        <div className="relative mt-6">
          <div
            ref={wordRef}
            className="whitespace-nowrap text-[clamp(3rem,11vw,5rem)] leading-[1.35] px-[0.15em] py-[0.1em]"
            style={{ fontFamily: "'Great Vibes', cursive", willChange: 'clip-path' }}
            aria-hidden="true"
          >
            <span className="text-content-primary">Hum</span>
            <span className="text-brand-500">Safar</span>
          </div>

          {/* pen nib */}
          <span
            ref={penRef}
            className="absolute top-0 left-0 -ml-1 text-brand-600"
            style={{ willChange: 'transform, opacity' }}
            aria-hidden="true"
          >
            <svg width="22" height="30" viewBox="0 0 22 30" fill="none">
              <path d="M11 2 L18 22 L11 27 L4 22 Z" fill="#C44B3A" />
              <path d="M11 27 L11 30" stroke="#C44B3A" strokeWidth="2" strokeLinecap="round" />
              <circle cx="11" cy="20" r="1.6" fill="white" />
            </svg>
          </span>
        </div>

        <p ref={taglineRef} className="mt-3 text-[0.62rem] uppercase tracking-[0.34em] text-content-muted font-medium">
          Rail &amp; Road · India
        </p>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-12 flex flex-col items-center gap-3 w-56 max-w-[70vw]">
        <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-content-primary/10">
          <div ref={barRef} className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 rounded-full bg-[linear-gradient(90deg,#E8735A_0%,#C9A03A_100%)]" />
        </div>
        <span className="text-[0.65rem] tabular-nums tracking-widest text-content-muted font-light">{progress}%</span>
      </div>

      <div className="sr-only" aria-live="polite">Loading: {progress}% complete</div>
    </div>
  )
}

export default Preloader
