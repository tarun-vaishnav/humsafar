import { cn } from '@utils/cn'

/**
 * Minimal, brand-tinted spinner. Renders an `role="status"` region so
 * assistive tech announces loading. Text label is visually hidden.
 */
const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
}

export const Loader = ({ size = 'md', label = 'Loading…', className }) => (
  <span role="status" aria-live="polite" className={cn('inline-flex items-center gap-2', className)}>
    <span
      className={cn(
        'inline-block rounded-full border-border-default border-t-brand animate-spin-slow',
        sizes[size],
      )}
      aria-hidden
    />
    <span className="sr-only-visually">{label}</span>
  </span>
)

export default Loader
