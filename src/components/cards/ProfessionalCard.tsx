import { ProfessionalExperience } from "@/lib/types";

interface ProfessionalCardProps {
  experience: ProfessionalExperience;
  accentColor: string;
}

export default function ProfessionalCard({
  experience,
  accentColor,
}: ProfessionalCardProps) {
  return (
    <div className="group border border-neutral-800 hover:border-neutral-600 transition-colors duration-200 font-mono">
      {/* Terminal-style title bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-900/50">
        <span className="text-sm text-neutral-300">
          {experience.area}
        </span>
        <span className="text-[10px] text-neutral-600 tracking-wider">
          PROD
        </span>
      </div>
      {/* Body */}
      <div className="px-4 py-3">
        <p className="text-xs text-neutral-500 leading-relaxed mb-3">
          {experience.description}
        </p>
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs">
          {experience.technologies.map((tech) => (
            <span
              key={tech}
              className="text-neutral-600"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
