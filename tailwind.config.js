/** @type {import('tailwindcss').Config} */
import { tokens } from './src/styles/tokens.js'

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    screens: tokens.breakpoints,
    colors: tokens.colors,
    fontFamily: tokens.fontFamily,
    fontSize: tokens.fontSize,
    fontWeight: tokens.fontWeight,
    letterSpacing: tokens.letterSpacing,
    lineHeight: tokens.lineHeight,
    spacing: tokens.spacing,
    borderRadius: tokens.radius,
    boxShadow: tokens.shadow,
    zIndex: tokens.zIndex,
    transitionTimingFunction: tokens.easing,
    transitionDuration: tokens.duration,
    backgroundImage: tokens.gradients,
    extend: {
      // Standard palettes re-added here (theme.colors replaces the default
      // palette, so admin/utility UI needs these scales back).
      colors: {
        gray: {
          50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db',
          400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151',
          800: '#1f2937', 900: '#111827', 950: '#030712',
        },
        indigo: {
          50: '#eef2ff', 100: '#e0e7ff', 400: '#818cf8', 500: '#6366f1',
          600: '#4f46e5', 700: '#4338ca',
        },
        green: {
          50: '#f0fdf4', 100: '#dcfce7', 400: '#4ade80', 500: '#22c55e',
          600: '#16a34a', 700: '#15803d',
        },
        red: {
          50: '#fef2f2', 100: '#fee2e2', 400: '#f87171', 500: '#ef4444',
          600: '#dc2626', 700: '#b91c1c',
        },
        amber: {
          50: '#fffbeb', 100: '#fef3c7', 400: '#fbbf24', 500: '#f59e0b',
          600: '#d97706', 700: '#b45309',
        },
        orange: {
          50: '#fff7ed', 100: '#ffedd5', 400: '#fb923c', 500: '#f97316',
          600: '#ea580c', 700: '#c2410c',
        },
      },
      blur: tokens.blur,
      backdropBlur: tokens.blur,
      maxWidth: {
        container: tokens.container.max,
        prose: tokens.container.prose,
      },
      aspectRatio: tokens.aspect,
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'spin-slow': 'spinSlow 2.4s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
