import { useMediaQuery } from './useMediaQuery'

/**
 * `true` when the OS reports prefers-reduced-motion. Gate every non-essential
 * animation on this, or check `env` / gsap timeline scaling that already reads it.
 */
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

export default useReducedMotion
