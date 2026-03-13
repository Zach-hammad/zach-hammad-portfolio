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
    <div className="bg-card rounded-lg p-6 border border-border">
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {experience.area}
      </h3>
      <p className="text-text-secondary text-sm mb-4">
        {experience.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {experience.technologies.map((tech) => (
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
    </div>
  );
}
