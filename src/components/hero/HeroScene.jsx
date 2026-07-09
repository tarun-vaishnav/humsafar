import { useRef, useEffect, useState, useMemo } from 'react'
import { gsap } from '@animations/gsap'

/**
 * HeroScene — Premium travel-inspired animated background.
 *
 * DESIGN PRINCIPLES:
 * ─ Light, warm, inviting — NOT dark, NOT cyber, NOT gaming.
 * ─ Background enhances the experience, never distracts from content.
 * ─ Content first. Product first. Animation second. Background third.
 *
 * Visual elements:
 * ─ Soft topographic contour lines (like a paper map)
 * ─ Elegant railway route curves
 * ─ Subtle floating destination dots
 * ─ Compass-inspired geometry
 * ─ Warm ambient gradients (coral, gold, blue — very subtle)
 * ─ Very slow motion — meditative, not frantic
 */

// ─── Topographic contour paths ──────────────────────────────────────────────
// Organic curves inspired by elevation maps and railway routes
const CONTOUR_PATHS = [
  'M-100,300 C50,280 200,320 400,290 C600,260 750,310 900,285 C1050,260 1200,300 1400,275 C1550,255 1700,290 1950,270',
  'M-50,420 C100,400 280,440 480,410 C680,380 820,430 1000,405 C1180,380 1350,420 1550,395 C1700,375 1850,410 2000,390',
  'M-80,540 C70,520 250,560 450,530 C650,500 800,550 980,525 C1160,500 1320,540 1520,515 C1680,495 1830,530 2000,510',
  'M-120,180 C30,160 210,200 410,170 C610,140 760,190 940,165 C1120,140 1300,180 1500,155 C1660,135 1820,170 2000,150',
  'M-60,660 C90,640 270,680 470,650 C670,620 810,670 990,645 C1170,620 1340,660 1540,635 C1700,615 1860,650 2050,630',
  'M-90,100 C60,80 240,120 440,90 C640,60 780,110 960,85 C1140,60 1310,100 1510,75 C1670,55 1840,90 2020,70',
]

// Subtle floating route dots (like destination markers on a map)
// Sizes are pre-computed to avoid impure Math.random calls during render.
const ROUTE_DOTS = [
  { cx: '15%', cy: '25%', delay: 0, size: 14 },
  { cx: '35%', cy: '45%', delay: 1.5, size: 12 },
  { cx: '55%', cy: '20%', delay: 3, size: 16 },
  { cx: '72%', cy: '55%', delay: 0.8, size: 11 },
  { cx: '88%', cy: '30%', delay: 2.2, size: 15 },
  { cx: '25%', cy: '65%', delay: 4, size: 13 },
  { cx: '65%', cy: '70%', delay: 1.2, size: 10 },
  { cx: '45%', cy: '80%', delay: 3.5, size: 17 },
]

// ─── Compass Rose SVG ───────────────────────────────────────────────────────
function CompassRose({ revealed }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!revealed || !ref.current) return
    gsap.fromTo(ref.current,
      { autoAlpha: 0, scale: 0.8, rotation: -15 },
      { autoAlpha: 1, scale: 1, rotation: 0, duration: 2.5, ease: 'expo.out', delay: 1.2 },
    )
    // Very slow continuous rotation
    gsap.to(ref.current, {
      rotation: 360,
      duration: 120,
      ease: 'none',
      repeat: -1,
    })
  }, [revealed])

  return (
    <div
      ref={ref}
      className="absolute opacity-0"
      style={{
        right: '8%',
        top: '15%',
        width: 'clamp(120px, 15vw, 220px)',
        height: 'clamp(120px, 15vw, 220px)',
      }}
    >
      <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
        {/* Outer ring */}
        <circle cx="100" cy="100" r="90" stroke="rgba(201,160,58,0.08)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="75" stroke="rgba(201,160,58,0.05)" strokeWidth="0.5" />

        {/* Cardinal lines */}
        <line x1="100" y1="15" x2="100" y2="45" stroke="rgba(201,160,58,0.12)" strokeWidth="0.8" />
        <line x1="100" y1="155" x2="100" y2="185" stroke="rgba(201,160,58,0.08)" strokeWidth="0.8" />
        <line x1="15" y1="100" x2="45" y2="100" stroke="rgba(201,160,58,0.08)" strokeWidth="0.8" />
        <line x1="155" y1="100" x2="185" y2="100" stroke="rgba(201,160,58,0.08)" strokeWidth="0.8" />

        {/* Diagonal lines */}
        <line x1="30" y1="30" x2="55" y2="55" stroke="rgba(201,160,58,0.06)" strokeWidth="0.5" />
        <line x1="145" y1="30" x2="170" y2="55" stroke="rgba(201,160,58,0.06)" strokeWidth="0.5" strokeTransform="rotate(90 100 100)" />
        <line x1="170" y1="145" x2="145" y2="170" stroke="rgba(201,160,58,0.06)" strokeWidth="0.5" />
        <line x1="55" y1="145" x2="30" y2="170" stroke="rgba(201,160,58,0.06)" strokeWidth="0.5" />

        {/* N marker */}
        <text x="100" y="12" textAnchor="middle" fill="rgba(201,160,58,0.15)" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="500">N</text>

        {/* Center dot */}
        <circle cx="100" cy="100" r="2" fill="rgba(201,160,58,0.10)" />
        <circle cx="100" cy="100" r="5" stroke="rgba(201,160,58,0.06)" strokeWidth="0.5" fill="none" />

        {/* Degree ticks */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 10) * Math.PI / 180
          const r1 = i % 9 === 0 ? 82 : 86
          const r2 = 90
          return (
            <line
              key={i}
              x1={100 + r1 * Math.sin(angle)}
              y1={100 - r1 * Math.cos(angle)}
              x2={100 + r2 * Math.sin(angle)}
              y2={100 - r2 * Math.cos(angle)}
              stroke={`rgba(201,160,58,${i % 9 === 0 ? 0.10 : 0.05})`}
              strokeWidth={i % 9 === 0 ? 0.8 : 0.4}
            />
          )
        })}
      </svg>
    </div>
  )
}

// ─── Topographic Lines ──────────────────────────────────────────────────────
function TopoLines({ revealed }) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!revealed || !svgRef.current) return
    const paths = svgRef.current.querySelectorAll('.topo-line')
    paths.forEach((path, i) => {
      const len = path.getTotalLength()
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 3 + i * 0.5,
        ease: 'power2.out',
        delay: 0.5 + i * 0.3,
      })
    })
  }, [revealed])

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1920 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {CONTOUR_PATHS.map((d, i) => (
        <path
          key={i}
          className="topo-line"
          d={d}
          stroke={i % 3 === 0 ? 'rgba(232,115,90,0.06)' : i % 3 === 1 ? 'rgba(37,99,235,0.04)' : 'rgba(201,160,58,0.05)'}
          strokeWidth={i % 2 === 0 ? '1' : '0.6'}
          strokeLinecap="round"
          fill="none"
        />
      ))}
    </svg>
  )
}

// ─── Floating Route Dots ────────────────────────────────────────────────────
function FloatingDots({ revealed }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!revealed || !containerRef.current) return
    const dots = containerRef.current.querySelectorAll('.route-dot')
    dots.forEach((dot, i) => {
      const d = ROUTE_DOTS[i]
      // Fade in
      gsap.fromTo(dot,
        { autoAlpha: 0, scale: 0 },
        { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'back.out(2)', delay: 1.5 + (d?.delay || 0) * 0.3 },
      )
      // Gentle floating
      gsap.to(dot, {
        y: `${Math.random() > 0.5 ? '+' : '-'}=${8 + Math.random() * 6}`,
        x: `${Math.random() > 0.5 ? '+' : '-'}=${4 + Math.random() * 4}`,
        duration: 4 + Math.random() * 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: d?.delay || 0,
      })
    })
  }, [revealed])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {ROUTE_DOTS.map((dot, i) => (
        <div
          key={i}
          className="route-dot absolute opacity-0"
          style={{ left: dot.cx, top: dot.cy }}
        >
          {/* Outer ring */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border"
            style={{
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              borderColor: i % 3 === 0 ? 'rgba(232,115,90,0.12)' : i % 3 === 1 ? 'rgba(37,99,235,0.10)' : 'rgba(201,160,58,0.10)',
            }}
          />
          {/* Center dot */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: '3px',
              height: '3px',
              backgroundColor: i % 3 === 0 ? 'rgba(232,115,90,0.20)' : i % 3 === 1 ? 'rgba(37,99,235,0.16)' : 'rgba(201,160,58,0.18)',
            }}
          />
        </div>
      ))}
    </div>
  )
}

// ─── Ambient Gradient Blobs ─────────────────────────────────────────────────
function AmbientGradients({ revealed }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!revealed || !ref.current) return
    gsap.fromTo(ref.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 3, ease: 'power2.out', delay: 0.5 },
    )
    // Very slow drift
    const blobs = ref.current.querySelectorAll('.gradient-blob')
    blobs.forEach((blob, i) => {
      gsap.to(blob, {
        x: `${i % 2 === 0 ? '+' : '-'}=${20 + Math.random() * 20}`,
        y: `${i % 2 === 0 ? '-' : '+'}=${15 + Math.random() * 15}`,
        duration: 20 + Math.random() * 15,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    })
  }, [revealed])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden opacity-0 pointer-events-none">
      {/* Warm coral blob — top left */}
      <div
        className="gradient-blob absolute rounded-full blur-3xl"
        style={{
          width: 'clamp(300px, 40vw, 600px)',
          height: 'clamp(300px, 40vw, 600px)',
          left: '-5%',
          top: '-10%',
          background: 'radial-gradient(circle, rgba(232,115,90,0.05) 0%, transparent 70%)',
        }}
      />
      {/* Travel blue blob — right */}
      <div
        className="gradient-blob absolute rounded-full blur-3xl"
        style={{
          width: 'clamp(250px, 35vw, 500px)',
          height: 'clamp(250px, 35vw, 500px)',
          right: '-8%',
          top: '20%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.03) 0%, transparent 70%)',
        }}
      />
      {/* Golden amber blob — bottom center */}
      <div
        className="gradient-blob absolute rounded-full blur-3xl"
        style={{
          width: 'clamp(200px, 30vw, 450px)',
          height: 'clamp(200px, 30vw, 450px)',
          left: '30%',
          bottom: '-5%',
          background: 'radial-gradient(circle, rgba(201,160,58,0.04) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}

// ─── Railway Route Curve ────────────────────────────────────────────────────
function RailwayCurve({ revealed }) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!revealed || !svgRef.current) return
    const path = svgRef.current.querySelector('.railway-path')
    if (!path) return
    const len = path.getTotalLength()
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 5,
      ease: 'power1.out',
      delay: 1,
    })

    // Animate the station dots
    const dots = svgRef.current.querySelectorAll('.station-dot')
    dots.forEach((dot, i) => {
      gsap.fromTo(dot,
        { scale: 0, transformOrigin: 'center' },
        { scale: 1, duration: 0.6, ease: 'back.out(3)', delay: 2 + i * 0.5 },
      )
    })
  }, [revealed])

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1920 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {/* Main elegant curve */}
      <path
        className="railway-path"
        d="M100,500 C300,480 500,350 700,380 C900,410 1000,300 1200,320 C1400,340 1600,250 1820,280"
        stroke="rgba(232,115,90,0.08)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Secondary route */}
      <path
        className="railway-path"
        d="M200,600 C400,580 600,500 800,520 C1000,540 1200,450 1400,470 C1600,490 1750,400 1900,420"
        stroke="rgba(37,99,235,0.05)"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />

      {/* Station dots along main route */}
      <circle className="station-dot" cx="350" cy="465" r="3" fill="rgba(232,115,90,0.15)" />
      <circle className="station-dot" cx="700" cy="380" r="3" fill="rgba(232,115,90,0.15)" />
      <circle className="station-dot" cx="1050" cy="340" r="3" fill="rgba(232,115,90,0.15)" />
      <circle className="station-dot" cx="1400" cy="335" r="3" fill="rgba(232,115,90,0.15)" />
      <circle className="station-dot" cx="1700" cy="290" r="3" fill="rgba(232,115,90,0.15)" />
    </svg>
  )
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export const HeroScene = ({ onReady, revealed }) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Signal ready immediately — no heavy WebGL to load
    const timer = setTimeout(() => {
      setReady(true)
      onReady?.()
    }, 100)
    return () => clearTimeout(timer)
  }, [onReady])

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FDFCFA 0%, #FAF8F5 30%, #F5F3EE 70%, #EFEDE8 100%)' }}
      aria-hidden="true"
    >
      {/* Subtle paper texture grain */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/></svg>")`,
        }}
      />

      {/* Animated layers — all very subtle, warm, travel-inspired */}
      <AmbientGradients revealed={revealed || ready} />
      <TopoLines revealed={revealed || ready} />
      <RailwayCurve revealed={revealed || ready} />
      <FloatingDots revealed={revealed || ready} />
      <CompassRose revealed={revealed || ready} />
    </div>
  )
}

export default HeroScene
