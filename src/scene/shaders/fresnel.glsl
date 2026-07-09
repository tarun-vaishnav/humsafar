// Schlick-approximated fresnel term. Use for rim glow / atmosphere / glass.
// `power` sharpens the falloff (2 = broad, 8 = tight edge).
float fresnel(vec3 normal, vec3 viewDir, float power) {
  return pow(1.0 - clamp(dot(normalize(normal), normalize(viewDir)), 0.0, 1.0), power);
}
