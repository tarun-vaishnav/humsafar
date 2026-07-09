import { forwardRef } from 'react'
import { cn } from '@utils/cn'

/**
 * Editorial typography primitives.
 *
 * Heading — variable-serif display, seven scales mapped to design tokens.
 * Text    — inter/sans body, four sizes.
 * Eyebrow — uppercase micro-label used above section headlines.
 *
 * All primitives take `as` for tag polymorphism and merge classNames safely.
 */

// ─── Heading ────────────────────────────────────────────────────────────────
const headingVariants = {
  hero: 'font-display font-light text-hero text-balance',
  display: 'font-display font-light text-display text-balance',
  headline: 'font-display font-normal text-headline text-balance',
  h1: 'font-display font-normal text-5xl md:text-6xl text-balance',
  h2: 'font-display font-normal text-4xl md:text-5xl text-balance',
  h3: 'font-display font-normal text-3xl md:text-4xl text-balance',
  h4: 'font-display font-medium text-2xl md:text-3xl text-balance',
  h5: 'font-sans font-semibold text-xl text-balance',
  h6: 'font-sans font-semibold text-lg text-balance',
}

const headingTag = {
  hero: 'h1',
  display: 'h1',
  headline: 'h2',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
}

export const Heading = forwardRef(function Heading(
  { as, variant = 'h2', className, children, ...rest },
  ref,
) {
  const Tag = as ?? headingTag[variant] ?? 'h2'
  return (
    <Tag ref={ref} className={cn('tracking-tight', headingVariants[variant], className)} {...rest}>
      {children}
    </Tag>
  )
})

// ─── Text ───────────────────────────────────────────────────────────────────
const textVariants = {
  lead: 'text-lg md:text-xl leading-relaxed text-content-secondary text-pretty',
  body: 'text-base leading-relaxed text-content-secondary text-pretty',
  small: 'text-sm leading-normal text-content-tertiary',
  caption: 'text-xs leading-normal text-content-muted',
}

export const Text = forwardRef(function Text(
  { as: Tag = 'p', variant = 'body', className, children, ...rest },
  ref,
) {
  return (
    <Tag ref={ref} className={cn(textVariants[variant], className)} {...rest}>
      {children}
    </Tag>
  )
})

// ─── Eyebrow ────────────────────────────────────────────────────────────────
export const Eyebrow = forwardRef(function Eyebrow(
  { as: Tag = 'span', className, children, ...rest },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={cn(
        'font-sans text-eyebrow uppercase text-content-tertiary',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
})

export default Heading
