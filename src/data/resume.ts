import { contact } from "@/data/contact";

export interface ResumeExperience {
  role: string;
  organization: string;
  period: string;
  bullets: string[];
}

export interface ResumeProject {
  name: string;
  stack: string;
  description: string;
}

export const resume = {
  name: "Zacharia Hammad",
  title: "Software Engineer | AI Products & Developer Tools",
  summary:
    "Software engineer building AI products and developer tools in Python, TypeScript, and Rust, with experience in computer vision, voice agents, and graph-backed applications.",
  details: ["Washington, DC Area", contact.email],
  skillGroups: [
    {
      label: "Languages",
      items: ["Python", "TypeScript", "JavaScript", "Rust", "SQL", "Tcl"],
    },
    {
      label: "Frameworks and APIs",
      items: [
        "React",
        "Next.js",
        "FastAPI",
        "LLM APIs",
        "VAPI",
        "OpenAI Realtime",
      ],
    },
    {
      label: "Data and ML",
      items: [
        "PostgreSQL",
        "Neo4j",
        "Kafka",
        "YOLO",
        "ONNX",
        "NVIDIA DeepStream",
        "MLflow",
      ],
    },
  ],
  experience: [
    {
      role: "Software Engineer",
      organization: "Visionary Solutions",
      period: "Aug 2025 - Present",
      bullets: [
        "Owned computer-vision product development across data sourcing, labeling, model training, and the user-facing application.",
        "Implemented shared TypeScript tool execution for VAPI and OpenAI Realtime voice agents, tying actions to verified caller identities.",
        "Built Neo4j identity matching and conversation context with access controls for AI applications.",
        "Developed YOLO/ONNX training and release tooling with MLflow tracking, evaluation, and model promotion and rollback; integrated NVIDIA DeepStream inference.",
        "Implemented event delivery between services using PostgreSQL and Kafka.",
      ],
    },
    {
      role: "UAS Engineering Co-op",
      organization: "PECO / Exelon",
      period: "Sep 2023 - Mar 2024",
      bullets: [
        "Automated drone reports with Python and APIs, reducing preparation time from two hours to under 30 minutes.",
      ],
    },
    {
      role: "Engineering Co-op",
      organization: "NAVSEA",
      period: "Sep 2022 - Mar 2023",
      bullets: [
        "Improved submarine simulation algorithms and sensor models; documented gas-sensor workflows.",
      ],
    },
    {
      role: "Research and Development Co-op",
      organization: "Saint-Gobain",
      period: "Sep 2021 - Mar 2022",
      bullets: [
        "Analyzed materials experiments with Python, MATLAB, and statistics to identify process improvements.",
      ],
    },
  ] satisfies ResumeExperience[],
  projects: [
    {
      name: "RepoToire",
      stack: "Rust and Quint",
      description:
        "Developed a Rust runtime prototype for AI coding agents with validated execution plans, staged execution, bounded retries, and Quint-to-Rust conformance tests.",
    },
    {
      name: "ML Pothole Detection System",
      stack: "Drexel Senior Design",
      description:
        "Developed YOLO edge inference with GPS-tagged capture, backend APIs, PostgreSQL, and a geospatial dashboard for a Drexel Senior Design Championship-winning team project.",
    },
    {
      name: "ASIC Design Optimization",
      stack: "Drexel Course Project",
      description:
        "Adapted Tcl scripts for Synopsys design flows in a two-person course project, comparing timing and area across five benchmark circuits using SkyWater and ASAP7 libraries.",
    },
  ] satisfies ResumeProject[],
  education: {
    school: "Drexel University",
    period: "Jun 2025",
    degree: "B.S. Computer Engineering",
    minor: "Minor in Data Science",
    gpa: "3.69",
  },
  certifications: [
    { name: "Neo4j Certified Professional", period: "Aug 2026" },
  ],
} as const;
