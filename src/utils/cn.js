import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Compose className strings with conflict-safe Tailwind merging.
 * Use everywhere instead of manual string concatenation.
 */
export const cn = (...inputs) => twMerge(clsx(inputs))

export default cn
