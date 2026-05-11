# Portfolio Content Cut — Design Spec

**Date:** 2026-05-10
**Status:** Approved
**Scope:** Replace the project list in `src/data/projects.ts` with a curated set of 8 strongest projects across the existing 3-layer narrative. No structural, component, or page-level changes.

## Problem

`src/data/projects.ts` currently contains 11 entries spanning hardware / systems / software. The set is stale relative to what the user's portfolio should signal:

1. Several entries have weak, generic descriptions that undersell the underlying work (e.g., Repotoire described as "Code health analysis CLI and MCP server. Shipped via Homebrew tap." vs. its actual scope of 110+ detectors across 9 languages over a knowledge graph).
2. **tqvec** — implementing TurboQuant (Zandieh et al., 2025) on a custom HNSW graph in Rust — is missing despite being one of the user's strongest projects and already featured on their YC profile.
3. **zkip-stark** — a zero-knowledge IP-layer protocol experiment with a Lean 4 formalization — is missing.
4. Several entries are redundant or thin: `HACK-CPU` overlaps with the two RISC CPU projects; `Assembly-Projects` is a grab-bag with no distinguishing technical claim; `ai_agent` and `tensorx` are described in vague single sentences; `Dragon-Curve` is already used as the page background, so featuring it as a card too is redundant.

## Goals

1. Cut to 8 strongest projects with concrete, technically-specific descriptions.
2. Add the two missing strong entries (tqvec, zkip-stark).
3. Preserve the existing 3-layer narrative (hardware → systems → software & AI) and its visual treatment.
4. No structural changes — page-level layout, components, and styling stay as-is.

## Non-Goals

- No changes to `src/app/page.tsx`, `LayerSection`, `ProjectCard`, `ProfessionalCard`, or any other component.
- No changes to the hero canvas, dragon-curve background, intro section, personal section, or contact footer.
- No changes to the build-time GitHub stats fetch (`src/lib/github.ts`); new entries are pulled in automatically via their `githubUrl` field.
- No work on the in-flight parallax scroll experience (separate spec at `docs/superpowers/specs/2026-03-15-parallax-scroll-experience-design.md`).
- No changes to layer titles, taglines, descriptions, or accent colors.
- No new fields on the `Project` type.

## Design

### Final Project List

#### Hardware (`layer: "hardware"`, accent `#4ade80`)

1. **ZRISC-32V** — `slug: zrisc`
   - Description: Custom 32-bit RISC processor with vector extensions in modern C++. Pipelining, hazards, caches, FMA — designed for ML workloads.
   - Tech: `C++`, `RISC`, `Vector Extensions`, `ML`
   - URL: `https://github.com/Zach-hammad/zrisc`

2. **RISC-V CPU** — `slug: risc-v`
   - Description: Pipelined RISC-V CPU in C with branch prediction, out-of-order execution, and a PC-signature hit predictor. Evolved from single-cycle to fully pipelined.
   - Tech: `C`, `RISC-V`, `Pipelining`, `Branch Prediction`
   - URL: `https://github.com/Zach-hammad/RISC-V`

#### Systems (`layer: "systems"`, accent `#60a5fa`)

3. **nanochat-riscv** — `slug: nanochat-riscv`
   - Description: Rust workspace (ISA / simulator / assembler / RTL) running a nanochat-style LLM on a custom RISC-V target.
   - Tech: `Rust`, `RISC-V`, `LLM`, `Simulator`
   - URL: `https://github.com/Zach-hammad/nanochat-riscv`

4. **LC-3 Virtual Machine** — `slug: lc3-vm`
   - Description: 16-bit educational architecture implemented in C. Memory-mapped I/O, trap routines; runs 2048 and Rogue.
   - Tech: `C`, `Virtual Machines`, `Systems Programming`
   - URL: `https://github.com/Zach-hammad/lc3-vm`

5. **CHIP-8 Emulator** — `slug: chip-8-sim`
   - Description: Python + pygame interpreter for the classic 8-bit virtual machine with full hex-keypad mapping.
   - Tech: `Python`, `Emulation`, `Interpreters`
   - URL: `https://github.com/Zach-hammad/chip_8_sim`

#### Software & AI (`layer: "software"`, accent `#c084fc`)

6. **Repotoire** — `slug: repotoire`
   - Description: Graph-powered code analysis CLI in pure Rust. 110+ detectors across 9 languages over a knowledge graph of the codebase. Single binary; ships via Homebrew and a GitHub Action.
   - Tech: `Rust`, `CLI`, `Static Analysis`, `Knowledge Graph`
   - URL: `https://github.com/Zach-hammad/repotoire`

7. **tqvec** — `slug: tqvec`
   - Description: Rust library for compressed approximate nearest-neighbor search. Implements TurboQuant (Zandieh et al., 2025) on a custom HNSW graph; ~8–14× memory reduction at 4-bit with 0.995+ cosine similarity.
   - Tech: `Rust`, `HNSW`, `Quantization`, `ANN`
   - URL: `https://github.com/Zach-hammad/tqvec`

8. **zkip-stark** — `slug: zkip-stark`
   - Description: Zero-knowledge IP-layer protocol experiment using STARK proofs, with a Lean 4 formalization and recursive proof support.
   - Tech: `Rust`, `ZK`, `STARK`, `Lean 4`
   - URL: `https://github.com/Zach-hammad/zkip-stark`

### Entries to Remove

The following 5 entries are removed from `src/data/projects.ts`:

| Slug | Reason |
|------|--------|
| `hack-cpu` | Redundant — RISC-V and ZRISC-32V already cover hardware CPU work at higher technical depth. |
| `assembly-projects` | Grab-bag with no distinguishing technical claim. |
| `ai-agent` | Vague description, weak signal. |
| `tensorx` | Vague description, weak signal. |
| `dragon-curve` | Already rendered as the page background (`DragonCurveBackground.tsx`); having it as a card too is redundant. |

### Layer Taglines

The existing taglines in `src/app/page.tsx` are unchanged and still fit:

- Hardware: *"I started at the metal"* — "Designing CPUs, implementing architectures from first principles. Where I learned how computers actually work."
- Systems: *"Then I built the machines"* — "Virtual machines, simulators, assembly. The layer between hardware and software."
- Software & AI: *"Now I write what runs on them"* — "Production software, developer tools, and AI systems. Where I am today."

The Systems-layer description mentions "assembly"; while `Assembly-Projects` is being dropped, LC-3 programming is essentially assembly, so the wording remains accurate. The Software-layer description mentions "AI systems"; tqvec is core AI infrastructure (vector search), so the wording remains accurate.

## Implementation Scope

Single-file edit: `src/data/projects.ts`. ~106 lines → ~85 lines.

- Remove the 5 dropped entries listed above.
- Update the descriptions and tech-tag lists for the 6 retained entries (zrisc, risc-v, nanochat-riscv, lc3-vm, chip-8-sim, repotoire) to match the design above.
- Add 2 new entries (tqvec, zkip-stark).

No changes to any other file. The build-time GitHub stats fetch (`fetchAllGitHubStats` in `src/lib/github.ts`) picks up the new entries automatically via their `githubUrl` fields.

## Risk Surface

Minimal.

- **Type safety:** The build type-checks all entries against `Project` in `src/lib/types.ts`. No new fields are introduced; existing entries already use the required shape.
- **GitHub stats fetch:** Two new public repos (tqvec, zkip-stark) will be hit at build time. Both are confirmed to exist under `Zach-hammad`.
- **Page layout:** Card counts per layer go 3 → 2 (Hardware: drop HACK-CPU), 4 → 3 (Systems: drop Assembly-Projects), 4 → 3 (Software: drop ai_agent, tensorx, Dragon-Curve; add tqvec, zkip-stark). Total 11 → 8. Hardware reads slightly tighter than the other layers; still reads as three discrete sections, and `LayerSection` renders cleanly with 2 cards.

## Verification

After implementation:

1. `npx next build` (or `bun run build`) compiles without TypeScript errors.
2. `bun run dev` and load the site — confirm all 8 cards render in their correct layers with the new descriptions, and that the 5 dropped entries no longer appear.
3. Confirm GitHub stats render on cards for tqvec and zkip-stark (or gracefully omit if the build-time fetch can't reach them).

## Out of Scope (Follow-up Work)

- Parallax scroll experience — separate spec; not addressed here.
- Description copy for the `ProfessionalCard` entries — not touched.
- `IntroSection`, `PersonalSection`, `ContactFooter` content — not touched.
- Adding new `Project` fields (e.g., live demo URL, blog post, paper link) — deliberately deferred.
