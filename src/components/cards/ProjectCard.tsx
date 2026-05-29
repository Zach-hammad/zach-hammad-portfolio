import { Project, GitHubStats } from "@/lib/types";
import { Star } from "lucide-react";

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
    <div
      className="group border border-l-2 border-neutral-800 hover:border-neutral-400 transition-colors duration-200 font-mono"
      style={{ borderLeftColor: accentColor }}
    >
      {/* Terminal-style title bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-900/50">
        <span className="text-sm text-neutral-300">
          {project.title}
        </span>
        <div className="flex items-center gap-3 text-xs text-neutral-400">
          {stats && stats.stars > 0 && (
            <span className="flex items-center gap-1">
              <Star size={10} />
              {stats.stars}
            </span>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} source on GitHub`}
              className="hover:text-neutral-100 transition-colors"
            >
              [src]
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.title} demo`}
              className="hover:text-neutral-100 transition-colors"
            >
              [demo]
            </a>
          )}
        </div>
      </div>
      {/* Body */}
      <div className="px-4 py-3">
        <p className="text-xs text-neutral-400 leading-relaxed mb-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="text-neutral-400"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
