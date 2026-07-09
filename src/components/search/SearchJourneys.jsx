import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { gsap } from '@animations/gsap'
import { cn } from '@utils/cn'
import { SearchService } from '@services/SearchService'
import { CityCombobox } from '@components/ui/CityCombobox'

// ─── Constants ──────────────────────────────────────────────────────────────
const TRANSPORT_FILTERS = ['all', 'train', 'bus']
const CLASS_FILTERS = ['All', 'Sleeper', '3AC', '2AC', '1AC', 'Chair Car', 'Executive', 'AC Sleeper', 'Volvo', 'Luxury Coach']
const LOADING_MESSAGES = [
  'Searching routes across India...',
  'Comparing trains and buses...',
  'Finding the best fares...',
  'Preparing your options...',
]


// ─── Loading Animation ─────────────────────────────────────────────────────
function SearchLoading() {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length)
    }, 800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="py-24 text-center">
      <div className="flex items-center justify-center gap-2 mb-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-brand-500/40 animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
      <p className="text-base text-content-tertiary font-light animate-pulse">{LOADING_MESSAGES[msgIndex]}</p>
    </div>
  )
}

// ─── Empty state ────────────────────────────────────────────────────────────
function EmptyState({ from, to }) {
  const [routes, setRoutes] = useState([])

  useEffect(() => {
    let alive = true
    SearchService.getAvailableRoutes().then((r) => { if (alive) setRoutes(r) })
    return () => { alive = false }
  }, [])


  return (
    <div className="py-20 text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-surface-overlay flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-content-muted">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
      </div>
      <h3 className="font-display text-2xl font-normal text-content-primary mb-3">No routes found</h3>
      <p className="text-base text-content-tertiary font-light mb-10 max-w-sm mx-auto">
        We couldn't find direct services between {from} and {to}. Try one of these popular routes instead.
      </p>

      {routes.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
          {routes.slice(0, 8).map((r) => (
            <span key={r.label} className="px-4 py-2 rounded-full text-sm text-content-secondary border border-black/[0.06] bg-white hover:border-brand-500/30 hover:text-brand-500 transition-all duration-300 cursor-default shadow-xs">
              {r.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Filter Bar ─────────────────────────────────────────────────────────────
function FilterBar({ transport, setTransport, classFilter, setClassFilter }) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      {/* Transport toggle */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-overlay border border-black/[0.04]">
        {TRANSPORT_FILTERS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTransport(t)}
            className={cn(
              'px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-medium transition-all duration-300',
              transport === t
                ? 'bg-white text-brand-500 shadow-sm'
                : 'text-content-muted hover:text-content-secondary',
            )}
          >
            {t === 'all' ? 'All' : t === 'train' ? 'Trains' : 'Buses'}
          </button>
        ))}
      </div>

      {/* Class filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CLASS_FILTERS.map((cls) => (
          <button
            key={cls}
            type="button"
            onClick={() => setClassFilter(classFilter === cls ? 'All' : cls)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 border',
              classFilter === cls
                ? 'border-brand-500/30 text-brand-500 bg-brand-50'
                : 'border-black/[0.06] text-content-muted hover:border-black/[0.10] hover:text-content-secondary bg-white',
            )}
          >
            {cls}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Train Result Card ──────────────────────────────────────────────────────
function TrainCard({ train, from, to, date, onSelect, index }) {
  const cardRef = useRef(null)

  useEffect(() => {
    if (!cardRef.current) return
    gsap.fromTo(cardRef.current, { autoAlpha: 0, y: 20 }, {
      autoAlpha: 1, y: 0, duration: 0.5, delay: index * 0.06, ease: 'power3.out',
    })
  }, [index])

  return (
    <div ref={cardRef} className="invisible group bg-white border border-black/[0.06] rounded-2xl p-6 hover:border-brand-500/20 transition-all duration-400 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h4 className="text-lg font-medium text-content-primary">{train.name}</h4>
            <span className="text-xs text-content-muted">#{train.number}</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-brand-500 font-medium bg-brand-50 px-2.5 py-0.5 rounded-full">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="3" width="16" height="16" rx="3" /><path d="M4 11h16" /></svg>
            Train
          </span>
        </div>
        <span className="text-sm text-content-tertiary font-light">{train.duration}</span>
      </div>

      {/* Timeline */}
      <div className="flex items-center gap-4 mb-6">
        <div>
          <p className="text-2xl font-light text-content-primary tabular-nums">{train.departure}</p>
          <p className="text-sm text-content-muted mt-0.5">{from}</p>
        </div>
        <div className="flex-1 flex items-center gap-2 py-2">
          <div className="w-2 h-2 rounded-full bg-brand-500" />
          <div className="flex-1 h-px bg-gradient-to-r from-brand-500/30 via-black/[0.06] to-black/[0.06] relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-content-muted bg-white px-3 font-light">{train.duration}</div>
          </div>
          <div className="w-2 h-2 rounded-full border-2 border-content-muted" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-light text-content-primary tabular-nums">{train.arrival}</p>
          <p className="text-sm text-content-muted mt-0.5">{to}</p>
        </div>
      </div>

      {/* Classes */}
      <div className="space-y-2">
        {train.classes.map((cls) => (
          <div key={cls.type} className="flex items-center justify-between gap-3 py-3 px-4 rounded-xl bg-surface-overlay/60 border border-black/[0.03] hover:border-black/[0.06] transition-all duration-300">
            <div className="flex items-center gap-3">
              <span className="text-sm text-content-primary font-medium min-w-[5.5rem]">{cls.type}</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full text-accent-600 bg-accent-50">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-500 animate-pulse" />
                Live status on inquiry
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-base font-semibold text-content-primary tabular-nums">₹{cls.fare.toLocaleString('en-IN')}</span>
                <span className="block text-[0.65rem] text-content-muted font-light">indicative fare</span>
              </div>
              <button
                type="button"
                onClick={() => onSelect({
                  type: 'train', id: train.id, name: train.name, number: train.number,
                  class: cls.type, fare: cls.fare, departure: train.departure, arrival: train.arrival,
                  duration: train.duration, from, to, date,
                })}
                className="group/ib inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs uppercase tracking-wider font-semibold bg-content-primary text-white hover:bg-brand-500 hover:shadow-glow transition-all duration-300 active:scale-95"
              >
                Inquire Now
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="transition-transform duration-300 group-hover/ib:translate-x-0.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Bus Result Card ────────────────────────────────────────────────────────
function BusCard({ bus, from, to, date, onSelect, index }) {
  const cardRef = useRef(null)

  useEffect(() => {
    if (!cardRef.current) return
    gsap.fromTo(cardRef.current, { autoAlpha: 0, y: 20 }, {
      autoAlpha: 1, y: 0, duration: 0.5, delay: index * 0.06, ease: 'power3.out',
    })
  }, [index])

  return (
    <div ref={cardRef} className="invisible group bg-white border border-black/[0.06] rounded-2xl p-6 hover:border-accent-400/20 transition-all duration-400 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h4 className="text-lg font-medium text-content-primary">{bus.operator}</h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-accent-600 font-medium bg-accent-50 px-2.5 py-0.5 rounded-full">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="14" rx="3" /><path d="M3 10h18" /></svg>
              Bus
            </span>
            <span className="text-xs text-content-muted">{bus.type}</span>
          </div>
        </div>
        <span className="text-sm text-content-tertiary font-light">{bus.duration}</span>
      </div>

      {/* Timeline */}
      <div className="flex items-center gap-4 mb-5">
        <div>
          <p className="text-2xl font-light text-content-primary tabular-nums">{bus.departure}</p>
          <p className="text-sm text-content-muted mt-0.5">{from}</p>
        </div>
        <div className="flex-1 flex items-center gap-2 py-2">
          <div className="w-2 h-2 rounded-full bg-accent-500" />
          <div className="flex-1 h-px bg-gradient-to-r from-accent-400/30 via-black/[0.06] to-black/[0.06] relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-content-muted bg-white px-3 font-light">{bus.duration}</div>
          </div>
          <div className="w-2 h-2 rounded-full border-2 border-content-muted" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-light text-content-primary tabular-nums">{bus.arrival}</p>
          <p className="text-sm text-content-muted mt-0.5">{to}</p>
        </div>
      </div>

      {/* Action row */}
      <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-surface-overlay/60 border border-black/[0.03]">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs text-accent-600 bg-accent-50 px-2.5 py-0.5 rounded-full font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-500 animate-pulse" />
            Live seats on inquiry
          </span>
          <span className="text-xs text-content-muted">{bus.type}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-base font-semibold text-content-primary tabular-nums">₹{bus.fare.toLocaleString('en-IN')}</span>
            <span className="block text-[0.65rem] text-content-muted font-light">indicative fare</span>
          </div>
          <button
            type="button"
            onClick={() => onSelect({
              type: 'bus', id: bus.id, name: bus.operator, class: bus.type,
              fare: bus.fare, departure: bus.departure, arrival: bus.arrival,
              duration: bus.duration, from, to, date,
            })}
            className="group/ib inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs uppercase tracking-wider font-semibold bg-content-primary text-white hover:bg-brand-500 hover:shadow-glow transition-all duration-300 active:scale-95"
          >
            Inquire Now
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="transition-transform duration-300 group-hover/ib:translate-x-0.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>

    </div>
  )
}

// ─── Main Search Component ──────────────────────────────────────────────────
export const SearchJourneys = ({ onJourneySelect }) => {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [passengers, setPassengers] = useState(1)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')
  const [transport, setTransport] = useState('all')
  const [classFilter, setClassFilter] = useState('All')
  const sectionRef = useRef(null)
  const resultsRef = useRef(null)

  // Animate results container
  useEffect(() => {
    if (!searched || loading || !resultsRef.current) return
    gsap.fromTo(resultsRef.current, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' })
  }, [searched, loading])

  // Prefill from a destination card (RoutesSection dispatches this).
  useEffect(() => {
    const onPrefill = (e) => {
      const { from: pf, to: pt } = e.detail || {}
      if (pf) setFrom(pf)
      if (pt) setTo(pt)
      setError('')
      // Highlight the form so the user sees it filled in.
      const form = sectionRef.current?.querySelector('#search-from')
      if (form) gsap.fromTo(form.closest('.bg-white'), { boxShadow: '0 0 0 0 rgba(232,115,90,0)' }, { boxShadow: '0 0 0 4px rgba(232,115,90,0.25)', duration: 0.5, yoyo: true, repeat: 1, ease: 'power2.inOut' })
    }
    window.addEventListener('humsafar:prefill-search', onPrefill)
    return () => window.removeEventListener('humsafar:prefill-search', onPrefill)
  }, [])


  // Filter results
  const filteredTrains = useMemo(() => {
    if (!results?.trains) return []
    return results.trains.filter((t) => {
      if (transport === 'bus') return false
      if (classFilter === 'All') return true
      return t.classes.some((c) => c.type === classFilter)
    })
  }, [results, transport, classFilter])

  const filteredBuses = useMemo(() => {
    if (!results?.buses) return []
    return results.buses.filter((b) => {
      if (transport === 'train') return false
      if (classFilter === 'All') return true
      return b.type === classFilter
    })
  }, [results, transport, classFilter])

  const handleSearch = useCallback(async () => {
    setError('')
    if (!from.trim()) { setError('Please select where you\'re travelling from.'); return }
    if (!to.trim()) { setError('Please select your destination.'); return }
    if (from.trim().toLowerCase() === to.trim().toLowerCase()) { setError('Origin and destination cannot be the same.'); return }
    if (!date) { setError('Please pick a travel date.'); return }

    setLoading(true)
    setSearched(true)
    setTransport('all')
    setClassFilter('All')

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)

    try {
      const found = await SearchService.search({ from: from.trim(), to: to.trim(), date })
      setResults(found)
    } catch {
      setError('Something went wrong. Please try again.')
      setResults(null)
    } finally {
      setLoading(false)
    }
  }, [from, to, date])

  const handleSelect = useCallback((journey) => {
    onJourneySelect({ ...journey, passengers, travelDate: date })
  }, [onJourneySelect, passengers, date])

  const totalResults = filteredTrains.length + filteredBuses.length

  return (
    <section ref={sectionRef} id="search" className="relative z-raised">
      <div className="bg-surface-base">
        <div className="max-w-5xl mx-auto px-gutter py-section">
          {/* Header */}
          <div className="text-center mb-16 md:mb-20">
            <span className="text-xs uppercase tracking-widest text-brand-500 font-medium">
              Search & Compare
            </span>
            <h2 className="mt-4 font-display text-display font-normal text-content-primary leading-tight">
              Plan your next journey
            </h2>
            <p className="mt-4 max-w-lg mx-auto text-lg text-content-tertiary font-light leading-relaxed">
              Compare trains and buses across hundreds of routes. Find the schedule, class, and fare that works for you.
            </p>
          </div>

          {/* Search form — the hero product */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-3xl border border-black/[0.06] shadow-lg p-8 md:p-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <CityCombobox id="search-from" label="From" value={from} placeholder="e.g. Delhi"
                  onChange={(v) => { setFrom(v); if (v && v.trim().toLowerCase() === to.trim().toLowerCase()) setTo(''); if (error) setError('') }} />
                <CityCombobox id="search-to" label="To" value={to} placeholder="e.g. Jaipur"
                  onChange={(v) => {
                    if (v && v.trim().toLowerCase() === from.trim().toLowerCase()) { setError('Origin and destination cannot be the same.'); return }
                    setError(''); setTo(v)
                  }} />

                <div>
                  <label htmlFor="search-date" className="block text-xs font-medium tracking-wide text-content-tertiary mb-2 uppercase">Travel Date</label>
                  <input
                    id="search-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-white border border-black/[0.08] rounded-xl px-4 py-3.5 text-base text-content-primary outline-none transition-all duration-300 hover:border-black/[0.14] focus:border-accent-600 focus:ring-2 focus:ring-accent-600/10 shadow-xs"
                  />
                </div>
                <div>
                  <label htmlFor="search-pax" className="block text-xs font-medium tracking-wide text-content-tertiary mb-2 uppercase">Passengers</label>
                  <input
                    id="search-pax"
                    type="number"
                    value={passengers}
                    onChange={(e) => setPassengers(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                    min={1}
                    max={50}
                    className="w-full bg-white border border-black/[0.08] rounded-xl px-4 py-3.5 text-base text-content-primary outline-none transition-all duration-300 hover:border-black/[0.14] focus:border-accent-600 focus:ring-2 focus:ring-accent-600/10 shadow-xs"
                  />
                </div>
              </div>

              {error && <p role="alert" className="mt-5 text-sm text-status-danger font-light text-center">{error}</p>}

              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={loading}
                  className={cn(
                    'px-14 py-4 rounded-full text-sm uppercase tracking-wider font-medium transition-all duration-400 active:scale-[0.97]',
                    loading
                      ? 'bg-surface-overlay text-content-muted cursor-wait'
                      : 'bg-brand-500 text-white hover:bg-brand-400 hover:shadow-glow shadow-md',
                  )}
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Searching...
                    </span>
                  ) : 'Search Journeys'}
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {searched && (
            <div ref={resultsRef} className={loading ? '' : 'invisible'}>
              {loading ? (
                <SearchLoading />
              ) : results ? (
                <div>
                  {/* Results header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-medium text-content-primary">
                        {from} <span className="text-content-muted mx-2">→</span> {to}
                      </h3>
                      <p className="text-sm text-content-muted font-light mt-1">{totalResults} options found · Estimated fares</p>
                    </div>
                  </div>

                  <FilterBar transport={transport} setTransport={setTransport} classFilter={classFilter} setClassFilter={setClassFilter} />

                  {totalResults === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-content-muted text-base font-light">No results match your filters.</p>
                      <button type="button" onClick={() => { setTransport('all'); setClassFilter('All') }}
                        className="mt-4 text-sm text-brand-500 hover:text-brand-400 font-medium transition-colors">
                        Clear all filters
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-10">
                      {/* Trains */}
                      {filteredTrains.length > 0 && (
                        <div>
                          <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-brand-500"><rect x="4" y="3" width="16" height="16" rx="3" /><path d="M4 11h16M9 19l-2 3M15 19l2 3M12 3v8" /></svg>
                            </div>
                            <h4 className="text-sm uppercase tracking-wider text-content-secondary font-medium">Trains</h4>
                            <span className="text-xs text-content-muted">({filteredTrains.length})</span>
                          </div>
                          <div className="grid gap-4">
                            {filteredTrains.map((train, i) => (
                              <TrainCard key={train.id} train={train} from={from} to={to} date={date} onSelect={handleSelect} index={i} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Buses */}
                      {filteredBuses.length > 0 && (
                        <div>
                          <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-accent-600"><rect x="3" y="4" width="18" height="14" rx="3" /><path d="M3 10h18M7 18v2M17 18v2" /></svg>
                            </div>
                            <h4 className="text-sm uppercase tracking-wider text-content-secondary font-medium">Buses</h4>
                            <span className="text-xs text-content-muted">({filteredBuses.length})</span>
                          </div>
                          <div className="grid gap-4">
                            {filteredBuses.map((bus, i) => (
                              <BusCard key={bus.id} bus={bus} from={from} to={to} date={date} onSelect={handleSelect} index={i} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-12 flex flex-col items-center gap-2 text-center">
                    <p className="inline-flex items-center gap-2 text-xs text-content-tertiary font-medium">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-accent-600"><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></svg>
                      Live seat availability &amp; final fares are confirmed by our team when you inquire.
                    </p>
                    <p className="text-[0.7rem] text-content-muted font-light">
                      Schedules &amp; indicative fares are for reference — we verify against IRCTC &amp; operator systems before booking.
                    </p>
                  </div>

                </div>
              ) : (
                <EmptyState from={from} to={to} />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default SearchJourneys
