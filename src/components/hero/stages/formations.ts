/**
 * Formation generators for the 5-stage particle morphing animation.
 *
 * Each function returns a Float32Array of PARTICLE_COUNT * 3 floats (x, y, z)
 * representing target positions for the particle system.
 *
 * Coordinate space: centered at origin, roughly -6 to +6 range on X/Y, Z near 0.
 */

export const PARTICLE_COUNT = 80000;

export interface FormationData {
  positions: Float32Array;
  colors: Float32Array | null;
}

/** Simple deterministic PRNG (mulberry32). */
function seededRandom(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Distribute `count` particles along a line segment from (x0,y0) to (x1,y1)
 * with slight perpendicular jitter for visual thickness.
 */
function lineParticles(
  positions: Float32Array,
  offset: number,
  count: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  rand: () => number,
  jitter = 0.04
): number {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.sqrt(dx * dx + dy * dy);
  // Perpendicular unit vector
  const nx = len > 0 ? -dy / len : 0;
  const ny = len > 0 ? dx / len : 0;

  for (let i = 0; i < count; i++) {
    const t = count > 1 ? i / (count - 1) : 0.5;
    const j = (rand() - 0.5) * jitter;
    const idx = (offset + i) * 3;
    positions[idx] = x0 + dx * t + nx * j;
    positions[idx + 1] = y0 + dy * t + ny * j;
    positions[idx + 2] = (rand() - 0.5) * 0.1;
  }
  return offset + count;
}

/**
 * Distribute particles along an arc.
 */
function arcParticles(
  positions: Float32Array,
  offset: number,
  count: number,
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  rand: () => number,
  jitter = 0.04
): number {
  for (let i = 0; i < count; i++) {
    const t = count > 1 ? i / (count - 1) : 0.5;
    const angle = startAngle + (endAngle - startAngle) * t;
    const r = radius + (rand() - 0.5) * jitter;
    const idx = (offset + i) * 3;
    positions[idx] = cx + Math.cos(angle) * r;
    positions[idx + 1] = cy + Math.sin(angle) * r;
    positions[idx + 2] = (rand() - 0.5) * 0.1;
  }
  return offset + count;
}

// ---------------------------------------------------------------------------
// Stage 1: Transistors — circuit traces grid with clusters at intersections
// ---------------------------------------------------------------------------
export function generateTransistors(): FormationData {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const rand = seededRandom(42);
  let p = 0;

  // Fewer, bolder traces — 3 horizontal, 4 vertical
  // ~600 particles on grid lines (dense enough to read as lines)
  const hLines = 3;
  const hSpacing = 2.2;
  for (let i = 0; i < hLines; i++) {
    const y = (i - (hLines - 1) / 2) * hSpacing;
    p = lineParticles(positions, p, 100, -4.5, y, 4.5, y, rand, 0.06);
  }

  const vLines = 4;
  const vSpacing = 2.8;
  for (let i = 0; i < vLines; i++) {
    const x = (i - (vLines - 1) / 2) * vSpacing;
    p = lineParticles(positions, p, 75, x, -3.5, x, 3.5, rand, 0.06);
  }

  // 6 large MOSFET symbols at key intersections (~700 particles each)
  const mosfets: [number, number][] = [
    [-4.2, 2.2], [-1.4, 0], [1.4, 2.2],
    [-1.4, -2.2], [1.4, -2.2], [4.2, 0],
  ];

  const mosfetBudget = PARTICLE_COUNT - p;
  const perMosfet = Math.floor(mosfetBudget / mosfets.length);

  for (const [cx, cy] of mosfets) {
    const s = 0.7; // Much larger symbols

    // Source (top vertical)
    p = lineParticles(positions, p, Math.floor(perMosfet * 0.10), cx, cy + s, cx, cy + s * 2.2, rand, 0.04);
    // Drain (bottom vertical)
    p = lineParticles(positions, p, Math.floor(perMosfet * 0.10), cx, cy - s, cx, cy - s * 2.2, rand, 0.04);
    // Gate bar (horizontal)
    p = lineParticles(positions, p, Math.floor(perMosfet * 0.12), cx - s, cy, cx + s, cy, rand, 0.04);
    // Gate lead (extending left from gate bar)
    p = lineParticles(positions, p, Math.floor(perMosfet * 0.08), cx - s * 2, cy, cx - s, cy, rand, 0.04);
    // Channel (vertical, offset right of gate)
    p = lineParticles(positions, p, Math.floor(perMosfet * 0.12), cx + s * 0.4, cy - s, cx + s * 0.4, cy + s, rand, 0.04);
    // Source contact (horizontal stub top)
    p = lineParticles(positions, p, Math.floor(perMosfet * 0.08), cx + s * 0.4, cy + s * 0.6, cx + s, cy + s * 0.6, rand, 0.04);
    // Drain contact (horizontal stub bottom)
    p = lineParticles(positions, p, Math.floor(perMosfet * 0.08), cx + s * 0.4, cy - s * 0.6, cx + s, cy - s * 0.6, rand, 0.04);
    // Body/bulk arrow (small cluster at center)
    const bulkCount = Math.floor(perMosfet * 0.08);
    for (let i = 0; i < bulkCount && p < PARTICLE_COUNT; i++) {
      const idx = p * 3;
      const angle = rand() * Math.PI * 2;
      const r = rand() * s * 0.2;
      positions[idx] = cx + s * 0.4 + Math.cos(angle) * r;
      positions[idx + 1] = cy + Math.sin(angle) * r;
      positions[idx + 2] = (rand() - 0.5) * 0.05;
      p++;
    }
    // Fill rest as scattered silicon substrate dots around symbol
    const fillCount = perMosfet - Math.floor(perMosfet * 0.76);
    for (let i = 0; i < fillCount && p < PARTICLE_COUNT; i++) {
      const idx = p * 3;
      positions[idx] = cx + (rand() - 0.5) * s * 3;
      positions[idx + 1] = cy + (rand() - 0.5) * s * 3;
      positions[idx + 2] = (rand() - 0.5) * 0.05;
      p++;
    }
  }

  // Fill any remaining
  while (p < PARTICLE_COUNT) {
    const idx = p * 3;
    positions[idx] = (rand() - 0.5) * 9;
    positions[idx + 1] = (rand() - 0.5) * 7;
    positions[idx + 2] = (rand() - 0.5) * 0.05;
    p++;
  }

  return { positions, colors: null };
}

// ---------------------------------------------------------------------------
// Stage 2: Logic Gates — 6 gate outlines with connecting wires
// ---------------------------------------------------------------------------
export function generateLogicGates(): FormationData {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const rand = seededRandom(137);
  let p = 0;

  // Gate positions: 2 rows x 3 columns
  const gates: { cx: number; cy: number; type: string }[] = [
    { cx: -3.5, cy: 1.8, type: "AND" },
    { cx: 0, cy: 1.8, type: "OR" },
    { cx: 3.5, cy: 1.8, type: "NOT" },
    { cx: -3.5, cy: -1.8, type: "NAND" },
    { cx: 0, cy: -1.8, type: "NOR" },
    { cx: 3.5, cy: -1.8, type: "XOR" },
  ];

  const gateParticles = Math.floor(PARTICLE_COUNT * 0.7);
  const perGate = Math.floor(gateParticles / gates.length);

  for (const gate of gates) {
    const { cx, cy, type } = gate;
    const w = 1.0;
    const h = 0.7;

    if (type === "AND" || type === "NAND") {
      // Flat left side + curved right side
      p = lineParticles(positions, p, Math.floor(perGate * 0.2), cx - w, cy - h, cx - w, cy + h, rand, 0.03);
      p = lineParticles(positions, p, Math.floor(perGate * 0.15), cx - w, cy + h, cx, cy + h, rand, 0.03);
      p = lineParticles(positions, p, Math.floor(perGate * 0.15), cx - w, cy - h, cx, cy - h, rand, 0.03);
      p = arcParticles(positions, p, Math.floor(perGate * 0.3), cx, cy, h, -Math.PI / 2, Math.PI / 2, rand, 0.03);
    } else if (type === "OR" || type === "NOR") {
      // Curved left + pointed right
      p = arcParticles(positions, p, Math.floor(perGate * 0.25), cx - w * 1.5, cy, w * 0.8, -Math.PI / 4, Math.PI / 4, rand, 0.03);
      p = arcParticles(positions, p, Math.floor(perGate * 0.25), cx - w * 0.3, cy + h * 1.5, w * 1.5, -Math.PI / 3, -Math.PI / 6, rand, 0.03);
      p = arcParticles(positions, p, Math.floor(perGate * 0.25), cx - w * 0.3, cy - h * 1.5, w * 1.5, Math.PI / 6, Math.PI / 3, rand, 0.03);
    } else if (type === "NOT") {
      // Triangle + circle
      p = lineParticles(positions, p, Math.floor(perGate * 0.2), cx - w, cy - h, cx - w, cy + h, rand, 0.03);
      p = lineParticles(positions, p, Math.floor(perGate * 0.2), cx - w, cy + h, cx + w * 0.7, cy, rand, 0.03);
      p = lineParticles(positions, p, Math.floor(perGate * 0.2), cx - w, cy - h, cx + w * 0.7, cy, rand, 0.03);
      p = arcParticles(positions, p, Math.floor(perGate * 0.15), cx + w * 0.85, cy, 0.15, 0, Math.PI * 2, rand, 0.02);
    } else if (type === "XOR") {
      // OR shape + extra curve on left
      p = arcParticles(positions, p, Math.floor(perGate * 0.15), cx - w * 1.7, cy, w * 0.8, -Math.PI / 4, Math.PI / 4, rand, 0.03);
      p = arcParticles(positions, p, Math.floor(perGate * 0.15), cx - w * 1.5, cy, w * 0.8, -Math.PI / 4, Math.PI / 4, rand, 0.03);
      p = arcParticles(positions, p, Math.floor(perGate * 0.2), cx - w * 0.3, cy + h * 1.5, w * 1.5, -Math.PI / 3, -Math.PI / 6, rand, 0.03);
      p = arcParticles(positions, p, Math.floor(perGate * 0.2), cx - w * 0.3, cy - h * 1.5, w * 1.5, Math.PI / 6, Math.PI / 3, rand, 0.03);
    }

    // Input/output leads
    const leadCount = Math.floor(perGate * 0.1);
    // Input leads (2 per gate)
    p = lineParticles(positions, p, Math.floor(leadCount / 3), cx - w - 0.8, cy + h * 0.4, cx - w, cy + h * 0.4, rand, 0.02);
    p = lineParticles(positions, p, Math.floor(leadCount / 3), cx - w - 0.8, cy - h * 0.4, cx - w, cy - h * 0.4, rand, 0.02);
    // Output lead
    const outX = type === "NOT" ? cx + w * 0.85 + 0.15 : cx + w;
    p = lineParticles(positions, p, Math.floor(leadCount / 3), outX, cy, outX + 0.8, cy, rand, 0.02);

    // NAND/NOR bubble
    if (type === "NAND" || type === "NOR") {
      p = arcParticles(positions, p, Math.floor(perGate * 0.05), cx + w + 0.15, cy, 0.15, 0, Math.PI * 2, rand, 0.02);
    }
  }

  // Connecting wires between gates
  const wireParticles = PARTICLE_COUNT - p;
  const wires: [number, number, number, number][] = [
    // Row 1 connections
    [-2.5, 1.8, -1.0, 1.8],
    [1.0, 1.8, 2.5, 1.8],
    // Row 2 connections
    [-2.5, -1.8, -1.0, -1.8],
    [1.0, -1.8, 2.5, -1.8],
    // Vertical connections
    [-3.5, 1.1, -3.5, -1.1],
    [0, 1.1, 0, -1.1],
    [3.5, 1.1, 3.5, -1.1],
    // Cross connections
    [-2.5, 1.4, -1.0, -1.4],
    [1.0, 1.4, 2.5, -1.4],
  ];

  const perWire = Math.floor(wireParticles / wires.length);
  for (const [x0, y0, x1, y1] of wires) {
    p = lineParticles(positions, p, Math.min(perWire, PARTICLE_COUNT - p), x0, y0, x1, y1, rand, 0.02);
  }

  // Fill remaining
  while (p < PARTICLE_COUNT) {
    const idx = p * 3;
    positions[idx] = (rand() - 0.5) * 10;
    positions[idx + 1] = (rand() - 0.5) * 5;
    positions[idx + 2] = (rand() - 0.5) * 0.05;
    p++;
  }

  return { positions, colors: null };
}

// ---------------------------------------------------------------------------
// Stage 3: Chip Die — Dense RISC-V pipeline packed with logic gates & wires
// ---------------------------------------------------------------------------

/** Draw an AND gate at (cx, cy) with given scale. ~65 particles. */
function andGate(
  positions: Float32Array, offset: number,
  cx: number, cy: number, s: number, rand: () => number
): number {
  let p = offset;
  p = lineParticles(positions, p, 16, cx - s, cy - s * 0.6, cx - s, cy + s * 0.6, rand, 0.015);
  p = lineParticles(positions, p, 12, cx - s, cy + s * 0.6, cx, cy + s * 0.6, rand, 0.015);
  p = lineParticles(positions, p, 12, cx - s, cy - s * 0.6, cx, cy - s * 0.6, rand, 0.015);
  p = arcParticles(positions, p, 25, cx, cy, s * 0.6, -Math.PI / 2, Math.PI / 2, rand, 0.015);
  return p;
}

/** Draw an OR gate at (cx, cy). ~56 particles. */
function orGate(
  positions: Float32Array, offset: number,
  cx: number, cy: number, s: number, rand: () => number
): number {
  let p = offset;
  p = arcParticles(positions, p, 18, cx - s * 1.8, cy, s * 1.2, -Math.PI / 6, Math.PI / 6, rand, 0.015);
  p = arcParticles(positions, p, 19, cx - s * 0.3, cy + s * 1.0, s * 1.2, -Math.PI / 3, -Math.PI / 8, rand, 0.015);
  p = arcParticles(positions, p, 19, cx - s * 0.3, cy - s * 1.0, s * 1.2, Math.PI / 8, Math.PI / 3, rand, 0.015);
  return p;
}

/** Draw a NOT (triangle + bubble) at (cx, cy). ~60 particles. */
function notGate(
  positions: Float32Array, offset: number,
  cx: number, cy: number, s: number, rand: () => number
): number {
  let p = offset;
  p = lineParticles(positions, p, 16, cx - s, cy - s * 0.5, cx - s, cy + s * 0.5, rand, 0.015);
  p = lineParticles(positions, p, 16, cx - s, cy + s * 0.5, cx + s * 0.6, cy, rand, 0.015);
  p = lineParticles(positions, p, 16, cx - s, cy - s * 0.5, cx + s * 0.6, cy, rand, 0.015);
  p = arcParticles(positions, p, 12, cx + s * 0.75, cy, s * 0.12, 0, Math.PI * 2, rand, 0.01);
  return p;
}

/** Draw a MUX (trapezoid) at (cx, cy). ~56 particles. */
function muxGate(
  positions: Float32Array, offset: number,
  cx: number, cy: number, s: number, rand: () => number
): number {
  let p = offset;
  p = lineParticles(positions, p, 16, cx - s * 0.4, cy - s * 0.8, cx - s * 0.4, cy + s * 0.8, rand, 0.015);
  p = lineParticles(positions, p, 12, cx - s * 0.4, cy + s * 0.8, cx + s * 0.4, cy + s * 0.5, rand, 0.015);
  p = lineParticles(positions, p, 16, cx + s * 0.4, cy + s * 0.5, cx + s * 0.4, cy - s * 0.5, rand, 0.015);
  p = lineParticles(positions, p, 12, cx + s * 0.4, cy - s * 0.5, cx - s * 0.4, cy - s * 0.8, rand, 0.015);
  return p;
}

/** Draw a flip-flop (rectangle with triangle clock input) at (cx, cy). ~72 particles. */
function flipFlop(
  positions: Float32Array, offset: number,
  cx: number, cy: number, s: number, rand: () => number
): number {
  let p = offset;
  p = lineParticles(positions, p, 12, cx - s * 0.3, cy - s * 0.6, cx + s * 0.3, cy - s * 0.6, rand, 0.01);
  p = lineParticles(positions, p, 16, cx + s * 0.3, cy - s * 0.6, cx + s * 0.3, cy + s * 0.6, rand, 0.01);
  p = lineParticles(positions, p, 12, cx + s * 0.3, cy + s * 0.6, cx - s * 0.3, cy + s * 0.6, rand, 0.01);
  p = lineParticles(positions, p, 16, cx - s * 0.3, cy + s * 0.6, cx - s * 0.3, cy - s * 0.6, rand, 0.01);
  // Clock triangle
  p = lineParticles(positions, p, 8, cx - s * 0.3, cy - s * 0.15, cx - s * 0.15, cy, rand, 0.008);
  p = lineParticles(positions, p, 8, cx - s * 0.15, cy, cx - s * 0.3, cy + s * 0.15, rand, 0.008);
  return p;
}

/** Draw an XOR gate at (cx, cy). ~75 particles. */
function xorGate(
  positions: Float32Array, offset: number,
  cx: number, cy: number, s: number, rand: () => number
): number {
  let p = offset;
  // Double curved left
  p = arcParticles(positions, p, 14, cx - s * 1.7, cy, s * 0.8, -Math.PI / 4, Math.PI / 4, rand, 0.015);
  p = arcParticles(positions, p, 14, cx - s * 1.5, cy, s * 0.8, -Math.PI / 4, Math.PI / 4, rand, 0.015);
  // Top and bottom curves
  p = arcParticles(positions, p, 18, cx - s * 0.3, cy + s * 1.0, s * 1.2, -Math.PI / 3, -Math.PI / 8, rand, 0.015);
  p = arcParticles(positions, p, 18, cx - s * 0.3, cy - s * 1.0, s * 1.2, Math.PI / 8, Math.PI / 3, rand, 0.015);
  // Output lead
  p = lineParticles(positions, p, 6, cx + s * 0.6, cy, cx + s * 1.0, cy, rand, 0.01);
  // Input leads
  p = lineParticles(positions, p, 5, cx - s * 1.4, cy + s * 0.25, cx - s * 0.9, cy + s * 0.25, rand, 0.008);
  return p;
}

/** Draw a NAND gate (AND + bubble) at (cx, cy). ~77 particles. */
function nandGate(
  positions: Float32Array, offset: number,
  cx: number, cy: number, s: number, rand: () => number
): number {
  let p = offset;
  p = andGate(positions, p, cx, cy, s, rand);
  p = arcParticles(positions, p, 12, cx + s * 0.75, cy, s * 0.12, 0, Math.PI * 2, rand, 0.01);
  return p;
}

/** Draw a small adder block at (cx, cy). ~90 particles. */
function adderBlock(
  positions: Float32Array, offset: number,
  cx: number, cy: number, s: number, rand: () => number
): number {
  let p = offset;
  // Sigma-shaped box
  p = lineParticles(positions, p, 14, cx - s * 0.5, cy - s * 0.5, cx + s * 0.5, cy - s * 0.5, rand, 0.012);
  p = lineParticles(positions, p, 18, cx + s * 0.5, cy - s * 0.5, cx + s * 0.5, cy + s * 0.5, rand, 0.012);
  p = lineParticles(positions, p, 14, cx + s * 0.5, cy + s * 0.5, cx - s * 0.5, cy + s * 0.5, rand, 0.012);
  p = lineParticles(positions, p, 18, cx - s * 0.5, cy + s * 0.5, cx - s * 0.5, cy - s * 0.5, rand, 0.012);
  // Sigma symbol inside (zigzag)
  p = lineParticles(positions, p, 8, cx - s * 0.25, cy + s * 0.3, cx + s * 0.05, cy, rand, 0.008);
  p = lineParticles(positions, p, 8, cx + s * 0.05, cy, cx - s * 0.25, cy - s * 0.3, rand, 0.008);
  // Carry in/out leads
  p = lineParticles(positions, p, 5, cx, cy + s * 0.5, cx, cy + s * 0.7, rand, 0.006);
  p = lineParticles(positions, p, 5, cx, cy - s * 0.5, cx, cy - s * 0.7, rand, 0.006);
  return p;
}

/** Draw a comparator block at (cx, cy). ~80 particles. */
function comparatorBlock(
  positions: Float32Array, offset: number,
  cx: number, cy: number, s: number, rand: () => number
): number {
  let p = offset;
  // Rectangle
  p = lineParticles(positions, p, 12, cx - s * 0.5, cy - s * 0.4, cx + s * 0.5, cy - s * 0.4, rand, 0.012);
  p = lineParticles(positions, p, 14, cx + s * 0.5, cy - s * 0.4, cx + s * 0.5, cy + s * 0.4, rand, 0.012);
  p = lineParticles(positions, p, 12, cx + s * 0.5, cy + s * 0.4, cx - s * 0.5, cy + s * 0.4, rand, 0.012);
  p = lineParticles(positions, p, 14, cx - s * 0.5, cy + s * 0.4, cx - s * 0.5, cy - s * 0.4, rand, 0.012);
  // = sign inside
  p = lineParticles(positions, p, 8, cx - s * 0.2, cy + s * 0.1, cx + s * 0.2, cy + s * 0.1, rand, 0.006);
  p = lineParticles(positions, p, 8, cx - s * 0.2, cy - s * 0.1, cx + s * 0.2, cy - s * 0.1, rand, 0.006);
  // Input/output leads
  p = lineParticles(positions, p, 6, cx - s * 0.5, cy, cx - s * 0.8, cy, rand, 0.006);
  p = lineParticles(positions, p, 6, cx + s * 0.5, cy, cx + s * 0.8, cy, rand, 0.006);
  return p;
}

// (fillWithGates removed — chip die now uses canvas sampling)

/**
 * Draw a detailed RISC-V chip die layout to an offscreen canvas, then
 * sample particle positions from all drawn pixels. Same proven technique
 * as the text stages — zero scatter waste, every particle hits structure.
 */
function drawChipDie(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);

  const pad = 30; // die edge padding
  const dieL = pad, dieT = pad, dieR = W - pad, dieB = H - pad;
  const dieW = dieR - dieL, dieH = dieB - dieT;

  // --- Die border (silver — package) ---
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 3;
  ctx.strokeRect(dieL, dieT, dieW, dieH);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(dieL + 5, dieT + 5, dieW - 10, dieH - 10);

  // --- Pin pads (silver) ---
  ctx.fillStyle = "#94a3b8";
  const pinW = 6, pinH = 14;
  for (let i = 0; i < 48; i++) {
    const x = dieL + 20 + (i / 47) * (dieW - 40);
    ctx.fillRect(x - pinW / 2, dieT - pinH, pinW, pinH);
    ctx.fillRect(x - pinW / 2, dieB, pinW, pinH);
  }
  for (let i = 0; i < 28; i++) {
    const y = dieT + 20 + (i / 27) * (dieH - 40);
    ctx.fillRect(dieL - pinH, y - pinW / 2, pinH, pinW);
    ctx.fillRect(dieR, y - pinW / 2, pinH, pinW);
  }

  // --- Power/ground rails (red/copper — power distribution) ---
  ctx.fillStyle = "#ef4444";
  ctx.lineWidth = 2;
  ctx.fillRect(dieL + 10, dieT + 10, dieW - 20, 3);
  ctx.fillRect(dieL + 10, dieB - 13, dieW - 20, 3);

  // --- 5 pipeline stage columns ---
  const stageGap = 6;
  const numStages = 5;
  const totalGaps = numStages - 1;
  const regWidth = 12; // pipeline register column width
  const usableW = dieW - 24 - totalGaps * (stageGap + regWidth);
  const stageW = Math.floor(usableW / numStages);
  const stageT = dieT + 50;
  const stageB = dieB - 100;
  const stageH = stageB - stageT;

  const stageLabels = ["IF", "ID", "EX", "MEM", "WB"];
  const stageXs: number[] = [];

  for (let si = 0; si < numStages; si++) {
    const sx = dieL + 12 + si * (stageW + stageGap + regWidth);
    stageXs.push(sx);

    // Stage outline (dark gold border)
    ctx.strokeStyle = "#d4a017";
    ctx.lineWidth = 2;
    ctx.strokeRect(sx, stageT, stageW, stageH);

    // Stage label (amber)
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 10px monospace";
    ctx.fillText(stageLabels[si], sx + 3, stageT + 12);

    // --- Fill stage interior with dense structures ---
    const innerL = sx + 3;
    const innerR = sx + stageW - 3;
    const innerT = stageT + 16;
    const innerB = stageB - 3;
    const innerW = innerR - innerL;
    const innerH = innerB - innerT;

    // Horizontal sub-dividers (gold)
    ctx.strokeStyle = "#d4a017";
    ctx.lineWidth = 1;
    const zone1 = innerT + Math.floor(innerH * 0.35);
    const zone2 = innerT + Math.floor(innerH * 0.65);
    ctx.beginPath();
    ctx.moveTo(innerL, zone1); ctx.lineTo(innerR, zone1);
    ctx.moveTo(innerL, zone2); ctx.lineTo(innerR, zone2);
    ctx.stroke();

    // ZONE 1 (top): Landmark block (cyan — poly layer)
    ctx.strokeStyle = "#22d3ee";
    ctx.fillStyle = "#22d3ee";
    const blockPad = 4;
    const blockL = innerL + blockPad;
    const blockR = innerR - blockPad;
    const blockT = innerT + blockPad;
    const blockB = zone1 - blockPad;
    const blockW = blockR - blockL;
    const blockH = blockB - blockT;

    ctx.lineWidth = 1.5;
    ctx.strokeRect(blockL, blockT, blockW, blockH);

    // Internal detail for landmark block
    if (si === 0) {
      // I-Cache: horizontal cache lines
      const lines = 12;
      for (let i = 0; i < lines; i++) {
        const y = blockT + 4 + (i / (lines - 1)) * (blockH - 8);
        ctx.fillRect(blockL + 3, y, blockW - 6, 1);
      }
      // Tag/data divider
      ctx.fillRect(blockL + Math.floor(blockW * 0.3), blockT + 2, 1, blockH - 4);
    } else if (si === 1) {
      // Register file: dense grid
      const rows = 16, cols = 2;
      const cellW = (blockW - 6) / cols;
      const cellH = (blockH - 6) / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.strokeRect(blockL + 3 + c * cellW, blockT + 3 + r * cellH, cellW, cellH);
        }
      }
    } else if (si === 2) {
      // ALU: diamond shape
      const cx = blockL + blockW / 2;
      const cy = blockT + blockH / 2;
      const rx = blockW * 0.4;
      const ry = blockH * 0.45;
      ctx.beginPath();
      ctx.moveTo(cx, cy - ry);
      ctx.lineTo(cx + rx, cy);
      ctx.lineTo(cx, cy + ry);
      ctx.lineTo(cx - rx, cy);
      ctx.closePath();
      ctx.stroke();
      // ALU notch
      ctx.beginPath();
      ctx.moveTo(cx - rx * 0.5, cy - ry * 0.3);
      ctx.lineTo(cx - rx * 0.2, cy);
      ctx.lineTo(cx - rx * 0.5, cy + ry * 0.3);
      ctx.stroke();
      // Internal lines
      ctx.fillRect(cx - rx * 0.4, cy - 1, rx * 0.8, 1);
      ctx.fillRect(cx - rx * 0.25, cy + ry * 0.3, rx * 0.5, 1);
    } else if (si === 3) {
      // D-Cache: horizontal lines + vertical tag divider
      const lines = 14;
      for (let i = 0; i < lines; i++) {
        const y = blockT + 4 + (i / (lines - 1)) * (blockH - 8);
        ctx.fillRect(blockL + 3, y, blockW - 6, 1);
      }
      ctx.fillRect(blockL + Math.floor(blockW * 0.25), blockT + 2, 1, blockH - 4);
    } else {
      // CSR file / WB: smaller grid
      const rows = 8, cols = 2;
      const cellW = (blockW - 6) / cols;
      const cellH = (blockH - 6) / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.strokeRect(blockL + 3 + c * cellW, blockT + 3 + r * cellH, cellW, cellH);
        }
      }
    }

    // ZONE 2 (middle): Dense standard cell rows (warm gold — active silicon)
    ctx.fillStyle = "#d4a017";
    ctx.strokeStyle = "#d4a017";
    const scT = zone1 + 3;
    const scB = zone2 - 3;
    const scRows = Math.floor((scB - scT) / 6);
    ctx.lineWidth = 0.8;
    for (let r = 0; r < scRows; r++) {
      const y = scT + r * 6;
      // Horizontal cell row
      ctx.fillRect(innerL + 2, y, innerW - 4, 1);
      // Small gate-like stubs along each row
      const stubs = Math.floor(innerW / 5);
      for (let s = 0; s < stubs; s++) {
        const stubX = innerL + 4 + s * 5;
        const stubH = 2 + (((r * 7 + s * 3) % 5) > 2 ? 2 : 0);
        ctx.fillRect(stubX, y + 1, 1, stubH);
        // Alternate: small rectangle or triangle shape
        if ((r + s) % 3 === 0) {
          ctx.strokeRect(stubX - 1, y + 1, 3, stubH);
        }
      }
    }

    // ZONE 3 (bottom): Dense routing grid (blue — metal layer)
    ctx.fillStyle = "#3b82f6";
    ctx.strokeStyle = "#3b82f6";
    const rgT = zone2 + 3;
    const rgB = innerB;
    // Horizontal metal lines (dense)
    const hLines = Math.floor((rgB - rgT) / 4);
    for (let i = 0; i < hLines; i++) {
      const y = rgT + i * 4;
      ctx.fillRect(innerL + 2, y, innerW - 4, 1);
    }
    // Vertical metal lines (cross-hatched with horizontal)
    const vLines = Math.floor(innerW / 5);
    for (let i = 0; i < vLines; i++) {
      const x = innerL + 3 + i * 5;
      ctx.fillRect(x, rgT, 1, rgB - rgT);
    }
    // Via dots at intersections (brighter blue)
    ctx.fillStyle = "#93c5fd";
    for (let i = 0; i < hLines; i += 2) {
      for (let j = 0; j < vLines; j += 2) {
        const x = innerL + 3 + j * 5;
        const y = rgT + i * 4;
        ctx.fillRect(x - 1, y - 1, 3, 3);
      }
    }
  }

  // --- Pipeline registers (cyan/teal — sequential elements) ---
  ctx.strokeStyle = "#22d3ee";
  ctx.fillStyle = "#22d3ee";
  ctx.lineWidth = 1;
  for (let si = 0; si < numStages - 1; si++) {
    const regX = stageXs[si] + stageW + stageGap / 2;
    const regL = regX - regWidth / 2;
    // Vertical line
    ctx.fillRect(regX, stageT, 1, stageH);
    // Flip-flop boxes
    const ffCount = Math.floor(stageH / 14);
    for (let fi = 0; fi < ffCount; fi++) {
      const fy = stageT + 3 + fi * 14;
      ctx.strokeRect(regL + 1, fy, regWidth - 2, 10);
      // Clock triangle
      ctx.beginPath();
      ctx.moveTo(regL + 1, fy + 3);
      ctx.lineTo(regL + 4, fy + 5);
      ctx.lineTo(regL + 1, fy + 7);
      ctx.stroke();
    }
  }

  // === TOP INFRASTRUCTURE (above pipeline stages) ===
  const topZone = stageT - 2; // y = dieT+10 to stageT-2

  // --- Control bus (red — above stages) ---
  ctx.fillStyle = "#ef4444";
  const busLines = 8;
  for (let b = 0; b < busLines; b++) {
    const y = dieT + 14 + b * 4;
    ctx.fillRect(dieL + 12, y, dieW - 24, 2);
  }
  // Vertical taps from bus to each stage
  for (const sx of stageXs) {
    const cx = sx + stageW / 2;
    ctx.fillRect(cx - 1, dieT + 12, 3, topZone - dieT - 12);
  }
  // Decoder blocks between taps (red outlined)
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 1.5;
  for (let si = 0; si < numStages - 1; si++) {
    const bx = stageXs[si] + stageW + stageGap / 2 - 8;
    ctx.strokeRect(bx, dieT + 16, 16, 18);
    // Internal lines
    ctx.fillRect(bx + 2, dieT + 21, 12, 1);
    ctx.fillRect(bx + 2, dieT + 27, 12, 1);
    ctx.fillRect(bx + 8, dieT + 18, 1, 14);
  }

  // === BOTTOM INFRASTRUCTURE (below pipeline stages) ===
  const botT = stageB + 4;   // bottom zone top
  const botB = dieB - 12;    // bottom zone bottom (inside die border)
  const botH = botB - botT;  // ~88px
  const botL = dieL + 12;
  const botR = dieR - 12;
  const botW = botR - botL;

  // Divide bottom into 4 horizontal bands
  const band1T = botT;                           // Bus matrix
  const band1B = botT + Math.floor(botH * 0.25);
  const band2T = band1B + 2;                     // Clock distribution
  const band2B = botT + Math.floor(botH * 0.50);
  const band3T = band2B + 2;                     // Controller blocks
  const band3B = botT + Math.floor(botH * 0.75);
  const band4T = band3B + 2;                     // Forwarding/hazard
  const band4B = botB;

  // --- Band 1: Data/Address Bus Matrix (red) ---
  ctx.fillStyle = "#ef4444";
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 1;
  // Dense horizontal bus lines
  const busCount = Math.floor((band1B - band1T) / 3);
  for (let i = 0; i < busCount; i++) {
    const y = band1T + i * 3;
    ctx.fillRect(botL, y, botW, 2);
  }
  // Vertical taps at each stage center
  for (const sx of stageXs) {
    const cx = sx + stageW / 2;
    ctx.fillRect(cx - 1, band1T, 3, band1B - band1T);
  }
  // Bus arbiter/crossbar blocks between stages
  for (let si = 0; si < numStages - 1; si++) {
    const ax = stageXs[si] + stageW + stageGap / 2 - 10;
    const aw = 20;
    const ah = band1B - band1T - 4;
    ctx.strokeRect(ax, band1T + 2, aw, ah);
    // Internal crossbar lines
    const crossLines = Math.floor(ah / 4);
    for (let c = 0; c < crossLines; c++) {
      const cy = band1T + 4 + c * 4;
      ctx.fillRect(ax + 2, cy, aw - 4, 1);
    }
    // Vertical divider
    ctx.fillRect(ax + aw / 2, band1T + 3, 1, ah - 2);
  }

  // --- Band 2: Clock Distribution H-Tree (green) ---
  ctx.fillStyle = "#22c55e";
  ctx.strokeStyle = "#22c55e";
  ctx.lineWidth = 1.5;
  const clkMidY = Math.floor((band2T + band2B) / 2);
  const clkMidX = Math.floor((botL + botR) / 2);
  // Main trunk
  ctx.fillRect(botL, clkMidY, botW, 3);
  // Level 1 branches: split at midpoint
  ctx.fillRect(clkMidX - 1, band2T, 3, band2B - band2T);
  // Level 2 branches: quarter points
  const q1x = Math.floor((botL + clkMidX) / 2);
  const q3x = Math.floor((clkMidX + botR) / 2);
  ctx.fillRect(q1x - 1, band2T + 2, 3, band2B - band2T - 4);
  ctx.fillRect(q3x - 1, band2T + 2, 3, band2B - band2T - 4);
  // Level 2 horizontal branches
  ctx.fillRect(botL, band2T + 4, botW, 2);
  ctx.fillRect(botL, band2B - 4, botW, 2);
  // Level 3 branches: eighth points
  const eighths = [botL, q1x, clkMidX, q3x, botR];
  for (let i = 0; i < eighths.length - 1; i++) {
    const ex = Math.floor((eighths[i] + eighths[i + 1]) / 2);
    ctx.fillRect(ex, band2T + 3, 2, band2B - band2T - 6);
  }
  // Clock buffer boxes at endpoints
  ctx.lineWidth = 1;
  for (let i = 0; i < 10; i++) {
    const bx = botL + 8 + (i / 9) * (botW - 20);
    ctx.strokeRect(bx - 4, clkMidY - 5, 8, 5);
    ctx.strokeRect(bx - 4, clkMidY + 3, 8, 5);
    // Triangle (buffer symbol)
    ctx.beginPath();
    ctx.moveTo(bx - 2, clkMidY - 4);
    ctx.lineTo(bx + 2, clkMidY - 2);
    ctx.lineTo(bx - 2, clkMidY);
    ctx.stroke();
  }

  // --- Band 3: Memory/IO Controller Blocks (cyan) ---
  ctx.fillStyle = "#22d3ee";
  ctx.strokeStyle = "#22d3ee";
  ctx.lineWidth = 1.5;
  const ctrlLabels = ["MEM", "DMA", "IRQ", "DBG", "PMU"];
  const ctrlCount = ctrlLabels.length;
  const ctrlGap = 6;
  const ctrlW = Math.floor((botW - (ctrlCount - 1) * ctrlGap) / ctrlCount);
  const ctrlH = band3B - band3T - 2;
  for (let ci = 0; ci < ctrlCount; ci++) {
    const cx = botL + ci * (ctrlW + ctrlGap);
    // Block outline
    ctx.strokeRect(cx, band3T + 1, ctrlW, ctrlH);
    // Label
    ctx.font = "bold 8px monospace";
    ctx.fillText(ctrlLabels[ci], cx + 3, band3T + 10);
    // Internal FIFO/queue grid
    ctx.lineWidth = 0.8;
    const gridRows = Math.floor((ctrlH - 14) / 4);
    const gridCols = Math.floor(ctrlW / 6);
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        ctx.strokeRect(cx + 2 + c * 6, band3T + 13 + r * 4, 5, 3);
      }
    }
    ctx.lineWidth = 1.5;
  }
  // Connecting lines between controller blocks
  for (let ci = 0; ci < ctrlCount - 1; ci++) {
    const fromR = botL + ci * (ctrlW + ctrlGap) + ctrlW;
    const toL = botL + (ci + 1) * (ctrlW + ctrlGap);
    const midY = band3T + ctrlH / 2;
    ctx.fillRect(fromR, midY - 1, toL - fromR, 3);
    ctx.fillRect(fromR, midY - 4, toL - fromR, 1);
    ctx.fillRect(fromR, midY + 3, toL - fromR, 1);
  }

  // --- Band 4: Forwarding/Hazard Logic (purple) ---
  ctx.fillStyle = "#a855f7";
  ctx.strokeStyle = "#a855f7";
  ctx.lineWidth = 1;
  // Multiple forwarding paths (horizontal)
  const fwdLines = Math.floor((band4B - band4T) / 4);
  for (let i = 0; i < fwdLines; i++) {
    const y = band4T + i * 4;
    ctx.fillRect(botL, y, botW, 2);
  }
  // Vertical taps from stages
  for (const sx of stageXs) {
    const cx = sx + stageW / 2;
    ctx.fillRect(cx - 1, band4T, 3, band4B - band4T);
  }
  // Hazard detection logic blocks
  ctx.lineWidth = 1.5;
  const hazardPairs = [
    { from: 2, to: 1 },
    { from: 3, to: 1 },
    { from: 3, to: 2 },
    { from: 4, to: 1 },
  ];
  for (const hp of hazardPairs) {
    const fromCx = stageXs[hp.from] + stageW / 2;
    const toCx = stageXs[hp.to] + stageW / 2;
    const midX = Math.floor((fromCx + toCx) / 2);
    const midY = Math.floor((band4T + band4B) / 2);
    // Comparator block at midpoint
    ctx.strokeRect(midX - 6, midY - 5, 12, 10);
    // "=" symbol inside
    ctx.fillRect(midX - 3, midY - 2, 6, 1);
    ctx.fillRect(midX - 3, midY + 1, 6, 1);
    // Diagonal hazard paths
    ctx.beginPath();
    ctx.moveTo(fromCx, band4T + 2);
    ctx.lineTo(midX + 6, midY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(midX - 6, midY);
    ctx.lineTo(toCx, band4T + 2);
    ctx.stroke();
  }

  // --- Metal routing overlay (subtle blue — upper metal layers) ---
  ctx.fillStyle = "#3b82f6";
  ctx.globalAlpha = 0.2;
  for (let y = dieT + 20; y < dieB - 20; y += 8) {
    ctx.fillRect(dieL + 12, y, dieW - 24, 1);
  }
  for (let x = dieL + 20; x < dieR - 20; x += 10) {
    ctx.fillRect(x, dieT + 20, 1, dieH - 40);
  }
  ctx.globalAlpha = 1.0;
}

export function generateChipDie(): FormationData {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const rand = seededRandom(271);

  // SSR / fallback guard
  if (typeof document === "undefined") {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (rand() - 0.5) * 14;
      positions[i * 3 + 1] = (rand() - 0.5) * 9;
      positions[i * 3 + 2] = (rand() - 0.5) * 0.1;
    }
    return { positions, colors: null };
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (rand() - 0.5) * 14;
      positions[i * 3 + 1] = (rand() - 0.5) * 9;
      positions[i * 3 + 2] = (rand() - 0.5) * 0.1;
    }
    return { positions, colors: null };
  }

  // High-res canvas for sharp detail
  const W = 1400;
  const H = 900;
  canvas.width = W;
  canvas.height = H;

  drawChipDie(ctx, W, H);

  // Sample particles from colored ink pixels
  const imageData = ctx.getImageData(0, 0, W, H);
  const data = imageData.data;
  const inkPixels: number[] = [];
  const inkColors: number[] = [];

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      // Any non-black pixel is valid ink (handles all colors)
      if (r > 30 || g > 30 || b > 30) {
        inkPixels.push(x, y);
        inkColors.push(r / 255, g / 255, b / 255);
      }
    }
  }

  const numInk = inkPixels.length / 2;
  if (numInk === 0) {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (rand() - 0.5) * 14;
      positions[i * 3 + 1] = (rand() - 0.5) * 9;
      positions[i * 3 + 2] = (rand() - 0.5) * 0.1;
    }
    return { positions, colors: null };
  }

  // Map canvas coords to world coords (centered, ~14x9 world units)
  const worldWidth = 14;
  const worldHeight = worldWidth * (H / W);
  const colors = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const pi = Math.floor(rand() * numInk);
    const px = inkPixels[pi * 2];
    const py = inkPixels[pi * 2 + 1];
    const idx = i * 3;
    positions[idx] = (px / W - 0.5) * worldWidth + (rand() - 0.5) * 0.015;
    positions[idx + 1] = -(py / H - 0.5) * worldHeight + (rand() - 0.5) * 0.015;
    positions[idx + 2] = (rand() - 0.5) * 0.015;
    colors[idx] = inkColors[pi * 3];
    colors[idx + 1] = inkColors[pi * 3 + 1];
    colors[idx + 2] = inkColors[pi * 3 + 2];
  }

  return { positions, colors };
}


/**
 * Render text to an offscreen canvas and sample particle positions from
 * the text pixel data. Creates particles that trace actual text shapes —
 * the "Metaware particle-text" technique.
 */
function sampleTextFormation(
  lines: string[],
  count: number,
  worldWidth: number,
  seed: number,
): Float32Array {
  const positions = new Float32Array(count * 3);
  const rand = seededRandom(seed);

  // SSR / fallback guard
  if (typeof document === "undefined") {
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * worldWidth;
      positions[i * 3 + 1] = (rand() - 0.5) * worldWidth * 0.6;
      positions[i * 3 + 2] = (rand() - 0.5) * 0.1;
    }
    return positions;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * worldWidth;
      positions[i * 3 + 1] = (rand() - 0.5) * worldWidth * 0.6;
      positions[i * 3 + 2] = (rand() - 0.5) * 0.1;
    }
    return positions;
  }

  const fontSize = 48;
  const lineHeight = fontSize * 1.6;

  // Measure max text width before setting canvas size
  ctx.font = `${fontSize}px monospace`;
  let maxWidth = 0;
  for (const line of lines) {
    if (line.length > 0) {
      maxWidth = Math.max(maxWidth, ctx.measureText(line).width);
    }
  }

  const pad = fontSize / 2;
  canvas.width = Math.ceil(maxWidth + pad * 2);
  canvas.height = Math.ceil(lines.length * lineHeight + pad * 2);

  // Re-set font after canvas resize (resets context state)
  ctx.font = `${fontSize}px monospace`;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "top";

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].length > 0) {
      ctx.fillText(lines[i], pad, i * lineHeight + pad);
    }
  }

  // Collect ink pixel positions (every pixel for sharp detail)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const inkPixels: number[] = []; // flat: [x0, y0, x1, y1, ...]

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      if (data[(y * canvas.width + x) * 4] > 100) {
        inkPixels.push(x, y);
      }
    }
  }

  const numInk = inkPixels.length / 2;
  if (numInk === 0) {
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * worldWidth;
      positions[i * 3 + 1] = (rand() - 0.5) * worldWidth * 0.6;
      positions[i * 3 + 2] = (rand() - 0.5) * 0.1;
    }
    return positions;
  }

  // Map canvas pixel coords to centered world coords
  const aspect = canvas.width / canvas.height;
  const worldHeight = worldWidth / aspect;

  for (let i = 0; i < count; i++) {
    const pi = Math.floor(rand() * numInk) * 2;
    const px = inkPixels[pi];
    const py = inkPixels[pi + 1];
    const idx = i * 3;
    positions[idx] = (px / canvas.width - 0.5) * worldWidth + (rand() - 0.5) * 0.02;
    positions[idx + 1] = -(py / canvas.height - 0.5) * worldHeight + (rand() - 0.5) * 0.02;
    positions[idx + 2] = (rand() - 0.5) * 0.02;
  }

  return positions;
}

// ---------------------------------------------------------------------------
// Stage 4: Assembly — particles sampled from rendered text
// ---------------------------------------------------------------------------

const ASSEMBLY_LINES = [
  "# RISC-V boot sequence",
  "_start:",
  "  la      sp, _stack_top",
  "  li      a0, 0x80000000",
  "  csrw    mtvec, a0",
  "  jal     ra, kernel_init",
  "",
  "kernel_init:",
  "  addi    sp, sp, -32",
  "  sd      ra, 24(sp)",
  "  jal     ra, mem_init",
  "  jal     ra, scheduler_start",
];

export function generateAssembly(): FormationData {
  return { positions: sampleTextFormation(ASSEMBLY_LINES, PARTICLE_COUNT, 10, 314), colors: null };
}

// ---------------------------------------------------------------------------
// Stage 5: Source Code — particles sampled from rendered text
// ---------------------------------------------------------------------------

const SOURCE_LINES = [
  "pub fn build_system(config: &Config) -> Result<System> {",
  "    let pipeline = Pipeline::new()",
  '        .stage("transistors")',
  '        .stage("logic_gates")',
  '        .stage("architecture")',
  "        .build();",
  "",
  "    // The journey from silicon",
  "    // to software, compiled.",
  "    pipeline.compile(config)",
  "}",
];

export function generateSourceCode(): FormationData {
  return { positions: sampleTextFormation(SOURCE_LINES, PARTICLE_COUNT, 10, 420), colors: null };
}

/** Generate random scatter positions for entry animation. */
export function generateScatter(): Float32Array {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const rand = seededRandom(999);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const idx = i * 3;
    positions[idx] = (rand() - 0.5) * 16;
    positions[idx + 1] = (rand() - 0.5) * 12;
    positions[idx + 2] = (rand() - 0.5) * 4;
  }

  return positions;
}

/** All formation generators in stage order. */
export const FORMATIONS: Array<() => FormationData> = [
  generateTransistors,
  generateLogicGates,
  generateChipDie,
  generateAssembly,
  generateSourceCode,
];
