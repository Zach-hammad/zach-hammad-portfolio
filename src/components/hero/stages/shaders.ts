/**
 * Vertex and fragment shaders for the particle morphing system.
 *
 * The particle system uses two position attributes (positionA, positionB)
 * and two color attributes (colorA, colorB), lerping between them via uMix.
 * Subtle idle drift is applied via uTime.
 */

export const vertexShader = /* glsl */ `
  attribute vec3 positionA;
  attribute vec3 positionB;
  attribute vec3 colorA;
  attribute vec3 colorB;
  attribute float randomSeed;

  uniform float uMix;
  uniform float uTime;
  uniform float uPixelRatio;

  varying float vRandomSeed;
  varying float vMix;
  varying vec3 vColor;

  void main() {
    vRandomSeed = randomSeed;
    vMix = uMix;

    // Lerp between per-particle colors
    vColor = mix(colorA, colorB, uMix);

    // Lerp between formation A and formation B
    vec3 pos = mix(positionA, positionB, uMix);

    // --- Swarm dispersal during transitions ---
    // Peaks at mix=0.5 (mid-transition), zero at 0 and 1 (holding formation).
    // Particles push outward from center, creating a "breathe" effect.
    float dispersal = sin(uMix * 3.14159);
    float dispersalStrength = dispersal * dispersal * 1.2; // squared for snappier ease-in/out
    float particlePhase = randomSeed * 6.2831853;

    // Each particle scatters in a unique direction
    vec3 scatterDir = vec3(
      sin(particlePhase + uTime * 1.5),
      cos(particlePhase * 1.3 + uTime * 1.2),
      sin(particlePhase * 0.7 + uTime * 0.8)
    );
    pos += scatterDir * dispersalStrength * (0.4 + randomSeed * 0.6);

    // --- Idle drift (subtle shimmer) ---
    // Kept low so text formations remain readable.
    // Dispersal provides the energy during transitions; drift is just texture.
    float driftSpeed = 0.4 + randomSeed * 0.5;
    float driftAmp = 0.012 + randomSeed * 0.008;

    // Layer two frequencies for organic motion
    pos.x += sin(uTime * driftSpeed + particlePhase) * driftAmp;
    pos.x += sin(uTime * driftSpeed * 2.3 + particlePhase * 0.5) * driftAmp * 0.3;
    pos.y += cos(uTime * driftSpeed * 0.7 + particlePhase * 1.3) * driftAmp;
    pos.y += cos(uTime * driftSpeed * 1.9 + particlePhase * 0.8) * driftAmp * 0.3;
    pos.z += sin(uTime * driftSpeed * 0.5 + particlePhase * 0.7) * driftAmp * 0.4;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Fixed screen-space size. Slight pulse during dispersal for extra energy.
    float baseSize = 3.5 + randomSeed * 2.5;
    float pulse = 1.0 + dispersal * 0.3; // particles grow slightly mid-transition
    gl_PointSize = baseSize * pulse * uPixelRatio;
  }
`;

export const fragmentShader = /* glsl */ `
  uniform float uMix;

  varying float vRandomSeed;
  varying float vMix;
  varying vec3 vColor;

  void main() {
    // Soft circle — discard outside radius
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if (dist > 0.5) discard;

    // Smooth edge falloff for glow effect
    float alpha = 1.0 - smoothstep(0.1, 0.5, dist);

    // Per-particle brightness — keep bright overall
    alpha *= 0.92 + vRandomSeed * 0.08;

    // Use per-particle interpolated color
    vec3 color = vColor;

    // Glow: brighten center for hot-core look
    color += (1.0 - dist * 2.0) * 0.3;

    gl_FragColor = vec4(color, alpha);
  }
`;
