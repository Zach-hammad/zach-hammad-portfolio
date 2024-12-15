import { Card } from "@/components/ui/card";
import { ExternalLink, Github } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  demoUrl?: string;
  codeUrl?: string;
}

const ProjectCard = ({
  title,
  description,
  technologies,
  imageUrl,
  demoUrl,
  codeUrl,
}: ProjectCardProps) => {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300 animate-slide-up">
      <div className="aspect-video overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-primary-dark mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-primary-light text-primary rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-4">
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
            >
              <ExternalLink size={16} />
              Live Demo
            </a>
          )}
          {codeUrl && (
            <a
              href={codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
            >
              <Github size={16} />
              View Code
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;