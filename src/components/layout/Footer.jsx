import { useRef, useEffect } from 'react'
import { gsap } from '@animations/gsap'

/**
 * Site footer — an editorial "departure board" closing to the page.
 *
 * Built around a warm temple/holy-place backdrop with a deep charcoal overlay so
 * the palette stays on-brand (coral + gold on warm black, never pure black) and
 * the content stays legible. A dotted route-line motif nods to the rail/road
 * theme, and every interactive element animates with the site's expo easing.
 *
 * NOTE: the design system exposes NO `neutral-*` Tailwind scale — dark values
 * are set with explicit warm-black hex so the scrim actually renders.
 */

// Editorial backdrop — a Hindu temple / holy place (Varanasi ghats at dawn).
const FOOTER_BG =
  'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1920&q=60'

const INK = '#1A1815' // warm black (palette.neutral.950)

const LINK_GROUPS = [
  {
    title: 'Explore',
    links: [
      { label: 'Search Journeys', href: '#search' },
      { label: 'Popular Routes', href: '#routes' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Book Now', href: '#inquiry' },
      { label: 'Track Inquiry', href: '/track' },
    ],
  },
  {
    title: 'Travel',
    links: [
      { label: 'Trains', href: '#search' },
      { label: 'Buses', href: '#search' },
      { label: 'Destinations', href: '#routes' },
      { label: 'Group Bookings', href: '#inquiry' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Contact', href: '#contact' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
    ],
  },
]

const SOCIALS = [
  { label: 'Instagram', href: '#', path: 'M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.2 1 .5 1.4 1 .5.4.8.8 1 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.5.5-.9.8-1.5 1-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.5-.5-.8-.9-1-1.5-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.5-.5.9-.8 1.5-1 .4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zM12 6.5A5.5 5.5 0 1012 17.5 5.5 5.5 0 0012 6.5zm0 9a3.5 3.5 0 110-7 3.5 3.5 0 010 7zm5.7-9.2a1.3 1.3 0 11-2.6 0 1.3 1.3 0 012.6 0z' },
  { label: 'Twitter', href: '#', path: 'M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 00-7 3.7A11.6 11.6 0 013.4 4.6a4.1 4.1 0 001.3 5.5c-.7 0-1.3-.2-1.9-.5v.05a4.1 4.1 0 003.3 4 4.1 4.1 0 01-1.8.07 4.1 4.1 0 003.8 2.8A8.2 8.2 0 012 18.3a11.6 11.6 0 006.3 1.8c7.5 0 11.6-6.2 11.6-11.6v-.5c.8-.6 1.5-1.3 2.1-2.1z' },
  { label: 'Facebook', href: '#', path: 'M22 12a10 10 0 10-11.6 9.9v-7h-2.5V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0022 12z' },
]

const TRUST = [
  { t: '150+ Cities', s: 'Across India', d: 'M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7Zm0 9a2 2 0 110-4 2 2 0 010 4Z' },
  { t: 'Real Humans', s: 'No bots, ever', d: 'M12 12a5 5 0 100-10 5 5 0 000 10Zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6Z' },
  { t: 'Secure', s: 'Trusted booking', d: 'M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4Z' },
  { t: 'Best Fares', s: 'Compare & save', d: 'M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
]

export const Footer = () => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const tweens = []

    // Staggered rise for each block.
    tweens.push(gsap.fromTo(
      el.querySelectorAll('.footer-reveal'),
      { autoAlpha: 0, y: 34 },
      {
        autoAlpha: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09,
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
      },
    ))

    // Route line "draws" itself as the footer enters.
    const dash = el.querySelector('.route-dash')
    if (dash) {
      const len = dash.getTotalLength?.() ?? 1200
      tweens.push(gsap.fromTo(dash,
        { strokeDasharray: len, strokeDashoffset: len },
        {
          strokeDashoffset: 0, duration: 2.4, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none reverse' },
        },
      ))
    }

    // Parallax drift on the backdrop for depth.
    const bg = el.querySelector('.footer-bg')
    if (bg) {
      tweens.push(gsap.fromTo(bg, { yPercent: -8 }, {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.4 },
      }))
    }

    return () => tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill() })
  }, [])

  return (
    <footer ref={ref} className="relative z-raised text-white overflow-hidden" style={{ backgroundColor: INK }}>
      {/* ── Backdrop: temple photo + deep charcoal gradient scrim ── */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="footer-bg absolute inset-x-0 -top-[8%] h-[116%] bg-cover bg-center will-change-transform"
          style={{ backgroundImage: `url(${FOOTER_BG})`, opacity: 0.28 }}
        />
        {/* Warm dark wash keeps it on-brand AND legible */}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to bottom, ${INK}F2, ${INK}D9 40%, ${INK}F2)` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(232,115,90,0.18),transparent_60%)]" />
      </div>

      {/* Top hairline: animated gold→coral shimmer */}
      <div
        className="relative h-px w-full bg-[linear-gradient(90deg,transparent,#E8735A,#C9A03A,#E8735A,transparent)] bg-[length:200%_100%]"
        style={{ animation: 'shimmerFooter 7s linear infinite' }}
        aria-hidden="true"
      />
      <style>{`@keyframes shimmerFooter{0%{background-position:0% 0}100%{background-position:200% 0}}`}</style>

      {/* Decorative route line spanning the CTA band */}
      <svg className="pointer-events-none absolute left-0 right-0 top-[38%] w-full h-24 opacity-40" viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden="true">
        <path className="route-dash" d="M-20 70 C 220 10, 420 90, 640 50 S 1040 10, 1220 60" fill="none" stroke="url(#routeGrad)" strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#E8735A" stopOpacity="0" />
            <stop offset="0.5" stopColor="#C9A03A" />
            <stop offset="1" stopColor="#E8735A" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative max-w-container mx-auto px-gutter">
        {/* ── Trust strip ── */}
        <div className="footer-reveal grid grid-cols-2 md:grid-cols-4 gap-4 pt-14">
          {TRUST.map((b) => (
            <div key={b.t} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-sm px-4 py-3.5 transition-all duration-500 hover:border-brand-500/60 hover:bg-white/[0.1] hover:-translate-y-0.5">
              <span className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500/40 to-golden-500/30 text-brand-300 transition-transform duration-500 group-hover:scale-110">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={b.d} /></svg>
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-semibold text-white">{b.t}</span>
                <span className="block text-[0.7rem] text-white/60 font-light">{b.s}</span>
              </span>
            </div>
          ))}
        </div>

        {/* ── CTA band ── */}
        <div className="footer-reveal py-16 md:py-24 border-b border-white/10 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-white/85 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
              Your journey awaits
            </span>
            <h2 className="mt-6 font-display text-5xl md:text-7xl font-light leading-[0.92] tracking-tight text-white">
              Ready when
              <br />
              <span className="bg-gradient-to-r from-brand-300 via-golden-300 to-brand-300 bg-clip-text text-transparent">you are.</span>
            </h2>
            <p className="mt-6 max-w-md text-white/75 font-light leading-relaxed">
              Tell us where you&apos;re headed. Our team confirms availability and secures
              your seats — no bots, just real people who love travel.
            </p>
          </div>

          <a
            href="#search"
            className="group relative inline-flex items-center gap-3 self-start md:self-auto overflow-hidden rounded-full bg-white px-9 py-4 text-sm uppercase tracking-wider font-semibold text-content-primary shadow-xl transition-all duration-500 hover:text-white hover:-translate-y-1"
          >
            {/* Coral fill sweeps in on hover */}
            <span className="absolute inset-0 translate-y-full bg-gradient-to-br from-brand-500 to-brand-600 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" aria-hidden="true" />
            <span className="relative z-10">Start Planning</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="relative z-10 transition-transform duration-500 group-hover:translate-x-1"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
        </div>

        {/* ── Link columns ── */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8">
          {/* Brand */}
          <div className="footer-reveal col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="grid place-items-center h-10 w-10 rounded-2xl bg-gradient-to-br from-brand-500 to-golden-500 shadow-lg">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2.5c-3.7 0-6.7 3-6.7 6.7 0 4.5 5.2 9.6 6.7 11.3 1.5-1.7 6.7-6.8 6.7-11.3 0-3.7-3-6.7-6.7-6.7Z" fill="white" />
                  <circle cx="9.5" cy="9" r="1.7" fill="#E8735A" />
                  <circle cx="14.5" cy="9" r="1.7" fill="#C9A03A" />
                  <path d="M8.4 13.2c.9-1 2.3-1 3.6-1s2.7 0 3.6 1" stroke="#E8735A" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </span>
              <span className="font-display text-xl font-semibold tracking-tight text-white">HumSafar</span>
            </div>
            <p className="max-w-xs text-sm text-white/70 font-light leading-relaxed">
              Rail &amp; road travel across India, reimagined. Compare trains and buses,
              plan the perfect route, and travel with confidence.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="group grid place-items-center h-10 w-10 rounded-full border border-white/20 text-white/80 transition-all duration-500 hover:border-brand-500 hover:text-white hover:bg-brand-500/30 hover:-translate-y-1"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="transition-transform duration-500 group-hover:scale-110"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          {LINK_GROUPS.map((group) => (
            <div key={group.title} className="footer-reveal">
              <h3 className="text-[0.7rem] uppercase tracking-[0.2em] text-golden-300 font-semibold mb-5">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="group inline-flex items-center gap-1.5 text-sm text-white/75 font-light transition-colors duration-300 hover:text-white">
                      <span className="h-px w-0 bg-brand-500 transition-all duration-300 group-hover:w-4" />
                      <span className="transition-transform duration-300 group-hover:translate-x-0.5">{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-reveal py-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/55 font-light">
          <p>© {new Date().getFullYear()} HumSafar. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Crafted for travellers
            <span className="text-brand-300">·</span>
            Rail &amp; Road · India
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
