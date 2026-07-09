import { useState, useRef, useEffect, useCallback } from 'react'
import { gsap } from '@animations/gsap'
import { cn } from '@utils/cn'
import { InquiryService } from '@services/InquiryService'
import { Turnstile } from '@components/ui/Turnstile'

const NAME_REGEX = /^[a-zA-Z\s'.,-]{2,100}$/

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_REGEX = /^(\+91[\s-]?)?[6-9]\d{9}$/

function validate(data) {
  const errors = {}
  if (!data.fullName?.trim()) errors.fullName = 'Name is required.'
  else if (!NAME_REGEX.test(data.fullName.trim())) errors.fullName = 'Please enter a valid name.'
  if (!data.email?.trim()) errors.email = 'Email is required.'
  else if (!EMAIL_REGEX.test(data.email.trim())) errors.email = 'Please enter a valid email.'
  if (!data.phone?.trim()) errors.phone = 'Phone number is required.'
  else if (!PHONE_REGEX.test(data.phone.replace(/\s/g, ''))) errors.phone = 'Enter a valid Indian mobile number.'
  if (data.passengers < 1 || data.passengers > 50) errors.passengers = 'Passengers must be 1–50.'
  return errors
}

function JourneySummary({ journey }) {
  if (!journey) return null
  return (
    <div className="mb-10 p-5 rounded-2xl border border-black/[0.06] bg-white shadow-xs">
      <div className="flex items-center gap-2 mb-3">
        <span className={cn('text-xs uppercase tracking-wider font-medium px-2.5 py-0.5 rounded-full',
          journey.type === 'train' ? 'text-brand-500 bg-brand-50' : 'text-accent-600 bg-accent-50',
        )}>{journey.type}</span>
        <span className="text-xs text-content-muted">Selected Journey</span>
      </div>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm font-medium text-content-primary">{journey.name}</span>
        {journey.number && <span className="text-xs text-content-muted">#{journey.number}</span>}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm text-content-tertiary font-light">
        <span>{journey.from}</span>
        <span className="text-content-muted">→</span>
        <span>{journey.to}</span>
        <span className="text-content-disabled">·</span>
        <span>{journey.departure}–{journey.arrival}</span>
        <span className="text-content-disabled">·</span>
        <span>{journey.class}</span>
        <span className="text-content-disabled">·</span>
        <span className="text-brand-500 font-medium">₹{journey.fare?.toLocaleString('en-IN')}</span>
      </div>
      {journey.travelDate && (
        <p className="mt-2 text-xs text-content-muted">{journey.travelDate} · {journey.passengers} {journey.passengers === 1 ? 'passenger' : 'passengers'}</p>
      )}
    </div>
  )
}

export const InquiryFlow = ({ journey }) => {
  const [data, setData] = useState({ fullName: '', email: '', phone: '', passengers: journey?.passengers || 1, specialRequest: '', preferredContactTime: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [reference, setReference] = useState(null)
  const submittedRef = useRef(false)
  const sectionRef = useRef(null)
  const formRef = useRef(null)
  const honeypotRef = useRef(null)
  const turnstileTokenRef = useRef('')


  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const header = el.querySelector('.inquiry-header')
    if (!header) return
    const tween = gsap.fromTo(header, { autoAlpha: 0, y: 50 }, {
      autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    return () => { tween.scrollTrigger?.kill(); tween.kill() }
  }, [])

  useEffect(() => {
    if (journey && sectionRef.current) {
      setTimeout(() => sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200)
    }
  }, [journey])

  const handleChange = useCallback((field, value) => {
    setData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => { if (!prev[field]) return prev; const next = { ...prev }; delete next[field]; return next })
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (submittedRef.current || submitting) return

    // A journey must be selected before an inquiry can be submitted.
    if (!journey) {
      setSubmitError('Please select a journey above before submitting your inquiry.')
      document.getElementById('search')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    const validationErrors = validate(data)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      const firstKey = Object.keys(validationErrors)[0]
      formRef.current?.querySelector(`[name="${firstKey}"]`)?.focus()
      return
    }

    submittedRef.current = true
    setSubmitting(true)
    setSubmitError(null)

    try {
      const payload = {
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        passengers: Number(data.passengers) || 1,
        specialRequest: data.specialRequest.trim() || undefined,
        preferredContactTime: data.preferredContactTime || undefined,
        journeyType: journey?.type || undefined,
        journeyName: journey?.name || undefined,
        journeyNumber: journey?.number || undefined,
        journeyClass: journey?.class || undefined,
        journeyFare: journey?.fare || undefined,
        fromCity: journey?.from || undefined,
        toCity: journey?.to || undefined,
        travelDate: journey?.travelDate || undefined,
        departure: journey?.departure || undefined,
        arrival: journey?.arrival || undefined,
      }

      const result = await InquiryService.submit(payload, {
        turnstileToken: turnstileTokenRef.current,
        honeypot: honeypotRef.current?.value || '',
      })

      if (!result.ok) {
        submittedRef.current = false
        // Surface field-specific validation errors when possible.
        if (result.error === 'validation_failed' && result.message?.includes(':')) {
          const [field, ...rest] = result.message.split(':')
          setErrors({ [field.trim()]: rest.join(':').trim() })
        }
        setSubmitError(result.message || 'Something went wrong. Please try again.')
        return
      }

      setReference(result.reference || null)
      setSubmitted(true)
    } catch {
      submittedRef.current = false
      setSubmitError('Connection failed. Check your internet and try again.')
    } finally {
      setSubmitting(false)
    }
  }, [data, journey, submitting])


  const handleReset = useCallback(() => {
    setData({ fullName: '', email: '', phone: '', passengers: 1, specialRequest: '', preferredContactTime: '' })
    setErrors({}); setSubmitted(false); setSubmitting(false); setSubmitError(null); submittedRef.current = false
  }, [])

  const inputClass = (field) => cn(
    'w-full bg-white border rounded-xl px-4 py-3.5 text-base text-content-primary font-light outline-none transition-all duration-300 placeholder:text-content-muted',
    errors[field]
      ? 'border-status-danger/40 focus:border-status-danger focus:ring-2 focus:ring-red-100'
      : 'border-black/[0.08] hover:border-black/[0.14] focus:border-accent-600 focus:ring-2 focus:ring-accent-600/10',
  )

  // ─── Confirmation ─────────────────────────────────────────────
  if (submitted) {
    return (
      <section ref={sectionRef} id="inquiry" className="relative z-raised">
        <div className="bg-surface-base">
          <div className="max-w-lg mx-auto px-gutter py-section text-center">
            <div className="w-16 h-16 rounded-2xl border border-brand-500/20 bg-brand-50 flex items-center justify-center mb-8 mx-auto shadow-glow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8735A" strokeWidth="2" strokeLinecap="round"><path d="M5 12l5 5L20 7" /></svg>
            </div>
            <h3 className="font-display text-3xl font-light text-content-primary mb-4">Inquiry Received.</h3>
            {journey && (
              <p className="text-sm text-content-tertiary font-light mb-2">{journey.from} → {journey.to} · {journey.class}</p>
            )}
            {reference && (
              <div className="mt-6 mb-2 inline-flex flex-col items-center gap-1 px-6 py-4 rounded-2xl border border-brand-500/15 bg-brand-50">
                <span className="text-[11px] uppercase tracking-wider text-content-muted">Your reference</span>
                <span className="font-mono text-xl text-brand-600 tracking-wide">{reference}</span>
                <a href="/track" className="mt-1 text-xs uppercase tracking-wider text-brand-500 hover:text-brand-400 font-medium transition-colors">Track your inquiry →</a>
              </div>
            )}
            <div className="mt-8 mb-10 max-w-sm mx-auto space-y-4 text-left">
              {[
                { n: '1', label: 'Confirmation sent', detail: `to ${data.email}` },
                { n: '2', label: 'A booking advisor', detail: 'will contact you within 24 hours' },
                { n: '3', label: 'Availability confirmed', detail: 'and booking secured' },
              ].map((s) => (
                <div key={s.n} className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full border border-brand-500/15 bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-brand-500 font-medium">{s.n}</span>
                  </div>
                  <p className="text-sm text-content-tertiary font-light"><strong className="text-content-secondary font-medium">{s.label}</strong> {s.detail}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-medium border border-black/[0.08] text-content-secondary hover:border-black/[0.14] hover:text-content-primary transition-all duration-500">
                Return Home
              </button>
              <button type="button" onClick={handleReset}
                className="px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-medium bg-brand-500 text-white hover:bg-brand-400 hover:shadow-glow transition-all duration-500">
                Book Another Journey
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // ─── Form ─────────────────────────────────────────────────────
  return (
    <section ref={sectionRef} id="inquiry" className="relative z-raised">
      <div className="bg-surface-overlay/40">
        <div className="max-w-xl mx-auto px-gutter py-section">
          <div className="inquiry-header invisible text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-brand-500 font-medium">
              Complete Your Booking
            </span>
            <h2 className="mt-4 font-display text-display font-light text-content-primary leading-tight">
              {journey ? 'Almost There.' : 'Inquire About a Journey.'}
            </h2>
            <p className="mt-4 text-base text-content-tertiary font-light">
              {journey ? 'Add your contact details and we\'ll handle the rest.' : 'Select a journey above, or fill in your details and we\'ll find the best option for you.'}
            </p>
          </div>

          <JourneySummary journey={journey} />

          {submitError && (
            <div className="mb-6 p-4 rounded-xl border border-status-danger/15 bg-brand-50 text-center">
              <p className="text-sm text-status-danger font-light">{submitError}</p>
              <button type="button" onClick={() => { setSubmitError(null); submittedRef.current = false }} className="mt-2 text-xs uppercase tracking-wider text-status-danger/60 hover:text-status-danger font-medium transition-colors">Try Again</button>
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="inq-name" className="block text-xs font-medium tracking-wide text-content-tertiary mb-2 uppercase">Full Name *</label>
              <input id="inq-name" name="fullName" type="text" value={data.fullName} onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="Your full name" className={inputClass('fullName')} autoComplete="name" aria-invalid={!!errors.fullName} />
              {errors.fullName && <p role="alert" className="mt-2 text-xs text-status-danger font-light">{errors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="inq-email" className="block text-xs font-medium tracking-wide text-content-tertiary mb-2 uppercase">Email *</label>
              <input id="inq-email" name="email" type="email" value={data.email} onChange={(e) => handleChange('email', e.target.value)}
                placeholder="you@example.com" className={inputClass('email')} autoComplete="email" aria-invalid={!!errors.email} />
              {errors.email && <p role="alert" className="mt-2 text-xs text-status-danger font-light">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="inq-phone" className="block text-xs font-medium tracking-wide text-content-tertiary mb-2 uppercase">Phone *</label>
              <input id="inq-phone" name="phone" type="tel" value={data.phone} onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+91 98765 43210" className={inputClass('phone')} autoComplete="tel" aria-invalid={!!errors.phone} />
              {errors.phone && <p role="alert" className="mt-2 text-xs text-status-danger font-light">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="inq-pax" className="block text-xs font-medium tracking-wide text-content-tertiary mb-2 uppercase">Passengers</label>
              <input id="inq-pax" name="passengers" type="number" value={data.passengers} onChange={(e) => handleChange('passengers', Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                min={1} max={50} className={inputClass('passengers')} />
              {errors.passengers && <p role="alert" className="mt-2 text-xs text-status-danger font-light">{errors.passengers}</p>}
            </div>

            <div>
              <label htmlFor="inq-contact-time" className="block text-xs font-medium tracking-wide text-content-tertiary mb-2 uppercase">Preferred Contact Time</label>
              <select id="inq-contact-time" name="preferredContactTime" value={data.preferredContactTime} onChange={(e) => handleChange('preferredContactTime', e.target.value)}
                className="w-full bg-white border border-black/[0.08] rounded-xl px-4 py-3.5 text-base text-content-primary outline-none transition-all duration-300 hover:border-black/[0.14] focus:border-accent-600 focus:ring-2 focus:ring-accent-600/10">
                <option value="">Any time</option>
                <option value="morning">Morning (9 AM – 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM – 5 PM)</option>
                <option value="evening">Evening (5 PM – 9 PM)</option>
              </select>
            </div>

            <div>
              <label htmlFor="inq-request" className="block text-xs font-medium tracking-wide text-content-tertiary mb-2 uppercase">Special Requests</label>
              <textarea id="inq-request" name="specialRequest" value={data.specialRequest} onChange={(e) => handleChange('specialRequest', e.target.value)}
                placeholder="Any preferences, accessibility needs, or special requests..." rows={3}
                className="w-full bg-white border border-black/[0.08] rounded-xl px-4 py-3.5 text-base text-content-primary font-light outline-none transition-all duration-300 placeholder:text-content-muted resize-none hover:border-black/[0.14] focus:border-accent-600 focus:ring-2 focus:ring-accent-600/10" />
            </div>

            {/* Honeypot — bots fill this; humans never see it */}
            <input ref={honeypotRef} type="text" name="company" defaultValue="" className="absolute -left-[9999px] opacity-0 w-0 h-0" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            {/* Bot protection (Cloudflare Turnstile) — renders only when configured */}
            <div className="flex justify-center">
              <Turnstile
                onVerify={(token) => { turnstileTokenRef.current = token }}
                onExpire={() => { turnstileTokenRef.current = '' }}
              />
            </div>

            <div className="pt-4">

              <button type="submit" disabled={submitting}
                className={cn(
                  'w-full py-4 rounded-full text-sm uppercase tracking-wider font-medium transition-all duration-500',
                  submitting
                    ? 'bg-surface-overlay text-content-muted cursor-wait'
                    : 'bg-brand-500 text-white hover:bg-brand-400 hover:shadow-glow shadow-md active:scale-[0.98]',
                )}>
                {submitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Sending...
                  </span>
                ) : 'Submit Inquiry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default InquiryFlow
