import { useRef, useEffect, useCallback } from 'react'
import { gsap } from '@animations/gsap'
import { Button } from '@components/ui'
import { useMagnetic } from '@hooks/useMagnetic'
import { cn } from '@utils/cn'

function SplitWords({ children, className }) {
  const words = typeof children === 'string' ? children.split(' ') : []
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="hero-word inline-block overflow-hidden mr-[0.28em] last:mr-0 pb-[0.18em] -mb-[0.18em]">
          <span className="hero-word-inner inline-block translate-y-[120%]">{word}</span>
        </span>

      ))}
    </span>
  )
}

function ScrollIndicator() {
  return (
    <div className="hero-scroll absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2.5 opacity-0">
      <span className="text-[0.6rem] uppercase tracking-widest text-content-muted font-medium">Scroll</span>
      <div className="relative w-px h-9 overflow-hidden">
        <div className="hero-scroll-line absolute inset-0 w-full bg-gradient-to-b from-brand-500/50 to-transparent origin-top scale-y-0" />
      </div>
    </div>
  )
}

function MagneticCTA({ children, variant = 'primary', href, className, ...rest }) {
  const magRef = useMagnetic({ strength: 0.25, radius: 100 })
  return (
    <Button as="a" href={href} ref={magRef} variant={variant} size="lg" className={cn('hero-btn w-full sm:w-auto', className)} {...rest}>
      {children}
    </Button>
  )
}

export const HeroContent = ({ revealed }) => {
  const containerRef = useRef(null)
  const tlRef = useRef(null)

  const buildTimeline = useCallback(() => {
    const ctx = containerRef.current
    if (!ctx) return null
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
    tl.to(ctx.querySelectorAll('.hero-word-inner'), { y: '0%', duration: 1.4, stagger: 0.07, ease: 'expo.out' }, 0.35)
    tl.fromTo(ctx.querySelectorAll('.hero-artifact'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 1.4, stagger: 0.15 }, 0.6)

    tl.fromTo(ctx.querySelector('.hero-sub'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.1 }, 1.0)
    tl.fromTo(ctx.querySelectorAll('.hero-btn'), { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 }, 1.25)
    tl.fromTo(ctx.querySelector('.hero-trust'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1 }, 1.55)
    tl.to(ctx.querySelector('.hero-scroll'), { autoAlpha: 1, duration: 0.8 }, 1.9)
    tl.to(ctx.querySelector('.hero-scroll-line'), { scaleY: 1, duration: 1.8, ease: 'power2.inOut', repeat: -1, yoyo: true }, 2.1)
    return tl
  }, [])

  useEffect(() => {
    tlRef.current = buildTimeline()
    return () => { tlRef.current?.kill(); tlRef.current = null }
  }, [buildTimeline])

  useEffect(() => {
    if (revealed && tlRef.current) tlRef.current.play()
  }, [revealed])

  return (
    <div
      id="top"
      ref={containerRef}
      className="relative z-raised flex min-h-[100svh] flex-col items-center justify-center px-5 sm:px-gutter pt-28 pb-24 md:pt-32 md:pb-28 text-center pointer-events-none select-none"
    >
      {/* Floating travel artifacts — decorative, drift gently behind the copy */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Dashed route arc, top-left */}
        <svg className="hero-artifact invisible absolute left-[6%] top-[20%] w-40 h-40 text-brand-400/40 animate-hero-float" style={{ animationDelay: '0s' }} viewBox="0 0 120 120" fill="none">
          <path d="M8 96 C 40 20, 80 20, 112 72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-route-dash" />
          <circle cx="8" cy="96" r="4" fill="currentColor" />
          <circle cx="112" cy="72" r="4" fill="currentColor" />
        </svg>

        {/* Location pin, top-right */}
        <svg className="hero-artifact invisible absolute right-[9%] top-[24%] w-10 h-10 text-golden-500/50 animate-hero-float" style={{ animationDelay: '1.2s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.4" />
        </svg>

        {/* Compass-ish ring, bottom-left */}
        <svg className="hero-artifact invisible absolute left-[12%] bottom-[22%] w-12 h-12 text-accent-500/40 animate-hero-float" style={{ animationDelay: '0.6s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="12" cy="12" r="9" />
          <path d="M15.5 8.5 13 13l-4.5 2.5L11 11l4.5-2.5Z" fill="currentColor" stroke="none" />
        </svg>

        {/* Paper-plane, bottom-right */}
        <svg className="hero-artifact invisible absolute right-[13%] bottom-[26%] w-9 h-9 text-brand-500/45 animate-hero-float" style={{ animationDelay: '1.8s' }} viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>


      {/* Headline — sized so it never crowds the nav */}

      <h1 className="font-display font-light text-content-primary max-w-[16ch] leading-[0.95] tracking-[-0.035em] text-[clamp(2.6rem,7vw,6.25rem)]">
        <SplitWords>Every journey begins with a single step.</SplitWords>
      </h1>

      <p className="hero-sub invisible mt-7 md:mt-9 max-w-md sm:max-w-lg text-base sm:text-lg md:text-xl text-content-tertiary leading-relaxed font-light">
        Compare trains and buses across the country, plan the perfect route, and
        travel with confidence — backed by real human support.
      </p>

      {/* CTAs */}
      <div className="mt-9 md:mt-11 flex w-full sm:w-auto flex-col sm:flex-row items-center justify-center gap-3.5 pointer-events-auto max-w-sm sm:max-w-none">
        <MagneticCTA variant="primary" href="#search">Search Journeys</MagneticCTA>
        <MagneticCTA variant="ghost" href="#routes">Explore Routes</MagneticCTA>
      </div>

      {/* Trust strip */}
      <div className="hero-trust invisible mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2.5 text-xs text-content-muted font-medium">
        {['150+ cities', 'Trains & buses', 'Human booking support'].map((t) => (
          <span key={t} className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400/60" />
            {t}
          </span>
        ))}
      </div>

      <ScrollIndicator />
    </div>
  )
}

export default HeroContent
