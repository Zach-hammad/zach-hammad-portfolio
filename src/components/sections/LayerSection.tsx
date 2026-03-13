import { ReactNode } from "react";
import AnimatedSection from "@/components/AnimatedSection";

interface LayerSectionProps {
  layerNumber: number;
  label: string;
  title: string;
  description: string;
  accentColor: string;
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
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="mb-12">
            <span
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: accentColor }}
            >
              Layer {layerNumber} — {label}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              {title}
            </h2>
            <p className="text-text-secondary max-w-2xl">{description}</p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
      </div>
    </section>
  );
}
