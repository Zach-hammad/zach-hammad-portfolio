# Unified Canvas Architecture — Design Spec

## Problem

Two competing visual systems create a disjointed experience:
1. **Particle hero** (80K particles, R3F/Three.js) — confined to a sticky 400vh container, fades to black at scroll end
2. **Dragon curve SVG overlay** (fixed, z-30) — broken scroll animation, 30+ iterations of tweaking, still not right

The hero ends with a hard cut to darkness. The dragon curve fights the particles for attention. There's no visual continuity from hero to content.

## Solution

**One full-page fixed canvas.** The particle system tells the ENTIRE story:
- Stages 0-4: existing hero formations (transistors → gates → chip → assembly → code)
- Stage 5 (NEW): particles morph from source code into a dragon curve formation
- Content phase: dragon curve particles persist as subtle background, color-shifting per section

Delete `DragonCurveBackground.tsx` entirely. The particles ARE the dragon curve now.

## Architecture

### Layer Stack

```
z-50  TopBar (fixed nav, existing)
z-10  <main> content (relative, scrollable, semi-transparent backgrounds)
z-5   CodeOverlay (fixed div, sibling to canvas wrapper, visible during hero only)
z-0   Canvas wrapper (fixed div, inset-0, contains R3F Canvas)
      Body background (#0a0a0a)
```

The canvas wrapper div is `className="fixed inset-0 z-0"`. CodeOverlay is a separate `fixed` div at `z-5`, rendered as a sibling outside the canvas wrapper.

### Scroll Phases

**Phase 1 — Hero (scrollY 0 to 400vh)**

Stages 0-5 mapped to hero scroll progress (0.0 to 1.0), where `heroProgress = Math.min(scrollY / (4 * window.innerHeight), 1)`:

```
0.00-0.12  hold stage 0   (transistors)
0.12-0.20  lerp 0→1
0.20-0.28  hold stage 1   (logic gates)
0.28-0.38  lerp 1→2
0.38-0.48  hold stage 2   (chip die)
0.48-0.58  lerp 2→3
0.58-0.66  hold stage 3   (assembly)
0.66-0.76  lerp 3→4
0.76-0.82  hold stage 4   (source code)
0.82-0.92  lerp 4→5       (source code → dragon curve)
0.92-1.00  hold stage 5   (dragon curve) + intensity fade
```

During hold stage 5 (0.92-1.00), `uIntensity` fades linearly from 1.0 → 0.18. No easing — linear is fine for an 8% scroll window that takes ~0.5s of scrolling.

**Phase 2 — Content (scrollY > 400vh)**

```
contentProgress = Math.max(0, Math.min(1,
  (scrollY - 4 * innerHeight) / (document.documentElement.scrollHeight - window.innerHeight - 4 * innerHeight)
))
```

If the denominator is <= 0 (extremely short page), clamp to 0. This is a degenerate edge case that won't happen in practice.

- Dragon curve particles hold formation at background intensity (uIntensity = 0.18)
- Color shifts to match the current content section's accent (see Content Color Mapping below)
- Idle drift shader provides subtle life
- `uIntensity` stays at 0.18 throughout content phase

**Entry animation:** Unchanged. Still scatter → formation[0] (transistors) over 0.6s. `uIntensity` starts at 1.0 during entry.

### Dragon Curve Formation

Reuse the L-system turn-sequence algorithm from `DragonCurveBackground.tsx`:

```ts
export function generateDragonCurve(): FormationData {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const rand = seededRandom(555);

  // 1. Generate turn sequence (14 iterations → 16384 turns → 16385 points)
  let turns: number[] = [];
  for (let i = 0; i < 14; i++) {
    const flipped = turns.slice().reverse().map(t => 1 - t);
    turns = [...turns, 0, ...flipped];
  }

  // 2. Walk turns to produce points
  const dx = [1, 0, -1, 0];
  const dy = [0, 1, 0, -1];
  let dir = 0;
  const pts: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  for (const turn of turns) {
    dir = (dir + (turn === 0 ? 1 : 3)) % 4;
    const last = pts[pts.length - 1];
    pts.push({ x: last.x + dx[dir], y: last.y + dy[dir] });
  }

  // 3. Compute bounding box and scale to ±6 world units
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  const scale = 12 / Math.max(rangeX, rangeY); // fit in ±6
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  // 4. Distribute particles along segments proportionally
  const numSegments = pts.length - 1; // 16384
  let p = 0;
  for (let s = 0; s < numSegments && p < PARTICLE_COUNT; s++) {
    // ~5 particles per segment (80000/16384 ≈ 4.88)
    const count = Math.floor((s + 1) * PARTICLE_COUNT / numSegments) - Math.floor(s * PARTICLE_COUNT / numSegments);
    const x0 = (pts[s].x - cx) * scale;
    const y0 = (pts[s].y - cy) * scale;
    const x1 = (pts[s + 1].x - cx) * scale;
    const y1 = (pts[s + 1].y - cy) * scale;
    p = lineParticles(positions, p, count, x0, y0, x1, y1, rand, 0.02);
  }

  // 5. Fill any rounding remainder
  while (p < PARTICLE_COUNT) {
    const idx = p * 3;
    positions[idx] = (rand() - 0.5) * 12;
    positions[idx + 1] = (rand() - 0.5) * 12;
    positions[idx + 2] = (rand() - 0.5) * 0.02;
    p++;
  }

  return { positions, colors: null };
}
```

Jitter value 0.02 (half the default 0.04) for tighter lines. The integer-division trick (`Math.floor((s+1)*N/total) - Math.floor(s*N/total)`) distributes exactly PARTICLE_COUNT particles across all segments with no off-by-one.

### Content Color Mapping

Hard-coded breakpoints based on the known page structure. The content below the hero has a fixed section order:

```ts
// Approximate content-phase breakpoints (fraction of content scroll)
const CONTENT_COLORS = [
  { at: 0.00, color: new THREE.Color("#4ade80") },  // IntroSection + Hardware
  { at: 0.35, color: new THREE.Color("#60a5fa") },  // Systems
  { at: 0.60, color: new THREE.Color("#c084fc") },  // Software
  { at: 1.00, color: new THREE.Color("#c084fc") },  // Personal/Contact (hold)
];

export function computeContentColor(contentProgress: number): THREE.Color {
  // Linear interpolation between stops, same as lerpColor pattern
}
```

These breakpoints don't need to be pixel-perfect. The sections are always in the same order; the color transitions are gradual enough that ±10% offset is imperceptible. No Intersection Observer needed.

Color updates happen via `fillColorBuffer()` (already exists in ParticleSystem.tsx). This runs only when color changes detectably (threshold: deltaProgress > 0.01), not every frame.

### Shader Changes

New uniform `uIntensity` (float, initial value 1.0):

**Vertex shader:**
```glsl
uniform float uIntensity;
// ...
// Scale point size: 30% minimum (still visible as fine dots) to 100%
gl_PointSize = baseSize * pulse * uPixelRatio * (0.3 + uIntensity * 0.7);
```

**Fragment shader:**
```glsl
uniform float uIntensity;
// ...
// Scale alpha: 30% minimum to 100%
alpha *= 0.3 + uIntensity * 0.7;
```

### Content Section Backgrounds

All content sections get `bg-[#0a0a0a]/90` — 90% opaque dark background.

**Effective particle visibility through sections:** At uIntensity=0.18, base alpha ≈ 0.43 (from `0.3 + 0.18 * 0.7`), through 10% transparency = ~4.3% effective opacity. This is subtle — more "sense of depth" than visible lines. The dragon curve is primarily visible through the **gaps between sections**.

**Between sections:** Replace `<hr class="section-rule">` with `<div className="h-8" aria-hidden="true" />` transparent gaps. Dragon curve particles are fully visible (at background intensity) through these gaps, becoming the section divider.

**Mobile/fallback:** Sections always use `bg-[#0a0a0a]/90`. Without a canvas behind them, `rgba(10,10,10,0.9)` over a `#0a0a0a` body is visually indistinguishable from fully opaque. No conditional logic needed.

### CodeOverlay Behavior

CodeOverlay visibility is already controlled by its `fadeWindow()` function based on `progress`:
- Assembly snippet: visible at progress 0.65-0.82
- Source code snippet: visible at progress 0.82-1.0

When `heroProgress >= 1.0`, both snippets have opacity 0, so CodeOverlay returns `null`. No additional hide logic needed. The component becomes a fixed div (not absolute), receiving `heroProgress` as its `progress` prop.

## Component Changes

### New: `CanvasBackground.tsx`

Fixed full-page canvas + CodeOverlay. Replaces `CanvasHero.tsx`.

```tsx
// Structure
<>
  <div className="fixed inset-0 z-0">
    <Canvas camera={{ position: [0, 0, 14.5], fov: 45 }} dpr={[1, 2]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}>
      <ParticleSystem heroProgressRef={heroProgressRef} contentProgressRef={contentProgressRef} />
    </Canvas>
  </div>
  <div className="fixed inset-0 z-5 pointer-events-none">
    <CodeOverlay progress={heroProgress} />
  </div>
</>
```

Scroll tracking (via `useEffect` + scroll listener):
- `heroProgressRef.current = Math.min(scrollY / (4 * innerHeight), 1)`
- `contentProgressRef.current` = content scroll fraction (see formula above)
- `heroProgress` state = throttled via rAF for CodeOverlay (same pattern as current `useScrollProgress`)

**No fade-out logic.** The current `CanvasHero` opacity fade (`progress > 0.95 ? (1-progress)/0.05 : 1`) is removed entirely. Intensity is controlled by the shader's `uIntensity` uniform instead.

### Modified: `HeroContainer.tsx`

```tsx
export default function HeroContainer() {
  const capable = useCanvasCapability();

  if (CanvasHero && capable) {
    // Just a scroll spacer — canvas is at page level
    return <div className="h-[400vh]" aria-hidden="true" />;
  }

  return <StaticHero />;
}
```

No more `relative` wrapper, no more `sticky` div. The 400vh spacer works as a plain block element that provides scroll distance.

### Modified: `page.tsx`

```tsx
export default async function Home() {
  // ... data fetching unchanged ...

  return (
    <>
      <TopBar />
      <CanvasBackground />
      <main className="relative z-10 font-mono">
        <HeroContainer />
        <IntroSection />
        <div className="h-8" aria-hidden="true" />
        <LayerSection layerNumber={1} label="Hardware" ... >
          {/* ... */}
        </LayerSection>
        <div className="h-8" aria-hidden="true" />
        <LayerSection layerNumber={2} label="Systems" ... >
          {/* ... */}
        </LayerSection>
        <div className="h-8" aria-hidden="true" />
        <LayerSection layerNumber={3} label="Software & AI" ... >
          {/* ... */}
        </LayerSection>
        <div className="h-8" aria-hidden="true" />
        <PersonalSection />
        <ContactFooter />
      </main>
    </>
  );
}
```

`CanvasBackground` is a client component imported with `dynamic(() => import(...), { ssr: false })` guarded by the feature flag, same pattern as current `CanvasHero` in `HeroContainer`.

### Modified: `formations.ts`

- Add `generateDragonCurve()` (algorithm above)
- Add to `FORMATIONS` array: `FORMATIONS[5] = generateDragonCurve`

### Modified: `useParticlePositions.ts`

- Add `STAGE_COLORS[5] = new THREE.Color("#c084fc")` (purple — same as stage 4, the dragon curve doesn't introduce a new color)
- Remap `ZONES` array to 6-stage layout (boundaries from Scroll Phases above)
- Add `computeContentColor()` export
- `computeTransition()` now handles stages 0-5

### Modified: `shaders.ts`

- Add `uniform float uIntensity;` declaration to vertex shader
- Apply intensity scaling to `gl_PointSize` and alpha (formulas above)

### Modified: `ParticleSystem.tsx`

- Props: `heroProgressRef` + `contentProgressRef` (replaces single `progressRef`)
- New uniform: `uIntensity: { value: 1.0 }`
- `useFrame` logic:
  - If `heroProgress < 1`: use `computeTransition(heroProgress)` for stages (existing logic)
  - If `heroProgress >= 0.92`: compute intensity fade `uIntensity = 1.0 - (heroProgress - 0.92) / 0.08 * 0.82`
  - If `heroProgress >= 1`: content phase — `uIntensity = 0.18`, update colors via `computeContentColor(contentProgress)`
- Color buffer updates during content: only when `contentProgress` changes by > 0.01 (not every frame)

### Modified: Content Sections

All add `bg-[#0a0a0a]/90` to their outermost container:
- `LayerSection.tsx`: `<section className="py-20 px-4 bg-[#0a0a0a]/90">`
- `IntroSection.tsx`: add `bg-[#0a0a0a]/90` to section
- `PersonalSection.tsx`: add `bg-[#0a0a0a]/90` to section
- `ContactFooter.tsx`: add `bg-[#0a0a0a]/90` to footer

### Deleted: `DragonCurveBackground.tsx`

Remove file. Remove import from `page.tsx`. Algorithm preserved in `formations.ts`.

### Modified: `globals.css`

Remove `.section-rule` class.

## What's NOT Changing

- StaticHero (fallback) — unchanged
- TopBar — unchanged
- ProjectCard / ProfessionalCard — unchanged
- AnimatedSection — unchanged
- PhotoCarousel — unchanged
- Data files (projects, professional, contact) — unchanged
- GitHub stats fetching — unchanged
- Tailwind config — unchanged
- Build process — unchanged

## Edge Cases

1. **Very short page (few projects)**: Content progress denominator approaches 0. Clamped to 0, color stays at first stop. Acceptable.
2. **Very tall page (many projects)**: Color transitions spread out proportionally. Fine.
3. **Window resize**: `innerHeight` recalculated on each scroll event. Small jump in progress is acceptable — users rarely resize mid-scroll.
4. **Canvas flag disabled**: No canvas rendered. `HeroContainer` renders `StaticHero`. Content sections have visually-opaque backgrounds. Fully functional.
5. **Content loads after initial render (images)**: `document.documentElement.scrollHeight` is read on each scroll event, so content progress auto-adjusts. Color mapping may shift slightly as images load, but the transitions are gradual enough to be imperceptible.

## Success Criteria

1. Particles morph through 6 formations as you scroll through the hero
2. The 6th formation (dragon curve) is clearly recognizable as a fractal
3. Particles dim smoothly to background intensity at end of hero
4. Dragon curve particles visible through transparent gaps between content sections
5. Dragon curve color shifts to match current section's accent
6. No visible "seam" or hard cut between hero and content phases
7. Content text remains fully readable over semi-transparent backgrounds
8. 60fps throughout on mid-range hardware
9. Mobile/reduced-motion fallback still works
10. `bun run build` succeeds
