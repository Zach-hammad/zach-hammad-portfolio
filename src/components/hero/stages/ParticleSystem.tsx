"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PARTICLE_COUNT, FORMATIONS, generateScatter } from "./formations";
import { vertexShader, fragmentShader } from "./shaders";
import { computeTransition, STAGE_COLORS } from "./useParticlePositions";

interface ParticleSystemProps {
  /** Ref to current scroll progress (0-1). Read in useFrame, never triggers re-render. */
  progressRef: React.RefObject<number>;
}

/** Fill a Float32Array color buffer with a single THREE.Color. */
function fillColorBuffer(buffer: Float32Array, color: THREE.Color) {
  for (let i = 0; i < buffer.length; i += 3) {
    buffer[i] = color.r;
    buffer[i + 1] = color.g;
    buffer[i + 2] = color.b;
  }
}

export default function ParticleSystem({ progressRef }: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Track which stages are currently loaded into the buffers
  const loadedStagesRef = useRef({ a: -1, b: -1 });

  // Entry animation state
  const entryRef = useRef({ started: false, startTime: 0, done: false });

  // Compute all formations once at mount
  const formations = useMemo(() => {
    return FORMATIONS.map((fn) => fn());
  }, []);

  // Scatter positions for entry animation
  const scatterPositions = useMemo(() => generateScatter(), []);

  // Create buffer attributes and geometry (once)
  const { geometry } = useMemo(() => {
    const geo = new THREE.BufferGeometry();

    // Position attributes for lerping between two formations
    const posA = new Float32Array(PARTICLE_COUNT * 3);
    const posB = new Float32Array(PARTICLE_COUNT * 3);
    // Color attributes for per-particle coloring
    const colA = new Float32Array(PARTICLE_COUNT * 3);
    const colB = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT);

    // Initialize with scatter → first formation for entry animation
    posA.set(scatterPositions);
    posB.set(formations[0].positions);

    // Initialize colors: stage 0 color for scatter, formation colors for target
    const c0 = STAGE_COLORS[0];
    fillColorBuffer(colA, c0);
    if (formations[0].colors) {
      colB.set(formations[0].colors);
    } else {
      fillColorBuffer(colB, c0);
    }

    // Per-particle random seed for visual variation
    const seedRng = mulberry32(12345);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      seeds[i] = seedRng();
    }

    geo.setAttribute("positionA", new THREE.BufferAttribute(posA, 3));
    geo.setAttribute("positionB", new THREE.BufferAttribute(posB, 3));
    geo.setAttribute("colorA", new THREE.BufferAttribute(colA, 3));
    geo.setAttribute("colorB", new THREE.BufferAttribute(colB, 3));
    geo.setAttribute("randomSeed", new THREE.BufferAttribute(seeds, 1));

    // Dummy position attribute (required by Three.js Points)
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3)
    );

    return { geometry: geo };
  }, [formations, scatterPositions]);

  // Shader material uniforms (no more color uniforms — colors are per-particle)
  const uniforms = useMemo(
    () => ({
      uMix: { value: 0 },
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    }),
    []
  );

  // Animation loop — runs every frame, zero React re-renders
  useFrame((state) => {
    const mat = materialRef.current;
    if (!mat) return;

    const elapsed = state.clock.elapsedTime;

    // --- Entry animation ---
    const entry = entryRef.current;
    if (!entry.done) {
      if (!entry.started) {
        entry.started = true;
        entry.startTime = elapsed;
      }

      const entryProgress = Math.min((elapsed - entry.startTime) / 0.6, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - entryProgress, 3);

      mat.uniforms.uMix.value = eased;
      mat.uniforms.uTime.value = elapsed;

      if (entryProgress >= 1) {
        entry.done = true;
        // Snap buffers: posA = formation[0], posB = formation[0]
        const attrA = geometry.getAttribute("positionA") as THREE.BufferAttribute;
        const attrB = geometry.getAttribute("positionB") as THREE.BufferAttribute;
        (attrA.array as Float32Array).set(formations[0].positions);
        (attrB.array as Float32Array).set(formations[0].positions);
        attrA.needsUpdate = true;
        attrB.needsUpdate = true;

        // Snap colors to formation[0]
        const colAttrA = geometry.getAttribute("colorA") as THREE.BufferAttribute;
        const colAttrB = geometry.getAttribute("colorB") as THREE.BufferAttribute;
        if (formations[0].colors) {
          (colAttrA.array as Float32Array).set(formations[0].colors);
          (colAttrB.array as Float32Array).set(formations[0].colors);
        } else {
          fillColorBuffer(colAttrA.array as Float32Array, STAGE_COLORS[0]);
          fillColorBuffer(colAttrB.array as Float32Array, STAGE_COLORS[0]);
        }
        colAttrA.needsUpdate = true;
        colAttrB.needsUpdate = true;

        loadedStagesRef.current = { a: 0, b: 0 };
      }
      return;
    }

    // --- Scroll-driven animation ---
    const progress = progressRef.current ?? 0;
    const transition = computeTransition(progress);

    const loaded = loadedStagesRef.current;

    // Update buffer data only when stage indices change
    if (loaded.a !== transition.stageA) {
      const attrA = geometry.getAttribute("positionA") as THREE.BufferAttribute;
      (attrA.array as Float32Array).set(formations[transition.stageA].positions);
      attrA.needsUpdate = true;

      // Update color buffer for stage A
      const colAttrA = geometry.getAttribute("colorA") as THREE.BufferAttribute;
      const stageAColors = formations[transition.stageA].colors;
      if (stageAColors) {
        (colAttrA.array as Float32Array).set(stageAColors);
      } else {
        fillColorBuffer(colAttrA.array as Float32Array, transition.colorA);
      }
      colAttrA.needsUpdate = true;

      loaded.a = transition.stageA;
    }

    if (loaded.b !== transition.stageB) {
      const attrB = geometry.getAttribute("positionB") as THREE.BufferAttribute;
      (attrB.array as Float32Array).set(formations[transition.stageB].positions);
      attrB.needsUpdate = true;

      // Update color buffer for stage B
      const colAttrB = geometry.getAttribute("colorB") as THREE.BufferAttribute;
      const stageBColors = formations[transition.stageB].colors;
      if (stageBColors) {
        (colAttrB.array as Float32Array).set(stageBColors);
      } else {
        fillColorBuffer(colAttrB.array as Float32Array, transition.colorB);
      }
      colAttrB.needsUpdate = true;

      loaded.b = transition.stageB;
    }

    // Update uniforms (cheap — just setting values)
    mat.uniforms.uMix.value = transition.mixFactor;
    mat.uniforms.uTime.value = elapsed;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Simple deterministic PRNG (mulberry32). */
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
