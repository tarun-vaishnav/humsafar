import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'

// Side-effect: force GSAP+plugin registration to run at boot before any
// component reaches for the animation engine.
import '@animations/gsap'

import { QueryProvider } from './QueryProvider'
import { MotionProvider } from './MotionProvider'
import { SceneProvider } from './SceneProvider'
import { ScrollProvider } from './ScrollProvider'
import { env } from '@config/env'

/**
 * Root composition of every cross-cutting provider, ordered by dependency:
 *
 *   Router → data-cache → motion → scene → smooth-scroll → app
 *
 * Reasoning:
 *   – Router first so any redirect / SSR concern lands before hooks fire.
 *   – Data before motion so page-level suspense can render skeletons whose
 *     variants Motion knows how to reduce.
 *   – Scene wraps Scroll because ScrollTrigger drives 3D camera timelines.
 *
 * NOTE: `<head>` management via react-helmet-async is intentionally omitted at
 * this scaffolding stage. Add a HelmetProvider wrap here once we install the
 * dependency and start authoring page-level metadata.
 */
export const AppProvider = ({ children }) => (
  <BrowserRouter basename={env.baseUrl === '/' ? undefined : env.baseUrl}>
    <QueryProvider>
      <MotionProvider>
        <SceneProvider>
          <ScrollProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </ScrollProvider>
        </SceneProvider>
      </MotionProvider>
    </QueryProvider>
  </BrowserRouter>
)

export default AppProvider
