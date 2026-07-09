/**
 * Custom shader materials built with drei's `shaderMaterial` factory.
 *
 * Every material registered here is auto-extended to R3F's JSX namespace so you
 * can use it like `<brandRimMaterial />` in a mesh. Uniforms become props.
 *
 * DESIGN SYSTEM: Uses warm coral and travel blue from the token system.
 */
import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import vertBase from './shaders/base.vert?raw'
import fragBase from './shaders/base.frag?raw'
import { colors as themeColors } from '@styles/theme'

const BrandRimMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color(themeColors.brand.DEFAULT),
    uRimColor: new THREE.Color(themeColors.accent.DEFAULT),
    uRimPower: 3.0,
    uRimIntensity: 1.4,
  },
  vertBase,
  fragBase,
)

extend({ BrandRimMaterial })

export { BrandRimMaterial }
