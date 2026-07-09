import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { gsap } from '@animations/gsap'
import { cn } from '@utils/cn'
import { CityService } from '@services/CityService'

/**
 * Premium city combobox — warm light theme.
 * Searchable dropdown with keyboard navigation, ARIA combobox pattern.
 */
export function CityCombobox({ id, label, value, onChange, placeholder = 'Select city' }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const panelRef = useRef(null)

  const results = useMemo(() => CityService.search(query || '', 20), [query])

  // Animate panel
  useEffect(() => {
    if (!panelRef.current) return
    if (open) {
      gsap.fromTo(panelRef.current,
        { autoAlpha: 0, y: -6, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.25, ease: 'power3.out' },
      )
    } else {
      gsap.to(panelRef.current, { autoAlpha: 0, y: -6, scale: 0.98, duration: 0.15, ease: 'power2.in' })
    }
  }, [open])

  // Outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Scroll active into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return
    const el = listRef.current.children[activeIndex]
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  const select = useCallback((city) => {
    onChange(city.name)
    setQuery('')
    setOpen(false)
    setActiveIndex(-1)
  }, [onChange])

  const handleKeyDown = useCallback((e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) { setOpen(true); return }
    if (!open) return

    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, results.length - 1)); break
      case 'ArrowUp': e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); break
      case 'Enter': e.preventDefault(); if (activeIndex >= 0 && results[activeIndex]) select(results[activeIndex]); break
      case 'Escape': setOpen(false); setActiveIndex(-1); break
      case 'Tab': setOpen(false); break
      default: break
    }
  }, [open, activeIndex, results, select])

  const handleInputChange = useCallback((e) => {
    setQuery(e.target.value)
    setActiveIndex(-1)
    if (!open) setOpen(true)
  }, [open])

  const activeDescendant = activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className="block text-xs font-medium tracking-wide text-content-tertiary mb-2 uppercase">
        {label}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={`${id}-listbox`}
          aria-activedescendant={activeDescendant}
          autoComplete="off"
          value={open ? query : value}
          placeholder={value || placeholder}
          onFocus={() => { setOpen(true); setQuery('') }}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full bg-white border border-black/[0.08] rounded-xl px-4 py-3.5 text-base text-content-primary',
            'placeholder:text-content-muted outline-none transition-all duration-300',
            'hover:border-black/[0.14] focus:border-accent-600 focus:ring-2 focus:ring-accent-600/10',
            'shadow-xs',
          )}
        />

        {/* Chevron */}
        <button
          type="button"
          tabIndex={-1}
          onClick={() => { setOpen(!open); inputRef.current?.focus() }}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-secondary transition-colors"
          aria-label="Toggle city list"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={open ? 'M12 10L8 6L4 10' : 'M4 6L8 10L12 6'} />
          </svg>
        </button>
      </div>

      {/* Dropdown panel */}
      <div
        ref={panelRef}
        className="invisible absolute z-dropdown left-0 right-0 mt-2"
        style={{ pointerEvents: open ? 'auto' : 'none' }}
      >
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-lg overflow-hidden">
          <ul
            ref={listRef}
            id={`${id}-listbox`}
            role="listbox"
            className="max-h-64 overflow-y-auto py-2 scrollbar-none"
          >
            {results.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-content-muted">No cities found</li>
            ) : (
              results.map((city, i) => {
                const isActive = i === activeIndex
                const isSelected = city.name === value
                return (
                  <li
                    key={city.id}
                    id={`${id}-option-${i}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => select(city)}
                    onKeyDown={(e) => { if (e.key === 'Enter') select(city) }}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={cn(
                      'px-4 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors duration-150',
                      isActive ? 'bg-surface-overlay' : 'hover:bg-surface-overlay/60',
                      isSelected && 'text-accent-600',
                    )}
                  >
                    <div>
                      <span className={cn('text-sm font-medium', isSelected ? 'text-accent-600' : 'text-content-primary')}>
                        {city.name}
                      </span>
                      <span className="text-xs text-content-muted ml-2">{city.state}</span>
                    </div>
                    {isSelected && (
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-600 shrink-0">
                        <polyline points="3 8 7 12 13 4" />
                      </svg>
                    )}
                  </li>
                )
              })
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CityCombobox
