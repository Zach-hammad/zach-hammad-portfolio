# Portfolio Content Cut Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 11 entries in `src/data/projects.ts` with the curated set of 8 from the spec, keeping the 3-layer narrative unchanged.

**Architecture:** Single-file content edit. No new components, no type changes, no page-level changes. The build-time GitHub stats fetch (`src/lib/github.ts`) picks up new entries automatically via their `githubUrl` fields. Verification is TypeScript compile + visual smoke check in the dev server.

**Tech Stack:** TypeScript, Next.js 15, Bun.

**Spec:** `docs/superpowers/specs/2026-05-10-portfolio-content-cut-design.md`

---

## File Map

**Modified files:**

| File | Responsibility |
|------|---------------|
| `src/data/projects.ts` | Exported `projects: Project[]` array — sole source of truth for the open-source project cards rendered in `src/app/page.tsx`. After this plan, contains exactly 8 entries (2 hardware, 3 systems, 3 software). |

**Untouched (verify only):**
- `src/lib/types.ts` — `Project` interface unchanged.
- `src/lib/github.ts` — build-time GitHub stats fetch unchanged; new entries pulled in automatically.
- `src/app/page.tsx` — layer rendering unchanged.

---

## Task 1: Replace `src/data/projects.ts` with the curated set

**Files:**
- Modify: `src/data/projects.ts` (full file replacement)

- [ ] **Step 1: Verify the `Project` type contract (read-only)**

Read: `src/lib/types.ts`
Expected shape:
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
```

This is the contract every entry in `projects.ts` must satisfy. No new fields; no rename.

- [ ] **Step 2: Replace the contents of `src/data/projects.ts` with the curated 8 entries**

Write the entire file as follows (full replacement, not a partial edit):

```typescript
import { Project } from "@/lib/types";

export const projects: Project[] = [
  // Layer: Hardware
  {
    slug: "zrisc",
    title: "ZRISC-32V",
    description:
      "Custom 32-bit RISC processor with vector extensions in modern C++. Pipelining, hazards, caches, FMA — designed for ML workloads.",
    technologies: ["C++", "RISC", "Vector Extensions", "ML"],
    githubUrl: "https://github.com/Zach-hammad/zrisc",
    layer: "hardware",
  },
  {
    slug: "risc-v",
    title: "RISC-V CPU",
    description:
      "Pipelined RISC-V CPU in C with branch prediction, out-of-order execution, and a PC-signature hit predictor. Evolved from single-cycle to fully pipelined.",
    technologies: ["C", "RISC-V", "Pipelining", "Branch Prediction"],
    githubUrl: "https://github.com/Zach-hammad/RISC-V",
    layer: "hardware",
  },

  // Layer: Systems
  {
    slug: "nanochat-riscv",
    title: "nanochat-riscv",
    description:
      "Rust workspace (ISA / simulator / assembler / RTL) running a nanochat-style LLM on a custom RISC-V target.",
    technologies: ["Rust", "RISC-V", "LLM", "Simulator"],
    githubUrl: "https://github.com/Zach-hammad/nanochat-riscv",
    layer: "systems",
  },
  {
    slug: "lc3-vm",
    title: "LC-3 Virtual Machine",
    description:
      "16-bit educational architecture implemented in C. Memory-mapped I/O, trap routines; runs 2048 and Rogue.",
    technologies: ["C", "Virtual Machines", "Systems Programming"],
    githubUrl: "https://github.com/Zach-hammad/lc3-vm",
    layer: "systems",
  },
  {
    slug: "chip-8-sim",
    title: "CHIP-8 Emulator",
    description:
      "Python + pygame interpreter for the classic 8-bit virtual machine with full hex-keypad mapping.",
    technologies: ["Python", "Emulation", "Interpreters"],
    githubUrl: "https://github.com/Zach-hammad/chip_8_sim",
    layer: "systems",
  },

  // Layer: Software & AI
  {
    slug: "repotoire",
    title: "Repotoire",
    description:
      "Graph-powered code analysis CLI in pure Rust. 110+ detectors across 9 languages over a knowledge graph of the codebase. Single binary; ships via Homebrew and a GitHub Action.",
    technologies: ["Rust", "CLI", "Static Analysis", "Knowledge Graph"],
    githubUrl: "https://github.com/Zach-hammad/repotoire",
    layer: "software",
  },
  {
    slug: "tqvec",
    title: "tqvec",
    description:
      "Rust library for compressed approximate nearest-neighbor search. Implements TurboQuant (Zandieh et al., 2025) on a custom HNSW graph; ~8–14× memory reduction at 4-bit with 0.995+ cosine similarity.",
    technologies: ["Rust", "HNSW", "Quantization", "ANN"],
    githubUrl: "https://github.com/Zach-hammad/tqvec",
    layer: "software",
  },
  {
    slug: "zkip-stark",
    title: "zkip-stark",
    description:
      "Zero-knowledge IP-layer protocol experiment using STARK proofs, with a Lean 4 formalization and recursive proof support.",
    technologies: ["Rust", "ZK", "STARK", "Lean 4"],
    githubUrl: "https://github.com/Zach-hammad/zkip-stark",
    layer: "software",
  },
];

export function getProjectsByLayer(layer: Project["layer"]): Project[] {
  return projects.filter((p) => p.layer === layer);
}
```

Notes:
- The `getProjectsByLayer` helper is preserved verbatim — `src/app/page.tsx` imports it.
- The named export `projects` is preserved — `src/app/page.tsx` also imports it directly for the build-time GitHub stats fetch.
- Order within each layer mirrors the spec's "strongest first" intent: ZRISC before RISC-V (more ambitious + the YC-profile entry); nanochat-riscv before LC-3 before CHIP-8 (Rust workspace > 16-bit VM > Python emulator); Repotoire / tqvec / zkip-stark in that order.

- [ ] **Step 3: Verify TypeScript compiles with the new data**

Run from `~/personal/zach-hammad-portfolio`:
```bash
/opt/homebrew/bin/bun run build 2>&1 | tail -40
```

Expected: Build succeeds. Look for `✓ Compiled successfully` (or equivalent) near the end. No `Type error:` lines anywhere.

If the build fails on TypeScript: the most likely cause is a mismatch with the `Project` interface — re-check shape against Step 1. If the build fails on the GitHub stats fetch (rate limit, 404), that is non-blocking for type-correctness — see Step 4 fallback.

- [ ] **Step 4: Verify the page renders the new project list in the dev server**

The dev server is already running on `http://localhost:3030` (started earlier in this session — task `b2isf1kl8`). If it is not running, start it:
```bash
cd ~/personal/zach-hammad-portfolio && PORT=3030 /opt/homebrew/bin/bun run dev
```

Open `http://localhost:3030` in a browser and confirm:

1. **Hardware section** ("I started at the metal") shows exactly 2 cards: `ZRISC-32V`, then `RISC-V CPU`. No `HACK-CPU (Nand2Tetris)` card.
2. **Systems section** ("Then I built the machines") shows exactly 3 cards: `nanochat-riscv`, `LC-3 Virtual Machine`, `CHIP-8 Emulator`. No `Assembly Projects` card.
3. **Software & AI section** ("Now I write what runs on them") open-source subsection shows exactly 3 cards: `Repotoire`, `tqvec`, `zkip-stark`. No `AI Agent`, `TensorX`, or `Dragon Curve` cards.
4. Each card's description matches the text in Step 2.
5. The `DragonCurveBackground` is still visible as a fractal background overlay across the whole page.
6. GitHub stats render on cards where available. If `tqvec` or `zkip-stark` shows no stats it is acceptable for this task — the build-time fetcher gracefully handles missing data (the card just omits the stats badge).

If any of 1–5 fails: re-open `src/data/projects.ts` and verify the entry matches the code block in Step 2 exactly.

- [ ] **Step 5: Commit**

```bash
cd ~/personal/zach-hammad-portfolio && \
  git add src/data/projects.ts && \
  git commit -m "$(cat <<'EOF'
feat(data): curate project list to 8 strongest

Replaces the previous 11-entry list with the curated set defined in
docs/superpowers/specs/2026-05-10-portfolio-content-cut-design.md.

Added:
- tqvec (Rust HNSW + TurboQuant ANN library)
- zkip-stark (ZK-IP protocol with STARK proofs, Lean 4 formalization)

Removed:
- HACK-CPU, Assembly-Projects, ai_agent, tensorx, Dragon-Curve
  (Dragon-Curve is already used as the page background)

Updated descriptions and tech tags for the 6 retained entries to match
what the underlying repositories actually do.

Layer distribution: 3/4/4 → 2/3/3.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

Expected: One commit on `main`. `git status` shows a clean working tree.

---

## Self-Review

**Spec coverage:**

| Spec requirement | Covered by |
|------------------|-----------|
| Cut to 8 strongest projects | Step 2 (full file replacement) |
| Add tqvec | Step 2 — entry under Software layer |
| Add zkip-stark | Step 2 — entry under Software layer |
| Preserve 3-layer narrative | No changes to `page.tsx` or `LayerSection`; verified in Step 4 |
| No structural changes | File Map confirms only `src/data/projects.ts` is modified |
| Type safety | Step 1 reads the `Project` interface; Step 3 runs the build |
| GitHub stats picked up automatically for new entries | Step 4 item 6 |
| Layer taglines unchanged | Not modified by this plan (no edit to `page.tsx`) |

All spec requirements are covered. No gaps.

**Placeholder scan:** No "TBD", "TODO", "implement later", or "add appropriate X" — all steps contain the actual content.

**Type consistency:** Every entry in Step 2 matches the `Project` interface in `src/lib/types.ts` (Step 1). `getProjectsByLayer` signature is preserved verbatim. The named export `projects` and the helper export `getProjectsByLayer` are both used by `src/app/page.tsx` — both are present in the Step 2 replacement.
