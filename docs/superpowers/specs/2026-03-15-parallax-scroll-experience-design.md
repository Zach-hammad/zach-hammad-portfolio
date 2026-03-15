# Parallax Scroll Experience Design

**Date:** 2026-03-15
**Status:** Draft
**Scope:** Full-page parallax narrative with ambient particle dissolve, scroll-driven content entrances, and depth-layered dragon curve

## Problem

The portfolio hero (5-stage particle system) is visually impressive but self-contained. Below the fold, the site becomes a standard card grid with fade-in animations. There's no visual thread connecting the hero to the content sections, creating a disconnect between the "wow" moment and the actual portfolio work. The dragon curve background spans the page but sits as a flat fixed overlay with no depth.

## Goals

1. Create a continuous scroll experience from hero to footer with perceived depth
2. Transition the particle system into ambient background presence below the hero
3. Give the dragon curve spatial depth via parallax scrolling
4. Add scroll-driven content section entrances that punctuate the narrative
5. Maintain performance on mid-range laptops and graceful degradation on mobile

## Non-Goals

- No changes to the hero particle system itself (formations, shaders, scroll mapping)
- No new content sections (blog, case studies, project detail pages)
- No dark/light mode toggle
- No changes to the TopBar or ContactFooter behavior

## Architecture

### Parallax Scroll Container

The root `<main>` element becomes a CSS parallax container using the `perspective` + `preserve-3d` technique:

```
perspective: 1px
overflow-x: hidden
overflow-y: auto
height: 100vh
transform-style: preserve-3d
```

**Scroll mechanics:** The parallax container (`<main>`) becomes the scroll host — it has `height: 100vh` and `overflow-y: auto`, so scroll events fire on this element, not `window`. All scroll listeners (dragon curve, ambient particles, ScrollContext) must read `container.scrollTop` and `container.scrollHeight` instead of `window.scrollY` and `document.documentElement.scrollHeight`.

**Concrete DOM structure:**
```html
<!-- Outside parallax — fixed elements -->
<TopBar />           <!-- position: fixed, z-50 -->
<HeroContainer />    <!-- position: fixed, z-10 (sibling, NOT child of main) -->

<!-- Parallax scroll container -->
<main style="perspective: 1px; height: 100vh; overflow-y: auto; transform-style: preserve-3d">
  <!-- Background layers (depth) -->
  <div style="translateZ(-3px) scale(4)">  <!-- far ambient particles -->
  <div style="translateZ(-2px) scale(3)">  <!-- mid ambient particles -->
  <div style="translateZ(-1px) scale(2)">  <!-- dragon curve + near particles -->

  <!-- Foreground (normal scroll) -->
  <div style="translateZ(0)">
    <div style="height: 400vh" />  <!-- hero scroll spacer -->
    <IntroSection />
    <hr />
    <LayerSection /> × 3
    <PersonalSection />
    <ContactFooter />
  </div>
</main>
```

Child layers are positioned at different Z-depths using `translateZ(-Npx) scale(N+1)`, where the scale factor compensates for perspective shrinkage. Deeper layers scroll slower than foreground content, creating natural depth without JavaScript scroll listeners.

### Layer Stack

| Layer | Z-Depth | Scroll Speed | Content |
|-------|---------|-------------|---------|
| Far ambient particles | `translateZ(-3px) scale(4)` | 1/4x | ~60 particles, 1-2px, opacity 0.08 |
| Mid ambient particles | `translateZ(-2px) scale(3)` | 1/3x | ~40 particles, 2-4px, opacity 0.12 |
| Dragon curve + near particles | `translateZ(-1px) scale(2)` | 1/2x | Dragon curve SVG + ~20 particles, 3-5px, opacity 0.18 |
| Content | `translateZ(0)` | 1x | All page content (sections, cards, footer) |

The TopBar remains `position: fixed` with `z-index: 50`, outside the parallax system entirely.

### Hero Canvas Integration

**Critical: The HeroContainer must be a sibling of the parallax container, NOT a child.** `position: fixed` elements inside a `preserve-3d` container have undefined z-ordering per CSS spec. The hero canvas is moved outside `<main>` and rendered as a sibling element, visually behind the content layer but above the parallax background layers via `z-index`.

The `HeroContainer` wrapper (currently `sticky top-0 h-screen z-10`) changes to `fixed top-0 inset-x-0 h-screen z-10`. The hero scroll spacer inside `<main>` preserves the scroll range for the particle formations.

The hero canvas scroll listener currently reads `window.scrollY`. Since the parallax container becomes the scroll host, `CanvasHero.tsx` needs a minor modification: accept a `scrollRef` prop pointing to the parallax container and read `scrollRef.current.scrollTop` instead of `window.scrollY`. This is the only change to hero components.

**Modified hero files:**
- `CanvasHero.tsx` — accept `scrollRef` prop, read from container scroll
- `HeroContainer.tsx` — change from `sticky` to `fixed` positioning

**Unchanged hero files:**
- `ParticleSystem.tsx`
- `formations.ts`
- `shaders.ts`
- `useParticlePositions.ts`

## Components

### ScrollContext Provider

A React context that wraps the parallax scroll container and exposes scroll state to descendants.

**Interface:**
```typescript
interface ScrollContextValue {
  scrollProgress: number;  // 0-1, overall page progress
  scrollY: number;         // raw scroll position in px
  containerRef: RefObject<HTMLDivElement>;
}
```

**Rationale:** The parallax container uses its own scroll (not `window.scrollY`). Components that need scroll position (dragon curve, ambient particles, section animations) must read from the container element. A shared context avoids each component independently querying the DOM.

**Consumers:**
1. DragonCurveBackground (dashoffset + gradient color)
2. AmbientParticles (fade-in timing + color)
3. AnimatedSection (entrance trigger thresholds)

**Implementation:** The provider attaches a passive scroll listener to the container ref and updates values via ref (for animation loops) and throttled state (for React consumers that need re-renders). This mirrors the dual ref/state pattern already used in `CanvasHero.tsx`.

### AmbientParticles

A lightweight 2D canvas component that renders ~120 particles at three depth tiers below the hero fold.

**Behavior:**
- Particles are randomly positioned across the full page width and the below-hero page height at mount time
- Each particle has: position (x, y), size (1-5px based on tier), base opacity, drift velocity, depth tier
- Colors track the current scroll section using the existing `COLOR_STOPS` array from `DragonCurveBackground.tsx` (extract to shared `src/lib/colors.ts`)
- Idle drift: slow random motion (0.1-0.3px/frame), direction changes every 3-5 seconds
- Rendering: simple filled circles with soft edges via `radialGradient` or `globalAlpha` falloff

**Fade-in transition:**
- Canvas element is present from mount but at `opacity: 0`
- At hero scroll progress 85%, begins fading in (CSS transition, 500ms)
- Fully visible at scroll progress 95%
- The hero canvas fades out from 95-100%. This creates a precise overlap: ambient particles reach full opacity at the same moment the hero begins fading out. Between 85-95%, ambient particles are fading in while the hero is still fully visible — the ambient particles are below perception threshold during this window, preventing visual seam. No dead zone between systems.

**Parallax integration:**
- Use three separate `<canvas>` elements, one per depth tier, placed at actual CSS parallax depths (`translateZ(-1px)`, `-2px`, `-3px` with corresponding scale corrections)
- Each canvas renders only its tier's particles (~20-60 particles each)
- This gives true CSS parallax depth separation — the browser compositor handles the scroll speed differences natively, consistent with the overall architecture
- Each canvas is `position: absolute; inset: 0` within its parallax layer div, sized to match the full scrollable content height

**Performance budget:**
- 120 particles, simple circle draws
- `requestAnimationFrame` loop, but only when canvas is in viewport (Intersection Observer gate)
- No WebGL, no Three.js — raw Canvas 2D API
- Target: < 1ms per frame on mid-range laptop

### DragonCurveBackground (Modified)

**Current:** `position: fixed`, `inset-0`, reads `window.scrollY`.

**Changes:**
1. Remove `position: fixed` and `inset-0` styles
2. Position as a parallax layer: `translateZ(-1px) scale(2)` within the scroll container
3. Switch scroll listener from `window` scroll event to `ScrollContext` values
4. Keep all existing behavior: progressive reveal via `strokeDashoffset`, vertical color-shifting gradient via `lerpColor`

**Concern — `overflow: hidden` on cards:**
The `preserve-3d` context can interfere with `overflow: hidden` on descendant elements. Audit all card components (`ProjectCard`, `ProfessionalCard`) and `PhotoCarousel` for `overflow: hidden` usage. If present, add `transform-style: flat` to those elements to isolate them from the 3D context.

**Concern — SVG at 2x scale:**
At `scale(2)`, the dragon curve SVG renders at double its natural size. Since it's vector, this should be visually clean, but verify on lower-end GPUs that the 16,384-segment path doesn't cause compositing performance issues at 2x.

### AnimatedSection (Modified)

**Current:** Fade-in animation on intersection, uniform behavior.

**Changes:**
1. Keep Framer Motion's built-in Intersection Observer for entrance triggers (simpler than ScrollContext for this use case, already works)
2. Add `staggerDelay` prop (default 80ms) to support per-card stagger within a section
3. Card entrance animation: fade-in + 12px upward drift, 400ms duration, staggered 80ms per card. This is the universal card animation across all sections.

**Section-level treatments (not per-card):**
- Section `<hr>` rules: draw from center outward via CSS `scaleX(0) → scaleX(1)` transition triggered by Intersection Observer. Duration: 600ms, ease-out.
- Section labels (`// LAYER N — LABEL`): fade in 200ms before cards begin staggering

### Shared Color Constants

Extract `COLOR_STOPS` from `DragonCurveBackground.tsx` to `src/lib/colors.ts`. Both `DragonCurveBackground` and `AmbientParticles` import from this shared source.

```typescript
// src/lib/colors.ts
export const STAGE_COLOR_STOPS = [
  { at: 0.0,  color: [74, 222, 128] as const },  // green — transistors
  { at: 0.15, color: [96, 165, 250] as const },   // blue — logic gates
  { at: 0.30, color: [245, 158, 11] as const },   // amber — chip die
  { at: 0.45, color: [252, 165, 165] as const },  // red — assembly
  { at: 0.60, color: [216, 180, 254] as const },  // purple — source code
  { at: 0.75, color: [192, 132, 252] as const },  // purple — software section
  { at: 1.0,  color: [192, 132, 252] as const },  // hold
];

export function lerpStageColor(scrollFraction: number): string { ... }
```

## Mobile Fallback

On viewports < 768px (or where `prefers-reduced-motion: reduce` is set):

1. **No parallax:** Remove `perspective` and `preserve-3d` from scroll container. All layers scroll at normal speed.
2. **No ambient particles:** `AmbientParticles` component returns `null`.
3. **Dragon curve:** Reverts to `position: fixed` behavior (current implementation).
4. **Content entrances:** Keep fade + drift animations (CSS-only, cheap). Keep `<hr>` draw-on.
5. **Hero:** Already falls back to `StaticHero` via `HeroContainer` capability detection.

Detection: check `window.matchMedia('(prefers-reduced-motion: reduce)')` and viewport width at mount. Store in `ScrollContext` as `isParallaxEnabled: boolean`.

## Data Flow

```
TopBar (position: fixed, z-50, outside parallax)
HeroContainer (position: fixed, z-10, outside parallax)
│   └── reads: ScrollContext.scrollProgress → particle formations, fade-out
│
ScrollContainer <main> (perspective: 1px, preserve-3d, overflow-y: auto, height: 100vh)
├── onScroll → ScrollContext.scrollProgress / scrollY
│
├── [z=-3] <canvas> AmbientParticles far tier (~60 particles)
│   └── reads: ScrollContext.scrollProgress → color
│
├── [z=-2] <canvas> AmbientParticles mid tier (~40 particles)
│   └── reads: ScrollContext.scrollProgress → color
│
├── [z=-1] DragonCurveBackground (SVG) + <canvas> AmbientParticles near tier (~20 particles)
│   └── reads: ScrollContext.scrollProgress → dashoffset, gradient stops, color
│
└── [z=0] Content foreground
    ├── <div style="height: 400vh" />  (hero scroll spacer)
    ├── IntroSection
    ├── <hr> (draw-on animation via IO)
    ├── LayerSection × 3
    │   ├── Section label (fade-in via IO)
    │   └── Cards (fade + drift, staggered 80ms via Framer Motion IO)
    ├── <hr> (draw-on animation via IO)
    ├── PersonalSection (PhotoCarousel: transform-style: flat)
    └── ContactFooter
```

## Edge Cases

1. **Short viewports (< 768px width OR < 600px height):** Disable parallax entirely. The 768px width threshold matches Tailwind's `md:` breakpoint and the existing mobile fallback logic. The 600px height threshold catches landscape phones and small windows where perspective scaling causes visual overlap.
2. **Very long pages:** If content grows significantly, ambient particle positions (set at mount) may not cover the full scrollable area. Solution: generate particles for 1.5x the initial page height. On resize, debounce 200ms, then regenerate particle positions if `scrollHeight` changed by more than 10%.
3. **Browser support:** `preserve-3d` is well-supported (97%+ on caniuse). Safari has historically had minor rendering differences — test on WebKit.
4. **`overflow: hidden` conflicts:** Any descendant with `overflow: hidden` inside the `preserve-3d` container needs `transform-style: flat` to prevent clipping artifacts. Review confirmed: `ProjectCard` and `ProfessionalCard` do NOT use `overflow: hidden`. Components that DO need `transform-style: flat`: `PhotoCarousel` (Embla container has `overflow-hidden`), `StaticHero` (fallback hero has `overflow-hidden`). `CodeOverlay` is safe — positioned inside the fixed hero canvas which is outside the parallax container.
5. **Hero canvas z-ordering:** Resolved by architecture — `HeroContainer` is a sibling of the parallax `<main>`, not a child. No `preserve-3d` interaction.
6. **TopBar backdrop-blur:** `backdrop-blur-sm` creates a new stacking context. Since TopBar is `position: fixed` outside the parallax container, this should not interact with `preserve-3d`. Test on Safari to confirm — Safari has historically treated backdrop filters differently in 3D contexts.

## Performance Budget

| Component | Target Frame Time | Particle Count | Rendering |
|-----------|------------------|----------------|-----------|
| Hero canvas (existing) | < 8ms | 80,000 | WebGL/Three.js |
| Ambient particles | < 1ms | ~120 | Canvas 2D |
| Dragon curve | < 0.5ms | N/A (SVG) | CSS compositing |
| Section animations | < 0.1ms | N/A | CSS transitions |

Total frame budget: < 16ms (60fps). Hero canvas dominates; all new additions are designed to be negligible.

## Testing Plan

1. **Visual regression:** Screenshot comparison at 0%, 25%, 50%, 75%, 100% scroll positions
2. **Performance:** Lighthouse performance audit, Chrome DevTools Performance tab recording of full scroll
3. **Mobile fallback:** Verify parallax disabled, no ambient particles, entrances still work
4. **Browser matrix:** Chrome, Firefox, Safari (macOS), Edge
5. **Reduced motion:** Verify `prefers-reduced-motion` disables parallax and simplifies animations
6. **Resize handling:** Verify ambient particles regenerate, parallax scales correctly
7. **`overflow: hidden` audit:** Verify no clipping artifacts on cards or carousel

## Files Changed

**New files:**
- `src/lib/colors.ts` — shared color constants and `lerpStageColor`
- `src/components/ScrollContext.tsx` — parallax scroll context provider
- `src/components/AmbientParticles.tsx` — lightweight 2D canvas particle field

**Modified files:**
- `src/app/page.tsx` — move HeroContainer outside main, wrap main in ScrollProvider, restructure into parallax layers
- `src/components/DragonCurveBackground.tsx` — remove fixed positioning, consume ScrollContext, import colors from shared module
- `src/components/hero/CanvasHero.tsx` — accept scrollRef prop, read container scroll instead of window scroll
- `src/components/hero/HeroContainer.tsx` — change from sticky to fixed positioning
- `src/components/AnimatedSection.tsx` — add staggerDelay prop, `<hr>` draw-on animation
- `src/components/PhotoCarousel.tsx` — add `transform-style: flat` to Embla container
- `src/components/hero/StaticHero.tsx` — add `transform-style: flat` to section element
- `src/app/globals.css` — section-rule draw-on animation keyframes

**Unchanged files:**
- `ParticleSystem.tsx`, `formations.ts`, `shaders.ts`, `useParticlePositions.ts`
- `TopBar`, `ContactFooter`, `PersonalSection`
- `ProjectCard`, `ProfessionalCard` (confirmed no overflow: hidden)
