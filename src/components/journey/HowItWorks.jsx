import { useRef, useEffect } from 'react'
import { gsap } from '@animations/gsap'
import { cn } from '@utils/cn'

const STEPS = [
  {
    num: '01',
    title: 'Search Your Route',
    body: 'Enter your origin, destination, and travel date. We instantly surface every available train and bus option across multiple operators.',
  },
  {
    num: '02',
    title: 'Compare Options',
    body: 'See fares, journey times, classes, and availability side by side. Sleeper, AC, Volvo, luxury coach — every option at a glance.',
  },
  {
    num: '03',
    title: 'Select & Inquire',
    body: 'Pick the journey that fits. Your selection is remembered — just add your contact details and we handle the rest.',
  },
  {
    num: '04',
    title: 'Expert Booking',
    body: 'A travel advisor confirms availability, secures your seats, and contacts you within 24 hours. No bots — real human assistance.',
  },
]

export const HowItWorks = () => {
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      const header = el.querySelector('.hiw-header')
      if (header) {
        gsap.fromTo(header, { autoAlpha: 0, y: 50 }, {
          autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none reverse' },
        })
      }

      el.querySelectorAll('.hiw-step').forEach((step, i) => {
        gsap.fromTo(step, { autoAlpha: 0, y: 40 }, {
          autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: step, start: 'top 85%', toggleActions: 'play none none reverse' },
          delay: i * 0.1,
        })
      })

      const line = el.querySelector('.hiw-line')
      if (line) {
        gsap.fromTo(line, { scaleY: 0 }, {
          scaleY: 1, duration: 1.6, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 60%', toggleActions: 'play none none reverse' },
        })
      }
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="how-it-works" className="relative z-raised">
      <div className="bg-surface-base">
        <div className="max-w-4xl mx-auto px-gutter py-section">
          {/* Header */}
          <div className="hiw-header invisible text-center mb-20 md:mb-28">
            <span className="text-xs uppercase tracking-widest text-brand-500 font-medium">
              How It Works
            </span>
            <h2 className="mt-4 font-display text-display font-light text-content-primary leading-tight">
              Book in Four Simple Steps.
            </h2>
            <p className="mt-5 max-w-md mx-auto text-base text-content-tertiary font-light leading-relaxed">
              From search to confirmed booking — real human assistance at every step.

            </p>
          </div>

          {/* Steps */}
          <div className="relative">
            <div className="hiw-line absolute left-[1.6rem] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/15 via-brand-500/8 to-transparent origin-top" />

            <div className="space-y-16 md:space-y-20">
              {STEPS.map((step, i) => {
                const isEven = i % 2 === 0
                return (
                  <div
                    key={step.num}
                    className={cn(
                      'hiw-step invisible relative flex items-start gap-6 md:gap-10',
                      isEven ? 'md:flex-row' : 'md:flex-row-reverse',
                    )}
                  >
                    <div className="relative z-raised flex-shrink-0 w-[3.2rem] h-[3.2rem] rounded-full border border-brand-500/15 bg-white flex items-center justify-center md:absolute md:left-1/2 md:-translate-x-1/2 shadow-xs">
                      <span className="text-xs font-medium text-brand-500 tabular-nums">{step.num}</span>
                    </div>

                    <div className={cn(
                      'flex-1 max-w-sm',
                      isEven ? 'md:text-right md:pr-16 md:ml-0' : 'md:text-left md:pl-16 md:mr-0',
                    )}>
                      <h3 className="font-display text-xl font-normal text-content-primary mb-3">
                        {step.title}
                      </h3>
                      <p className="text-sm text-content-tertiary font-light leading-relaxed">
                        {step.body}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
