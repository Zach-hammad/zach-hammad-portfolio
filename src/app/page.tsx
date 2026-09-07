import HeroContainer from "@/components/hero/HeroContainer";
import IntroSection from "@/components/sections/IntroSection";
import ProofPillarsSection from "@/components/sections/ProofPillarsSection";
import FlagshipCaseStudy from "@/components/sections/FlagshipCaseStudy";
import ProductionProofSection from "@/components/sections/ProductionProofSection";
import FoundationsSection from "@/components/sections/FoundationsSection";
import TopBar from "@/components/TopBar";
import PersonalSection from "@/components/sections/PersonalSection";
import ContactFooter from "@/components/sections/ContactFooter";

export default function Home() {
  return (
    <>
      <TopBar />
      <main id="main-content" tabIndex={-1} className="relative z-10">
        <HeroContainer />
        <ProofPillarsSection />
        <section id="work" className="shell section-space">
          <IntroSection />
          <FlagshipCaseStudy />
          <ProductionProofSection />
        </section>
        <FoundationsSection />
        <PersonalSection />
      </main>
      <ContactFooter />
    </>
  );
}
