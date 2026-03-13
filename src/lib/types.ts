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
  area: string;
  description: string;
  technologies: string[];
}

export interface PersonalSection {
  title: string;
  description: string;
  images?: { src: string; alt: string }[];
}

export interface GitHubStats {
  stars: number;
  language: string | null;
}
