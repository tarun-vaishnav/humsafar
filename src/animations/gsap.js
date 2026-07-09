/**
 * Global GSAP configuration.
 *
 * Import this module once at app boot (see /providers/AppProvider) so plugins
 * are registered before any component tries to use them. Every animation file
 * should import gsap FROM HERE, never from 'gsap' directly, so the plugin
 * registration side-effect is guaranteed.
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { gsapDuration, gsapEasing } from '@styles/tokens'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

// Sensible defaults across every tween.
gsap.defaults({
  ease: gsapEasing.smooth,
  duration: gsapDuration.smooth,
  overwrite: 'auto',
})

// Smaller lag if we drop below 30fps — keeps animations from "catching up"
// after a stall which usually looks worse than a blip.
gsap.ticker.lagSmoothing(500, 33)

// Respect reduced-motion at the engine level. This wraps every animation so
// duration is squashed to near-zero when the user has requested less motion.
if (typeof window !== 'undefined') {
  const mql = window.matchMedia?.('(prefers-reduced-motion: reduce)')
  const apply = () => {
    gsap.globalTimeline.timeScale(mql?.matches ? 100 : 1)
  }
  apply()
  mql?.addEventListener?.('change', apply)
}

export { gsap, ScrollTrigger, ScrollToPlugin }
export default gsap
