import { forwardRef } from 'react'
import { cn } from '@utils/cn'

/**
 * Compact status / label pill. Used for feature flags, category tags, and
 * hero eyebrow chips.
 *
 * DESIGN SYSTEM: Warm, subtle backgrounds. No neon. No aggressive contrast.
 */
const variants = {
  default: 'bg-surface-overlay text-content-secondary border-border-default',
  brand: 'bg-brand-50 text-brand-600 border-brand-500/20',
  accent: 'bg-accent-50 text-accent-600 border-accent-600/20',
  golden: 'bg-golden-50 text-golden-500 border-golden-500/20',
  forest: 'bg-forest-50 text-forest-500 border-forest-DEFAULT/20',
  success: 'bg-forest-50 text-status-positive border-status-positive/20',
  warning: 'bg-golden-50 text-status-warning border-status-warning/20',
  danger: 'bg-brand-50 text-status-danger border-status-danger/20',
  outline: 'bg-transparent text-content-tertiary border-border-strong',
}

export const Badge = forwardRef(function Badge(
  { variant = 'default', className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill border px-3 py-1 text-xs font-medium tracking-wide',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
})

export default Badge
