import { useRef, useEffect, useState, useCallback } from 'react'
import { gsap } from '@animations/gsap'
import { useMagnetic } from '@hooks/useMagnetic'
import { cn } from '@utils/cn'

const NAV_LINKS = [
  { label: 'Search', href: '#search' },
  { label: 'Routes', href: '#routes' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Book', href: '#inquiry' },
  { label: 'Track', href: '/track' },
]


/* HumSafar mark — a location pin holding two companions (hum-safar =
   fellow travellers) journeying to one shared destination. */
function BrandMark({ compact }) {
  const size = compact ? 34 : 38
  return (
    <span
      className="relative grid flex-shrink-0 place-items-center rounded-2xl transition-transform duration-500 group-hover:scale-105"
      style={{ width: size, height: size }}
    >
      <span
        className="absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,#E8735A_0%,#C9A03A_100%)] shadow-[0_6px_18px_-6px_rgba(232,115,90,0.6)] transition-shadow duration-500 group-hover:shadow-[0_8px_22px_-6px_rgba(232,115,90,0.8)]"
        aria-hidden="true"
      />
      <svg className="relative" width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2.5c-3.7 0-6.7 3-6.7 6.7 0 4.5 5.2 9.6 6.7 11.3 1.5-1.7 6.7-6.8 6.7-11.3 0-3.7-3-6.7-6.7-6.7Z" fill="white" />
        <circle cx="9.5" cy="9" r="1.7" fill="#E8735A" />
        <circle cx="14.5" cy="9" r="1.7" fill="#C9A03A" />
        <path d="M8.4 13.2c.9-1 2.3-1 3.6-1s2.7 0 3.6 1" stroke="#E8735A" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </span>
  )
}


function Wordmark({ compact }) {
  return (
    <span className="flex flex-col justify-center leading-none">
      <span className={cn('font-display font-semibold tracking-[-0.02em] transition-all duration-500', compact ? 'text-lg' : 'text-xl')}>
        <span className="text-content-primary">Hum</span>
        <span className="text-brand-500">Safar</span>
      </span>
      <span className={cn('hidden sm:block uppercase tracking-[0.26em] text-content-muted leading-none transition-all duration-500', compact ? 'text-[0.5rem] mt-1' : 'text-[0.55rem] mt-1.5')}>
        Rail &amp; Road · India
      </span>
    </span>
  )
}

function NavLink({ href, children, onClick }) {
  const magRef = useMagnetic({ strength: 0.15, radius: 60 })
  return (
    <a
      ref={magRef}
      href={href}
      onClick={onClick}
      className="group/link relative px-4 py-2 text-[0.72rem] uppercase tracking-[0.14em] font-semibold text-content-tertiary transition-colors duration-300 hover:text-content-primary"
    >
      {children}
      <span className="absolute -bottom-0.5 left-1/2 h-px w-0 -translate-x-1/2 bg-brand-500 transition-all duration-400 group-hover/link:w-2/3" />
    </a>
  )
}

export const Navigation = () => {
  const navRef = useRef(null)
  const ctaRef = useMagnetic({ strength: 0.2, radius: 80 })
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2600)
    return () => clearTimeout(t)
  }, [])

  const handleScroll = useCallback(() => setScrolled(window.scrollY > 40), [])
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (!visible || !navRef.current) return
    gsap.fromTo(navRef.current, { autoAlpha: 0, y: -18 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out' })
  }, [visible])

  const compact = scrolled || menuOpen

  return (
    <nav
      ref={navRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-header invisible transition-all duration-500',
        compact
          ? 'py-2.5 bg-white/80 backdrop-blur-2xl border-b border-content-primary/[0.06] shadow-[0_4px_30px_-12px_rgba(42,39,34,0.14)]'
          : 'py-4 md:py-5 bg-transparent border-b border-transparent',
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-container items-center justify-between gap-4 px-5 md:px-10 lg:px-14">
        {/* Brand */}
        <a href="#top" className="group flex items-center gap-2.5" aria-label="HumSafar — Home">
          <BrandMark compact={compact} />
          <Wordmark compact={compact} />
        </a>

        {/* Center links (desktop) */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.label} href={l.href}>{l.label}</NavLink>
          ))}
        </div>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3">
          <a
            ref={ctaRef}
            href="#contact"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-content-primary px-5 py-2.5 text-[0.72rem] uppercase tracking-[0.14em] font-semibold text-white transition-all duration-400 hover:bg-brand-500 hover:shadow-[0_10px_26px_-8px_rgba(217,95,74,0.6)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-300" />
            Contact
          </a>

          {/* Hamburger (mobile / tablet) */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="lg:hidden grid place-items-center h-10 w-10 rounded-full border border-content-primary/10 bg-white/70 backdrop-blur-md text-content-primary transition-colors duration-300 hover:border-brand-400/50"
          >
            <span className="relative block h-3.5 w-5">
              <span className={cn('absolute left-0 h-0.5 w-full rounded-full bg-current transition-all duration-300', menuOpen ? 'top-1.5 rotate-45' : 'top-0')} />
              <span className={cn('absolute left-0 top-1.5 h-0.5 w-full rounded-full bg-current transition-all duration-300', menuOpen ? 'opacity-0' : 'opacity-100')} />
              <span className={cn('absolute left-0 h-0.5 w-full rounded-full bg-current transition-all duration-300', menuOpen ? 'top-1.5 -rotate-45' : 'top-3')} />
            </span>

          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={cn(
          'lg:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="mx-auto max-w-container px-5 md:px-10 pb-6 pt-2 flex flex-col gap-1">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-content-secondary transition-colors duration-300 hover:bg-brand-50 hover:text-brand-600"
            >
              {l.label}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-content-primary px-5 py-3.5 text-[0.72rem] uppercase tracking-[0.14em] font-semibold text-white"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-300" />
            Contact Us
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
