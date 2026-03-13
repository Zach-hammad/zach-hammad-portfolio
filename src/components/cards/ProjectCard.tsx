import { Project, GitHubStats } from "@/lib/types";
import { Github, ExternalLink, Star } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  stats?: GitHubStats | null;
  accentColor: string;
}

export default function ProjectCard({
  project,
  stats,
  accentColor,
}: ProjectCardProps) {
  return (
    <div className="bg-card rounded-lg p-6 border border-border hover:border-opacity-50 transition-colors">
      <h3 className="text-xl font-semibold text-text-primary mb-2">
        {project.title}
      </h3>
      <p className="text-text-secondary text-sm mb-4">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="px-2 py-1 rounded text-xs"
            style={{
              backgroundColor: `${accentColor}15`,
              color: accentColor,
            }}
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4 text-sm">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-text-muted hover:text-text-primary transition-colors"
          >
            <Github size={14} />
            Code
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-text-muted hover:text-text-primary transition-colors"
          >
            <ExternalLink size={14} />
            Demo
          </a>
        )}
        {stats && stats.stars > 0 && (
          <span className="flex items-center gap-1 text-text-muted">
            <Star size={14} />
            {stats.stars}
          </span>
        )}
      </div>
    </div>
  );
}
