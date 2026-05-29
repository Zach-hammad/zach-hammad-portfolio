# Proof Wall Portfolio Refresh — Design Spec

**Date:** 2026-05-29  
**Status:** Approved direction; awaiting written-spec review  
**Scope:** Reframe the homepage around "Full-Stack AI Engineer" proof while preserving the current dark, mono, systems-first visual identity. Keep the Dragon Curve background and make it feel more dimensional and polished.

## Problem

The current site has a strong visual identity: dark terminal-like styling, mono typography, thin rules, colored technical layers, a canvas hero, and the Dragon Curve background. It already feels personal and systems-minded.

The gap is positioning. Recruiters and collaborators should understand within seconds that Zach is a **Full-Stack AI Engineer** who can build AI systems end to end: product surfaces, agents, retrieval systems, inference pipelines, infrastructure, and low-level foundations. The current hardware -> systems -> software arc proves depth, but it makes visitors assemble the AI story themselves.

## Goals

1. Lead with the role: **Full-Stack AI Engineer**.
2. Preserve the current visual language: dark background, mono text, terminal cards, thin section rules, bracket-style links, restrained accent colors, and systems aesthetics.
3. Add a recruiter-fast proof path without making the site feel corporate or generic.
4. Keep the hardware -> systems -> software origin story visible as a credibility layer.
5. Make the Dragon Curve background cooler: more depth, glow, motion quality, and stage-aware color, while staying behind content and never hurting readability.
6. Keep content NDA-safe for professional work.

## Non-Goals

- No total visual redesign.
- No marketing-style landing page, oversized feature cards, decorative blobs, or generic SaaS hero.
- No removal of the current systems personality.
- No confidential work details beyond NDA-safe summaries.
- No project detail routing in this pass; the homepage remains the primary experience.
- No new analytics, CMS, blog, or database.

## Visual Direction

The new page should feel like the current site got sharper, not replaced.

Preserve:

- `font-mono` as the primary voice.
- Background near `#0a0a0a`.
- Neutral text hierarchy with subtle accents.
- Thin `section-rule` dividers.
- Terminal/card surfaces with left accent borders.
- Bracket-style technical links such as `[src]`, `[demo]`, `[resume]`.
- Green, blue, amber/red, and purple accents tied to the existing technical journey.
- The Dragon Curve as a background signature.

Change:

- The first readable claim becomes "Full-Stack AI Engineer".
- Proof is grouped by capability instead of forcing the visitor to infer it from chronological layers.
- Repotoire becomes the flagship case study.
- Production experience becomes a clearer NDA-safe proof section.
- Contact, resume, GitHub, and LinkedIn become easier to reach from the first screen.

## Homepage Structure

### 1. First Screen: Identity + Fast Path

The hero keeps the existing canvas/technical atmosphere, but the overlay copy becomes more direct.

Content hierarchy:

- Eyebrow: `FULL-STACK AI ENGINEER`
- Primary identity: `Zacharia Hammad`
- Lead: `I build AI systems end to end: agents, retrieval, computer vision, infrastructure, and the low-level foundations they run on.`
- Fast links: `[resume]`, `[github]`, `[linkedin]`, `[email]`

Accessibility requirement: keep one semantic `h1` on the page. Recommended `h1`: `Zacharia Hammad`, with the role as nearby supporting text. This preserves personal-brand SEO while making the role visually prominent.

### 2. Proof Pillars

Add a compact, scan-friendly proof section immediately after the hero/intro. It uses the current terminal-card style, not glossy cards.

Pillars:

1. **AI Products & Agents** — Scout, voice agents, dashboards, workflows.
2. **Retrieval & Knowledge Systems** — Neo4j, vector search, Repotoire, tqvec.
3. **Inference & Edge AI** — DeepStream, TensorRT, CUDA, Hailo, Raspberry Pi.
4. **Systems Foundation** — RISC-V, VMs, emulators, Rust/C/C++.

Each pillar should include a one-sentence claim and 3-5 terse proof tokens. The section should read quickly on mobile and desktop.

### 3. Flagship Case Study: Repotoire

Repotoire becomes the primary homepage proof point because it connects AI tooling, systems thinking, Rust, code intelligence, and developer workflow.

Layout:

- Wide terminal-style panel.
- Left: concise case-study narrative.
- Right: proof metrics/tokens.

Suggested narrative:

- Problem: AI coding agents need accurate codebase context.
- Approach: graph-powered code analysis with detectors across languages.
- Result: single-binary Rust CLI, Homebrew distribution, GitHub Action, and codebase knowledge graph.
- Links: `[src]`, `[install]` if available, `[github action]` if available.

### 4. Production Proof, NDA-Safe

Keep the professional work high-level but more recruiter-readable.

Group the existing professional proof into outcome-oriented cards:

- Real-time video processing: TensorRT, DeepStream, CUDA, production deployment.
- Knowledge graph systems: Neo4j, entity resolution/fingerprinting, relationship mapping.
- Full-stack product systems: Next.js, TypeScript, dashboards, educational or sales workflows.
- Infrastructure and GitOps: Kubernetes, ArgoCD, GitHub Actions, secrets/config workflows.
- Edge AI deployment: Hailo, Raspberry Pi, model deployment.

Do not include employer-sensitive names, private architecture specifics, internal repo names, or proprietary metrics unless Zach later provides explicit public-safe language.

### 5. Origin Story: Hardware -> Systems -> Software & AI

Keep the current layered story because it is distinctive. Reposition it as the "systems foundation" beneath the top-level proof wall.

The existing `LayerSection` style can stay:

- Hardware: `I started at the metal`
- Systems: `Then I built the machines`
- Software & AI: `Now I write what runs on them`

This section should still include the strongest open-source projects:

- ZRISC-32V
- RISC-V CPU
- nanochat-riscv
- LC-3 Virtual Machine
- CHIP-8 Emulator
- Repotoire
- tqvec
- zkip-stark

If Repotoire appears both as flagship and as a card, the card should be shorter and point back to the flagship panel through visual hierarchy or copy, not duplicate the full case-study text.

### 6. Personal Brand

Keep the personal section. It should continue to show Zach as a real person, not just a resume.

Preserve the current tone: BJJ, chess, travel, photography, learning, discipline. This belongs lower on the page after technical proof, where it rounds out the brand without slowing down recruiters.

### 7. Contact Footer

The footer should be simple and direct:

- Email
- GitHub
- LinkedIn
- Resume
- Short closing line tied to the role, e.g. `Building AI systems from product surface to metal.`

## Dragon Curve Upgrade

Keep `DragonCurveBackground` as the site-wide background signature, but make it cooler in a restrained way.

### Desired Feel

The curve should feel like a living technical artifact behind the portfolio: sharper, more dimensional, slightly luminous, and connected to the page's capability story. It should not become a loud decoration or compete with text.

### Visual Changes

1. **Layered strokes**
   - Main crisp path: current gradient stroke, slightly brighter.
   - Soft glow path: same geometry with blur/filter and low opacity.
   - Ghost/depth path: offset or delayed dash path at very low opacity to create depth.

2. **Scroll-reactive reveal**
   - Preserve the existing progressive `strokeDashoffset` reveal.
   - Add a subtle trailing reveal layer so the curve feels less flat.
   - Keep updates throttled through `requestAnimationFrame`.

3. **Stage-aware color**
   - Reuse the existing color stops, but map them to the refreshed sections:
     - Green: systems foundation / hardware.
     - Blue: systems and retrieval infrastructure.
     - Amber/red: inference and runtime intensity.
     - Purple: AI products, agents, and software.

4. **Depth and framing**
   - Keep the curve fixed behind content unless an implementation plan decides to revive the older parallax-container approach.
   - Add subtle scale/translate shifts based on scroll progress for depth.
   - Keep the strongest glow away from dense text regions where possible.

5. **Readability constraints**
   - Background layer remains `pointer-events-none`.
   - Content remains above it with a higher z-index.
   - Total visible opacity should stay restrained; the curve can be noticed, but never read before the text.
   - Cards and text sections may use existing dark translucent surfaces where needed to protect contrast.

6. **Reduced motion**
   - Do not return a fully animated curve for users who prefer reduced motion.
   - Preferred fallback: static low-opacity Dragon Curve with no scroll animation.
   - Acceptable fallback: hide the curve if the static version creates clutter.

## Component Design

### Existing Components to Keep

- `TopBar`
- `HeroContainer`
- `CanvasHero`
- `StaticHero`
- `DragonCurveBackground`
- `LayerSection`
- `ProjectCard`
- `ProfessionalCard`
- `PersonalSection`
- `ContactFooter`
- `AnimatedSection`

### New or Refined Components

Recommended additions:

- `ProofPillarsSection`
  - Renders the four capability pillars.
  - Uses terminal-card styling consistent with `ProjectCard`.

- `FlagshipCaseStudy`
  - Renders Repotoire as a wide case-study panel.
  - Data-driven enough to avoid hard-coding all copy inside JSX.

- `FastPathLinks`
  - Small reusable link cluster for resume/GitHub/LinkedIn/email.
  - Used near the hero and optionally in the footer.

Recommended refinements:

- `IntroSection`
  - Shift from generic graduate summary to role-specific positioning.
  - Avoid duplicating the `h1`.

- `DragonCurveBackground`
  - Add layered paths/glow/depth while preserving the existing generator and color interpolation.

## Data Design

Add a small data module rather than scattering new copy across components:

```ts
// src/data/proof.ts
export const roleIdentity = { ... };
export const proofPillars = [ ... ];
export const flagshipCaseStudy = { ... };
export const fastPathLinks = [ ... ];
```

This keeps the homepage easy to edit and lets components stay presentational.

Existing data modules remain:

- `src/data/projects.ts` for open-source projects.
- `src/data/professional.ts` for NDA-safe production work.
- `src/data/personal.ts` for personal brand content.
- `src/data/contact.ts` for contact links.

## Data Flow

At build time:

1. `src/app/page.tsx` imports proof, project, professional, personal, and contact data.
2. GitHub stats continue to fetch from project `githubUrl` values.
3. The page renders static content suitable for Netlify static export.
4. Client components handle only animation/capability logic:
   - `HeroContainer` chooses canvas or static hero.
   - `CanvasHero` handles WebGL hero animation when enabled and capable.
   - `DragonCurveBackground` handles SVG background reveal and reduced-motion behavior.
   - `AnimatedSection` handles entrance animation.

## Error Handling and Fallbacks

- If GitHub stats fail, project cards continue rendering without stars.
- If WebGL is unavailable, the site uses `StaticHero`.
- If `NEXT_PUBLIC_ENABLE_CANVAS_HERO` is not enabled, the static hero remains the default.
- If reduced motion is enabled, the hero and Dragon Curve avoid scroll animation.
- If a resume URL is missing, hide the resume link rather than rendering a broken link.
- If a case-study secondary link is missing, omit that action and preserve spacing.

## Accessibility

- Preserve one `h1`.
- Use descriptive labels for icon-only or bracket-style links.
- Maintain keyboard focus styles on all links and controls.
- Do not rely on color alone to communicate the four proof pillars.
- Keep text contrast at or above the already-audited neutral levels.
- Respect `prefers-reduced-motion`.
- Ensure the upgraded Dragon Curve is `aria-hidden`.

## Testing and Verification

After implementation:

1. `bun run lint`
2. `bun run audit`
3. `bun run build`
4. Browser check at desktop width:
   - First screen clearly says `Full-Stack AI Engineer`.
   - Current visual style is preserved.
   - Dragon Curve is visible, cooler, and behind content.
   - Proof pillars and Repotoire flagship read cleanly.
5. Browser check at mobile width:
   - No overlapping text.
   - Fast links wrap cleanly.
   - Proof pillars remain scannable.
   - Dragon Curve does not overwhelm content.
6. Reduced-motion check:
   - No scroll-driven Dragon Curve animation.
   - No distracting hero animation.
7. Link check:
   - Resume, GitHub, LinkedIn, email, and project links work or are gracefully omitted.

## Implementation Boundaries

This spec authorizes a homepage refresh and Dragon Curve visual upgrade. It does not authorize unrelated refactors, new routes, a blog, a CMS, or private work disclosures.

The implementation plan should prefer scoped edits to:

- `src/app/page.tsx`
- `src/components/sections/*`
- `src/components/cards/*` only if needed for reusable styling
- `src/components/DragonCurveBackground.tsx`
- `src/components/hero/StaticHero.tsx`
- `src/data/*`

Keep the change small enough to review visually in one pass.
