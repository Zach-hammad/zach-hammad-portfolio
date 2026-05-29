import FastPathLinks from "@/components/FastPathLinks";
import { roleIdentity } from "@/data/proof";

export default function HeroCopy() {
  return (
    <div className="text-center relative z-10 max-w-3xl mx-auto px-4">
      <p className="text-xs font-mono tracking-[0.28em] uppercase text-neutral-400 mb-6">
        {roleIdentity.systemsLine}
      </p>
      <p className="text-xs font-mono uppercase tracking-[0.22em] text-purple-300 mb-4">
        {roleIdentity.eyebrow}
      </p>
      <h1 className="text-5xl md:text-7xl font-bold mb-5 text-neutral-100">
        {roleIdentity.name}
      </h1>
      <p className="text-sm md:text-base text-neutral-400 leading-relaxed max-w-2xl mx-auto mb-8">
        {roleIdentity.lead}
      </p>
      <FastPathLinks />
    </div>
  );
}
