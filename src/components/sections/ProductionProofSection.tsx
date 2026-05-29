import AnimatedSection from "@/components/AnimatedSection";
import ProfessionalCard from "@/components/cards/ProfessionalCard";
import { professionalExperience } from "@/data/professional";

export default function ProductionProofSection() {
  return (
    <section className="py-20 px-4 font-mono">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="mb-12">
            <div className="text-xs text-neutral-400 mb-6">
              {"// "}NDA-SAFE PRODUCTION
            </div>
            <h2 className="text-2xl md:text-3xl font-normal text-neutral-200 mb-3">
              Production systems without private details
            </h2>
            <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
              High-level proof from real work: inference, knowledge systems,
              product surfaces, infrastructure, and edge deployment.
            </p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {professionalExperience.map((experience, index) => (
            <AnimatedSection key={experience.area} delay={index * 0.08}>
              <ProfessionalCard
                experience={experience}
                accentColor="#c084fc"
              />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
