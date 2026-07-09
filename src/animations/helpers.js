/**
 * Higher-level animation helpers. Compose these instead of writing raw GSAP
 * every time you need a reveal, split-text, or scrubbed timeline.
 */
import { gsap, ScrollTrigger } from './gsap'
import { reveals, stagger as staggerTokens } from './presets'
import { gsapDuration, gsapEasing } from '@styles/tokens'

/**
 * Reveal a single element (or NodeList) using a named preset from `reveals`.
 * Returns the tween so callers can await, chain, or kill it.
 */
export const revealElement = (target, preset = 'fadeUp', overrides = {}) => {
  const p = reveals[preset] ?? reveals.fadeUp
  return gsap.fromTo(target, p.from, { ...p.to, ...overrides })
}

/**
 * Stagger-reveal a list of elements as a ScrollTrigger scene.
 * `trigger` defaults to the first target — pass a wrapper for finer control.
 */
export const revealOnScroll = (targets, opts = {}) => {
  const {
    preset = 'fadeUp',
    stagger = staggerTokens.base,
    start = 'top 80%',
    end = 'top 40%',
    trigger,
    scrub = false,
    once = true,
    ...overrides
  } = opts

  const p = reveals[preset] ?? reveals.fadeUp

  return gsap.fromTo(targets, p.from, {
    ...p.to,
    ...overrides,
    stagger,
    scrollTrigger: {
      trigger: trigger ?? targets,
      start,
      end,
      scrub,
      once: !scrub && once,
    },
  })
}

/**
 * Attach a scrubbed timeline to a section. Great for pinned hero acts,
 * horizontal scroll sequences, parallax composites.
 */
export const scrubTimeline = ({
  trigger,
  start = 'top top',
  end = 'bottom top',
  scrub = 1,
  pin = false,
  onEnter,
  onLeave,
} = {}) => {
  const tl = gsap.timeline({
    scrollTrigger: { trigger, start, end, scrub, pin, onEnter, onLeave },
    defaults: { ease: 'none' },
  })
  return tl
}

/**
 * Split text nodes into per-word or per-char spans — a lightweight alternative
 * to GSAP SplitText that keeps the app free of Club Greensock dependencies.
 * The returned array of spans can be tweened directly.
 */
export const splitText = (element, mode = 'word') => {
  if (!element) return []
  const original = element.textContent ?? ''
  element.textContent = ''

  const segments =
    mode === 'char'
      ? Array.from(original)
      : original.split(/(\s+)/) // preserve whitespace between words

  const nodes = []
  segments.forEach((seg) => {
    if (/^\s+$/.test(seg)) {
      element.appendChild(document.createTextNode(seg))
      return
    }
    const span = document.createElement('span')
    span.className = 'inline-block will-change-transform'
    span.setAttribute('aria-hidden', 'true')
    span.textContent = seg
    element.appendChild(span)
    nodes.push(span)
  })

  // Preserve accessibility — full text stays available to screen readers.
  const srSpan = document.createElement('span')
  srSpan.className = 'sr-only-visually'
  srSpan.textContent = original
  element.prepend(srSpan)

  return nodes
}

/**
 * Refresh ScrollTrigger — call after DOM changes that affect layout (font swap,
 * images loaded, route change etc.).
 */
export const refreshScroll = () => ScrollTrigger.refresh()

/**
 * Kill every ScrollTrigger, tween, and lingering context. Call on hot-reload
 * during dev; providers call it on unmount.
 */
export const killAllAnimations = () => {
  ScrollTrigger.getAll().forEach((t) => t.kill())
  gsap.globalTimeline.clear()
}

export { gsapDuration, gsapEasing }
