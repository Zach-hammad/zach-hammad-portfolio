import { ReactNode } from "react";
import AnimatedSection from "@/components/AnimatedSection";

interface LayerSectionProps {
  layerNumber: number;
  label: string;
  title: string;
  description: string;
  accentColor: string;
  backgroundClass?: string;
  children: ReactNode;
}

export default function LayerSection({
  layerNumber,
  label,
  title,
  description,
  accentColor,
  children,
}: LayerSectionProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto font-mono">
        <AnimatedSection>
          <div className="mb-12">
            {/* Terminal-style section divider */}
            <div className="text-xs text-neutral-600 mb-6">
              {"// "}
              <span style={{ color: accentColor }}>
                LAYER {layerNumber}
              </span>
              {" — "}
              {label.toUpperCase()}
            </div>
            <h2 className="text-2xl md:text-3xl font-normal text-neutral-200 mb-3">
              {title}
            </h2>
            <p className="text-sm text-neutral-500 max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
      </div>
    </section>
  );
}
