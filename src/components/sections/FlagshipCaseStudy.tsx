import AnimatedSection from "@/components/AnimatedSection";
import { flagshipCaseStudy } from "@/data/proof";

export default function FlagshipCaseStudy() {
  return (
    <section className="py-20 px-4 font-mono">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="mb-12">
            <div className="text-xs text-neutral-400 mb-6">
              {"// "}
              <span className="text-purple-300">
                {flagshipCaseStudy.eyebrow}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-normal text-neutral-200 mb-3">
              {flagshipCaseStudy.title}
            </h2>
            <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
              {flagshipCaseStudy.subtitle}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="border border-l-2 border-neutral-800 bg-neutral-950/50 hover:border-neutral-400 transition-colors duration-200 border-l-purple-400">
            <div className="flex items-center justify-between gap-4 px-4 py-2 border-b border-neutral-800 bg-neutral-900/50">
              <span className="text-sm text-neutral-300">
                graph-powered code intelligence
              </span>
              <div className="flex items-center gap-3 text-xs text-neutral-400">
                {flagshipCaseStudy.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    aria-label={link.ariaLabel}
                    className="hover:text-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
                  >
                    [{link.label}]
                  </a>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] gap-8 px-4 py-5">
              <div className="space-y-5">
                <div>
                  <div className="text-[10px] tracking-wider text-neutral-400 mb-2">
                    PROBLEM
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {flagshipCaseStudy.problem}
                  </p>
                </div>
                <div>
                  <div className="text-[10px] tracking-wider text-neutral-400 mb-2">
                    APPROACH
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {flagshipCaseStudy.approach}
                  </p>
                </div>
                <div>
                  <div className="text-[10px] tracking-wider text-neutral-400 mb-2">
                    RESULT
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {flagshipCaseStudy.result}
                  </p>
                </div>
              </div>
              <div className="py-1">
                <div className="text-[10px] tracking-wider text-neutral-400 mb-4">
                  PROOF TOKENS
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-neutral-400">
                  {flagshipCaseStudy.proof.map((item) => (
                    <span
                      key={item}
                      className="border border-neutral-800 px-2 py-1"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
