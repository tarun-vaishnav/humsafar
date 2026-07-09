// Base vertex shader used by drei's shaderMaterial.
// Interpolates world-space position, view direction, and UVs so downstream
// fragments can compute fresnel and post-effects cheaply.
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;

uniform float uTime;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  vec4 mvPosition = viewMatrix * worldPos;
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
