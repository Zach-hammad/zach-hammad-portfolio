/**
 * Transition math for the 5-stage scroll animation.
 *
 * Maps a scroll progress value (0-1) to which two stages are active,
 * the mix factor between them, and the corresponding colors.
 *
 * Transition zones (hold 50% / transition 50% of scroll):
 *   0.00-0.15  hold stage 0
 *   0.15-0.25  lerp 0→1
 *   0.25-0.35  hold stage 1
 *   0.35-0.45  lerp 1→2
 *   0.45-0.55  hold stage 2
 *   0.55-0.65  lerp 2→3
 *   0.65-0.75  hold stage 3
 *   0.75-0.85  lerp 3→4
 *   0.85-1.00  hold stage 4
 */

import * as THREE from "three";

/** Stage colors matching the portfolio theme. */
export const STAGE_COLORS = [
  new THREE.Color("#4ade80"), // Green — Transistors
  new THREE.Color("#60a5fa"), // Blue — Logic Gates
  new THREE.Color("#f59e0b"), // Amber — Chip Die
  new THREE.Color("#fca5a5"), // Light Red — Assembly (brighter for text readability)
  new THREE.Color("#d8b4fe"), // Light Purple — Source Code (brighter for text readability)
] as const;

export interface TransitionState {
  /** Index of the "from" stage (0-4). */
  stageA: number;
  /** Index of the "to" stage (0-4). */
  stageB: number;
  /** Lerp factor between stageA and stageB (0 = fully A, 1 = fully B). */
  mixFactor: number;
  /** Color of stageA. */
  colorA: THREE.Color;
  /** Color of stageB. */
  colorB: THREE.Color;
}

/** Transition zone boundaries. */
const ZONES = [
  { holdEnd: 0.15, transEnd: 0.25 }, // Stage 0 → 1
  { holdEnd: 0.35, transEnd: 0.45 }, // Stage 1 → 2
  { holdEnd: 0.55, transEnd: 0.65 }, // Stage 2 → 3
  { holdEnd: 0.75, transEnd: 0.85 }, // Stage 3 → 4
];

/**
 * Compute the current transition state given a scroll progress value.
 * Pure function — no React hooks, no allocations on the hot path.
 */
export function computeTransition(progress: number): TransitionState {
  // Clamp
  const p = Math.max(0, Math.min(1, progress));

  for (let i = 0; i < ZONES.length; i++) {
    const zone = ZONES[i];

    // In hold zone for stage i
    if (p < zone.holdEnd) {
      return {
        stageA: i,
        stageB: i,
        mixFactor: 0,
        colorA: STAGE_COLORS[i],
        colorB: STAGE_COLORS[i],
      };
    }

    // In transition zone from stage i → i+1
    if (p < zone.transEnd) {
      const mixFactor = (p - zone.holdEnd) / (zone.transEnd - zone.holdEnd);
      return {
        stageA: i,
        stageB: i + 1,
        mixFactor,
        colorA: STAGE_COLORS[i],
        colorB: STAGE_COLORS[i + 1],
      };
    }
  }

  // Past all transitions — hold final stage
  return {
    stageA: 4,
    stageB: 4,
    mixFactor: 0,
    colorA: STAGE_COLORS[4],
    colorB: STAGE_COLORS[4],
  };
}
