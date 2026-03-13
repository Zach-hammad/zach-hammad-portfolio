import { personalSections } from "@/data/personal";
import AnimatedSection from "@/components/AnimatedSection";
import PhotoCarousel from "@/components/PhotoCarousel";

export default function PersonalSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="mb-12">
            <span className="text-xs font-mono tracking-widest uppercase text-text-muted">
              Beyond Code
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              The person behind the engineer
            </h2>
          </div>
        </AnimatedSection>
        <div className="space-y-16">
          {personalSections.map((section, index) => (
            <AnimatedSection key={section.title} delay={index * 0.1}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className={index % 2 === 1 ? "md:order-2" : ""}>
                  <h3 className="text-xl font-semibold mb-3">
                    {section.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {section.description}
                  </p>
                </div>
                {section.images && section.images.length > 0 && (
                  <div className={index % 2 === 1 ? "md:order-1" : ""}>
                    <PhotoCarousel images={section.images} />
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
