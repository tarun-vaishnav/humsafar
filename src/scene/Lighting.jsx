import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { colors as themeColors } from '@styles/theme'

/**
 * Cinematic 3-point light rig, warm-key + cool-fill, with a slow orbiting rim.
 *
 * `intensity` scales the whole rig linearly — useful for scene transitions.
 * The rim light rotates on a fixed axis so highlights sweep across geometry as
 * the camera holds still.
 */
export const Lighting = ({ intensity = 1, animated = true }) => {
  const rimRef = useRef()

  useFrame(() => {
    if (animated && rimRef.current)
      rimRef.current.position.x = Math.sin(performance.now() * 0.0002) * 5
  })

  return (
    <group>
      {/* Ambient — sets the deep-shadow floor. Neutral so brand tint reads. */}
      <ambientLight intensity={0.2 * intensity} color={0xffffff} />

      {/* Key — warm gold, mimics golden-hour sun. */}
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.4 * intensity}
        color={themeColors.brand.DEFAULT}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Fill — cool teal, opposite the key to lift shadow detail. */}
      <directionalLight
        position={[-3, 2, -2]}
        intensity={0.5 * intensity}
        color={themeColors.accent.DEFAULT}
      />

      {/* Rim — bright pinpoint sweeping the silhouette. */}
      <pointLight
        ref={rimRef}
        position={[0, 3, -5]}
        intensity={2 * intensity}
        color={0xffffff}
        distance={20}
        decay={2}
      />
    </group>
  )
}

export default Lighting
