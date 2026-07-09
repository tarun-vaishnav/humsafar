import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

/**
 * App bootstrap.
 *
 * — Uses React 19's `createRoot` with StrictMode to catch effect-cleanup bugs
 *   (our Lenis/GSAP setup runs cleanly through the double-invocation).
 * — `global.css` is imported once here so Tailwind's layered directives and
 *   font-face rules land before the first paint.
 */
const container = document.getElementById('root')
if (!container) throw new Error('#root not found in index.html')

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
