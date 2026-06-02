import { contact } from "@/data/contact";

export interface ResumeSkillGroup {
  label: string;
  items: string[];
}

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
  result?: string;
}

export const resume = {
  name: "Zacharia Hammad",
  title: "Full Stack Software Engineer",
  focus:
    "Secure AI Workflows | Knowledge Graphs | Agentic Interfaces | Event-Driven Architecture | Security",
  details: [
    "Washington, DC Area",
    "U.S. Citizen",
    contact.email,
    "zachariahammad.com",
    "linkedin.com/in/zach-hammad",
    "github.com/Zach-hammad",
  ],
  summary:
    "Full Stack Software Engineer building secure AI workflow systems across Python/FastAPI services, React/TypeScript interfaces, event-driven infrastructure, LLM knowledge graphs, RAG/search, and human-in-the-loop product surfaces. Experience with multi-tenant authorization, audit logging, source-attributed evidence workflows, transactional event delivery, DLQ/replay, and production security hardening.",
  skillGroups: [
    {
      label: "Languages",
      items: ["Python", "TypeScript", "JavaScript", "Rust", "SQL"],
    },
    {
      label: "Core stack",
      items: [
        "FastAPI",
        "React 19",
        "Next.js",
        "PostgreSQL",
        "Neo4j",
        "Kafka/Redpanda",
        "Redis",
      ],
    },
    {
      label: "AI systems",
      items: [
        "Claude",
        "OpenAI APIs",
        "Codex-assisted development",
        "RAG",
        "LightRAG",
        "Graphiti",
        "vector retrieval",
        "knowledge graphs",
        "tool-calling agents",
        "human-in-the-loop workflows",
      ],
    },
    {
      label: "Reliability",
      items: [
        "transactional outbox",
        "DLQs",
        "replay workflows",
        "idempotent processing",
        "retries",
        "circuit breakers",
        "cross-language event contracts",
      ],
    },
    {
      label: "Security",
      items: [
        "multi-tenant isolation",
        "Postgres RLS",
        "HMAC event signing",
        "service auth",
        "Cypher-injection hardening",
        "PII redaction",
        "audit logging",
      ],
    },
  ] satisfies ResumeSkillGroup[],
  experience: [
    {
      role: "Software Engineer",
      organization: "Visionary Solutions",
      period: "Aug 2025 - Present",
      bullets: [
        "Independently developed a multimodal evidence-processing platform used in enterprise/government-facing customer demos, spanning GPU inference, entity resolution, event-driven delivery, chain-of-custody workflows, and multi-tenant API surfaces.",
        "Designed graph/RAG infrastructure that became the core intelligence layer for customer-facing AI SaaS workflows, powering entity resolution, temporal modeling, graph search, and graph-backed user context.",
        "Built an LLM-powered investigation assistant with Next.js, Claude/OpenAI APIs, 40+ tool-calling actions, source-linked evidence workflows, graph analytics, and human-in-the-loop write confirmation.",
        "Engineered cross-service reliability through signed events, transactional outbox delivery, DLQs, replay workflows, idempotent processing, retries, circuit breakers, and cross-language event contracts.",
        "Hardened multi-tenant security across services with org-scoped isolation, Postgres RLS, Neo4j tenant keys, service authentication, Cypher-injection fixes, PII redaction, and audit remediation.",
        "Built React/TypeScript AI product workflows now rolling out to customers, integrating LLM chat, voice agents, Bayesian scoring, event consumers, and graph-backed context.",
      ],
    },
    {
      role: "Unmanned Aerial Systems Engineering Co-op",
      organization: "PECO / Exelon",
      period: "Sept 2023 - Mar 2024",
      bullets: [
        "Engineered Python automation with Pandas and API integrations, reducing reporting time from two hours to under 30 minutes while improving analytics accuracy.",
        "Built Power BI dashboards for drone quality KPIs and optimized Python/Excel/Power BI data flows, cutting processing time by 75% and improving data accuracy by 20%.",
      ],
    },
    {
      role: "Engineering Co-op",
      organization: "NAVSEA",
      period: "Sept 2022 - Mar 2023",
      bullets: [
        "Improved submarine simulation algorithms and sensor modeling while documenting electrical/mechanical workflows for gas-sensor and chamber systems.",
      ],
    },
    {
      role: "Research and Development Co-op",
      organization: "Saint-Gobain",
      period: "Sept 2021 - Mar 2022",
      bullets: [
        "Led Python/MATLAB analytics and statistical modeling for materials experiments, identifying process improvements and potential 50% cost savings.",
      ],
    },
  ] satisfies ResumeExperience[],
  projects: [
    {
      name: "Repotoire",
      stack: "Rust, Code Graphs, Static Analysis",
      description:
        "Built a Rust code-intelligence CLI that models repositories as knowledge graphs to catch duplicate logic, dependency cycles, security issues, and architectural drift.",
      result:
        "Adopted internally at Visionary Solutions as a developer testing tool.",
    },
    {
      name: "ML Pothole Detection System",
      stack: "Python, YOLO, Raspberry Pi, PostgreSQL",
      description:
        "Built an AI road-defect detection system combining YOLO edge inference, GPS-tagged capture, backend APIs, PostgreSQL, object storage, and a geospatial dashboard.",
      result: "Won Drexel Senior Design Championship.",
    },
    {
      name: "SyncSphere Console",
      stack: "Python, ML Ranking, Event Ingestion",
      description:
        "Built a hackathon-winning ML event recommendation platform using clustering and ranking to personalize HR engagement.",
      result: "Won the Wexford Challenge at Philly CodeFest 2025.",
    },
  ] satisfies ResumeProject[],
  education: {
    school: "Drexel University",
    degree: "Bachelor of Science in Computer Engineering, Minor in Data Science",
    detail: "GPA: 3.7 | June 2025",
  },
} as const;
