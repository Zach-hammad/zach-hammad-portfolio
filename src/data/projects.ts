import { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    slug: "apu",
    title: "Agent Processing Unit",
    description:
      "I’m building RepoToire’s Agent Processing Unit in Rust. It applies an instruction cycle to agent work: fetch an approved instruction, dispatch it, check the result, and retire its effects into machine state.",
    technologies: ["Rust", "Runtime systems", "Instruction sets"],
    githubUrl: "https://github.com/Zach-hammad/repotoire-v2",
    layer: "systems",
  },
  {
    slug: "risc-v",
    title: "RISC-V architecture",
    description:
      "Computer-architecture coursework in C simulation, exploring instruction execution, pipelining, and branch prediction.",
    technologies: ["C", "RISC-V", "Coursework"],
    githubUrl: "https://github.com/Zach-hammad/RISC-V",
    layer: "hardware",
  },
  {
    slug: "lc3-vm",
    title: "LC-3 virtual machine",
    description:
      "A 16-bit educational architecture implemented in C, with memory-mapped I/O and trap routines. A way to learn what an instruction actually asks the machine to do.",
    technologies: ["C", "Virtual machines", "ISA"],
    githubUrl: "https://github.com/Zach-hammad/lc3-vm",
    layer: "systems",
  },
  {
    slug: "chip-8-sim",
    title: "CHIP-8 emulator",
    description:
      "An interpreter for the classic virtual machine, built with Python and pygame. Instruction decoding, display state, and a hex-keypad interface.",
    technologies: ["Python", "Emulation", "pygame"],
    githubUrl: "https://github.com/Zach-hammad/chip_8_sim",
    layer: "systems",
  },
];

export function getProjectsByLayer(layer: Project["layer"]): Project[] {
  return projects.filter((project) => project.layer === layer);
}
