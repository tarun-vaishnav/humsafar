import { cn } from '@utils/cn'

/**
 * Placeholder shimmer for loading states. Not decorative — always pair with
 * `aria-busy` on the parent region so screen readers announce loading.
 */
export const Skeleton = ({ className, ...rest }) => (
  <div
    className={cn(
      'relative overflow-hidden rounded-md bg-surface-raised',
      'before:absolute before:inset-0 before:-translate-x-full',
      'before:animate-[shimmer_1.5s_infinite]',
      'before:bg-gradient-to-r before:from-transparent before:via-black/[0.03] before:to-transparent',
      className,
    )}
    aria-hidden
    {...rest}
  />
)

export default Skeleton
