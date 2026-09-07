import { contact } from "@/data/contact";

export interface FastPathLink {
  label: string;
  href: string;
  ariaLabel: string;
  external?: boolean;
}

export const roleIdentity = {
  eyebrow: "Software engineer · AI products & systems",
  name: "Zacharia Hammad",
  systemsLine: "Product → Intelligence → Runtime → Architecture",
  lead: "At Visionary Solutions, I work on computer vision, knowledge graphs, and voice agents. Outside work, I’m building an AI-agent runtime in Rust.",
  intro:
    "I studied computer engineering at Drexel. My work spans ML pipelines and product interfaces; my personal projects explore runtimes and processor design.",
  footerLine: "Get in touch.",
} as const;

export const proofPillars = [
  {
    title: "AI products",
    claim: "Computer vision, voice agents, and knowledge graphs.",
    tokens: ["Python", "TypeScript", "ML"],
    accentColor: "var(--accent)",
  },
  {
    title: "Runtime systems",
    claim: "Execution, state, and what happens when things fail.",
    tokens: ["Rust", "Quint", "Pipelines"],
    accentColor: "var(--accent)",
  },
  {
    title: "Computer architecture",
    claim: "From instruction sets to timing and area tradeoffs.",
    tokens: ["RISC-V", "Tcl", "ASIC"],
    accentColor: "var(--brass)",
  },
] as const;

export const fastPathLinks: FastPathLink[] = [
  ...(contact.resume
    ? [
        {
          label: "résumé",
          href: contact.resume,
          ariaLabel: "Open Zacharia Hammad resume",
        },
      ]
    : []),
  {
    label: "GitHub",
    href: contact.github,
    ariaLabel: "Open Zacharia Hammad GitHub profile",
    external: true,
  },
  {
    label: "LinkedIn",
    href: contact.linkedin,
    ariaLabel: "Open Zacharia Hammad LinkedIn profile",
    external: true,
  },
  {
    label: "Email",
    href: `mailto:${contact.email}`,
    ariaLabel: "Email Zacharia Hammad",
  },
];

export const flagshipCaseStudy = {
  title: "RepoToire",
  subtitle: "A runtime for AI coding agents.",
  problem:
    "An agent can propose a change. Deciding what may execute, what counts as success, and when to stop needs a clearer contract.",
  approach:
    "I’m building a Rust runtime around an instruction set for coding agents. Codebase context informs a Goal Program; a compiler turns that program into an executable. Approval is tied to that exact image before the runtime admits it.",
  result:
    "Conformance tests replay Quint traces against the Rust runtime and compare the execution stage, instruction, and Machine state.",
  proof: ["Rust", "Quint", "Code intelligence", "Runtime prototype"],
} as const;
