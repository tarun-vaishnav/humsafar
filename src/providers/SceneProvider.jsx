import { createContext, useContext, useMemo, useState } from 'react'
import { env } from '@config/env'
import { getDevicePerformanceTier, prefersReducedMotion, isWebGLAvailable } from '@utils/device'

/**
 * SceneProvider owns global 3D concerns without touching WebGL itself. It
 * publishes:
 *
 *   – `enabled`     — whether 3D should render (feature flag + WebGL support
 *                     + not reduced motion).
 *   – `tier`        — device performance tier (`low`/`medium`/`high`).
 *   – `assetsReady` — flipped `true` once critical GLB/HDRI assets are cached.
 *   – `mark(name)`  — tag a preload asset as loaded, useful for progress bars.
 *   – `activeScene` / `setActiveScene` — string key for the currently visible
 *     scene, so pages can control which R3F sub-tree is rendered without
 *     spinning up their own contexts.
 */
const SceneContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components
export const useScene = () => {
  const ctx = useContext(SceneContext)
  if (!ctx) throw new Error('useScene must be used inside <SceneProvider>')
  return ctx
}

export const SceneProvider = ({ children }) => {
  const [assets, setAssets] = useState({})
  const [activeScene, setActiveScene] = useState(null)
  // Tier detection runs once at mount via lazy initializer — no post-mount
  // setState pattern, and it stays stable through StrictMode double-invocation.
  const [tier] = useState(() => getDevicePerformanceTier())

  const enabled = useMemo(
    () => env.features.threeD && isWebGLAvailable() && !prefersReducedMotion(),
    [],
  )

  const value = useMemo(
    () => ({
      enabled,
      tier,
      activeScene,
      setActiveScene,
      assetsReady: Object.values(assets).every(Boolean),
      mark: (name) => setAssets((prev) => ({ ...prev, [name]: true })),
    }),
    [enabled, tier, activeScene, assets],
  )

  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>
}

export default SceneProvider
