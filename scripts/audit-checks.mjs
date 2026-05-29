import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) =>
  readFileSync(path.join(root, relativePath), "utf8");

function walk(dir) {
  const entries = readdirSync(path.join(root, dir));
  return entries.flatMap((entry) => {
    const relativePath = path.join(dir, entry);
    const absolutePath = path.join(root, relativePath);
    return statSync(absolutePath).isDirectory()
      ? walk(relativePath)
      : [relativePath];
  });
}

const srcFiles = walk("src").filter((file) => /\.(ts|tsx)$/.test(file));
const sourceText = srcFiles.map(read).join("\n");

for (const lowContrastClass of [
  "text-neutral-500",
  "text-neutral-600",
  "text-neutral-700",
  "text-text-muted",
]) {
  assert(
    !sourceText.includes(lowContrastClass),
    `Low-contrast class still present: ${lowContrastClass}`
  );
}

const topBar = read("src/components/TopBar.tsx");
assert(topBar.includes('aria-label="GitHub"'), "TopBar GitHub link needs an accessible name");
assert(topBar.includes('aria-label="LinkedIn"'), "TopBar LinkedIn link needs an accessible name");
assert(topBar.includes('aria-label="Email"'), "TopBar email link needs an accessible name");
assert(topBar.includes("min-h-11"), "TopBar links need mobile-sized tap targets");

const contactData = read("src/data/contact.ts");
assert(
  contactData.includes("resume: undefined as string | undefined"),
  "Contact data should expose an optional resume field so resume links can be hidden when absent"
);

const proofData = read("src/data/proof.ts");
for (const requiredProofText of [
  "Full-Stack AI Engineer",
  "I build AI systems end to end",
  "AI Products & Agents",
  "Retrieval & Knowledge Systems",
  "Inference & Edge AI",
  "Systems Foundation",
  "Repotoire",
  "110+ detectors",
]) {
  assert(
    proofData.includes(requiredProofText),
    `Proof data missing required text: ${requiredProofText}`
  );
}
assert(
  proofData.includes("contact.resume"),
  "Fast path links should read the optional resume URL from contact data"
);

const intro = read("src/components/sections/IntroSection.tsx");
assert(!intro.includes("<h1"), "IntroSection should not add a second h1");
assert(intro.includes("<h2"), "IntroSection should keep the repeated name as h2");

const projectCard = read("src/components/cards/ProjectCard.tsx");
assert(
  projectCard.includes("View ${project.title} source on GitHub"),
  "Project source links need project-specific accessible names"
);
assert(
  projectCard.includes("Open ${project.title} demo"),
  "Project demo links need project-specific accessible names"
);
assert(
  projectCard.includes("borderLeftColor: accentColor"),
  "ProjectCard should use accentColor instead of accepting an unused prop"
);

const professionalCard = read("src/components/cards/ProfessionalCard.tsx");
assert(
  professionalCard.includes("borderLeftColor: accentColor"),
  "ProfessionalCard should use accentColor instead of accepting an unused prop"
);

const carousel = read("src/components/PhotoCarousel.tsx");
assert(
  carousel.includes("focus-visible:opacity-100"),
  "Carousel controls need to appear on keyboard focus"
);
assert(
  carousel.includes("opacity-100 md:opacity-0"),
  "Carousel controls should be visible on touch/mobile viewports"
);

const staticHero = read("src/components/hero/StaticHero.tsx");
assert(staticHero.includes("useReducedMotion"), "StaticHero should respect reduced motion");

const heroCopy = read("src/components/hero/HeroCopy.tsx");
assert(heroCopy.includes("<h1"), "HeroCopy should own the single page h1");
assert(
  heroCopy.includes("roleIdentity.eyebrow"),
  "HeroCopy should render the Full-Stack AI Engineer eyebrow from proof data"
);
assert(
  heroCopy.includes("roleIdentity.lead"),
  "HeroCopy should render the role lead from proof data"
);

const fastPathLinksComponent = read("src/components/FastPathLinks.tsx");
assert(
  fastPathLinksComponent.includes("fastPathLinks.map"),
  "FastPathLinks should render the proof data link list"
);
assert(
  fastPathLinksComponent.includes("aria-label={link.ariaLabel}"),
  "FastPathLinks anchors need descriptive accessible labels"
);
assert(
  fastPathLinksComponent.includes("min-h-11"),
  "FastPathLinks should keep mobile-sized tap targets"
);
assert(
  staticHero.includes("<HeroCopy />"),
  "StaticHero should render the shared hero copy"
);

const canvasHero = read("src/components/hero/CanvasHero.tsx");
assert(
  canvasHero.includes("<HeroCopy />"),
  "CanvasHero should render the same visible hero copy as StaticHero"
);

const proofPillarsSection = read("src/components/sections/ProofPillarsSection.tsx");
assert(
  proofPillarsSection.includes("proofPillars.map"),
  "ProofPillarsSection should render all proof pillars from data"
);
assert(
  proofPillarsSection.includes("borderLeftColor: pillar.accentColor"),
  "Proof pillar cards should preserve the existing left-accent card language"
);

const flagshipCaseStudySection = read("src/components/sections/FlagshipCaseStudy.tsx");
assert(
  flagshipCaseStudySection.includes("flagshipCaseStudy.problem"),
  "FlagshipCaseStudy should render the problem narrative"
);
assert(
  flagshipCaseStudySection.includes("flagshipCaseStudy.proof.map"),
  "FlagshipCaseStudy should render proof tokens"
);
assert(
  !flagshipCaseStudySection.includes('className="border border-neutral-800 bg-neutral-950/50 p-4"'),
  "Flagship proof tokens should be flattened within the outer card, not nested in a bordered panel"
);

const pageFile = read("src/app/page.tsx");
assert(
  pageFile.includes("<ProofPillarsSection />"),
  "Homepage should render proof pillars near the top"
);
assert(
  pageFile.includes("<FlagshipCaseStudy />"),
  "Homepage should render the Repotoire flagship case study"
);

const animatedSection = read("src/components/AnimatedSection.tsx");
assert(
  animatedSection.includes("useReducedMotion"),
  "AnimatedSection should respect reduced motion"
);

const dragon = read("src/components/DragonCurveBackground.tsx");
assert(
  dragon.includes("prefers-reduced-motion: reduce"),
  "Dragon background should respect reduced motion"
);
assert(dragon.includes("z-0"), "Dragon background should sit behind page content");

const page = read("src/app/page.tsx");
assert(
  page.includes('className="font-mono relative z-10"'),
  "Main content should layer above the decorative dragon background"
);

const layout = read("src/app/layout.tsx");
assert(layout.includes("metadataBase"), "Metadata should include a production metadataBase");
assert(layout.includes("canonical"), "Metadata should include a canonical URL");

const personalData = read("src/data/personal.ts");
assert(!personalData.includes(".png"), "Referenced carousel images should not use .png extensions");

const referencedImages = [...personalData.matchAll(/src: "([^"]+)"/g)].map(
  (match) => match[1]
);
assert(referencedImages.length > 0, "Expected referenced personal images");

for (const imagePath of referencedImages) {
  assert(imagePath.endsWith(".jpg"), `Expected jpg path: ${imagePath}`);
  const absolutePath = path.join(root, "public", imagePath);
  assert(existsSync(absolutePath), `Missing referenced image: ${imagePath}`);
  const signature = readFileSync(absolutePath).subarray(0, 2);
  assert(
    signature[0] === 0xff && signature[1] === 0xd8,
    `Referenced image is not JPEG data: ${imagePath}`
  );
}

const formations = read("src/components/hero/stages/formations.ts");
for (const unusedFunction of [
  "orGate",
  "notGate",
  "muxGate",
  "flipFlop",
  "xorGate",
  "nandGate",
  "adderBlock",
  "comparatorBlock",
]) {
  assert(
    !formations.includes(`function ${unusedFunction}`),
    `Unused formation helper still present: ${unusedFunction}`
  );
}

console.log("Portfolio audit checks passed.");
