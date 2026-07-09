import { forwardRef } from 'react'
import { cn } from '@utils/cn'

/**
 * Design-system Button — awwwards-grade micro-interactions.
 *
 * • Renders fully-styled at rest (no "white until hover" flashes).
 * • Coral gradient fill uses explicit numeric shades (brand-400/500/600) so
 *   the gradient always resolves.
 * • Hover: subtle lift + deepened shadow + a diagonal light-sweep.
 * • `as` for polymorphism; forwards ref (works with useMagnetic).
 */

const base =
  'group/btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold ' +
  'overflow-hidden select-none will-change-transform ' +
  'transition-[transform,box-shadow,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ' +
  'active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base'

const variants = {
  // Primary — warm coral gradient, the hero action.
  primary:
    'text-white border border-brand-500/40 ' +
    'bg-[linear-gradient(135deg,#F08A6E_0%,#E8735A_35%,#D95F4A_70%,#C44B3A_100%)] ' +
    'shadow-[0_10px_30px_-8px_rgba(217,95,74,0.6),inset_0_1px_0_rgba(255,255,255,0.25)] ' +
    'hover:shadow-[0_16px_40px_-8px_rgba(217,95,74,0.75),inset_0_1px_0_rgba(255,255,255,0.35)] ' +
    'hover:-translate-y-0.5',
  // Ink — confident dark charcoal, warms to coral on hover.
  ink:
    'text-white border border-white/5 bg-content-primary ' +
    'shadow-[0_10px_30px_-10px_rgba(42,39,34,0.65)] ' +
    'hover:bg-brand-500 hover:border-brand-400 hover:shadow-[0_16px_40px_-8px_rgba(217,95,74,0.6)] hover:-translate-y-0.5',
  // Ghost — glassy outline that fills warm on hover.
  ghost:
    'text-content-secondary border border-content-primary/12 bg-white/70 backdrop-blur-md ' +
    'shadow-[0_2px_10px_-4px_rgba(42,39,34,0.12)] ' +
    'hover:text-brand-600 hover:border-brand-400/50 hover:bg-brand-50 ' +
    'hover:shadow-[0_12px_30px_-10px_rgba(232,115,90,0.4)] hover:-translate-y-0.5',
  secondary:
    'bg-surface-raised text-content-primary border border-content-primary/8 hover:border-content-primary/16 hover:-translate-y-0.5 shadow-sm',
  outline:
    'bg-transparent text-content-primary border border-content-primary/16 hover:border-brand-400 hover:text-brand-600',
  link: 'bg-transparent text-accent-600 hover:text-brand-500 underline underline-offset-4 px-0',
}

const sizes = {
  sm: 'h-9 px-5 text-xs rounded-pill tracking-wide',
  md: 'h-11 px-7 text-sm rounded-pill tracking-wide',
  lg: 'h-[3.4rem] px-9 text-[0.95rem] rounded-pill tracking-wide',
  icon: 'h-11 w-11 rounded-full text-base',
}

const SHEEN = new Set(['primary', 'ink', 'ghost'])

export const Button = forwardRef(function Button(
  { as: Tag = 'button', variant = 'primary', size = 'md', type, className, children, ...rest },
  ref,
) {
  return (
    <Tag
      ref={ref}
      type={Tag === 'button' ? (type ?? 'button') : type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {SHEEN.has(variant) && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 h-full w-1/3 -translate-x-[200%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-[900ms] ease-out group-hover/btn:translate-x-[400%]"
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </Tag>
  )
})

export default Button
