import { ProfessionalExperience } from "@/lib/types";

export const professionalExperience: ProfessionalExperience[] = [
  {
    area: "Real-Time Video Processing",
    description:
      "Designed and built a real-time video processing pipeline for production deployment.",
    technologies: ["TensorRT", "DeepStream", "Python", "CUDA"],
  },
  {
    area: "Knowledge Graph System",
    description:
      "Architected a knowledge graph with entity fingerprinting and relationship mapping.",
    technologies: ["Neo4j", "Python", "Rust", "Graph Algorithms"],
  },
  {
    area: "Educational Platform",
    description:
      "Developed a full-stack educational platform with gamification and knowledge tracking.",
    technologies: ["Next.js", "Turborepo", "TypeScript", "Monorepo"],
  },
  {
    area: "Infrastructure & GitOps",
    description:
      "Built and maintained production Kubernetes infrastructure with GitOps workflows.",
    technologies: ["k3s", "ArgoCD", "Harbor", "GitHub Actions", "Doppler"],
  },
  {
    area: "Edge AI Deployment",
    description:
      "Deployed ML models to edge hardware with hardware-accelerated inference.",
    technologies: ["Hailo", "Raspberry Pi", "Python", "TensorRT"],
  },
];
