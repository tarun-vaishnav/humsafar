import { useRef, useEffect } from 'react'
import { gsap } from '@animations/gsap'

/**
 * Popular destinations — editorial image cards.
 * Images pull from Unsplash (with a warm gradient fallback if a photo fails).
 */
const DESTINATIONS = [
  {
    name: 'Jaipur',
    epithet: 'The Pink City',
    line: 'Where ancient fortresses watch over a city painted in rose, and every street hums with centuries of craft.',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=70',

    tint: 'from-brand-600/70',
    from: 'Delhi',
    to: 'Jaipur',
    route: 'Delhi → Jaipur · from ₹290',
  },
  {
    name: 'Udaipur',
    epithet: 'City of Lakes',
    line: 'Mirror-still waters reflecting palaces that float between sky and stone, unchanged by time.',
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=70',
    tint: 'from-accent-700/70',
    from: 'Jaipur',
    to: 'Udaipur',
    route: 'Jaipur → Udaipur · from ₹680',
  },
  {
    name: 'Jaisalmer',
    epithet: 'The Golden Fort',
    line: 'A sandcastle city rising from the Thar, where the desert whispers stories the world has forgotten.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=70',

    tint: 'from-golden-600/70',
    from: 'Jodhpur',
    to: 'Jaisalmer',
    route: 'Jodhpur → Jaisalmer · from ₹380',
  },
  {
    name: 'Varanasi',
    epithet: 'The Eternal City',
    line: 'Where the Ganges carries prayers older than memory, and dawn arrives like a hymn.',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=70',
    tint: 'from-brand-700/70',
    from: 'Delhi',
    to: 'Varanasi',
    route: 'Delhi → Varanasi · from ₹450',
  },
  {
    name: 'Kerala',
    epithet: "God\u2019s Own Country",
    line: 'Backwaters and spice trails winding through emerald canopies, where every journey tastes of cardamom.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=70',
    tint: 'from-forest-600/70',
    from: 'Kochi',
    to: 'Alleppey',
    route: 'Kochi → Alleppey · from ₹520',
  },
]

/**
 * Prefill the search form with a destination and jump to it.
 * SearchJourneys listens for this event (sibling component, no shared store).
 */
function prefillSearch(from, to) {
  window.dispatchEvent(new CustomEvent('humsafar:prefill-search', { detail: { from, to } }))
  const el = document.getElementById('search')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}


function handleImgError(e) {
  // Hide broken image; the gradient tint layer beneath keeps the card elegant.
  e.currentTarget.style.opacity = '0'
}

export const RoutesSection = () => {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = sectionRef.current
    if (!ctx) return
    const tweens = []

    const opener = ctx.querySelector('.routes-opener')
    if (opener) {
      tweens.push(gsap.fromTo(opener, { autoAlpha: 0, y: 70 }, {
        autoAlpha: 1, y: 0, duration: 1.4, ease: 'expo.out',
        scrollTrigger: { trigger: opener, start: 'top 88%', toggleActions: 'play none none reverse' },
      }))
    }

    ctx.querySelectorAll('.dest-card').forEach((card, i) => {
      tweens.push(gsap.fromTo(card, { autoAlpha: 0, y: 60 }, {
        autoAlpha: 1, y: 0, duration: 1.1, ease: 'expo.out', delay: (i % 2) * 0.1,
        scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse' },
      }))
      const img = card.querySelector('.dest-img')
      if (img) {
        tweens.push(gsap.fromTo(img, { scale: 1.25 }, {
          scale: 1, ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
        }))
      }
    })

    const closer = ctx.querySelector('.routes-closer')
    if (closer) {
      tweens.push(gsap.fromTo(closer, { autoAlpha: 0, y: 50 }, {
        autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: closer, start: 'top 85%', toggleActions: 'play none none reverse' },
      }))
    }

    return () => tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill() })
  }, [])

  return (
    <section ref={sectionRef} id="routes" className="relative z-raised">
      <div className="bg-surface-overlay/60">
        {/* Opening */}
        <div className="routes-opener invisible max-w-4xl mx-auto px-gutter pt-section pb-16 md:pb-24 text-center">
          <span className="text-xs uppercase tracking-widest text-brand-500 font-semibold">
            Popular Destinations
          </span>
          <h2 className="mt-4 font-display text-display font-light text-content-primary leading-[1.02]">
            Explore India,
            <br className="hidden sm:block" />
            one route at a time.
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-base md:text-lg text-content-tertiary font-light leading-relaxed">
            Hand-picked cities travellers love — with trains and buses connecting
            every one of them. Tap a destination to start planning.
          </p>
        </div>

        {/* Destination grid */}
        <div className="max-w-container mx-auto px-gutter pb-8 md:pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 auto-rows-[minmax(0,1fr)]">
            {DESTINATIONS.map((dest, i) => (
              <div
                key={dest.name}
                className={`dest-card invisible group relative overflow-hidden rounded-3xl bg-content-primary shadow-lg text-left w-full ${
                  i === 0 ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2 min-h-[280px] lg:min-h-[560px]' : 'min-h-[280px]'
                }`}
              >


                {/* Gradient base (fallback beneath image) */}
                <div className={`absolute inset-0 bg-gradient-to-br ${dest.tint} to-content-primary`} aria-hidden="true" />
                {/* Image */}
                <img
                  src={dest.image}
                  alt={`${dest.name} — ${dest.epithet}`}
                  loading="lazy"
                  onError={handleImgError}
                  className="dest-img absolute inset-0 h-full w-full object-cover transition-transform duration-700 will-change-transform"
                />
                {/* Readability scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" aria-hidden="true" />

                {/* Content */}
                <div className="relative flex h-full flex-col justify-end p-6 md:p-8">
                  <span className="inline-flex w-fit items-center gap-2 mb-3 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-[0.65rem] uppercase tracking-widest text-white/90 font-semibold border border-white/20">
                    {dest.epithet}
                  </span>
                  <h3 className={`font-display font-light text-white leading-none tracking-tight ${
                    i === 0 ? 'text-5xl md:text-7xl' : 'text-4xl md:text-5xl'
                  }`}>
                    {dest.name}
                  </h3>
                  {i === 0 && (
                    <p className="mt-4 max-w-md text-sm md:text-base text-white/75 font-light leading-relaxed">
                      {dest.line}
                    </p>
                  )}
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <span className="text-xs md:text-sm text-white/80 font-medium">{dest.route}</span>
                    {/* Enquire now — the ONLY clickable element. Always visible on
                        touch, reveals on hover for pointer devices. */}
                    <button
                      type="button"
                      onClick={() => prefillSearch(dest.from, dest.to)}
                      aria-label={`Plan a trip to ${dest.name} — ${dest.from} to ${dest.to}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-[0.7rem] uppercase tracking-wider font-semibold text-content-primary shadow-sm transition-all duration-500 opacity-100 translate-x-0 sm:opacity-0 sm:translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 hover:bg-brand-500 hover:text-white focus-visible:opacity-100 focus-visible:translate-x-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                      Enquire now
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </button>
                  </div>
                </div>

                {/* Hover ring */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/0 transition-all duration-500 group-hover:ring-white/25" aria-hidden="true" />
              </div>

            ))}

          </div>
        </div>

        {/* Closing */}
        <div className="routes-closer invisible max-w-3xl mx-auto px-gutter pt-8 pb-section text-center">
          <p className="font-display text-headline font-light text-content-secondary leading-snug">
            Your next journey starts with a single search.
            <br />
            Compare, select, and inquire — we handle the rest.
          </p>
        </div>
      </div>
    </section>
  )
}

export default RoutesSection
