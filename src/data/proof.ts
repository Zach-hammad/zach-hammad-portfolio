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
