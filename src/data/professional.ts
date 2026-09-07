import { ProfessionalExperience } from "@/lib/types";

export const professionalExperience: ProfessionalExperience[] = [
  {
    id: "computer-vision",
    area: "Computer Vision",
    category: "COMPUTER VISION",
    description: "From training the model to following an object through video.",
    summary:
      "Owned a computer-vision product from data sourcing and labeling through YOLO training, ONNX export, inference integration, and the user-facing application.",
    technologies: ["Python", "YOLO", "ONNX", "DeepStream", "MLflow"],
    flow: ["Video", "Inference", "Application"],
    notes: [
      "Developed model training and evaluation workflows, with experiment tracking and release tooling.",
      "Connected video inference and object tracking to an application that lets users inspect results.",
      "Improved streaming reliability, including backpressure, failure handling, and clean shutdown.",
    ],
  },
  {
    id: "ai-memory",
    area: "AI Memory",
    category: "AI MEMORY & RETRIEVAL",
    description:
      "Conversation memory you can trace back to its source.",
    summary:
      "Built graph-based infrastructure that connects information across conversations and makes useful context available to AI applications.",
    technologies: ["Python", "Neo4j", "LLM extraction", "Evaluation"],
    flow: ["Evidence", "Identity", "Context"],
    notes: [
      "Developed Python pipelines that turn conversation text into structured information while retaining its source.",
      "Built evaluation tooling for retrieval quality, identity matching, and access boundaries.",
    ],
  },
  {
    id: "voice-agents",
    area: "Voice Agents",
    category: "AI PRODUCT ENGINEERING",
    description:
      "From a spoken request to a useful action.",
    summary:
      "Built voice-agent integrations that connect conversations to application tools, with caller context and access checks around each action.",
    technologies: ["TypeScript", "Vapi", "OpenAI Realtime", "PostgreSQL"],
    flow: ["Conversation", "Tool action", "Delivery"],
    notes: [
      "Integrated Vapi and OpenAI Realtime with TypeScript tools for search, scheduling, and other application actions.",
      "Worked on reliable event delivery and keeping context consistent across services.",
    ],
  },
];
