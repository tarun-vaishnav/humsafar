import { forwardRef } from 'react'
import { cn } from '@utils/cn'

/**
 * Elevated content surface. Wraps common patterns — bordered background,
 * radius, optional interactive lift on hover.
 *
 * Composition-first: pass children freely; there's no forced header/footer.
 */
const variants = {
  default: 'bg-surface-raised border border-border-default',
  raised: 'bg-surface-overlay border border-border-default shadow-lg',
  ghost: 'bg-transparent border border-border-subtle',
  glass:
    'bg-surface-raised/60 backdrop-blur-xl backdrop-saturate-150 border border-border-default',
}

const padding = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
}

export const Card = forwardRef(function Card(
  {
    as: Tag = 'article',
    variant = 'default',
    interactive = false,
    padding: pad = 'md',
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-2xl',
        variants[variant],
        padding[pad],
        interactive &&
          'transition-[transform,box-shadow,border-color] duration-base ease-smooth ' +
            'hover:-translate-y-1 hover:border-border-strong hover:shadow-xl',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
})

export default Card
