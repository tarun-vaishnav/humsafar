import { forwardRef } from 'react'
import { cn } from '@utils/cn'
import { Container } from './Container'

/**
 * Vertical block of the page. Applies the `section` spacing token top/bottom,
 * optionally centers content, and wraps children in a Container by default.
 *
 * Set `bare` when you need to control the container yourself (e.g. hero acts
 * that go edge-to-edge or split into columns).
 */
export const Section = forwardRef(function Section(
  {
    as: Tag = 'section',
    id,
    size = 'default',
    className,
    contentClassName,
    bare = false,
    children,
    ...rest
  },
  ref,
) {
  return (
    <Tag
      ref={ref}
      id={id}
      className={cn('relative py-section', className)}
      {...rest}
    >
      {bare ? (
        children
      ) : (
        <Container size={size} className={contentClassName}>
          {children}
        </Container>
      )}
    </Tag>
  )
})

export default Section
