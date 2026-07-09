import { Suspense, useMemo } from 'react'
import { Canvas as R3FCanvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei'
import * as THREE from 'three'
import { env } from '@config/env'
import { getDevicePerformanceTier } from '@utils/device'

/**
 * Global R3F canvas — the *single* WebGL context for the app. Individual scenes
 * are declared as children (via <View /> from drei, or plain groups behind a
 * scroll-linked router) rather than remounting new canvases per section.
 *
 * Perf-adaptive:
 * — DPR ceiling drops on low tiers so mid-range Androids don't spike GPU cost.
 * — AdaptiveDpr trims resolution during scroll, restoring it when idle.
 * — AdaptiveEvents throttles raycasting during fast scroll.
 *
 * The canvas is `fixed` behind DOM so scroll-driven scenes can be rendered
 * beneath rich content without repainting the WebGL surface.
 */

const dprByTier = {
  low: [1, 1.25],
  medium: [1, 1.75],
  high: [1, 2],
}

export const Canvas = ({ children, camera, className, eventsAsRoot = false, ...rest }) => {
  const tier = getDevicePerformanceTier()
  const dpr = dprByTier[tier] ?? dprByTier.medium

  const cameraProps = useMemo(
    () => ({
      position: [0, 0, 6],
      fov: 45,
      near: 0.1,
      far: 100,
      ...camera,
    }),
    [camera],
  )

  return (
    <div
      className={
        'fixed inset-0 -z-hover pointer-events-none ' + (className ?? '')
      }
      // The canvas paints behind everything; specific overlays that need pointer
      // events on the WebGL should opt in via `data-r3f-events` at their level.
      aria-hidden
    >
      <R3FCanvas
        camera={cameraProps}
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
          // sRGB output matches the rest of the CSS pipeline.
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        flat={false}
        eventSource={eventsAsRoot && typeof document !== 'undefined' ? document.body : undefined}
        eventPrefix={eventsAsRoot ? 'client' : undefined}
        frameloop={env.features.threeD ? 'demand' : 'never'}
        performance={{ min: 0.5, max: 1, debounce: 200 }}
        {...rest}
      >
        <color attach="background" args={[0, 0, 0]} />
        <fog attach="fog" args={[0x08090b, 8, 30]} />
        <AdaptiveDpr pixelated={false} />
        <AdaptiveEvents />
        <Suspense fallback={null}>
          {children}
          <Preload all />
        </Suspense>
      </R3FCanvas>
    </div>
  )
}

export default Canvas
