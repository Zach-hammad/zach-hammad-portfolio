import { Project, GitHubStats } from "@/lib/types";
import { ArrowUpRight } from "lucide-react";
import ProjectArchitectureDiagram from "@/components/ProjectArchitectureDiagram";

interface ProjectCardProps {
  project: Project;
  stats?: GitHubStats | null;
  accentColor: string;
}

export default function ProjectCard({
  project,
  accentColor,
}: ProjectCardProps) {
  return (
    <article id={project.slug} className="project-card" style={{ borderLeftColor: accentColor }}>
      <div className="project-card-copy">
        <div className="project-card-heading">
          <h3>{project.title}</h3>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} source on GitHub`}
              className="icon-link"
            >
              <ArrowUpRight size={20} aria-hidden="true" />
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.title} demo`}
              className="text-link"
            >
              Demo <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
        </div>
        <p>{project.description}</p>
        <ul
          className="technology-list"
          aria-label={`${project.title} technologies`}
        >
          {project.technologies.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </div>
      <ProjectArchitectureDiagram projectSlug={project.slug} projectTitle={project.title} />
    </article>
  );
}
