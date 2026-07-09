/**
 * Global smooth-scroll: a single Lenis instance, driven by GSAP's ticker so
 * ScrollTrigger and Lenis stay in perfect frame-sync.
 *
 * The instance is a singleton — mounted once by ScrollProvider and available
 * anywhere via `getLenis()`. Never call `new Lenis()` outside this module.
 */
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'
import { env } from '@config/env'
import { prefersReducedMotion } from '@utils/device'

let lenisInstance = null
let tickerAttached = false

const defaults = {
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ease-out-expo-ish
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1.4,
  lerp: 0.1,
  syncTouch: false,
}

const rafTicker = (time) => {
  // GSAP passes seconds; Lenis expects milliseconds.
  lenisInstance?.raf(time * 1000)
}

export const initScroll = (options = {}) => {
  if (lenisInstance) return lenisInstance

  // Users with prefers-reduced-motion or the feature-flag off get native scroll.
  if (!env.features.lenis || prefersReducedMotion()) return null

  lenisInstance = new Lenis({ ...defaults, ...options })

  // Bridge Lenis → ScrollTrigger so every ScrollTrigger updates on the smoothed
  // scrollTop rather than the raw browser value.
  lenisInstance.on('scroll', ScrollTrigger.update)

  if (!tickerAttached) {
    gsap.ticker.add(rafTicker)
    gsap.ticker.lagSmoothing(0)
    tickerAttached = true
  }

  return lenisInstance
}

export const destroyScroll = () => {
  if (!lenisInstance) return
  gsap.ticker.remove(rafTicker)
  tickerAttached = false
  lenisInstance.destroy()
  lenisInstance = null
}

export const getLenis = () => lenisInstance

export const scrollTo = (target, opts = {}) => {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { duration: 1.2, ...opts })
  } else if (typeof window !== 'undefined') {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (el instanceof Element) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' })
  }
}

export const startScroll = () => lenisInstance?.start()
export const stopScroll = () => lenisInstance?.stop()
