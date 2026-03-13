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
