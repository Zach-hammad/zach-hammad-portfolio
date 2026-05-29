import AnimatedSection from "@/components/AnimatedSection";
import { proofPillars } from "@/data/proof";

export default function ProofPillarsSection() {
  return (
    <section className="py-20 px-4 font-mono">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="mb-12">
            <div className="text-xs text-neutral-400 mb-6">
              {"// "}PROOF WALL
            </div>
            <h2 className="text-2xl md:text-3xl font-normal text-neutral-200 mb-3">
              AI systems, from product surface to metal
            </h2>
            <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
              Four ways to scan the work: product, retrieval, inference, and
              the systems foundation underneath it.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {proofPillars.map((pillar, index) => (
            <AnimatedSection key={pillar.title} delay={index * 0.08}>
              <div
                className="h-full border border-l-2 border-neutral-800 bg-neutral-950/40 hover:border-neutral-400 transition-colors duration-200"
                style={{ borderLeftColor: pillar.accentColor }}
              >
                <div className="px-4 py-2 border-b border-neutral-800 bg-neutral-900/50">
                  <h3 className="text-sm text-neutral-300">{pillar.title}</h3>
                </div>
                <div className="px-4 py-4">
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                    {pillar.claim}
                  </p>
                  <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-neutral-400">
                    {pillar.tokens.map((token) => (
                      <span key={token}>{token}</span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
