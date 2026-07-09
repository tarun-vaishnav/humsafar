import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppProvider } from '@providers/AppProvider'
import { Loader, Cursor } from '@components/ui'
import env from '@config/env'

/**
 * Root application shell.
 *
 * Pages are code-split via `React.lazy` so the initial route ships only the
 * bytes needed for the landing screen. Route-level Suspense boundaries let us
 * mount a global loader without freezing the layout chrome.
 *
 * The Canvas is intentionally NOT here — pages that need 3D mount their own
 * `<Canvas>` inside the layout so scenes stay page-scoped. `SceneProvider`
 * still lives in `AppProvider` so the flag/tier context is available before
 * any Canvas exists.
 */
const HomePage = lazy(() => import('@pages/HomePage'))
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'))
const TrackPage = lazy(() => import('@pages/TrackPage'))
const AdminPage = lazy(() => import('@pages/AdminPage'))

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <Loader size="lg" label="Loading…" />
  </div>
)

export const App = () => (
  <AppProvider>
    <Cursor />
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/track" element={<TrackPage />} />
        {/* Hidden admin panel — obscure path, real auth behind it. */}
        <Route path={`/${env.admin.path}`} element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </AppProvider>
)

export default App
