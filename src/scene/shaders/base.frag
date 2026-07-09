// Base fragment shader — solid brand-tinted material with fresnel rim.
// Intended as a starting point: copy, extend uniforms, add chunks as needed.
precision highp float;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;

uniform float uTime;
uniform vec3  uColor;
uniform vec3  uRimColor;
uniform float uRimPower;
uniform float uRimIntensity;

// Import chunks via the shader loader (they get prepended by vite-plugin-glsl
// when the material composes its final source).

void main() {
  vec3 base = uColor;
  float rim = pow(1.0 - clamp(dot(normalize(vNormal), normalize(vViewPosition)), 0.0, 1.0), uRimPower);
  vec3 color = base + uRimColor * rim * uRimIntensity;
  gl_FragColor = vec4(color, 1.0);
}
