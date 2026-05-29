import { ProfessionalExperience } from "@/lib/types";

export const professionalExperience: ProfessionalExperience[] = [
  {
    area: "Real-Time Video Processing",
    description:
      "Built GPU-accelerated video processing paths for production inference workloads.",
    technologies: ["TensorRT", "DeepStream", "Python", "CUDA"],
  },
  {
    area: "Knowledge Graph Systems",
    description:
      "Designed entity mapping and relationship layers for AI systems that need durable context.",
    technologies: ["Neo4j", "Python", "Rust", "Graph Algorithms"],
  },
  {
    area: "Full-Stack Product Systems",
    description:
      "Built dashboard and workflow surfaces that connect AI capabilities to real users.",
    technologies: ["Next.js", "TypeScript", "Turborepo", "Monorepo"],
  },
  {
    area: "Infrastructure & GitOps",
    description:
      "Maintained deployment paths for production services with repeatable infrastructure workflows.",
    technologies: ["Kubernetes", "ArgoCD", "GitHub Actions", "Doppler"],
  },
  {
    area: "Edge AI Deployment",
    description:
      "Deployed model workloads to constrained hardware with hardware-accelerated inference.",
    technologies: ["Hailo", "Raspberry Pi", "Python", "TensorRT"],
  },
];
