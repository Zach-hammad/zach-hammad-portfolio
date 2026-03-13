# Portfolio Revamp Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild zachariahammad.com as a scroll-storytelling portfolio narrating the journey from silicon to software.

**Architecture:** Single-page Next.js 15 App Router site with a sticky canvas hero animation (transistor→code transformation built last behind feature flag) followed by CSS/HTML timeline sections organized by abstraction layer (Hardware → Systems → Software & AI), a personal section, and contact footer. All project data in a single source-of-truth file, GitHub stats fetched at build time.

**Tech Stack:** Next.js 15, Tailwind CSS v4, Framer Motion, Three.js + @react-three/fiber (hero only), embla-carousel-react, bun

**Spec:** `docs/superpowers/specs/2026-03-13-portfolio-revamp-design.md`

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout: metadata, fonts, body wrapper
│   ├── page.tsx                # Single page: composes all sections in scroll order
│   └── globals.css             # Tailwind directives + dark theme custom properties
├── components/
│   ├── hero/
│   │   ├── StaticHero.tsx      # Fallback hero: name, tagline, CSS animation
│   │   ├── CanvasHero.tsx      # Three.js hero (lazy-loaded, feature-flagged)
│   │   └── HeroContainer.tsx   # Switches between Static/Canvas based on flag + capability
│   ├── sections/
│   │   ├── IntroSection.tsx    # Name, tagline, bio, social links
│   │   ├── LayerSection.tsx    # Reusable section shell: title, subtitle, accent color, children
│   │   ├── PersonalSection.tsx # BJJ, Chess, Travel sub-sections
│   │   └── ContactFooter.tsx   # Links, resume download, copyright
│   ├── cards/
│   │   ├── ProjectCard.tsx     # Individual project card with tech tags + GitHub link
│   │   └── ProfessionalCard.tsx # NDA-safe technology area card (no GitHub link)
│   ├── PhotoCarousel.tsx       # Reusable embla carousel for image arrays
│   └── AnimatedSection.tsx     # Framer Motion whileInView wrapper
├── data/
│   ├── projects.ts             # All project data: hardware, systems, software layers
│   ├── professional.ts         # NDA-safe professional experience entries
│   └── personal.ts             # BJJ, chess, travel content + image paths
├── lib/
│   ├── github.ts               # GitHub API fetch + cache logic (build-time only)
│   └── types.ts                # Shared TypeScript interfaces
public/
├── images/
│   ├── bjj/                    # BJJ photos (migrated from lovable-uploads)
│   ├── travel/                 # Travel photos (migrated from lovable-uploads)
│   └── education/              # Drexel campus photo
├── resume.pdf                  # (user-provided, optional)
├── favicon.ico                 # (carried over)
└── og-image.png                # (new, generated later)
tailwind.config.ts              # Dark theme colors, custom properties
next.config.ts                  # Next.js config
.env.local                      # NEXT_PUBLIC_ENABLE_CANVAS_HERO=false
```

---

## Chunk 1: Scaffold, Data Layer & Core Components

### Task 1: Initialize Next.js project and clean up old code

**Files:**
- Delete: All files in `src/` (old Vite app)
- Delete: `vite.config.ts`, `postcss.config.js`, `components.json`, `eslint.config.js`, `tsconfig.app.json`, `tsconfig.node.json`
- Delete: `public/lovable-uploads/`, `public/placeholder.svg`
- Create: Next.js 15 project scaffold in place
- Modify: `package.json` (complete rewrite)
- Create: `tailwind.config.ts`
- Create: `next.config.ts`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx` (placeholder)
- Create: `.env.local`

- [ ] **Step 1: Back up images before wiping**

```bash
mkdir -p /tmp/portfolio-images
cp public/lovable-uploads/*.png /tmp/portfolio-images/
cp public/favicon.ico /tmp/portfolio-images/
```

- [ ] **Step 1b: Verify backup succeeded**

```bash
ls -la /tmp/portfolio-images/
```

Expected: 11 `.png` files + 1 `favicon.ico` = 12 files total. If count is wrong, do NOT proceed to step 2.

- [ ] **Step 2: Remove old source files**

```bash
rm -rf src/ vite.config.ts postcss.config.js components.json eslint.config.js tsconfig.app.json tsconfig.node.json bun.lockb package-lock.json public/lovable-uploads public/placeholder.svg
```

- [ ] **Step 3: Initialize Next.js 15 project**

```bash
bunx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --use-bun
```

If it complains about existing files (`package.json`, `README.md`, `tsconfig.json`), remove them first and re-run. Accept defaults for all prompts.

**Important:** Accept the default import alias (`@/*`) when prompted. All components in this plan use `@/` imports (e.g., `@/components/...`, `@/lib/...`). Verify `tsconfig.json` contains the path alias after scaffolding:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- [ ] **Step 4: Restore images with semantic names**

```bash
mkdir -p public/images/bjj public/images/travel public/images/education
cp /tmp/portfolio-images/1fd42820-74ec-4745-bfa9-e2824c435112.png public/images/bjj/training-1.png
cp /tmp/portfolio-images/84fa6c16-d68d-4ff1-916f-114a70c05331.png public/images/bjj/training-2.png
cp /tmp/portfolio-images/403795dc-4411-4ae0-afb2-65de504c390f.png public/images/bjj/group-1.png
cp /tmp/portfolio-images/6325b319-ba18-43a2-9a41-04143fbaff5c.png public/images/bjj/training-3.png
cp /tmp/portfolio-images/3f848bb8-007a-4deb-99a5-1bbb0272b133.png public/images/bjj/group-2.png
cp /tmp/portfolio-images/a158a666-15c0-46df-b705-d2fc0d429317.png public/images/travel/coastal.png
cp /tmp/portfolio-images/6e7ede49-e35c-4afb-8d4d-bb5f2fb97d2f.png public/images/travel/grand-canyon.png
cp /tmp/portfolio-images/2077d59a-3014-4e05-b8d1-499936f71ba1.png public/images/travel/library.png
cp /tmp/portfolio-images/46157ab5-592f-45b0-9333-a9b23bd8a892.png public/images/travel/paris.png
cp /tmp/portfolio-images/e956f62c-f8e9-47e5-a420-2072fd1ce061.png public/images/education/drexel.png
cp /tmp/portfolio-images/favicon.ico public/favicon.ico
```

- [ ] **Step 5: Configure Tailwind with dark theme colors**

Replace the generated `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        card: "#111111",
        border: "#222222",
        "text-primary": "#fafafa",
        "text-secondary": "#999999",
        "text-muted": "#666666",
        "accent-hardware": "#4ade80",
        "accent-systems": "#60a5fa",
        "accent-software": "#c084fc",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 6: Set up globals.css with dark theme**

Replace `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #0a0a0a;
  color: #fafafa;
}

::selection {
  background-color: rgba(96, 165, 250, 0.3);
  color: #fafafa;
}
```

- [ ] **Step 7: Set up root layout**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zacharia Hammad — Computer Engineer",
  description:
    "Computer Engineer building from transistors to interfaces. Portfolio showcasing hardware design, systems programming, and software engineering.",
  openGraph: {
    title: "Zacharia Hammad — Computer Engineer",
    description:
      "Computer Engineer building from transistors to interfaces.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Create placeholder page**

Replace `src/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">Portfolio — Under Construction</h1>
    </main>
  );
}
```

- [ ] **Step 9: Create environment file**

Create `.env.local`:

```
NEXT_PUBLIC_ENABLE_CANVAS_HERO=false
```

- [ ] **Step 10: Verify dev server starts**

```bash
bun run dev
```

Expected: Next.js dev server starts on localhost:3000, page shows "Portfolio — Under Construction" with dark background.

- [ ] **Step 10b: Verify production build works**

```bash
bun run build
```

Expected: Build succeeds with no errors. This catches config issues early.

- [ ] **Step 10c: Verify .env.local is in .gitignore**

Check that the Next.js scaffold added `.env*.local` to `.gitignore`. If not, add it.

- [ ] **Step 11: Commit scaffold**

```bash
git add -A
git commit -m "chore: scaffold Next.js 15 project with Tailwind dark theme

Replace Vite + React SPA with Next.js App Router.
Migrate images with semantic names. Configure dark-only theme."
```

---

### Task 2: Create data layer

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/data/projects.ts`
- Create: `src/data/professional.ts`
- Create: `src/data/personal.ts`

- [ ] **Step 1: Define shared types**

Create `src/lib/types.ts`:

```typescript
export interface Project {
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  layer: "hardware" | "systems" | "software";
}

export interface ProfessionalExperience {
  area: string;
  description: string;
  technologies: string[];
}

export interface PersonalSection {
  title: string;
  description: string;
  images?: { src: string; alt: string }[];
}

export interface GitHubStats {
  stars: number;
  language: string | null;
}
```

- [ ] **Step 2: Create project data**

Create `src/data/projects.ts`:

```typescript
import { Project } from "@/lib/types";

export const projects: Project[] = [
  // Layer: Hardware
  {
    slug: "risc-v",
    title: "RISC-V CPU",
    description:
      "Pipelined RISC-V CPU with branch prediction, out-of-order execution, and PC-signature hit predictor. Evolved from single-cycle to fully pipelined architecture.",
    technologies: ["C", "RISC-V", "Pipeline Architecture", "Branch Prediction"],
    githubUrl: "https://github.com/Zach-hammad/RISC-V",
    layer: "hardware",
  },
  {
    slug: "hack-cpu",
    title: "HACK CPU (Nand2Tetris)",
    description:
      "Full CPU implementation from first principles: ALU, registers, program counter, memory control, and VM translator.",
    technologies: ["Python", "Hardware Design", "CPU Architecture"],
    githubUrl: "https://github.com/Zach-hammad/HACK-CPU-Project",
    layer: "hardware",
  },
  {
    slug: "zrisc",
    title: "ZRISC-32V",
    description:
      "Custom RISC processor simulator with vector extensions for machine learning workloads.",
    technologies: ["C++", "RISC", "Vector Extensions", "ML"],
    githubUrl: "https://github.com/Zach-hammad/zrisc",
    layer: "hardware",
  },
  // Layer: Systems
  {
    slug: "lc3-vm",
    title: "LC-3 Virtual Machine",
    description: "Complete LC-3 virtual machine implementation with full instruction set support.",
    technologies: ["C", "Virtual Machines", "Systems Programming"],
    githubUrl: "https://github.com/Zach-hammad/lc3-vm",
    layer: "systems",
  },
  {
    slug: "chip-8-sim",
    title: "CHIP-8 Simulator",
    description: "CHIP-8 interpreter and emulator for running classic programs.",
    technologies: ["Python", "Emulation", "Interpreters"],
    githubUrl: "https://github.com/Zach-hammad/chip_8_sim",
    layer: "systems",
  },
  {
    slug: "assembly-projects",
    title: "Assembly Projects",
    description:
      "Collection of assembly language projects demonstrating low-level algorithms and hardware interaction.",
    technologies: ["Assembly", "Low-level Programming"],
    githubUrl: "https://github.com/Zach-hammad/Assembly-Projects",
    layer: "systems",
  },
  {
    slug: "nanochat-riscv",
    title: "nanochat-riscv",
    description: "Chat application running on bare-metal RISC-V hardware.",
    technologies: ["Rust", "RISC-V", "Bare Metal"],
    githubUrl: "https://github.com/Zach-hammad/nanochat-riscv",
    layer: "systems",
  },
  // Layer: Software
  {
    slug: "repotoire",
    title: "Repotoire",
    description:
      "Code health analysis CLI and MCP server. Shipped via Homebrew tap.",
    technologies: ["Rust", "CLI", "MCP", "Homebrew"],
    githubUrl: "https://github.com/Zach-hammad/repotoire",
    layer: "software",
  },
  {
    slug: "ai-agent",
    title: "AI Agent",
    description: "Autonomous agent system for task execution.",
    technologies: ["Python", "AI", "Agents"],
    githubUrl: "https://github.com/Zach-hammad/ai_agent",
    layer: "software",
  },
  {
    slug: "tensorx",
    title: "TensorX",
    description: "Tensor computation library.",
    technologies: ["Python", "Tensors", "ML"],
    githubUrl: "https://github.com/Zach-hammad/tensorx",
    layer: "software",
  },
  {
    slug: "dragon-curve",
    title: "Dragon Curve",
    description:
      "Fractal visualization using Lindenmayer systems, generating self-similar space-filling patterns.",
    technologies: ["Python", "Fractals", "L-Systems", "Visualization"],
    githubUrl: "https://github.com/Zach-hammad/Dragon-Curve",
    layer: "software",
  },
];

export function getProjectsByLayer(layer: Project["layer"]): Project[] {
  return projects.filter((p) => p.layer === layer);
}
```

- [ ] **Step 3: Create professional experience data**

Create `src/data/professional.ts`:

```typescript
import { ProfessionalExperience } from "@/lib/types";

export const professionalExperience: ProfessionalExperience[] = [
  {
    area: "Real-Time Video Processing",
    description:
      "Designed and built a real-time video processing pipeline for production deployment.",
    technologies: ["TensorRT", "DeepStream", "Python", "CUDA"],
  },
  {
    area: "Knowledge Graph System",
    description:
      "Architected a knowledge graph with entity fingerprinting and relationship mapping.",
    technologies: ["Neo4j", "Python", "Rust", "Graph Algorithms"],
  },
  {
    area: "Educational Platform",
    description:
      "Developed a full-stack educational platform with gamification and knowledge tracking.",
    technologies: ["Next.js", "Turborepo", "TypeScript", "Monorepo"],
  },
  {
    area: "Infrastructure & GitOps",
    description:
      "Built and maintained production Kubernetes infrastructure with GitOps workflows.",
    technologies: ["k3s", "ArgoCD", "Harbor", "GitHub Actions", "Doppler"],
  },
  {
    area: "Edge AI Deployment",
    description:
      "Deployed ML models to edge hardware with hardware-accelerated inference.",
    technologies: ["Hailo", "Raspberry Pi", "Python", "TensorRT"],
  },
];
```

- [ ] **Step 4: Create personal section data**

Create `src/data/personal.ts`:

```typescript
import { PersonalSection } from "@/lib/types";

export const personalSections: PersonalSection[] = [
  {
    title: "Brazilian Jiu-Jitsu",
    description:
      "I practice BJJ and help teach the kids' class. The discipline, patience, and mentorship translate directly into how I approach engineering problems.",
    images: [
      { src: "/images/bjj/training-1.png", alt: "BJJ training session" },
      { src: "/images/bjj/training-2.png", alt: "BJJ training session" },
      { src: "/images/bjj/group-1.png", alt: "BJJ group photo" },
      { src: "/images/bjj/training-3.png", alt: "BJJ training session" },
      { src: "/images/bjj/group-2.png", alt: "BJJ group with students" },
    ],
  },
  {
    title: "Chess",
    description:
      "My high school chess team won both state and national championships. Chess sharpened my strategic thinking and pattern recognition — skills I use daily in engineering.",
  },
  {
    title: "Travel & Photography",
    description:
      "Exploring different cultures and capturing moments through photography broadens how I think about problems and design.",
    images: [
      { src: "/images/travel/coastal.png", alt: "Coastal view" },
      { src: "/images/travel/grand-canyon.png", alt: "Grand Canyon" },
      { src: "/images/travel/library.png", alt: "Library" },
      { src: "/images/travel/paris.png", alt: "Paris" },
    ],
  },
];
```

- [ ] **Step 5: Commit data layer**

```bash
git add src/lib/types.ts src/data/projects.ts src/data/professional.ts src/data/personal.ts
git commit -m "feat: add data layer for projects, professional experience, and personal sections"
```

---

### Task 3: GitHub API integration

**Files:**
- Create: `src/lib/github.ts`

- [ ] **Step 0: Install server-only guard package**

```bash
bun add server-only
```

- [ ] **Step 1: Create GitHub fetch utility**

Create `src/lib/github.ts`:

```typescript
import "server-only";

import { GitHubStats } from "./types";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const CACHE_PATH = join(process.cwd(), ".github-cache.json");

type CacheData = Record<string, GitHubStats>;

async function readCache(): Promise<CacheData> {
  try {
    const data = await readFile(CACHE_PATH, "utf-8");
    return JSON.parse(data) as CacheData;
  } catch {
    return {};
  }
}

async function writeCache(cache: CacheData): Promise<void> {
  await writeFile(CACHE_PATH, JSON.stringify(cache, null, 2));
}

export async function fetchGitHubStats(
  repoUrl: string
): Promise<GitHubStats | null> {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;

  const [, owner, repo] = match;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      next: { revalidate: 86400 }, // 24 hours
    });

    if (!res.ok) throw new Error(`GitHub API ${res.status}`);

    const data = await res.json();
    const stats: GitHubStats = {
      stars: data.stargazers_count ?? 0,
      language: data.language ?? null,
    };

    // Update cache on success
    const cache = await readCache();
    cache[repoUrl] = stats;
    await writeCache(cache);

    return stats;
  } catch {
    // Fall back to cache
    const cache = await readCache();
    return cache[repoUrl] ?? null;
  }
}

// Note: Concurrent fetches may race on cache writes. This is acceptable —
// the cache is best-effort and any individual write captures a valid snapshot.
// Correctness is not affected; only cache completeness on first build.
export async function fetchAllGitHubStats(
  repoUrls: string[]
): Promise<Map<string, GitHubStats>> {
  const results = new Map<string, GitHubStats>();
  const fetches = repoUrls.map(async (url) => {
    const stats = await fetchGitHubStats(url);
    if (stats) results.set(url, stats);
  });
  await Promise.all(fetches);
  return results;
}
```

- [ ] **Step 2: Add cache file to .gitignore**

Append to `.gitignore`:

```
.github-cache.json
```

- [ ] **Step 3: Commit GitHub integration**

```bash
git add src/lib/github.ts .gitignore
git commit -m "feat: add GitHub API integration with file-based cache fallback"
```

---

### Task 4: Core reusable components

**Files:**
- Create: `src/components/AnimatedSection.tsx`
- Create: `src/components/cards/ProjectCard.tsx`
- Create: `src/components/cards/ProfessionalCard.tsx`
- Create: `src/components/PhotoCarousel.tsx`

- [ ] **Step 1: Install Framer Motion and embla-carousel**

```bash
bun add framer-motion embla-carousel-react
```

- [ ] **Step 2: Create AnimatedSection wrapper**

Create `src/components/AnimatedSection.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Create ProjectCard component**

Create `src/components/cards/ProjectCard.tsx`:

```tsx
import { Project, GitHubStats } from "@/lib/types";
import { Github, ExternalLink, Star } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  stats?: GitHubStats | null;
  accentColor: string;
}

export default function ProjectCard({
  project,
  stats,
  accentColor,
}: ProjectCardProps) {
  return (
    <div className="bg-card rounded-lg p-6 border border-border hover:border-opacity-50 transition-colors">
      <h3 className="text-xl font-semibold text-text-primary mb-2">
        {project.title}
      </h3>
      <p className="text-text-secondary text-sm mb-4">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="px-2 py-1 rounded text-xs"
            style={{
              backgroundColor: `${accentColor}15`,
              color: accentColor,
            }}
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4 text-sm">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-text-muted hover:text-text-primary transition-colors"
          >
            <Github size={14} />
            Code
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-text-muted hover:text-text-primary transition-colors"
          >
            <ExternalLink size={14} />
            Demo
          </a>
        )}
        {stats && stats.stars > 0 && (
          <span className="flex items-center gap-1 text-text-muted">
            <Star size={14} />
            {stats.stars}
          </span>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Install lucide-react**

```bash
bun add lucide-react
```

- [ ] **Step 5: Create ProfessionalCard component**

Create `src/components/cards/ProfessionalCard.tsx`:

```tsx
import { ProfessionalExperience } from "@/lib/types";

interface ProfessionalCardProps {
  experience: ProfessionalExperience;
  accentColor: string;
}

export default function ProfessionalCard({
  experience,
  accentColor,
}: ProfessionalCardProps) {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {experience.area}
      </h3>
      <p className="text-text-secondary text-sm mb-4">
        {experience.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {experience.technologies.map((tech) => (
          <span
            key={tech}
            className="px-2 py-1 rounded text-xs"
            style={{
              backgroundColor: `${accentColor}15`,
              color: accentColor,
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create PhotoCarousel component**

Create `src/components/PhotoCarousel.tsx`:

```tsx
"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PhotoCarouselProps {
  images: { src: string; alt: string }[];
}

export default function PhotoCarousel({ images }: PhotoCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative group">
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {images.map((image, index) => (
            <div key={index} className="flex-none w-full min-w-0">
              <div className="relative aspect-[4/3]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={scrollPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Previous image"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Next image"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
```

- [ ] **Step 7: Verify build compiles**

```bash
bun run build
```

Expected: Build succeeds with no errors. Components aren't rendered yet but should compile cleanly.

- [ ] **Step 8: Commit core components**

```bash
git add src/components/
git commit -m "feat: add core reusable components — AnimatedSection, ProjectCard, ProfessionalCard, PhotoCarousel"
```

---

## Chunk 2: Page Sections & Composition

### Task 5: Contact data and Intro section

**Files:**
- Create: `src/data/contact.ts`
- Create: `src/components/sections/IntroSection.tsx`

- [ ] **Step 0: Create shared contact data**

Create `src/data/contact.ts`:

```typescript
export const contact = {
  github: "https://github.com/Zach-hammad",
  linkedin: "https://linkedin.com/in/zachariahammad",
  // TODO: Replace with your actual email before shipping
  email: "zachhammad@example.com",
  resume: "/resume.pdf",
} as const;
```

**Note to implementer:** The email address MUST be updated to Zach's real email before deploying. Search for `@example.com` before shipping.

- [ ] **Step 0b: Commit contact data**

```bash
git add src/data/contact.ts
git commit -m "feat: add shared contact data — update email before deploy"
```

- [ ] **Step 1: Create IntroSection**

Create `src/components/sections/IntroSection.tsx`:

```tsx
import { Github, Linkedin, Mail, FileText } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { contact } from "@/data/contact";

export default function IntroSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatedSection>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Zacharia Hammad
          </h1>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <p className="text-xl text-text-secondary mb-6">
            Computer Engineer. I build from transistors to interfaces.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <p className="text-text-muted max-w-xl mx-auto mb-8 leading-relaxed">
            Computer Engineering graduate from Drexel University. I&apos;ve
            designed CPUs, built virtual machines, shipped developer tools in
            Rust, and deployed production ML pipelines. I care about
            understanding systems from the ground up.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.3}>
          <div className="flex items-center justify-center gap-6">
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors"
            >
              <Github size={18} />
              <span className="text-sm">GitHub</span>
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors"
            >
              <Linkedin size={18} />
              <span className="text-sm">LinkedIn</span>
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors"
            >
              <Mail size={18} />
              <span className="text-sm">Email</span>
            </a>
            <a
              href={contact.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors"
            >
              <FileText size={18} />
              <span className="text-sm">Resume</span>
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/IntroSection.tsx
git commit -m "feat: add intro section with name, tagline, bio, and social links"
```

---

### Task 6: LayerSection reusable component

**Files:**
- Create: `src/components/sections/LayerSection.tsx`

- [ ] **Step 1: Create LayerSection**

Create `src/components/sections/LayerSection.tsx`:

```tsx
import { ReactNode } from "react";
import AnimatedSection from "@/components/AnimatedSection";

interface LayerSectionProps {
  layerNumber: number;
  label: string;
  title: string;
  description: string;
  accentColor: string;
  children: ReactNode;
}

export default function LayerSection({
  layerNumber,
  label,
  title,
  description,
  accentColor,
  children,
}: LayerSectionProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="mb-12">
            <span
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: accentColor }}
            >
              Layer {layerNumber} — {label}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              {title}
            </h2>
            <p className="text-text-secondary max-w-2xl">{description}</p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/LayerSection.tsx
git commit -m "feat: add reusable LayerSection component for timeline layers"
```

---

### Task 7: Personal section

**Files:**
- Create: `src/components/sections/PersonalSection.tsx`

- [ ] **Step 1: Create PersonalSection**

Create `src/components/sections/PersonalSection.tsx`:

```tsx
import { personalSections } from "@/data/personal";
import AnimatedSection from "@/components/AnimatedSection";
import PhotoCarousel from "@/components/PhotoCarousel";

export default function PersonalSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="mb-12">
            <span className="text-xs font-mono tracking-widest uppercase text-text-muted">
              Beyond Code
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              The person behind the engineer
            </h2>
          </div>
        </AnimatedSection>
        <div className="space-y-16">
          {personalSections.map((section, index) => (
            <AnimatedSection key={section.title} delay={index * 0.1}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className={index % 2 === 1 ? "md:order-2" : ""}>
                  <h3 className="text-xl font-semibold mb-3">
                    {section.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {section.description}
                  </p>
                </div>
                {section.images && section.images.length > 0 && (
                  <div className={index % 2 === 1 ? "md:order-1" : ""}>
                    <PhotoCarousel images={section.images} />
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/PersonalSection.tsx
git commit -m "feat: add personal section with BJJ, chess, and travel sub-sections"
```

---

### Task 8: Contact footer

**Files:**
- Create: `src/components/sections/ContactFooter.tsx`

- [ ] **Step 1: Create ContactFooter**

Create `src/components/sections/ContactFooter.tsx`:

```tsx
import { Github, Linkedin, Mail, FileText } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { contact } from "@/data/contact";

export default function ContactFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 px-4 border-t border-border">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatedSection>
          <h2 className="text-2xl font-bold mb-4">Get in touch</h2>
          <div className="flex items-center justify-center gap-8 mb-8">
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github size={24} />
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label="Email"
            >
              <Mail size={24} />
            </a>
            <a
              href={contact.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label="Resume"
            >
              <FileText size={24} />
            </a>
          </div>
          <p className="text-text-muted text-sm">
            &copy; {currentYear} Zacharia Hammad
          </p>
        </AnimatedSection>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/ContactFooter.tsx
git commit -m "feat: add contact footer with social links and resume download"
```

---

### Task 9: Compose the page

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/hero/StaticHero.tsx`
- Create: `src/components/hero/HeroContainer.tsx`

- [ ] **Step 1: Create StaticHero fallback**

Create `src/components/hero/StaticHero.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";

export default function StaticHero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle animated background */}
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
        className="text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.p
          className="text-xs font-mono tracking-[0.3em] uppercase text-text-muted mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Transistors → Logic → Architecture → Assembly → Code
        </motion.p>
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Zacharia Hammad
        </motion.h1>
        <motion.p
          className="text-xl text-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          Computer Engineer
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-text-muted to-transparent mx-auto"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Create HeroContainer**

Create `src/components/hero/HeroContainer.tsx`:

```tsx
"use client";

import dynamic from "next/dynamic";
import StaticHero from "./StaticHero";

const canvasEnabled =
  process.env.NEXT_PUBLIC_ENABLE_CANVAS_HERO === "true";

// Lazy load canvas hero only when enabled
const CanvasHero = canvasEnabled
  ? dynamic(() => import("./CanvasHero"), { ssr: false })
  : null;

export default function HeroContainer() {
  if (CanvasHero) {
    return <CanvasHero />;
  }
  return <StaticHero />;
}
```

- [ ] **Step 3: Create placeholder CanvasHero**

Create `src/components/hero/CanvasHero.tsx`:

```tsx
"use client";

// Placeholder — Three.js implementation comes in v2
export default function CanvasHero() {
  return null;
}
```

- [ ] **Step 4: Compose the full page**

Replace `src/app/page.tsx`:

```tsx
import HeroContainer from "@/components/hero/HeroContainer";
import IntroSection from "@/components/sections/IntroSection";
import LayerSection from "@/components/sections/LayerSection";
import PersonalSection from "@/components/sections/PersonalSection";
import ContactFooter from "@/components/sections/ContactFooter";
import ProjectCard from "@/components/cards/ProjectCard";
import ProfessionalCard from "@/components/cards/ProfessionalCard";
import AnimatedSection from "@/components/AnimatedSection";
import { getProjectsByLayer } from "@/data/projects";
import { professionalExperience } from "@/data/professional";
import { fetchAllGitHubStats } from "@/lib/github";
import { projects } from "@/data/projects";

export default async function Home() {
  // Fetch GitHub stats at build time
  const repoUrls = projects
    .map((p) => p.githubUrl)
    .filter((url): url is string => !!url);
  const githubStats = await fetchAllGitHubStats(repoUrls);

  const hardwareProjects = getProjectsByLayer("hardware");
  const systemsProjects = getProjectsByLayer("systems");
  const softwareProjects = getProjectsByLayer("software");

  return (
    <main>
      <HeroContainer />

      <IntroSection />

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
                  ? githubStats.get(project.githubUrl)
                  : null
              }
              accentColor="#4ade80"
            />
          </AnimatedSection>
        ))}
      </LayerSection>

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
                  ? githubStats.get(project.githubUrl)
                  : null
              }
              accentColor="#60a5fa"
            />
          </AnimatedSection>
        ))}
      </LayerSection>

      <LayerSection
        layerNumber={3}
        label="Software & AI"
        title={`"Now I write what runs on them"`}
        description="Production software, developer tools, and AI systems. Where I am today."
        accentColor="#c084fc"
      >
        {/* Professional experience — NDA-safe */}
        <div className="md:col-span-2 mb-6">
          <AnimatedSection>
            <h3 className="text-lg font-semibold text-text-secondary mb-4">
              Production Experience
            </h3>
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

        {/* Open source projects */}
        <div className="md:col-span-2">
          <AnimatedSection>
            <h3 className="text-lg font-semibold text-text-secondary mb-4 mt-4">
              Open Source
            </h3>
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
      </LayerSection>

      <PersonalSection />

      <ContactFooter />
    </main>
  );
}
```

- [ ] **Step 5: Verify the full page renders**

```bash
bun run dev
```

Expected — verify ALL of the following are visible and functional:
- [ ] StaticHero with "Transistors -> Logic -> Architecture -> Assembly -> Code" text, name, title, scroll indicator
- [ ] IntroSection with name, tagline, bio paragraph, 4 social links (GitHub, LinkedIn, Email, Resume)
- [ ] Layer 1 (Hardware) — green accent, 3 project cards (RISC-V, HACK CPU, ZRISC-32V)
- [ ] Layer 2 (Systems) — blue accent, 4 project cards (LC-3 VM, CHIP-8, Assembly, nanochat)
- [ ] Layer 3 (Software & AI) — purple accent, "Production Experience" with 5 cards + "Open Source" with 4 cards
- [ ] Personal section — BJJ with photo carousel (5 images, arrows work), Chess (text only), Travel with carousel (4 images)
- [ ] Contact footer — 4 icon links, copyright year
- [ ] Dark background (#0a0a0a) throughout
- [ ] Scroll animations trigger on viewport entry (elements fade in + slide up)

- [ ] **Step 6: Verify build succeeds**

```bash
bun run build
```

Expected: Static generation succeeds. GitHub API called at build time. No errors.

- [ ] **Step 7: Commit v1 page composition**

```bash
git add src/app/page.tsx src/components/hero/
git commit -m "feat: compose full portfolio page — hero, timeline layers, personal, contact

This is the v1 shippable portfolio. Canvas hero animation
will be layered on in v2 behind a feature flag."
```

---

## Chunk 3: Polish, Canvas Hero & Ship

### Task 10: Visual polish and responsive design

**Files:**
- Modify: `src/components/sections/LayerSection.tsx` (add background patterns)
- Modify: `src/app/globals.css` (add layer background utilities)
- Modify: Various components for responsive tweaks

- [ ] **Step 1: Add layer background patterns to globals.css**

Append to `src/app/globals.css`:

```css
.layer-hardware {
  background: linear-gradient(135deg, #0a0a0a 0%, #0a1a0a 100%);
}

.layer-systems {
  background: linear-gradient(135deg, #0a0a0a 0%, #0a0a1a 100%);
}

.layer-software {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 100%);
}
```

- [ ] **Step 2: Add background class prop to LayerSection**

Modify `src/components/sections/LayerSection.tsx` — add `backgroundClass` prop:

Add to the interface:
```typescript
backgroundClass?: string;
```

Change the `<section>` className to:
```tsx
<section className={`py-20 px-4 ${backgroundClass ?? ""}`}>
```

- [ ] **Step 3: Update page.tsx to pass background classes**

In `src/app/page.tsx`, add the `backgroundClass` prop to each `<LayerSection>`:

For Hardware section, change:
```tsx
<LayerSection
  layerNumber={1}
  label="Hardware"
```
to:
```tsx
<LayerSection
  layerNumber={1}
  label="Hardware"
  backgroundClass="layer-hardware"
```

For Systems section, change:
```tsx
<LayerSection
  layerNumber={2}
  label="Systems"
```
to:
```tsx
<LayerSection
  layerNumber={2}
  label="Systems"
  backgroundClass="layer-systems"
```

For Software section, change:
```tsx
<LayerSection
  layerNumber={3}
  label="Software & AI"
```
to:
```tsx
<LayerSection
  layerNumber={3}
  label="Software & AI"
  backgroundClass="layer-software"
```

- [ ] **Step 4: Test responsive layout on mobile viewports**

```bash
bun run dev
```

Open Chrome DevTools, test at 375px, 768px, 1024px widths. Verify:
- Text is readable at all sizes
- Cards stack single-column on mobile
- Carousels work on touch
- No horizontal overflow

- [ ] **Step 5: Commit polish**

```bash
git add -A
git commit -m "feat: add layer background gradients and responsive polish"
```

---

### Task 11: SEO and metadata

**Files:**
- Modify: `src/app/layout.tsx` (expand metadata)
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`

- [ ] **Step 1: Expand metadata in layout.tsx**

Update the `metadata` export in `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "Zacharia Hammad — Computer Engineer",
  description:
    "Computer Engineer building from transistors to interfaces. Hardware design, systems programming, and production software engineering.",
  keywords: [
    "computer engineer",
    "RISC-V",
    "CPU design",
    "Rust",
    "systems programming",
    "portfolio",
  ],
  authors: [{ name: "Zacharia Hammad" }],
  openGraph: {
    title: "Zacharia Hammad — Computer Engineer",
    description:
      "Computer Engineer building from transistors to interfaces.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zacharia Hammad — Computer Engineer",
    description:
      "Computer Engineer building from transistors to interfaces.",
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

- [ ] **Step 2: Create robots.ts**

Create `src/app/robots.ts`:

```typescript
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://zachariahammad.com/sitemap.xml",
  };
}
```

- [ ] **Step 3: Create sitemap.ts**

Create `src/app/sitemap.ts`:

```typescript
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://zachariahammad.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
```

- [ ] **Step 4: Commit SEO**

```bash
git add src/app/layout.tsx src/app/robots.ts src/app/sitemap.ts
git commit -m "feat: add SEO metadata, robots.txt, and sitemap"
```

---

### Task 12: Ship v1

- [ ] **Step 1: Final build verification**

```bash
bun run build && bun run start
```

Expected: Production build succeeds. Site runs on localhost:3000 with all sections. No console errors.

- [ ] **Step 2: Deploy to Vercel**

```bash
bunx vercel --prod
```

Or connect the GitHub repo to Vercel dashboard for automatic deploys.

- [ ] **Step 3: Tag v1 release**

```bash
git tag -a v1.0.0 -m "v1: Portfolio with static hero, timeline sections, personal section"
```

---

### Task 13: Canvas hero animation (v2) — SPIKE

> **This is a creative spike, not a standard implementation task.** The Three.js animation is iterative — each stage will require visual tuning that can't be fully specified upfront. This task provides the scaffolding and structure; the animation content is developed iteratively within that structure. **This should get its own mini-plan once v1 ships.**

**Files:**
- Modify: `src/components/hero/CanvasHero.tsx` (full implementation)
- Modify: `src/components/hero/HeroContainer.tsx` (spacers + capability detection)
- Modify: `.env.local` (enable flag)

- [ ] **Step 1: Install Three.js dependencies**

```bash
bun add three @react-three/fiber @react-three/drei
bun add -d @types/three
```

- [ ] **Step 2: Update HeroContainer with spacers and capability detection**

Replace `src/components/hero/HeroContainer.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
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
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    // Check viewport width (disable on mobile)
    if (window.innerWidth < 768) return;

    // Check WebGL support
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

export default function HeroContainer() {
  const capable = useCanvasCapability();

  if (CanvasHero && capable) {
    return (
      <div className="relative">
        {/* Sticky canvas occupies viewport */}
        <div className="sticky top-0 h-screen z-10">
          <CanvasHero />
        </div>
        {/* Spacer divs provide scroll distance for animation */}
        <div className="h-[400vh]" aria-hidden="true" />
      </div>
    );
  }

  return <StaticHero />;
}
```

- [ ] **Step 3: Implement CanvasHero scaffold with scroll tracking**

Replace `src/components/hero/CanvasHero.tsx`:

```tsx
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight * 4; // 400vh
      setProgress(Math.min(scrollY / maxScroll, 1));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

function AnimationScene() {
  const progress = useScrollProgress();

  // Stage boundaries
  const stage =
    progress < 0.2
      ? 1
      : progress < 0.4
        ? 2
        : progress < 0.6
          ? 3
          : progress < 0.8
            ? 4
            : 5;

  // TODO: Replace with actual stage-specific Three.js scenes.
  // Each stage should be its own component:
  //   - TransistorStage (0-0.2): MOSFET symbols, silicon traces, electrical paths
  //   - LogicGateStage (0.2-0.4): AND/OR/NOT gates forming, connecting wires
  //   - ChipStage (0.4-0.6): Functional blocks (ALU, REG, CACHE) in die layout
  //   - AssemblyStage (0.6-0.8): Dissolve to scrolling assembly text
  //   - CodeStage (0.8-1.0): Morph to syntax-highlighted source code
  //
  // For now, render a placeholder that proves scroll tracking works.

  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        color={
          stage === 1
            ? "#4ade80"
            : stage === 2
              ? "#60a5fa"
              : stage === 3
                ? "#f59e0b"
                : stage === 4
                  ? "#f87171"
                  : "#c084fc"
        }
        wireframe
      />
    </mesh>
  );
}

export default function CanvasHero() {
  const progress = useScrollProgress();

  return (
    <div
      className="w-full h-full"
      style={{ opacity: progress >= 1 ? 0 : 1, transition: "opacity 0.5s" }}
    >
      <Canvas camera={{ position: [0, 0, 5] }}>
        <AnimationScene />
      </Canvas>
    </div>
  );
}
```

This gives you a working scaffold: scroll-tracked canvas with stage detection and fade-out. The actual stage visuals are marked as TODOs and should be iterated on visually.

- [ ] **Step 4: Enable the feature flag and test scaffold**

Update `.env.local`:

```
NEXT_PUBLIC_ENABLE_CANVAS_HERO=true
```

Verify:
- Desktop: Canvas renders, wireframe cube changes color as you scroll through 5 stages
- At bottom of scroll distance: Canvas fades out, content sections visible
- Mobile (< 768px): Static hero shows instead
- With `prefers-reduced-motion`: Static hero shows

- [ ] **Step 5: Commit canvas scaffold**

```bash
git add -A
git commit -m "feat: add Three.js canvas hero scaffold with scroll tracking

Scroll-driven 5-stage animation framework. Currently renders
placeholder geometry — stage-specific scenes to be implemented
iteratively. Includes mobile/a11y fallback to static hero."
```

- [ ] **Step 6: Iterate on stage visuals (creative spike)**

This is the iterative part. For each stage, create a dedicated component file:
- `src/components/hero/stages/TransistorStage.tsx`
- `src/components/hero/stages/LogicGateStage.tsx`
- `src/components/hero/stages/ChipStage.tsx`
- `src/components/hero/stages/AssemblyStage.tsx`
- `src/components/hero/stages/CodeStage.tsx`

Each stage receives a `stageProgress` (0→1 within its own range) and renders its Three.js scene. Develop each visually, commit per stage. Target 60fps — profile on mid-range hardware.

- [ ] **Step 7: Final test and tag v2**

Test on multiple devices:
- Desktop Chrome/Firefox/Safari: Full animation smooth at 60fps
- Mobile: Static hero (canvas disabled)
- Keyboard/trackpad/mouse scroll: Animation tracks correctly
- Fast scroll: No janky frames
- `prefers-reduced-motion`: Static hero

```bash
git add -A
git commit -m "feat: complete canvas hero — transistor-to-code scroll animation"
git tag -a v2.0.0 -m "v2: Full canvas hero animation with fallback"
```
