import AnimatedSection from "@/components/AnimatedSection";
import FastPathLinks from "@/components/FastPathLinks";
import { roleIdentity } from "@/data/proof";

export default function ContactFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 px-4 font-mono">
      <div className="max-w-3xl mx-auto">
        <hr className="section-rule mb-12" />
        <AnimatedSection>
          <div className="text-center">
            <div className="text-xs text-neutral-400 mb-6">
              {"// "}CONTACT
            </div>
            <p className="text-sm text-neutral-300 mb-8">
              {roleIdentity.footerLine}
            </p>
            <div className="mb-10">
              <FastPathLinks />
            </div>
            <p className="text-neutral-400 text-[10px] tracking-wider">
              &copy; {currentYear} Zacharia Hammad
            </p>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  );
}
