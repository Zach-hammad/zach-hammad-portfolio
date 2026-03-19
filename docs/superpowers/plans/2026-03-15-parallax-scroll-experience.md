# Parallax Scroll Experience Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full-page CSS parallax scroll experience with ambient particle dissolve, depth-layered dragon curve, and scroll-driven content entrances.

**Architecture:** CSS `perspective` + `preserve-3d` on the scroll container creates true parallax depth layers. The hero canvas becomes a fixed sibling outside the parallax system. A shared `ScrollContext` provides container scroll position to all scroll-aware components. Ambient particles render on three lightweight 2D canvases at real CSS parallax depths.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind CSS v3, Canvas 2D API, Framer Motion, CSS `preserve-3d`

**Spec:** `docs/superpowers/specs/2026-03-15-parallax-scroll-experience-design.md`

---

## File Map

**New files:**
| File | Responsibility |
|------|---------------|
| `src/lib/colors.ts` | Shared `STAGE_COLOR_STOPS` array + `lerpStageColor()` function |
| `src/components/ScrollContext.tsx` | Parallax scroll container (`<main>`) + context provider exposing `scrollProgress`, `scrollY`, `containerRef`, `isParallaxEnabled` |
| `src/components/AmbientParticles.tsx` | Lightweight 2D canvas particle field (~120 particles across 3 depth tiers) |
| `src/components/PageContent.tsx` | Client component wrapper — receives serialized server data, renders ScrollProvider + layout |
| `src/components/SectionRule.tsx` | Scroll-triggered `<hr>` with draw-on animation |

**Modified files:**
| File | Changes |
|------|---------|
| `src/app/page.tsx` | Move HeroContainer outside `<main>`, wrap `<main>` in ScrollProvider, add parallax layer divs, add hero scroll spacer |
| `src/components/DragonCurveBackground.tsx` | Remove `position: fixed`, consume ScrollContext, import colors from `lib/colors.ts` |
| `src/components/hero/CanvasHero.tsx` | Accept `scrollRef` prop, read `container.scrollTop` instead of `window.scrollY` |
| `src/components/hero/HeroContainer.tsx` | Change from `sticky` to `fixed`, accept + forward `scrollRef`, move spacer to page.tsx |
| `src/components/AnimatedSection.tsx` | Refine animation: 12px drift (was 30px), 400ms (was 600ms), add `staggerDelay` prop |
| `src/components/PhotoCarousel.tsx` | Add `style={{ transformStyle: "flat" }}` to Embla container |
| `src/components/hero/StaticHero.tsx` | Add `style={{ transformStyle: "flat" }}` to section element |
| `src/app/globals.css` | Add `.section-rule-animated` with `scaleX` draw-on transition |

---

## Chunk 1: Foundation (Tasks 1-3)

Shared colors, scroll context, and the parallax container structure. Everything else builds on these.

### Task 1: Extract shared color constants

**Files:**
- Create: `src/lib/colors.ts`
- Modify: `src/components/DragonCurveBackground.tsx`

- [ ] **Step 1: Create `src/lib/colors.ts`**

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

/** Interpolate between STAGE_COLOR_STOPS at a given scroll fraction (clamped 0-1). */
export function lerpStageColor(scrollFraction: number): string {
  const clamped = Math.max(0, Math.min(1, scrollFraction));
  for (let i = 0; i < STAGE_COLOR_STOPS.length - 1; i++) {
    const a = STAGE_COLOR_STOPS[i];
    const b = STAGE_COLOR_STOPS[i + 1];
    if (clamped >= a.at && clamped <= b.at) {
      const t = (clamped - a.at) / (b.at - a.at);
      const r = Math.round(a.color[0] + (b.color[0] - a.color[0]) * t);
      const g = Math.round(a.color[1] + (b.color[1] - a.color[1]) * t);
      const bl = Math.round(a.color[2] + (b.color[2] - a.color[2]) * t);
      return `rgb(${r},${g},${bl})`;
    }
  }
  const last = STAGE_COLOR_STOPS[STAGE_COLOR_STOPS.length - 1];
  return `rgb(${last.color[0]},${last.color[1]},${last.color[2]})`;
}
```

- [ ] **Step 2: Update DragonCurveBackground to import from shared module**

In `src/components/DragonCurveBackground.tsx`:
- Remove the local `COLOR_STOPS` constant (lines 16-24)
- Remove the local `lerpColor` function (lines 26-42)
- Add import: `import { STAGE_COLOR_STOPS, lerpStageColor } from "@/lib/colors";`
- Replace `lerpColor(` calls with `lerpStageColor(` (lines 144-146)

- [ ] **Step 3: Verify build**

Run: `cd /home/zach/code/zach-hammad-portfolio && npx next build 2>&1 | grep -E "(Error|Compiled)"`
Expected: `Compiled successfully`

- [ ] **Step 4: Commit**

```bash
git add src/lib/colors.ts src/components/DragonCurveBackground.tsx
git commit -m "refactor: extract shared color constants to lib/colors"
```

---

### Task 2: Create ScrollContext provider

**Files:**
- Create: `src/components/ScrollContext.tsx`

- [ ] **Step 1: Create ScrollContext**

```typescript
// src/components/ScrollContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
  type RefObject,
} from "react";

interface ScrollContextValue {
  /** 0-1 overall page scroll progress */
  scrollProgress: number;
  /** Raw scroll position in px (container.scrollTop) */
  scrollY: number;
  /** Ref to the parallax scroll container */
  containerRef: RefObject<HTMLElement | null>;
  /** Whether CSS parallax is enabled (false on mobile/reduced-motion) */
  isParallaxEnabled: boolean;
}

const ScrollContext = createContext<ScrollContextValue>({
  scrollProgress: 0,
  scrollY: 0,
  containerRef: { current: null } as RefObject<HTMLElement | null>,
  isParallaxEnabled: false,
});

export function useScrollContext() {
  return useContext(ScrollContext);
}

/**
 * Ref-based scroll values for animation loops (zero re-renders).
 * Call this from components that read scroll in rAF/useFrame.
 */
export function useScrollRef() {
  const { containerRef } = useScrollContext();
  const progressRef = useRef(0);
  const scrollYRef = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function onScroll() {
      if (!el) return;
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 0) return;
      scrollYRef.current = el.scrollTop;
      progressRef.current = Math.min(el.scrollTop / maxScroll, 1);
    }

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [containerRef]);

  return { progressRef, scrollYRef };
}

interface ScrollProviderProps {
  children: ReactNode;
}

export default function ScrollProvider({ children }: ScrollProviderProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isParallaxEnabled, setIsParallaxEnabled] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Detect parallax capability at mount
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const tooNarrow = window.innerWidth < 768;
    const tooShort = window.innerHeight < 600;

    setIsParallaxEnabled(!prefersReducedMotion && !tooNarrow && !tooShort);
  }, []);

  // Throttled scroll state updates (~30fps) for React consumers
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function onScroll() {
      if (!el) return;
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 0) return;

      const top = el.scrollTop;
      const progress = Math.min(top / maxScroll, 1);

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          setScrollProgress(progress);
          setScrollY(top);
          rafRef.current = null;
        });
      }
    }

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const value: ScrollContextValue = {
    scrollProgress,
    scrollY,
    containerRef,
    isParallaxEnabled,
  };

  return (
    <ScrollContext.Provider value={value}>
      <main
        ref={containerRef}
        className="h-screen overflow-x-hidden overflow-y-auto font-mono"
        style={
          isParallaxEnabled
            ? { perspective: "1px", transformStyle: "preserve-3d" }
            : undefined
        }
      >
        {children}
      </main>
    </ScrollContext.Provider>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd /home/zach/code/zach-hammad-portfolio && npx next build 2>&1 | grep -E "(Error|Compiled)"`
Expected: `Compiled successfully` (component not yet used, but must compile)

- [ ] **Step 3: Commit**

```bash
git add src/components/ScrollContext.tsx
git commit -m "feat: add ScrollContext provider for parallax scroll container"
```

---

### Task 3: Restructure page.tsx with parallax container

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/hero/HeroContainer.tsx`
- Modify: `src/components/hero/CanvasHero.tsx`

This is the big structural change. HeroContainer moves outside `<main>`, the scroll container wraps content, and parallax layer divs are added.

- [ ] **Step 1: Update HeroContainer — sticky to fixed, accept scrollRef**

Replace the entire file `src/components/hero/HeroContainer.tsx`:

```typescript
"use client";

import { useEffect, useState, type RefObject } from "react";
import dynamic from "next/dynamic";
import StaticHero from "./StaticHero";

const canvasEnabled =
  process.env.NEXT_PUBLIC_ENABLE_CANVAS_HERO === "true";

const CanvasHero = canvasEnabled
  ? dynamic(() => import("./CanvasHero"), { ssr: false })
  : null;

function useCanvasCapability(): boolean {
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;
    if (window.innerWidth < 768) return;

    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) return;
    } catch {
      return;
    }

    setCapable(true);
  }, []);

  return capable;
}

interface HeroContainerProps {
  scrollRef: RefObject<HTMLDivElement | null>;
}

export default function HeroContainer({ scrollRef }: HeroContainerProps) {
  const capable = useCanvasCapability();

  if (CanvasHero && capable) {
    return (
      <div className="fixed top-0 inset-x-0 h-screen z-10">
        <CanvasHero scrollRef={scrollRef} />
      </div>
    );
  }

  return <StaticHero />;
}
```

Key changes:
- Removed the `relative` wrapper div + `sticky` child
- Now renders as `fixed top-0 inset-x-0 h-screen z-10`
- Removed the `<div className="h-[400vh]">` spacer — that moves to page.tsx
- Accepts and forwards `scrollRef` prop to CanvasHero

- [ ] **Step 2: Update CanvasHero — accept scrollRef, read container scroll**

In `src/components/hero/CanvasHero.tsx`, replace the `useScrollProgress` hook and component signature:

```typescript
"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState, type RefObject } from "react";
import ParticleSystem from "./stages/ParticleSystem";
import CodeOverlay from "./overlays/CodeOverlay";

/**
 * Scroll progress tracked via both ref (for R3F, zero re-renders)
 * and state (for HTML overlay, needs React updates).
 *
 * Reads from the parallax scroll container, not window.
 */
function useScrollProgress(scrollRef: RefObject<HTMLDivElement | null>) {
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function onScroll() {
      if (!el) return;
      const scrollTop = el.scrollTop;
      const maxScroll = window.innerHeight * 4; // 400vh hero spacer
      const p = Math.min(scrollTop / maxScroll, 1);

      progressRef.current = p;

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          setProgress(p);
          rafRef.current = null;
        });
      }
    }

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [scrollRef]);

  return { progressRef, progress };
}

interface CanvasHeroProps {
  scrollRef: RefObject<HTMLDivElement | null>;
}

export default function CanvasHero({ scrollRef }: CanvasHeroProps) {
  const { progressRef, progress } = useScrollProgress(scrollRef);

  const opacity = progress >= 1 ? 0 : progress > 0.95 ? (1 - progress) / 0.05 : 1;

  return (
    <div
      className="w-full h-full relative"
      style={{ opacity, transition: "opacity 0.3s ease-out" }}
    >
      <Canvas
        camera={{ position: [0, 0, 14.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <ParticleSystem progressRef={progressRef} />
      </Canvas>
      <CodeOverlay progress={progress} />
    </div>
  );
}
```

- [ ] **Step 3: Update page.tsx — restructure with ScrollProvider and parallax layers**

Replace `src/app/page.tsx`:

```typescript
import HeroContainer from "@/components/hero/HeroContainer";
import IntroSection from "@/components/sections/IntroSection";
import DragonCurveBackground from "@/components/DragonCurveBackground";
import TopBar from "@/components/TopBar";
import LayerSection from "@/components/sections/LayerSection";
import PersonalSection from "@/components/sections/PersonalSection";
import ContactFooter from "@/components/sections/ContactFooter";
import ProjectCard from "@/components/cards/ProjectCard";
import ProfessionalCard from "@/components/cards/ProfessionalCard";
import AnimatedSection from "@/components/AnimatedSection";
import ScrollProvider from "@/components/ScrollContext";
import { getProjectsByLayer } from "@/data/projects";
import { professionalExperience } from "@/data/professional";
import { fetchAllGitHubStats } from "@/lib/github";
import { projects } from "@/data/projects";
import PageContent from "@/components/PageContent";

export default async function Home() {
  const repoUrls = projects
    .map((p) => p.githubUrl)
    .filter((url): url is string => !!url);
  const githubStats = await fetchAllGitHubStats(repoUrls);

  const hardwareProjects = getProjectsByLayer("hardware");
  const systemsProjects = getProjectsByLayer("systems");
  const softwareProjects = getProjectsByLayer("software");

  return (
    <PageContent
      hardwareProjects={hardwareProjects}
      systemsProjects={systemsProjects}
      softwareProjects={softwareProjects}
      professionalExperience={professionalExperience}
      githubStats={githubStats}
    />
  );
}
```

**Wait — there's a problem.** `page.tsx` is an async server component that fetches GitHub stats. But `ScrollProvider` is a client component (it uses refs and state). We can't put a client component wrapper (`ScrollProvider`) around server component children directly in a server component — the children would need to be passed as `{children}` props.

The cleanest solution: create a `PageContent` client component that receives the data as props and handles the layout structure.

- [ ] **Step 3a: Create `src/components/PageContent.tsx`**

```typescript
// src/components/PageContent.tsx
"use client";

import HeroContainer from "@/components/hero/HeroContainer";
import IntroSection from "@/components/sections/IntroSection";
import DragonCurveBackground from "@/components/DragonCurveBackground";
import TopBar from "@/components/TopBar";
import LayerSection from "@/components/sections/LayerSection";
import PersonalSection from "@/components/sections/PersonalSection";
import ContactFooter from "@/components/sections/ContactFooter";
import ProjectCard from "@/components/cards/ProjectCard";
import ProfessionalCard from "@/components/cards/ProfessionalCard";
import AnimatedSection from "@/components/AnimatedSection";
import ScrollProvider, { useScrollContext } from "@/components/ScrollContext";
import type { Project, ProfessionalExperience, GitHubStats } from "@/lib/types";

/**
 * Map can't serialize across RSC→client boundary.
 * page.tsx converts Map to Record before passing here.
 */
interface PageContentProps {
  hardwareProjects: Project[];
  systemsProjects: Project[];
  softwareProjects: Project[];
  professionalExperience: ProfessionalExperience[];
  githubStats: Record<string, GitHubStats>;
}

function PageInner({
  hardwareProjects,
  systemsProjects,
  softwareProjects,
  professionalExperience,
  githubStats,
}: PageContentProps) {
  const { containerRef, isParallaxEnabled } = useScrollContext();

  return (
    <>
      {/* Parallax background layers (only when enabled) */}
      {isParallaxEnabled && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ transform: "translateZ(-1px) scale(2)", transformOrigin: "top left" }}
        >
          <DragonCurveBackground />
        </div>
      )}

      {/* Foreground content at translateZ(0) */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Hero scroll spacer — provides scroll distance for particle animation */}
        <div className="h-[400vh]" aria-hidden="true" />

        <IntroSection />

        <hr className="section-rule max-w-5xl mx-auto" />

        <LayerSection
          layerNumber={1}
          label="Hardware"
          title={`"I started at the metal"`}
          description="Designing CPUs, implementing architectures from first principles. Where I learned how computers actually work."
          accentColor="#4ade80"
        >
          {hardwareProjects.map((project) => (
            <AnimatedSection key={project.slug} delay={0.1}>
              <ProjectCard
                project={project}
                stats={
                  project.githubUrl
                    ? githubStats[project.githubUrl]
                    : null
                }
                accentColor="#4ade80"
              />
            </AnimatedSection>
          ))}
        </LayerSection>

        <hr className="section-rule max-w-5xl mx-auto" />

        <LayerSection
          layerNumber={2}
          label="Systems"
          title={`"Then I built the machines"`}
          description="Virtual machines, simulators, assembly. The layer between hardware and software."
          accentColor="#60a5fa"
        >
          {systemsProjects.map((project) => (
            <AnimatedSection key={project.slug} delay={0.1}>
              <ProjectCard
                project={project}
                stats={
                  project.githubUrl
                    ? githubStats[project.githubUrl]
                    : null
                }
                accentColor="#60a5fa"
              />
            </AnimatedSection>
          ))}
        </LayerSection>

        <hr className="section-rule max-w-5xl mx-auto" />

        <LayerSection
          layerNumber={3}
          label="Software & AI"
          title={`"Now I write what runs on them"`}
          description="Production software, developer tools, and AI systems. Where I am today."
          accentColor="#c084fc"
        >
          <div className="md:col-span-2 mb-4">
            <AnimatedSection>
              <div className="text-xs text-neutral-600 mb-4">
                {"// "}production
              </div>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {professionalExperience.map((exp) => (
                <AnimatedSection key={exp.area} delay={0.1}>
                  <ProfessionalCard
                    experience={exp}
                    accentColor="#c084fc"
                  />
                </AnimatedSection>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <AnimatedSection>
              <div className="text-xs text-neutral-600 mb-4 mt-4">
                {"// "}open source
              </div>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {softwareProjects.map((project) => (
                <AnimatedSection key={project.slug} delay={0.1}>
                  <ProjectCard
                    project={project}
                    stats={
                      project.githubUrl
                        ? githubStats[project.githubUrl]
                        : null
                    }
                    accentColor="#c084fc"
                  />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </LayerSection>

        <hr className="section-rule max-w-5xl mx-auto" />

        <PersonalSection />

        <ContactFooter />
      </div>

      {/* Dragon curve fallback for non-parallax */}
      {!isParallaxEnabled && <DragonCurveBackground />}
    </>
  );
}

function PageOuter(props: PageContentProps) {
  const { containerRef } = useScrollContext();
  return (
    <>
      {/* Fixed elements — OUTSIDE scroll container (siblings) */}
      <TopBar />
      <HeroContainer scrollRef={containerRef} />
      <PageInner {...props} />
    </>
  );
}

export default function PageContent(props: PageContentProps) {
  return (
    <ScrollProvider>
      <PageOuter {...props} />
    </ScrollProvider>
  );
}
```

**Important:** Check `src/lib/types.ts` for the exact type names of `Project`, `ProfessionalExperience`, and `GitHubStats` — adjust the import if they differ.

- [ ] **Step 3b: Simplify page.tsx to delegate to PageContent**

Replace `src/app/page.tsx`:

```typescript
import PageContent from "@/components/PageContent";
import { getProjectsByLayer } from "@/data/projects";
import { professionalExperience } from "@/data/professional";
import { fetchAllGitHubStats } from "@/lib/github";
import { projects } from "@/data/projects";

export default async function Home() {
  const repoUrls = projects
    .map((p) => p.githubUrl)
    .filter((url): url is string => !!url);
  const githubStats = await fetchAllGitHubStats(repoUrls);

  const hardwareProjects = getProjectsByLayer("hardware");
  const systemsProjects = getProjectsByLayer("systems");
  const softwareProjects = getProjectsByLayer("software");

  return (
    <PageContent
      hardwareProjects={hardwareProjects}
      systemsProjects={systemsProjects}
      softwareProjects={softwareProjects}
      professionalExperience={professionalExperience}
      githubStats={githubStats}
    />
  );
}
```

- [ ] **Step 4: Verify build**

Run: `cd /home/zach/code/zach-hammad-portfolio && npx next build 2>&1 | grep -E "(Error|Compiled)"`
Expected: `Compiled successfully`

**If type errors occur:** Read `src/lib/types.ts` and adjust the imports in `PageContent.tsx` to match the actual type names.

- [ ] **Step 5: Manual smoke test**

Open `http://localhost:3000`. Verify:
- Page loads without errors
- Hero particle animation still works (if canvas enabled)
- Scroll works — content sections appear below hero spacer
- Dragon curve visible (in fallback mode for now since parallax layer structure needs CSS tuning)
- TopBar stays fixed at top

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/components/PageContent.tsx src/components/hero/HeroContainer.tsx src/components/hero/CanvasHero.tsx
git commit -m "feat: restructure page with ScrollProvider and fixed hero"
```

---

## Chunk 2: Dragon Curve Parallax + overflow:hidden fixes (Tasks 4-5)

### Task 4: Migrate DragonCurveBackground to parallax layer

**Files:**
- Modify: `src/components/DragonCurveBackground.tsx`

The dragon curve currently uses `position: fixed` and reads `window.scrollY`. It needs to:
1. Remove fixed positioning (parallax layer div handles placement)
2. Read scroll from ScrollContext
3. Keep all existing behavior (dashoffset reveal, color gradient)

- [ ] **Step 1: Rewrite DragonCurveBackground to use ScrollContext**

Replace `src/components/DragonCurveBackground.tsx`:

```typescript
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { STAGE_COLOR_STOPS, lerpStageColor } from "@/lib/colors";
import { useScrollRef, useScrollContext } from "@/components/ScrollContext";

/**
 * Dragon Curve fractal that grows as the user scrolls.
 *
 * Uses stroke-dashoffset on a pre-computed SVG path for GPU-accelerated
 * scroll-driven animation. The curve is generated once at mount using
 * the L-system turn sequence, then progressively revealed via CSS.
 *
 * Stroke color is a vertical gradient that shifts to match
 * the current stage/section as the user scrolls.
 */

function generateDragonCurve(iterations: number) {
  let turns: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const flipped = turns
      .slice()
      .reverse()
      .map((t) => 1 - t);
    turns = [...turns, 0, ...flipped];
  }

  const dx = [1, 0, -1, 0];
  const dy = [0, 1, 0, -1];
  let dir = 1; // landscape orientation
  const points = [{ x: 0, y: 0 }];
  for (const turn of turns) {
    dir = (dir + (turn === 0 ? 1 : 3)) % 4;
    const last = points[points.length - 1];
    points.push({ x: last.x + dx[dir], y: last.y + dy[dir] });
  }
  const first = points[0];
  points.unshift({ x: first.x - dx[0], y: first.y - dy[0] });

  return points;
}

function pointsToPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i].x} ${points[i].y}`;
  }
  return d;
}

export default function DragonCurveBackground() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const stop0Ref = useRef<SVGStopElement>(null);
  const stop1Ref = useRef<SVGStopElement>(null);
  const stop2Ref = useRef<SVGStopElement>(null);
  const [totalLength, setTotalLength] = useState(0);
  const { containerRef, isParallaxEnabled } = useScrollContext();
  const { progressRef } = useScrollRef();

  const { path, viewBox } = useMemo(() => {
    const points = generateDragonCurve(14);

    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    for (const p of points) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }

    const pad = 2;
    const vb = `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}`;
    const d = pointsToPath(points);

    return { path: d, viewBox: vb };
  }, []);

  useEffect(() => {
    if (!pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    setTotalLength(len);
    pathRef.current.style.strokeDasharray = `${len}`;
    pathRef.current.style.strokeDashoffset = `${len * 0.85}`;
  }, [path]);

  // Animation loop — reads scroll from ref, no React re-renders
  useEffect(() => {
    if (!totalLength || !pathRef.current) return;

    let animId: number;

    function tick() {
      if (!pathRef.current) return;

      const scrollProgress = progressRef.current;

      const progress = 0.15 + scrollProgress * 0.85;
      pathRef.current.style.strokeDashoffset = `${totalLength * (1 - progress)}`;

      const spread = 0.18;
      const topColor = lerpStageColor(scrollProgress - spread);
      const midColor = lerpStageColor(scrollProgress);
      const botColor = lerpStageColor(scrollProgress + spread);

      if (stop0Ref.current) stop0Ref.current.setAttribute("stop-color", topColor);
      if (stop1Ref.current) stop1Ref.current.setAttribute("stop-color", midColor);
      if (stop2Ref.current) stop2Ref.current.setAttribute("stop-color", botColor);

      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [totalLength, progressRef]);

  // Positioning depends on whether parallax is active
  const containerStyle = isParallaxEnabled
    ? { opacity: 0.25 } // parallax layer div handles position
    : { opacity: 0.25, position: "fixed" as const, inset: 0, zIndex: 30, pointerEvents: "none" as const };

  const containerClass = isParallaxEnabled
    ? "w-full h-full pointer-events-none"
    : "pointer-events-none";

  return (
    <div className={containerClass} style={containerStyle}>
      <svg
        ref={svgRef}
        viewBox={viewBox}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        <defs>
          <linearGradient id="dragonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop ref={stop0Ref} offset="0%" stopColor="#4ade80" />
            <stop ref={stop1Ref} offset="50%" stopColor="#4ade80" />
            <stop ref={stop2Ref} offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          d={path}
          stroke="url(#dragonGradient)"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
```

Key changes:
- Reads scroll from `useScrollRef()` (ref-based, zero re-renders)
- Uses `requestAnimationFrame` loop instead of scroll event listener (decoupled from scroll events, smoother)
- Conditionally applies `position: fixed` only when parallax is disabled (mobile fallback)
- Imports colors from shared module

- [ ] **Step 2: Verify build**

Run: `cd /home/zach/code/zach-hammad-portfolio && npx next build 2>&1 | grep -E "(Error|Compiled)"`
Expected: `Compiled successfully`

- [ ] **Step 3: Manual test**

Open `http://localhost:3000`. Verify:
- Dragon curve still visible and animates on scroll
- Color gradient shifts with scroll progress
- Progressive reveal works (15% baseline, grows to 100%)

- [ ] **Step 4: Commit**

```bash
git add src/components/DragonCurveBackground.tsx
git commit -m "feat: migrate dragon curve to ScrollContext with parallax support"
```

---

### Task 5: Fix overflow:hidden conflicts

**Files:**
- Modify: `src/components/PhotoCarousel.tsx`
- Modify: `src/components/hero/StaticHero.tsx`

- [ ] **Step 1: Add transform-style: flat to PhotoCarousel**

In `src/components/PhotoCarousel.tsx`, line 20, change:
```tsx
<div className="overflow-hidden rounded-lg" ref={emblaRef}>
```
to:
```tsx
<div className="overflow-hidden rounded-lg" ref={emblaRef} style={{ transformStyle: "flat" }}>
```

- [ ] **Step 2: Add transform-style: flat to StaticHero**

In `src/components/hero/StaticHero.tsx`, line 7, change:
```tsx
<section className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
```
to:
```tsx
<section className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden" style={{ transformStyle: "flat" }}>
```

- [ ] **Step 3: Verify build**

Run: `cd /home/zach/code/zach-hammad-portfolio && npx next build 2>&1 | grep -E "(Error|Compiled)"`
Expected: `Compiled successfully`

- [ ] **Step 4: Commit**

```bash
git add src/components/PhotoCarousel.tsx src/components/hero/StaticHero.tsx
git commit -m "fix: add transform-style flat to prevent preserve-3d clipping"
```

---

## Chunk 3: Ambient Particles (Task 6)

### Task 6: Create AmbientParticles component

**Files:**
- Create: `src/components/AmbientParticles.tsx`
- Modify: `src/components/PageContent.tsx`

- [ ] **Step 1: Create AmbientParticles**

```typescript
// src/components/AmbientParticles.tsx
"use client";

import { useEffect, useRef, useCallback } from "react";
import { useScrollContext, useScrollRef } from "@/components/ScrollContext";
import { lerpStageColor } from "@/lib/colors";

interface TierConfig {
  count: number;
  minSize: number;
  maxSize: number;
  baseOpacity: number;
}

const TIERS: TierConfig[] = [
  { count: 60, minSize: 1, maxSize: 2, baseOpacity: 0.08 },  // far
  { count: 40, minSize: 2, maxSize: 4, baseOpacity: 0.12 },  // mid
  { count: 20, minSize: 3, maxSize: 5, baseOpacity: 0.18 },  // near
];

interface Particle {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  vx: number;
  vy: number;
  nextDirectionChange: number;
}

function generateParticles(
  tier: TierConfig,
  width: number,
  height: number
): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < tier.count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: tier.minSize + Math.random() * (tier.maxSize - tier.minSize),
      baseOpacity: tier.baseOpacity * (0.6 + Math.random() * 0.4),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      nextDirectionChange: performance.now() + 3000 + Math.random() * 2000,
    });
  }
  return particles;
}

interface AmbientParticlesTierProps {
  tierIndex: number;
}

function AmbientParticlesTier({ tierIndex }: AmbientParticlesTierProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const { progressRef } = useScrollRef();
  const { isParallaxEnabled } = useScrollContext();

  const tier = TIERS[tierIndex];

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const width = parent.clientWidth;
    const height = parent.scrollHeight;

    canvas.width = width;
    canvas.height = height;

    particlesRef.current = generateParticles(tier, width, height);

    // Handle resize
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const observer = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newWidth = parent.clientWidth;
        const newHeight = parent.scrollHeight;
        if (
          Math.abs(newHeight - canvas.height) / canvas.height > 0.1 ||
          newWidth !== canvas.width
        ) {
          canvas.width = newWidth;
          canvas.height = newHeight;
          particlesRef.current = generateParticles(tier, newWidth, newHeight);
        }
      }, 200);
    });

    observer.observe(parent);
    return () => {
      observer.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, [tier]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    function tick() {
      if (!ctx || !canvas) return;
      const now = performance.now();
      const particles = particlesRef.current;
      const scrollProgress = progressRef.current;

      // Fade in: 0 at scroll 85%, 1 at scroll 95%
      const fadeProgress = Math.max(0, Math.min(1, (scrollProgress - 0.85) / 0.1));

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (fadeProgress <= 0) {
        animId = requestAnimationFrame(tick);
        return;
      }

      const color = lerpStageColor(scrollProgress);

      for (const p of particles) {
        // Drift
        p.x += p.vx;
        p.y += p.vy;

        // Direction change
        if (now >= p.nextDirectionChange) {
          p.vx = (Math.random() - 0.5) * 0.3;
          p.vy = (Math.random() - 0.5) * 0.3;
          p.nextDirectionChange = now + 3000 + Math.random() * 2000;
        }

        // Wrap around
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Draw
        const opacity = p.baseOpacity * fadeProgress;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color.replace("rgb(", "rgba(").replace(")", `,${opacity})`);
        ctx.fill();
      }

      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [progressRef]);

  if (!isParallaxEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

/** Z-depth and scale for each tier's parallax layer */
const TIER_DEPTHS = [
  { z: -3, scale: 4 },  // far
  { z: -2, scale: 3 },  // mid
  { z: -1, scale: 2 },  // near (co-located with dragon curve)
];

export default function AmbientParticles() {
  const { isParallaxEnabled } = useScrollContext();

  if (!isParallaxEnabled) return null;

  return (
    <>
      {TIER_DEPTHS.map((depth, i) => (
        <div
          key={i}
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translateZ(${depth.z}px) scale(${depth.scale})`,
            transformOrigin: "top left",
          }}
        >
          <AmbientParticlesTier tierIndex={i} />
        </div>
      ))}
    </>
  );
}
```

- [ ] **Step 2: Add AmbientParticles to PageContent**

In `src/components/PageContent.tsx`, add import:
```typescript
import AmbientParticles from "@/components/AmbientParticles";
```

Then in the `PageInner` JSX, replace the parallax background layers block:
```tsx
{/* Parallax background layers (only when enabled) */}
{isParallaxEnabled && (
  <>
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ transform: "translateZ(-1px) scale(2)" }}
    >
      <DragonCurveBackground />
    </div>
  </>
)}
```

with:

```tsx
{/* Parallax background layers */}
{isParallaxEnabled && (
  <>
    <AmbientParticles />
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ transform: "translateZ(-1px) scale(2)" }}
    >
      <DragonCurveBackground />
    </div>
  </>
)}
```

- [ ] **Step 3: Verify build**

Run: `cd /home/zach/code/zach-hammad-portfolio && npx next build 2>&1 | grep -E "(Error|Compiled)"`
Expected: `Compiled successfully`

- [ ] **Step 4: Manual test**

Open `http://localhost:3000` (with `NEXT_PUBLIC_ENABLE_CANVAS_HERO=true` in `.env.local`). Verify:
- Scroll past 85% of hero — ambient particles fade in
- Particles drift slowly
- Colors match current section
- Three depth tiers scroll at different speeds (if parallax is working)
- No performance degradation (check DevTools Performance tab — frames should stay under 16ms)

- [ ] **Step 5: Commit**

```bash
git add src/components/AmbientParticles.tsx src/components/PageContent.tsx
git commit -m "feat: add ambient particle system with 3-tier CSS parallax depth"
```

---

## Chunk 4: Content Entrance Animations (Tasks 7-8)

### Task 7: Refine AnimatedSection with stagger support

**Files:**
- Modify: `src/components/AnimatedSection.tsx`

- [ ] **Step 1: Update AnimatedSection**

Replace `src/components/AnimatedSection.tsx`:

```typescript
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  /** Delay before this element's animation starts (seconds) */
  delay?: number;
  /** Stagger delay multiplied by child index (seconds). Pass index * staggerDelay as delay. */
  staggerDelay?: number;
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

Changes from current:
- `y: 30` → `y: 12` (subtler drift, spec says 12px)
- `duration: 0.6` → `duration: 0.4` (snappier, spec says 400ms)
- `margin: "-100px"` → `margin: "-80px"` (trigger slightly earlier)

- [ ] **Step 2: Verify build**

Run: `cd /home/zach/code/zach-hammad-portfolio && npx next build 2>&1 | grep -E "(Error|Compiled)"`
Expected: `Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add src/components/AnimatedSection.tsx
git commit -m "refactor: refine AnimatedSection entrance animation timing"
```

---

### Task 8: Add section-rule draw-on animation

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/PageContent.tsx`

- [ ] **Step 1: Add draw-on CSS to globals.css**

Append to `src/app/globals.css`:

```css
/* Section divider draw-on animation */
.section-rule-animated {
  border: none;
  border-top: 1px solid #222;
  margin: 0;
  transform: scaleX(0);
  transition: transform 0.6s ease-out;
}

.section-rule-animated.visible {
  transform: scaleX(1);
}
```

- [ ] **Step 2: Create a small SectionRule component or use Intersection Observer inline**

The simplest approach: create a tiny client component for the animated rule. Add to the bottom of `src/components/AnimatedSection.tsx` (same file, co-located):

Actually, cleaner as a separate tiny component. Create `src/components/SectionRule.tsx`:

```typescript
"use client";

import { useRef, useEffect, useState } from "react";

export default function SectionRule({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLHRElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-40px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <hr
      ref={ref}
      className={`section-rule-animated ${visible ? "visible" : ""} ${className}`}
    />
  );
}
```

- [ ] **Step 3: Replace `<hr>` elements in PageContent**

In `src/components/PageContent.tsx`, add import:
```typescript
import SectionRule from "@/components/SectionRule";
```

Replace all instances of:
```tsx
<hr className="section-rule max-w-5xl mx-auto" />
```
with:
```tsx
<SectionRule className="max-w-5xl mx-auto" />
```

- [ ] **Step 4: Verify build**

Run: `cd /home/zach/code/zach-hammad-portfolio && npx next build 2>&1 | grep -E "(Error|Compiled)"`
Expected: `Compiled successfully`

- [ ] **Step 5: Manual test**

Open `http://localhost:3000`. Verify:
- Section dividers draw from center outward as they enter viewport
- Animation is smooth (600ms ease-out)
- Only triggers once per rule

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/components/SectionRule.tsx src/components/PageContent.tsx
git commit -m "feat: add scroll-triggered section rule draw-on animation"
```

---

## Chunk 5: Integration Testing & Polish (Task 9)

### Task 9: Full integration test and polish

**Files:**
- Possibly modify any file from above if issues found

- [ ] **Step 1: Enable canvas hero for testing**

Ensure `.env.local` contains:
```
NEXT_PUBLIC_ENABLE_CANVAS_HERO=true
```

- [ ] **Step 2: Full build verification**

Run: `cd /home/zach/code/zach-hammad-portfolio && npx next build 2>&1 | tail -30`
Expected: No errors, successful static page generation.

- [ ] **Step 3: Full scroll test — desktop**

Open `http://localhost:3000` in Chrome. Scroll through entire page and verify:
1. Hero particle animation works and fades out at 95%
2. Ambient particles fade in around 85-95%
3. Dragon curve has parallax depth (scrolls at half speed)
4. Section rules draw on scroll
5. Card animations are smooth (fade + 12px drift, staggered)
6. TopBar stays fixed, backdrop blur works
7. No visual glitches, no z-ordering issues
8. Photo carousel renders correctly (no clipping)

- [ ] **Step 4: Performance check**

Open Chrome DevTools → Performance tab. Record a full scroll. Verify:
- Frame times consistently < 16ms
- No long frames during ambient particle rendering
- No layout thrash from scroll listeners

- [ ] **Step 5: Mobile fallback test**

Open Chrome DevTools, toggle device toolbar to a mobile viewport (375px width). Verify:
1. No parallax effects
2. No ambient particles
3. Dragon curve renders in fixed position (original behavior)
4. Static hero fallback shows
5. Card entrance animations still work
6. Section rules still draw on

- [ ] **Step 6: Reduced motion test**

In Chrome DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`. Verify:
1. Parallax disabled
2. No ambient particles
3. Content entrance animations still fire (they're subtle enough to keep)

- [ ] **Step 7: Fix any issues found**

Address any bugs found during testing. Each fix gets its own commit.

- [ ] **Step 8: Final commit if any polish changes were made**

```bash
git add -u
git commit -m "fix: integration testing polish and fixes"
```

---

## Task Dependency Graph

```
Task 1 (colors) ──→ Task 4 (dragon curve migration)
                ──→ Task 6 (ambient particles)

Task 2 (ScrollContext) ──→ Task 3 (page restructure)
                       ──→ Task 4 (dragon curve migration)
                       ──→ Task 6 (ambient particles)

Task 3 (page restructure) ──→ Task 4
                           ──→ Task 5 (overflow fixes)
                           ──→ Task 6
                           ──→ Task 7 (AnimatedSection)
                           ──→ Task 8 (section rules)

Task 5 (overflow fixes) ──→ Task 9 (integration)
Task 6 (ambient particles) ──→ Task 9
Task 7 (AnimatedSection) ──→ Task 9
Task 8 (section rules) ──→ Task 9
```

**Parallelizable groups:**
- Tasks 1 + 2 can run in parallel (no dependencies on each other)
- Tasks 4 + 5 + 7 can run in parallel (all depend on Task 3 only)
- Task 6 depends on Tasks 1, 2, 3
- Task 8 depends on Task 3
- Task 9 depends on everything
