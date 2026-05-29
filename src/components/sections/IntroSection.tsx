import AnimatedSection from "@/components/AnimatedSection";
import { roleIdentity } from "@/data/proof";

export default function IntroSection() {
  return (
    <section className="py-24 px-4 font-mono">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatedSection>
          <div className="text-xs text-neutral-400 mb-6">
            {"// "}POSITIONING
          </div>
          <h2 className="text-3xl md:text-5xl font-normal mb-6 text-neutral-100 tracking-tight">
            Systems depth for production AI
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <p className="text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {roleIdentity.intro}
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
