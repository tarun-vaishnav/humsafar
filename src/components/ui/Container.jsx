import { forwardRef } from 'react'
import { cn } from '@utils/cn'

/**
 * Horizontal wrapper that caps content at the design-system `container` width
 * and applies the semantic `gutter` inline padding.
 *
 * `size`: `narrow` (prose), `default`, `wide` (full container), `full` (edge to edge).
 */
const sizes = {
  narrow: 'max-w-prose',
  default: 'max-w-container',
  wide: 'max-w-[1680px]',
  full: 'max-w-none',
}

export const Container = forwardRef(function Container(
  { as: Tag = 'div', size = 'default', className, children, ...rest },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={cn('mx-auto w-full px-gutter', sizes[size], className)}
      {...rest}
    >
      {children}
    </Tag>
  )
})

export default Container
