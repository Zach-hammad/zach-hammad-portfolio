# Proof Wall Portfolio Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reframe the homepage around Zacharia Hammad as a Full-Stack AI Engineer, preserve the current dark mono systems style, add recruiter-fast proof sections, and upgrade the Dragon Curve background.

**Architecture:** Keep the existing static Next.js homepage and component structure. Add a small proof data module plus focused presentational sections for proof pillars, flagship case study, production proof, and fast path links. Upgrade the existing SVG Dragon Curve in place with layered strokes, glow, scroll-reactive depth, and reduced-motion fallback.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, lucide-react, static export on Netlify, local audit script in `scripts/audit-checks.mjs`.

---

## File Structure

Create:

- `src/data/proof.ts` — role copy, proof pillars, flagship Repotoire case study, and fast path link data.
- `src/components/FastPathLinks.tsx` — reusable bracket-style links for hero/footer.
- `src/components/hero/HeroCopy.tsx` — shared hero text used by both static and canvas hero paths.
- `src/components/sections/ProofPillarsSection.tsx` — four recruiter-fast proof pillars.
- `src/components/sections/FlagshipCaseStudy.tsx` — wide Repotoire case-study panel.
- `src/components/sections/ProductionProofSection.tsx` — NDA-safe professional proof section.

Modify:

- `src/data/contact.ts` — add an optional `resume` field that remains hidden when absent.
- `src/app/page.tsx` — insert Proof Wall sections and move production proof out of the Software & AI layer.
- `src/app/layout.tsx` — update metadata to match Full-Stack AI Engineer positioning.
- `src/components/hero/StaticHero.tsx` — use shared hero copy and preserve current background feel.
- `src/components/hero/CanvasHero.tsx` — render the same hero copy over the canvas path.
- `src/components/sections/IntroSection.tsx` — replace duplicate personal intro copy with role-specific systems depth copy.
- `src/components/sections/ContactFooter.tsx` — add the role closing line and reuse fast path links.
- `src/components/DragonCurveBackground.tsx` — add layered glow/depth paths and static reduced-motion fallback.
- `scripts/audit-checks.mjs` — extend regression checks for the new role, sections, links, and Dragon Curve behavior.

Do not modify:

- Project image assets.
- GitHub stats fetch logic in `src/lib/github.ts`.
- Carousel behavior.
- The public project list unless a task explicitly needs to adjust duplicated Repotoire copy.

---

### Task 1: Add Proof Data And Audit Coverage

**Files:**

- Modify: `scripts/audit-checks.mjs`
- Modify: `src/data/contact.ts`
- Create: `src/data/proof.ts`

- [ ] **Step 1: Write failing audit checks for proof data**

Append this block in `scripts/audit-checks.mjs` after the existing contact/topbar checks:

```js
const contactData = read("src/data/contact.ts");
assert(
  contactData.includes("resume: undefined as string | undefined"),
  "Contact data should expose an optional resume field so resume links can be hidden when absent"
);

const proofData = read("src/data/proof.ts");
for (const requiredProofText of [
  "Full-Stack AI Engineer",
  "I build AI systems end to end",
  "AI Products & Agents",
  "Retrieval & Knowledge Systems",
  "Inference & Edge AI",
  "Systems Foundation",
  "Repotoire",
  "110+ detectors",
]) {
  assert(
    proofData.includes(requiredProofText),
    `Proof data missing required text: ${requiredProofText}`
  );
}
assert(
  proofData.includes("contact.resume"),
  "Fast path links should read the optional resume URL from contact data"
);
```

- [ ] **Step 2: Run audit and verify it fails**

Run:

```bash
bun run audit
```

Expected: FAIL because `src/data/proof.ts` does not exist and `contact.resume` is not defined.

- [ ] **Step 3: Add optional resume field to contact data**

Replace `src/data/contact.ts` with:

```ts
export const contact = {
  github: "https://github.com/Zach-hammad",
  linkedin: "https://www.linkedin.com/in/zach-hammad/",
  email: "zachariahammad@gmail.com",
  resume: undefined as string | undefined,
} as const;
```

- [ ] **Step 4: Create proof data**

Create `src/data/proof.ts`:

```ts
import { contact } from "@/data/contact";

export interface FastPathLink {
  label: string;
  href: string;
  ariaLabel: string;
  external?: boolean;
}

export interface ProofPillar {
  title: string;
  claim: string;
  tokens: string[];
  accentColor: string;
}

export interface CaseStudyLink {
  label: string;
  href: string;
  ariaLabel: string;
  external?: boolean;
}

export const roleIdentity = {
  eyebrow: "Full-Stack AI Engineer",
  name: "Zacharia Hammad",
  systemsLine: "Transistors -> Logic -> Architecture -> Assembly -> Code -> AI",
  lead:
    "I build AI systems end to end: agents, retrieval, computer vision, infrastructure, and the low-level foundations they run on.",
  intro:
    "Computer Engineering graduate from Drexel University. I move comfortably from CPU design and virtual machines to production AI pipelines, graph systems, and full-stack product surfaces.",
  footerLine: "Building AI systems from product surface to metal.",
} as const;

export const proofPillars: ProofPillar[] = [
  {
    title: "AI Products & Agents",
    claim:
      "I build user-facing AI systems that turn models into useful workflows.",
    tokens: ["Scout", "voice agents", "dashboards", "workflow systems"],
    accentColor: "#c084fc",
  },
  {
    title: "Retrieval & Knowledge Systems",
    claim:
      "I design the graph and vector layers that make AI systems context-aware.",
    tokens: ["Neo4j", "vector search", "Repotoire", "tqvec"],
    accentColor: "#60a5fa",
  },
  {
    title: "Inference & Edge AI",
    claim:
      "I ship model pipelines where latency, GPUs, and hardware constraints matter.",
    tokens: ["DeepStream", "TensorRT", "CUDA", "Hailo", "Raspberry Pi"],
    accentColor: "#f59e0b",
  },
  {
    title: "Systems Foundation",
    claim:
      "I understand the lower layers because I have built processors, VMs, and emulators.",
    tokens: ["RISC-V", "virtual machines", "emulators", "Rust", "C/C++"],
    accentColor: "#4ade80",
  },
];

const resumeLinks: FastPathLink[] = contact.resume
  ? [
      {
        label: "resume",
        href: contact.resume,
        ariaLabel: "Open Zacharia Hammad resume",
        external: false,
      },
    ]
  : [];

export const fastPathLinks: FastPathLink[] = [
  ...resumeLinks,
  {
    label: "github",
    href: contact.github,
    ariaLabel: "Open Zacharia Hammad GitHub profile",
    external: true,
  },
  {
    label: "linkedin",
    href: contact.linkedin,
    ariaLabel: "Open Zacharia Hammad LinkedIn profile",
    external: true,
  },
  {
    label: "email",
    href: `mailto:${contact.email}`,
    ariaLabel: "Email Zacharia Hammad",
    external: false,
  },
];

export const flagshipCaseStudy = {
  eyebrow: "FLAGSHIP CASE STUDY",
  title: "Repotoire",
  subtitle: "Graph-powered code intelligence for AI-assisted engineering.",
  problem:
    "AI coding agents need accurate codebase context before they can make reliable changes.",
  approach:
    "Repotoire builds a knowledge graph of a repository, runs language-aware detectors, and packages the result as a fast Rust CLI.",
  result:
    "110+ detectors across 9 languages, shipped as a single binary with Homebrew distribution and a GitHub Action path.",
  proof: [
    "Rust single binary",
    "110+ detectors",
    "9 languages",
    "knowledge graph",
    "Homebrew",
    "GitHub Action",
  ],
  links: [
    {
      label: "src",
      href: "https://github.com/Zach-hammad/repotoire",
      ariaLabel: "View Repotoire source on GitHub",
      external: true,
    },
  ] satisfies CaseStudyLink[],
} as const;
```

- [ ] **Step 5: Run audit and verify data checks pass**

Run:

```bash
bun run audit
```

Expected: PASS with `Portfolio audit checks passed.`

- [ ] **Step 6: Commit**

```bash
git add scripts/audit-checks.mjs src/data/contact.ts src/data/proof.ts
git commit -m "feat: add proof wall data"
```

---

### Task 2: Share Hero Copy Across Static And Canvas Hero

**Files:**

- Modify: `scripts/audit-checks.mjs`
- Create: `src/components/FastPathLinks.tsx`
- Create: `src/components/hero/HeroCopy.tsx`
- Modify: `src/components/hero/StaticHero.tsx`
- Modify: `src/components/hero/CanvasHero.tsx`

- [ ] **Step 1: Write failing audit checks for hero positioning**

Append this block in `scripts/audit-checks.mjs` after the `staticHero` check:

```js
const heroCopy = read("src/components/hero/HeroCopy.tsx");
assert(heroCopy.includes("<h1"), "HeroCopy should own the single page h1");
assert(
  heroCopy.includes("roleIdentity.eyebrow"),
  "HeroCopy should render the Full-Stack AI Engineer eyebrow from proof data"
);
assert(
  heroCopy.includes("roleIdentity.lead"),
  "HeroCopy should render the role lead from proof data"
);

const fastPathLinksComponent = read("src/components/FastPathLinks.tsx");
assert(
  fastPathLinksComponent.includes("fastPathLinks.map"),
  "FastPathLinks should render the proof data link list"
);
assert(
  fastPathLinksComponent.includes("aria-label={link.ariaLabel}"),
  "FastPathLinks anchors need descriptive accessible labels"
);
assert(
  fastPathLinksComponent.includes("min-h-11"),
  "FastPathLinks should keep mobile-sized tap targets"
);
assert(
  staticHero.includes("<HeroCopy />"),
  "StaticHero should render the shared hero copy"
);

const canvasHero = read("src/components/hero/CanvasHero.tsx");
assert(
  canvasHero.includes("<HeroCopy />"),
  "CanvasHero should render the same visible hero copy as StaticHero"
);
```

- [ ] **Step 2: Run audit and verify it fails**

Run:

```bash
bun run audit
```

Expected: FAIL because `HeroCopy.tsx` and `FastPathLinks.tsx` do not exist.

- [ ] **Step 3: Create FastPathLinks**

Create `src/components/FastPathLinks.tsx`:

```tsx
import { fastPathLinks } from "@/data/proof";

interface FastPathLinksProps {
  className?: string;
  align?: "center" | "start";
}

export default function FastPathLinks({
  className = "",
  align = "center",
}: FastPathLinksProps) {
  const alignmentClass =
    align === "center" ? "justify-center" : "justify-start";

  return (
    <div
      className={`flex flex-wrap items-center gap-2 text-xs text-neutral-400 ${alignmentClass} ${className}`}
    >
      {fastPathLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noopener noreferrer" : undefined}
          aria-label={link.ariaLabel}
          className="inline-flex min-h-11 items-center rounded-sm px-2 hover:text-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
        >
          [{link.label}]
        </a>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create HeroCopy**

Create `src/components/hero/HeroCopy.tsx`:

```tsx
import FastPathLinks from "@/components/FastPathLinks";
import { roleIdentity } from "@/data/proof";

export default function HeroCopy() {
  return (
    <div className="text-center relative z-10 max-w-3xl mx-auto px-4">
      <p className="text-xs font-mono tracking-[0.28em] uppercase text-neutral-400 mb-6">
        {roleIdentity.systemsLine}
      </p>
      <p className="text-xs font-mono uppercase tracking-[0.22em] text-purple-300 mb-4">
        {roleIdentity.eyebrow}
      </p>
      <h1 className="text-5xl md:text-7xl font-bold mb-5 text-neutral-100">
        {roleIdentity.name}
      </h1>
      <p className="text-sm md:text-base text-neutral-400 leading-relaxed max-w-2xl mx-auto mb-8">
        {roleIdentity.lead}
      </p>
      <FastPathLinks />
    </div>
  );
}
```

- [ ] **Step 5: Update StaticHero to use HeroCopy**

Modify `src/components/hero/StaticHero.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import HeroCopy from "./HeroCopy";

export default function StaticHero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(74, 222, 128, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(74, 222, 128, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 1 }}
      >
        <HeroCopy />
      </motion.div>

      <motion.div
        className="absolute bottom-8"
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : { delay: 1.2 }}
      >
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-neutral-400 to-transparent mx-auto"
          animate={shouldReduceMotion ? undefined : { scaleY: [1, 0.5, 1] }}
          transition={
            shouldReduceMotion ? undefined : { repeat: Infinity, duration: 2 }
          }
        />
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 6: Update CanvasHero to include HeroCopy overlay**

In `src/components/hero/CanvasHero.tsx`, add:

```tsx
import HeroCopy from "./HeroCopy";
```

Then replace the return block with:

```tsx
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
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto w-full">
          <HeroCopy />
        </div>
      </div>
    </div>
  );
```

- [ ] **Step 7: Run audit and build**

Run:

```bash
bun run audit
bun run build
```

Expected:

- Audit: PASS with `Portfolio audit checks passed.`
- Build: PASS with a successful Next.js static export.

- [ ] **Step 8: Commit**

```bash
git add scripts/audit-checks.mjs src/components/FastPathLinks.tsx src/components/hero/HeroCopy.tsx src/components/hero/StaticHero.tsx src/components/hero/CanvasHero.tsx
git commit -m "feat: sharpen hero positioning"
```

---

### Task 3: Add Proof Pillars And Repotoire Flagship

**Files:**

- Modify: `scripts/audit-checks.mjs`
- Create: `src/components/sections/ProofPillarsSection.tsx`
- Create: `src/components/sections/FlagshipCaseStudy.tsx`
- Modify: `src/components/sections/IntroSection.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Write failing audit checks for new proof sections**

Append this block in `scripts/audit-checks.mjs` after the hero checks:

```js
const proofPillarsSection = read("src/components/sections/ProofPillarsSection.tsx");
assert(
  proofPillarsSection.includes("proofPillars.map"),
  "ProofPillarsSection should render all proof pillars from data"
);
assert(
  proofPillarsSection.includes("borderLeftColor: pillar.accentColor"),
  "Proof pillar cards should preserve the existing left-accent card language"
);

const flagshipCaseStudySection = read("src/components/sections/FlagshipCaseStudy.tsx");
assert(
  flagshipCaseStudySection.includes("flagshipCaseStudy.problem"),
  "FlagshipCaseStudy should render the problem narrative"
);
assert(
  flagshipCaseStudySection.includes("flagshipCaseStudy.proof.map"),
  "FlagshipCaseStudy should render proof tokens"
);

const pageFile = read("src/app/page.tsx");
assert(
  pageFile.includes("<ProofPillarsSection />"),
  "Homepage should render proof pillars near the top"
);
assert(
  pageFile.includes("<FlagshipCaseStudy />"),
  "Homepage should render the Repotoire flagship case study"
);
```

- [ ] **Step 2: Run audit and verify it fails**

Run:

```bash
bun run audit
```

Expected: FAIL because the proof section files do not exist.

- [ ] **Step 3: Create ProofPillarsSection**

Create `src/components/sections/ProofPillarsSection.tsx`:

```tsx
import AnimatedSection from "@/components/AnimatedSection";
import { proofPillars } from "@/data/proof";

export default function ProofPillarsSection() {
  return (
    <section className="py-20 px-4 font-mono">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="mb-12">
            <div className="text-xs text-neutral-400 mb-6">
              {"// "}PROOF WALL
            </div>
            <h2 className="text-2xl md:text-3xl font-normal text-neutral-200 mb-3">
              AI systems, from product surface to metal
            </h2>
            <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
              Four ways to scan the work: product, retrieval, inference, and
              the systems foundation underneath it.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {proofPillars.map((pillar, index) => (
            <AnimatedSection key={pillar.title} delay={index * 0.08}>
              <div
                className="h-full border border-l-2 border-neutral-800 bg-neutral-950/40 hover:border-neutral-400 transition-colors duration-200"
                style={{ borderLeftColor: pillar.accentColor }}
              >
                <div className="px-4 py-2 border-b border-neutral-800 bg-neutral-900/50">
                  <h3 className="text-sm text-neutral-300">{pillar.title}</h3>
                </div>
                <div className="px-4 py-4">
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                    {pillar.claim}
                  </p>
                  <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-neutral-400">
                    {pillar.tokens.map((token) => (
                      <span key={token}>{token}</span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create FlagshipCaseStudy**

Create `src/components/sections/FlagshipCaseStudy.tsx`:

```tsx
import AnimatedSection from "@/components/AnimatedSection";
import { flagshipCaseStudy } from "@/data/proof";

export default function FlagshipCaseStudy() {
  return (
    <section className="py-20 px-4 font-mono">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="mb-12">
            <div className="text-xs text-neutral-400 mb-6">
              {"// "}
              <span className="text-purple-300">
                {flagshipCaseStudy.eyebrow}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-normal text-neutral-200 mb-3">
              {flagshipCaseStudy.title}
            </h2>
            <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
              {flagshipCaseStudy.subtitle}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="border border-l-2 border-neutral-800 bg-neutral-950/50 hover:border-neutral-400 transition-colors duration-200 border-l-purple-400">
            <div className="flex items-center justify-between gap-4 px-4 py-2 border-b border-neutral-800 bg-neutral-900/50">
              <span className="text-sm text-neutral-300">
                graph-powered code intelligence
              </span>
              <div className="flex items-center gap-3 text-xs text-neutral-400">
                {flagshipCaseStudy.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    aria-label={link.ariaLabel}
                    className="hover:text-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
                  >
                    [{link.label}]
                  </a>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] gap-8 px-4 py-5">
              <div className="space-y-5">
                <div>
                  <div className="text-[10px] tracking-wider text-neutral-400 mb-2">
                    PROBLEM
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {flagshipCaseStudy.problem}
                  </p>
                </div>
                <div>
                  <div className="text-[10px] tracking-wider text-neutral-400 mb-2">
                    APPROACH
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {flagshipCaseStudy.approach}
                  </p>
                </div>
                <div>
                  <div className="text-[10px] tracking-wider text-neutral-400 mb-2">
                    RESULT
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {flagshipCaseStudy.result}
                  </p>
                </div>
              </div>
              <div className="border border-neutral-800 bg-neutral-950/50 p-4">
                <div className="text-[10px] tracking-wider text-neutral-400 mb-4">
                  PROOF TOKENS
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-neutral-400">
                  {flagshipCaseStudy.proof.map((item) => (
                    <span
                      key={item}
                      className="border border-neutral-800 px-2 py-1"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Refocus IntroSection**

Replace `src/components/sections/IntroSection.tsx` with:

```tsx
import AnimatedSection from "@/components/AnimatedSection";
import { roleIdentity } from "@/data/proof";

export default function IntroSection() {
  return (
    <section className="py-24 px-4 font-mono">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatedSection>
          <div className="text-xs text-neutral-400 mb-6">
            {"// "}POSITIONING
          </div>
          <h2 className="text-3xl md:text-5xl font-normal mb-6 text-neutral-100 tracking-tight">
            Systems depth for production AI
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <p className="text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {roleIdentity.intro}
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Add proof sections to the homepage**

In `src/app/page.tsx`, add imports:

```tsx
import ProofPillarsSection from "@/components/sections/ProofPillarsSection";
import FlagshipCaseStudy from "@/components/sections/FlagshipCaseStudy";
```

Then insert these sections immediately after the first `<hr className="section-rule max-w-5xl mx-auto" />` that follows `<IntroSection />`:

```tsx
      <ProofPillarsSection />

      <hr className="section-rule max-w-5xl mx-auto" />

      <FlagshipCaseStudy />

      <hr className="section-rule max-w-5xl mx-auto" />
```

- [ ] **Step 7: Run audit, lint, and build**

Run:

```bash
bun run audit
bun run lint
bun run build
```

Expected:

- Audit: PASS with `Portfolio audit checks passed.`
- Lint: PASS with no errors.
- Build: PASS with a successful Next.js static export.

- [ ] **Step 8: Commit**

```bash
git add scripts/audit-checks.mjs src/components/sections/ProofPillarsSection.tsx src/components/sections/FlagshipCaseStudy.tsx src/components/sections/IntroSection.tsx src/app/page.tsx
git commit -m "feat: add proof wall sections"
```

---

### Task 4: Split Production Proof From Origin Story

**Files:**

- Modify: `scripts/audit-checks.mjs`
- Create: `src/components/sections/ProductionProofSection.tsx`
- Modify: `src/data/professional.ts`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Write failing audit checks for production proof separation**

Append this block in `scripts/audit-checks.mjs` after the proof section checks:

```js
const productionProofSection = read("src/components/sections/ProductionProofSection.tsx");
assert(
  productionProofSection.includes("professionalExperience.map"),
  "ProductionProofSection should render professional experience from data"
);
assert(
  productionProofSection.includes("NDA-SAFE PRODUCTION"),
  "ProductionProofSection should label work as NDA-safe production proof"
);

const updatedPage = read("src/app/page.tsx");
assert(
  updatedPage.includes("<ProductionProofSection />"),
  "Homepage should render production proof as its own section"
);
assert(
  !updatedPage.includes("{professionalExperience.map((exp) =>"),
  "Software & AI layer should not inline professional experience after production proof is split out"
);
```

- [ ] **Step 2: Run audit and verify it fails**

Run:

```bash
bun run audit
```

Expected: FAIL because `ProductionProofSection.tsx` does not exist.

- [ ] **Step 3: Refresh NDA-safe professional copy**

Replace `src/data/professional.ts` with:

```ts
import { ProfessionalExperience } from "@/lib/types";

export const professionalExperience: ProfessionalExperience[] = [
  {
    area: "Real-Time Video Processing",
    description:
      "Built GPU-accelerated video processing paths for production inference workloads.",
    technologies: ["TensorRT", "DeepStream", "Python", "CUDA"],
  },
  {
    area: "Knowledge Graph Systems",
    description:
      "Designed entity mapping and relationship layers for AI systems that need durable context.",
    technologies: ["Neo4j", "Python", "Rust", "Graph Algorithms"],
  },
  {
    area: "Full-Stack Product Systems",
    description:
      "Built dashboard and workflow surfaces that connect AI capabilities to real users.",
    technologies: ["Next.js", "TypeScript", "Turborepo", "Monorepo"],
  },
  {
    area: "Infrastructure & GitOps",
    description:
      "Maintained deployment paths for production services with repeatable infrastructure workflows.",
    technologies: ["Kubernetes", "ArgoCD", "GitHub Actions", "Doppler"],
  },
  {
    area: "Edge AI Deployment",
    description:
      "Deployed model workloads to constrained hardware with hardware-accelerated inference.",
    technologies: ["Hailo", "Raspberry Pi", "Python", "TensorRT"],
  },
];
```

- [ ] **Step 4: Create ProductionProofSection**

Create `src/components/sections/ProductionProofSection.tsx`:

```tsx
import AnimatedSection from "@/components/AnimatedSection";
import ProfessionalCard from "@/components/cards/ProfessionalCard";
import { professionalExperience } from "@/data/professional";

export default function ProductionProofSection() {
  return (
    <section className="py-20 px-4 font-mono">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="mb-12">
            <div className="text-xs text-neutral-400 mb-6">
              {"// "}NDA-SAFE PRODUCTION
            </div>
            <h2 className="text-2xl md:text-3xl font-normal text-neutral-200 mb-3">
              Production systems without private details
            </h2>
            <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
              High-level proof from real work: inference, knowledge systems,
              product surfaces, infrastructure, and edge deployment.
            </p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {professionalExperience.map((experience, index) => (
            <AnimatedSection key={experience.area} delay={index * 0.08}>
              <ProfessionalCard
                experience={experience}
                accentColor="#c084fc"
              />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Move production proof out of Software & AI layer**

In `src/app/page.tsx`, add:

```tsx
import ProductionProofSection from "@/components/sections/ProductionProofSection";
```

Remove:

```tsx
import ProfessionalCard from "@/components/cards/ProfessionalCard";
import { professionalExperience } from "@/data/professional";
```

Insert after `<FlagshipCaseStudy />` and the following rule:

```tsx
      <ProductionProofSection />

      <hr className="section-rule max-w-5xl mx-auto" />
```

Inside the Software & AI `LayerSection`, remove the professional experience block and leave only:

```tsx
        <div className="md:col-span-2">
          <AnimatedSection>
            <div className="text-xs text-neutral-400 mb-4 mt-4">
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
                      ? githubStats.get(project.githubUrl)
                      : null
                  }
                  accentColor="#c084fc"
                />
              </AnimatedSection>
            ))}
          </div>
        </div>
```

- [ ] **Step 6: Run audit, lint, and build**

Run:

```bash
bun run audit
bun run lint
bun run build
```

Expected:

- Audit: PASS with `Portfolio audit checks passed.`
- Lint: PASS with no errors.
- Build: PASS with a successful Next.js static export.

- [ ] **Step 7: Commit**

```bash
git add scripts/audit-checks.mjs src/components/sections/ProductionProofSection.tsx src/data/professional.ts src/app/page.tsx
git commit -m "feat: separate production proof"
```

---

### Task 5: Update Metadata And Contact Footer

**Files:**

- Modify: `scripts/audit-checks.mjs`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/sections/ContactFooter.tsx`

- [ ] **Step 1: Write failing audit checks for metadata and footer**

Append this block in `scripts/audit-checks.mjs` after the existing metadata checks:

```js
assert(
  layout.includes("Full-Stack AI Engineer"),
  "Metadata should include the new Full-Stack AI Engineer positioning"
);
assert(
  layout.includes("agents, retrieval, computer vision"),
  "Metadata description should include core AI system capabilities"
);

const contactFooter = read("src/components/sections/ContactFooter.tsx");
assert(
  contactFooter.includes("roleIdentity.footerLine"),
  "ContactFooter should render the role-specific closing line"
);
assert(
  contactFooter.includes("<FastPathLinks />"),
  "ContactFooter should reuse FastPathLinks"
);
```

- [ ] **Step 2: Run audit and verify it fails**

Run:

```bash
bun run audit
```

Expected: FAIL because metadata and footer still use the previous Computer Engineer framing.

- [ ] **Step 3: Update metadata**

In `src/app/layout.tsx`, replace the metadata object with:

```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://zachariahammad.com"),
  title: "Zacharia Hammad — Full-Stack AI Engineer",
  description:
    "Full-Stack AI Engineer building agents, retrieval systems, computer vision pipelines, infrastructure, and low-level systems foundations.",
  keywords: [
    "full-stack ai engineer",
    "AI agents",
    "retrieval systems",
    "computer vision",
    "RISC-V",
    "Rust",
    "systems programming",
    "portfolio",
  ],
  authors: [{ name: "Zacharia Hammad" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Zacharia Hammad — Full-Stack AI Engineer",
    description:
      "Building AI systems end to end: agents, retrieval, computer vision, infrastructure, and systems foundations.",
    url: "/",
    siteName: "Zacharia Hammad",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zacharia Hammad — Full-Stack AI Engineer",
    description:
      "Building AI systems end to end: agents, retrieval, computer vision, infrastructure, and systems foundations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

- [ ] **Step 4: Update ContactFooter**

Replace `src/components/sections/ContactFooter.tsx` with:

```tsx
import AnimatedSection from "@/components/AnimatedSection";
import FastPathLinks from "@/components/FastPathLinks";
import { roleIdentity } from "@/data/proof";

export default function ContactFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 px-4 font-mono">
      <div className="max-w-3xl mx-auto">
        <hr className="section-rule mb-12" />
        <AnimatedSection>
          <div className="text-center">
            <div className="text-xs text-neutral-400 mb-6">
              {"// "}CONTACT
            </div>
            <p className="text-sm text-neutral-300 mb-8">
              {roleIdentity.footerLine}
            </p>
            <div className="mb-10">
              <FastPathLinks />
            </div>
            <p className="text-neutral-400 text-[10px] tracking-wider">
              &copy; {currentYear} Zacharia Hammad
            </p>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Run audit, lint, and build**

Run:

```bash
bun run audit
bun run lint
bun run build
```

Expected:

- Audit: PASS with `Portfolio audit checks passed.`
- Lint: PASS with no errors.
- Build: PASS with a successful Next.js static export.

- [ ] **Step 6: Commit**

```bash
git add scripts/audit-checks.mjs src/app/layout.tsx src/components/sections/ContactFooter.tsx
git commit -m "feat: update portfolio positioning metadata"
```

---

### Task 6: Upgrade Dragon Curve Background

**Files:**

- Modify: `scripts/audit-checks.mjs`
- Modify: `src/components/DragonCurveBackground.tsx`

- [ ] **Step 1: Write failing audit checks for upgraded Dragon Curve**

Append this block in `scripts/audit-checks.mjs` after the existing Dragon Curve checks:

```js
assert(
  dragon.includes("dragonGlow"),
  "Dragon background should include a glow filter"
);
assert(
  dragon.includes("glowPathRef"),
  "Dragon background should render a separate glow path"
);
assert(
  dragon.includes("ghostPathRef"),
  "Dragon background should render a separate ghost/depth path"
);
assert(
  dragon.includes("requestAnimationFrame"),
  "Dragon scroll updates should be throttled with requestAnimationFrame"
);
assert(
  dragon.includes('aria-hidden="true"'),
  "Dragon background should be hidden from assistive technology"
);
assert(
  !dragon.includes("if (reducedMotion) return null"),
  "Reduced motion should use a static Dragon Curve fallback instead of always hiding it"
);
```

- [ ] **Step 2: Run audit and verify it fails**

Run:

```bash
bun run audit
```

Expected: FAIL because the current Dragon Curve has one path, no glow filter, and returns `null` for reduced motion.

- [ ] **Step 3: Add layered path refs and rAF state**

In `src/components/DragonCurveBackground.tsx`, add these refs inside `DragonCurveBackground()`:

```tsx
  const glowPathRef = useRef<SVGPathElement>(null);
  const ghostPathRef = useRef<SVGPathElement>(null);
  const rafRef = useRef<number | null>(null);
```

Add this helper above the component:

```tsx
function setPathDash(path: SVGPathElement | null, length: number, offset: number) {
  if (!path) return;
  path.style.strokeDasharray = `${length}`;
  path.style.strokeDashoffset = `${offset}`;
}
```

- [ ] **Step 4: Initialize all Dragon Curve path layers**

Replace the `totalLength` setup effect with:

```tsx
  useEffect(() => {
    if (!pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    setTotalLength(len);

    if (reducedMotion) {
      setPathDash(pathRef.current, len, 0);
      setPathDash(glowPathRef.current, len, 0);
      setPathDash(ghostPathRef.current, len, 0);
      return;
    }

    setPathDash(pathRef.current, len, len * 0.85);
    setPathDash(glowPathRef.current, len, len * 0.88);
    setPathDash(ghostPathRef.current, len, len * 0.92);
  }, [path, reducedMotion]);
```

- [ ] **Step 5: Throttle scroll updates and add depth transform**

Replace the scroll effect body with:

```tsx
  useEffect(() => {
    if (reducedMotion || !totalLength || !pathRef.current) return;

    function updateDragon() {
      if (!pathRef.current || !containerRef.current) return;

      const scrollY = window.scrollY;
      const totalScrollRange =
        document.documentElement.scrollHeight - window.innerHeight;

      if (totalScrollRange <= 0) return;

      const scrollProgress = Math.min(scrollY / totalScrollRange, 1);
      const progress = 0.15 + scrollProgress * 0.85;
      const mainOffset = totalLength * (1 - progress);
      const glowOffset = totalLength * (1 - Math.max(0, progress - 0.025));
      const ghostOffset = totalLength * (1 - Math.max(0, progress - 0.055));

      setPathDash(pathRef.current, totalLength, mainOffset);
      setPathDash(glowPathRef.current, totalLength, glowOffset);
      setPathDash(ghostPathRef.current, totalLength, ghostOffset);

      const spread = 0.18;
      const topColor = lerpColor(scrollProgress - spread);
      const midColor = lerpColor(scrollProgress);
      const botColor = lerpColor(scrollProgress + spread);

      if (stop0Ref.current) stop0Ref.current.setAttribute("stop-color", topColor);
      if (stop1Ref.current) stop1Ref.current.setAttribute("stop-color", midColor);
      if (stop2Ref.current) stop2Ref.current.setAttribute("stop-color", botColor);

      if (svgRef.current) {
        const shiftX = (scrollProgress - 0.5) * 18;
        const shiftY = (scrollProgress - 0.5) * -12;
        const scale = 1 + scrollProgress * 0.035;
        svgRef.current.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0) scale(${scale})`;
      }
    }

    function onScroll() {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        updateDragon();
        rafRef.current = null;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    updateDragon();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion, totalLength]);
```

- [ ] **Step 6: Replace the render block with layered SVG paths**

Remove:

```tsx
  if (reducedMotion) return null;
```

Set the outer wrapper to:

```tsx
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
      style={{ opacity: reducedMotion ? 0.14 : 0.32 }}
    >
```

Inside `<defs>`, add the glow filter:

```tsx
          <filter id="dragonGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.9" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.75 0"
            />
          </filter>
```

Replace the single `<path />` with:

```tsx
        <path
          ref={ghostPathRef}
          d={path}
          stroke="url(#dragonGradient)"
          strokeWidth="1.15"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={reducedMotion ? 0.16 : 0.2}
          transform="translate(1.1 -1.1)"
        />
        <path
          ref={glowPathRef}
          d={path}
          stroke="url(#dragonGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={reducedMotion ? 0.08 : 0.22}
          filter="url(#dragonGlow)"
        />
        <path
          ref={pathRef}
          d={path}
          stroke="url(#dragonGradient)"
          strokeWidth="0.72"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={reducedMotion ? 0.34 : 0.82}
        />
```

- [ ] **Step 7: Run audit, lint, and build**

Run:

```bash
bun run audit
bun run lint
bun run build
```

Expected:

- Audit: PASS with `Portfolio audit checks passed.`
- Lint: PASS with no errors.
- Build: PASS with a successful Next.js static export.

- [ ] **Step 8: Commit**

```bash
git add scripts/audit-checks.mjs src/components/DragonCurveBackground.tsx
git commit -m "feat: upgrade dragon curve background"
```

---

### Task 7: Visual QA And Final Verification

**Files:**

- Modify only files required to fix defects found during verification.

- [ ] **Step 1: Start the dev server**

Run:

```bash
bun run dev
```

Expected: the Next.js dev server prints a local URL such as `http://localhost:3000`.

- [ ] **Step 2: Desktop browser verification**

Open the local URL in the in-app browser and verify:

- First viewport clearly shows `Full-Stack AI Engineer`.
- `Zacharia Hammad` is the only visible hero name and remains the page `h1`.
- The style still reads as dark, mono, technical, and restrained.
- Proof pillars appear before the layered origin story.
- Repotoire appears as the wide flagship case study.
- Production proof appears as its own NDA-safe section.
- The Dragon Curve sits behind content, has glow/depth, and does not reduce text contrast.

- [ ] **Step 3: Mobile browser verification**

Use the in-app browser mobile viewport and verify:

- Hero text wraps without overflow.
- Fast path links wrap cleanly and remain tappable.
- Proof pillar cards stack cleanly.
- The Repotoire flagship panel stacks cleanly.
- No card text overlaps with the Dragon Curve.
- Footer links remain accessible.

- [ ] **Step 4: Reduced-motion verification**

Use browser devtools or OS settings to emulate `prefers-reduced-motion: reduce`, reload, and verify:

- Animated section entrances stop moving.
- Static hero remains readable.
- Dragon Curve renders as a static low-opacity background or remains visually quiet.
- No scroll-driven Dragon Curve reveal runs.

- [ ] **Step 5: Final command verification**

Run:

```bash
bun run lint
bun run audit
bun run build
git diff --check
```

Expected:

- Lint: PASS with no errors.
- Audit: PASS with `Portfolio audit checks passed.`
- Build: PASS with a successful Next.js static export.
- Diff check: no output.

- [ ] **Step 6: Commit QA fixes if any were needed**

If verification required code changes, run:

```bash
git add src scripts
git commit -m "fix: polish proof wall verification"
```

If verification required no code changes, do not create an empty commit.

