import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@utils/cn'
import { TrackingService } from '@services/TrackingService'

/**
 * Public inquiry tracking page (/track).
 *
 * Customers enter their reference (HS-XXXXXX) + email to see the live status
 * and history of their booking inquiry. Two-factor by design.
 */

const STATUS_META = {
  NEW: { label: 'Received', color: 'text-brand-500 bg-brand-50', step: 1 },
  CONTACTED: { label: 'Advisor in touch', color: 'text-accent-600 bg-accent-50', step: 2 },
  PLANNING: { label: 'Planning your trip', color: 'text-accent-600 bg-accent-50', step: 3 },
  COMPLETED: { label: 'Booking confirmed', color: 'text-status-success bg-green-50', step: 4 },
  CANCELLED: { label: 'Cancelled', color: 'text-status-danger bg-red-50', step: 0 },
}

const STEPS = ['Received', 'Contacted', 'Planning', 'Confirmed']

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function TrackPage() {
  const [reference, setReference] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (loading) return
    setError(null)
    setResult(null)
    if (!reference.trim() || !email.trim()) {
      setError('Please enter both your reference and email.')
      return
    }
    setLoading(true)
    const res = await TrackingService.track({ reference: reference.trim(), email: email.trim() })
    setLoading(false)
    if (!res.ok) {
      setError(res.message)
      return
    }
    setResult(res.inquiry)
  }, [reference, email, loading])

  const meta = result ? STATUS_META[result.status] ?? STATUS_META.NEW : null

  return (
    <main className="min-h-screen bg-surface-base">
      <div className="max-w-xl mx-auto px-gutter py-16 md:py-24">
        <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-content-muted hover:text-content-primary transition-colors mb-10">
          <span aria-hidden>←</span> Back to HumSafar
        </Link>

        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-brand-500 font-medium">Track Your Inquiry</span>
          <h1 className="mt-4 font-display text-4xl font-light text-content-primary leading-tight">Where's my booking?</h1>
          <p className="mt-4 text-base text-content-tertiary font-light">
            Enter the reference from your confirmation email along with your email address.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="trk-ref" className="block text-xs font-medium tracking-wide text-content-tertiary mb-2 uppercase">Reference</label>
            <input id="trk-ref" value={reference} onChange={(e) => setReference(e.target.value.toUpperCase())}
              placeholder="HS-XXXXXX"
              className="w-full bg-white border border-black/[0.08] rounded-xl px-4 py-3.5 text-base text-content-primary font-mono outline-none transition-all duration-300 placeholder:text-content-muted hover:border-black/[0.14] focus:border-accent-600 focus:ring-2 focus:ring-accent-600/10" />
          </div>
          <div>
            <label htmlFor="trk-email" className="block text-xs font-medium tracking-wide text-content-tertiary mb-2 uppercase">Email</label>
            <input id="trk-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" autoComplete="email"
              className="w-full bg-white border border-black/[0.08] rounded-xl px-4 py-3.5 text-base text-content-primary font-light outline-none transition-all duration-300 placeholder:text-content-muted hover:border-black/[0.14] focus:border-accent-600 focus:ring-2 focus:ring-accent-600/10" />
          </div>

          {error && (
            <div className="p-4 rounded-xl border border-status-danger/15 bg-red-50 text-center">
              <p className="text-sm text-status-danger font-light">{error}</p>
            </div>
          )}

          <button type="submit" disabled={loading}
            className={cn(
              'w-full py-4 rounded-full text-sm uppercase tracking-wider font-medium transition-all duration-500',
              loading ? 'bg-surface-overlay text-content-muted cursor-wait' : 'bg-brand-500 text-white hover:bg-brand-400 hover:shadow-glow shadow-md active:scale-[0.98]',
            )}>
            {loading ? 'Checking…' : 'Track Inquiry'}
          </button>
        </form>

        {result && meta && (
          <div className="mt-12 p-6 rounded-2xl border border-black/[0.06] bg-white shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-content-muted uppercase tracking-wider">Reference</p>
                <p className="font-mono text-lg text-content-primary">{result.reference}</p>
              </div>
              <span className={cn('text-xs uppercase tracking-wider font-medium px-3 py-1 rounded-full', meta.color)}>{meta.label}</span>
            </div>

            {/* Progress bar (hidden for cancelled) */}
            {result.status !== 'CANCELLED' && (
              <div className="flex items-center mb-8">
                {STEPS.map((label, i) => {
                  const done = i + 1 <= meta.step
                  return (
                    <div key={label} className="flex-1 flex items-center last:flex-none">
                      <div className="flex flex-col items-center">
                        <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium',
                          done ? 'bg-brand-500 text-white' : 'bg-surface-overlay text-content-muted')}>
                          {done ? '✓' : i + 1}
                        </div>
                        <span className="mt-1.5 text-[10px] text-content-muted whitespace-nowrap">{label}</span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={cn('flex-1 h-0.5 mx-1 -mt-4', i + 1 < meta.step ? 'bg-brand-500' : 'bg-surface-overlay')} />
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            <dl className="space-y-2 text-sm mb-6">
              <div className="flex justify-between"><dt className="text-content-muted">Traveller</dt><dd className="text-content-secondary">{result.fullName}</dd></div>
              {result.journeyName && <div className="flex justify-between"><dt className="text-content-muted">Journey</dt><dd className="text-content-secondary">{result.journeyName}</dd></div>}
              {(result.fromCity || result.toCity) && <div className="flex justify-between"><dt className="text-content-muted">Route</dt><dd className="text-content-secondary">{result.fromCity} → {result.toCity}</dd></div>}
              {result.travelDate && <div className="flex justify-between"><dt className="text-content-muted">Travel date</dt><dd className="text-content-secondary">{result.travelDate}</dd></div>}
              <div className="flex justify-between"><dt className="text-content-muted">Submitted</dt><dd className="text-content-secondary">{fmtDate(result.createdAt)}</dd></div>
            </dl>

            {result.statusHistory?.length > 0 && (
              <div className="pt-5 border-t border-black/[0.06]">
                <p className="text-xs uppercase tracking-wider text-content-muted mb-3">History</p>
                <ul className="space-y-3">
                  {[...result.statusHistory].reverse().map((h, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-content-secondary">{STATUS_META[h.status]?.label ?? h.status}{h.note ? ` — ${h.note}` : ''}</p>
                        <p className="text-xs text-content-muted">{fmtDate(h.createdAt)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
