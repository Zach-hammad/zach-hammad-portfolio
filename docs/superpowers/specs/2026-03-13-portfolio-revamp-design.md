# Portfolio Revamp — Design Spec

## Overview

Complete rebuild of zachariahammad.com as a scroll-storytelling portfolio that narrates the journey from silicon to software. The site is a single continuous scroll with a cinematic canvas hero animation (bottom-up chip-to-code transformation) followed by conventional CSS/HTML timeline sections.

**Primary audience:** Technical peers and hiring managers, with personal flair.
**Core narrative:** "I understand computers from the ground up."

## Architecture

### Framework & Tooling

| Tool | Purpose |
|------|---------|
| Next.js 15 (App Router) | Framework, SSG |
| Tailwind CSS v4 | Styling |
| Three.js + @react-three/fiber | Canvas hero animation |
| @react-three/drei | ScrollControls for scroll-linked animation |
| Framer Motion | Section reveal animations (whileInView) |
| embla-carousel-react | Photo carousels (BJJ, travel) |
| bun | Package manager |
| Vercel | Deployment |

### What's Excluded (YAGNI)

- No light mode — dark only, by design
- No CMS / blog / MDX
- No contact form — links only (GitHub, LinkedIn, email)
- No analytics (add Vercel Analytics post-launch if wanted)
- No i18n, auth, or database
- No react-query, recharts, react-hook-form, or other unused deps from current site

## Scroll Structure

The entire site is a single `page.tsx`. No client-side routing.

### 1. Hero Canvas (Sticky, ~4 viewport scroll distance)

A `<canvas>` element with `position: sticky; top: 0` occupies the full viewport. Below it, ~4 viewport-heights of spacer divs provide scroll distance. As the user scrolls, the animation progresses through 5 stages:

| Stage | Visual | Scroll % |
|-------|--------|----------|
| 1 — Transistors | Abstract MOSFET symbols, silicon traces, electrical paths | 0–20% |
| 2 — Logic Gates | AND/OR/NOT gates form from transistors, wire together | 20–40% |
| 3 — Chip Architecture | Gates coalesce into ALU, registers, cache blocks — stylized die layout | 40–60% |
| 4 — Assembly | Chip dissolves into scrolling assembly/machine code | 60–80% |
| 5 — Source Code | Assembly morphs into syntax-highlighted high-level code | 80–100% |

At 100%, the canvas fades to transparent, revealing the intro section beneath.

**Build strategy:** The canvas hero is built LAST, behind a feature flag. The site ships with a static hero fallback first — simple text + subtle CSS animation. The Three.js canvas is layered on once the rest of the site is complete. This prevents the animation from blocking launch.

**Mobile fallback:** On screens < 768px or devices that report `prefers-reduced-motion`, show the static hero instead of the canvas. The animation is a progressive enhancement, not a requirement.

### 2. Intro Section

- Name: "Zacharia Hammad"
- Tagline: "Computer Engineer. I build from transistors to interfaces."
- Brief bio (2-3 sentences): who you are, what you care about, what you're looking for
- Links: GitHub, LinkedIn, Resume (PDF download), Email

### 3. Layer 1 — Hardware ("I started at the metal")

**Visual treatment:** Dark background with green (#4ade80) accent. Subtle circuit-trace patterns in the background.

**Projects:**

| Project | Description | Tech |
|---------|-------------|------|
| RISC-V CPU | Pipelined architecture with branch prediction, OoO execution, PC-signature hit predictor | C, RISC-V |
| HACK CPU (Nand2Tetris) | Full CPU implementation: ALU, registers, program counter, VM translator | Python |
| ZRISC-32V | Custom RISC processor simulator with vector extensions for ML | C++ |

Each project card includes: title, description, tech tags, GitHub link. Star count pulled at build time from GitHub API.

### 4. Layer 2 — Systems ("Then I built the machines")

**Visual treatment:** Dark background with blue (#60a5fa) accent. Architectural diagram-inspired patterns.

**Projects:**

| Project | Description | Tech |
|---------|-------------|------|
| LC-3 Virtual Machine | Full VM implementation in C | C |
| CHIP-8 Simulator | Interpreter/emulator | Python |
| Assembly Projects | Collection of low-level algorithms | Assembly |
| nanochat-riscv | Chat application on bare-metal RISC-V | Rust |

### 5. Layer 3 — Software & AI ("Now I write what runs on them")

**Visual treatment:** Dark background with purple (#c084fc) accent. Code-editor-inspired patterns.

Split into two sub-sections:

#### 5a. Production / Professional (NDA-safe — technology only, no specifics)

| Area | Technologies |
|------|-------------|
| Real-time video processing pipeline | TensorRT, DeepStream, Python |
| Knowledge graph system | Neo4j, Python, Rust, fingerprinting |
| Educational platform | Next.js, Turborepo, monorepo architecture |
| Infrastructure & GitOps | k3s, ArgoCD, Harbor, GitHub Actions, Doppler |
| Edge AI deployment | Hailo accelerator, Raspberry Pi |

Presented as a technology matrix or architecture summary, not individual project cards. No company name or proprietary details.

#### 5b. Personal / Open Source

| Project | Description | Tech |
|---------|-------------|------|
| Repotoire | Code health analysis CLI + MCP server. Shipped via Homebrew. | Rust |
| AI Agent | Autonomous agent system | Python |
| TensorX | Tensor computation library | Python |
| Dragon Curve | Fractal visualization (L-systems) | Python |

### 6. Beyond Code

Personal section — BJJ, Chess, Travel. Three sub-sections:

- **Brazilian Jiu-Jitsu:** Photo carousel (5 existing local images), brief description of practice + teaching kids' classes
- **Chess:** State and national championship team. Photo (existing local or sourced).
- **Travel & Photography:** Photo carousel (4 existing local images)

Uses embla-carousel-react for carousels. Images served from `/public/images/` (migrated from current `lovable-uploads/` with proper names).

### 7. Contact / Footer

- GitHub, LinkedIn, Email links
- Resume PDF download
- Copyright / year
- Minimal — no form, no newsletter signup

## Data Architecture

### Project Data

A single `data/projects.ts` file exports all project information. No duplication across pages (fixing the current site's worst sin).

```typescript
interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  layer: 'hardware' | 'systems' | 'software';
  featured?: boolean;
}
```

### GitHub API Integration

At build time (in server components), fetch star counts and language data from GitHub API for repos that have `githubUrl`. Cache via Next.js ISR with a 24-hour revalidation. Fallback gracefully if API is unavailable — show the card without stats.

### Images

- Migrate existing local images from `public/lovable-uploads/` to `public/images/` with semantic names (`bjj-training-1.jpg`, `travel-paris.jpg`, etc.)
- Use Next.js `<Image>` component for optimization (WebP, lazy loading, responsive sizes)
- Remove all hotlinked external URLs — no more Unsplash/Investopedia dependency

## Animation Details

### Hero Canvas (Three.js)

- Scroll position mapped to animation progress (0 to 1) via `@react-three/drei` ScrollControls or a custom `useScroll` hook
- Each stage is a scene transition: geometry morphs, particle systems, shader effects
- Target: 60fps on modern hardware, graceful degradation on older devices
- Total scroll distance: ~400vh (4 full viewport heights)
- The canvas component is lazy-loaded (`next/dynamic` with `ssr: false`) to avoid SSR issues with Three.js

### Section Animations (Framer Motion)

- `whileInView` triggers for fade-in + slide-up on section headers and project cards
- Staggered children for project card grids
- Subtle parallax on background patterns
- Respect `prefers-reduced-motion` — disable all animations if set

## Color System

Dark theme only. Layer colors create visual progression:

| Element | Color |
|---------|-------|
| Background | #0a0a0a |
| Card background | #111111 |
| Hardware accent | #4ade80 (green) |
| Systems accent | #60a5fa (blue) |
| Software accent | #c084fc (purple) |
| Text primary | #fafafa |
| Text secondary | #999999 |
| Text muted | #666666 |
| Borders | #222222 |

## Open Details (resolve during implementation)

- **GitHub API rate limiting:** Use a local JSON cache file as fallback. If API call fails at build time, use cached data from last successful build. First build without cache shows cards without stats.
- **Canvas feature flag:** Environment variable `NEXT_PUBLIC_ENABLE_CANVAS_HERO=true`. Defaults to `false`. Static hero shown when flag is off.
- **Resume PDF:** User provides their own PDF, placed at `public/resume.pdf`. If missing, the download link is hidden.
- **Typography:** System font stack via Tailwind defaults. No custom fonts — faster load, less to maintain. Can revisit post-launch.

## Performance Budget

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Total bundle (excluding Three.js): < 100kb gzipped
- Three.js loaded lazily, only on capable devices
- All images optimized via Next.js Image component
- No client-side data fetching — everything is build-time or static

## Migration Plan

This is a full wipe. The current Vite + React SPA is replaced entirely. The only assets carried over are:

- 11 local images from `public/lovable-uploads/` (renamed and reorganized)
- Project descriptions (rewritten to fit the narrative)

Everything else — components, routing, styling, dependencies — is new.

## Build Order

1. Next.js project scaffold + Tailwind + dark theme
2. Data layer (`data/projects.ts`, GitHub API integration)
3. Intro section
4. Timeline sections (Layers 1-3) with project cards
5. Personal section (BJJ, Chess, Travel) with carousels
6. Contact/footer
7. Section animations (Framer Motion)
8. Static hero fallback (text + CSS animation)
9. **Ship v1** — working portfolio without canvas hero
10. Canvas hero animation (Three.js) — behind feature flag
11. Mobile fallback + performance testing
12. **Ship v2** — full experience with canvas hero
