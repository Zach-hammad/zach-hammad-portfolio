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
