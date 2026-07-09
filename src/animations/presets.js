/**
 * Reusable animation presets. Every animation in the app should compose
 * these — never re-invent a fade-in from scratch.
 *
 * `from` presets are meant for `gsap.from()` (component enters from this state
 * and animates to its natural DOM values).
 */
import { gsapDuration, gsapEasing } from '@styles/tokens'

// ─── Reveal / entrance ──────────────────────────────────────────────────────
export const reveals = {
  fadeUp: {
    from: { autoAlpha: 0, y: 40 },
    to: { autoAlpha: 1, y: 0, duration: gsapDuration.smooth, ease: gsapEasing.smooth },
  },
  fadeDown: {
    from: { autoAlpha: 0, y: -40 },
    to: { autoAlpha: 1, y: 0, duration: gsapDuration.smooth, ease: gsapEasing.smooth },
  },
  fadeIn: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: gsapDuration.smooth, ease: gsapEasing.smooth },
  },
  scaleIn: {
    from: { autoAlpha: 0, scale: 0.92 },
    to: {
      autoAlpha: 1,
      scale: 1,
      duration: gsapDuration.smooth,
      ease: gsapEasing.expressive,
    },
  },
  slideRight: {
    from: { autoAlpha: 0, x: -60 },
    to: { autoAlpha: 1, x: 0, duration: gsapDuration.smooth, ease: gsapEasing.smooth },
  },
  slideLeft: {
    from: { autoAlpha: 0, x: 60 },
    to: { autoAlpha: 1, x: 0, duration: gsapDuration.smooth, ease: gsapEasing.smooth },
  },
  cinematic: {
    from: { autoAlpha: 0, y: 80, filter: 'blur(24px)' },
    to: {
      autoAlpha: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: gsapDuration.hero,
      ease: gsapEasing.expressive,
    },
  },
}

// ─── Micro-interactions ─────────────────────────────────────────────────────
export const micro = {
  hoverLift: { y: -3, duration: gsapDuration.base, ease: gsapEasing.smooth },
  hoverGlow: { scale: 1.03, duration: gsapDuration.base, ease: gsapEasing.smooth },
  press: { scale: 0.97, duration: gsapDuration.quick, ease: gsapEasing.swift },
  release: { scale: 1, duration: gsapDuration.base, ease: gsapEasing.overshoot },
}

// ─── Stagger ────────────────────────────────────────────────────────────────
export const stagger = {
  fine: 0.04,
  base: 0.08,
  loose: 0.14,
  cinematic: 0.22,
}
