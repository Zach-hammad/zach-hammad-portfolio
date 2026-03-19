import { personalSections } from "@/data/personal";
import AnimatedSection from "@/components/AnimatedSection";
import PhotoCarousel from "@/components/PhotoCarousel";

export default function PersonalSection() {
  return (
    <section className="py-20 px-4 font-mono">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="mb-12">
            <div className="text-xs text-neutral-600 mb-6">
              {"// "}BEYOND CODE
            </div>
            <h2 className="text-2xl md:text-3xl font-normal text-neutral-200">
              The person behind the engineer
            </h2>
          </div>
        </AnimatedSection>
        <div className="space-y-16">
          {personalSections.map((section, index) => (
            <AnimatedSection key={section.title} delay={index * 0.1}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className={index % 2 === 1 ? "md:order-2" : ""}>
                  <h3 className="text-lg font-normal text-neutral-300 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {section.description}
                  </p>
                </div>
                {section.images && section.images.length > 0 && (
                  <div className={index % 2 === 1 ? "md:order-1" : ""}>
                    <div className="border border-neutral-800">
                      <PhotoCarousel images={section.images} />
                    </div>
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
