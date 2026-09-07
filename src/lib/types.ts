export interface Project {
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  layer: "hardware" | "systems" | "software";
}

export interface ProfessionalExperience {
  id: "computer-vision" | "ai-memory" | "voice-agents";
  area: string;
  category: string;
  description: string;
  summary: string;
  technologies: string[];
  flow: string[];
  notes: string[];
}

export interface PersonalPhoto {
  src: string;
  alt: string;
  fit?: "contain" | "cover";
  position?: string;
}

export interface PersonalSection {
  title: string;
  description: string;
  images?: PersonalPhoto[];
}

export interface GitHubStats {
  stars: number;
  language: string | null;
}
