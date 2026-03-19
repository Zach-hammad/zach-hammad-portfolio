import HeroContainer from "@/components/hero/HeroContainer";
import IntroSection from "@/components/sections/IntroSection";
import DragonCurveBackground from "@/components/DragonCurveBackground";
import TopBar from "@/components/TopBar";
import LayerSection from "@/components/sections/LayerSection";
import PersonalSection from "@/components/sections/PersonalSection";
import ContactFooter from "@/components/sections/ContactFooter";
import ProjectCard from "@/components/cards/ProjectCard";
import ProfessionalCard from "@/components/cards/ProfessionalCard";
import AnimatedSection from "@/components/AnimatedSection";
import { getProjectsByLayer } from "@/data/projects";
import { professionalExperience } from "@/data/professional";
import { fetchAllGitHubStats } from "@/lib/github";
import { projects } from "@/data/projects";

export default async function Home() {
  // Fetch GitHub stats at build time
  const repoUrls = projects
    .map((p) => p.githubUrl)
    .filter((url): url is string => !!url);
  const githubStats = await fetchAllGitHubStats(repoUrls);

  const hardwareProjects = getProjectsByLayer("hardware");
  const systemsProjects = getProjectsByLayer("systems");
  const softwareProjects = getProjectsByLayer("software");

  return (
    <>
    <main className="font-mono">
      <TopBar />
      <HeroContainer />

      <IntroSection />

      <hr className="section-rule max-w-5xl mx-auto" />

      <LayerSection
        layerNumber={1}
        label="Hardware"
        title={`"I started at the metal"`}
        description="Designing CPUs, implementing architectures from first principles. Where I learned how computers actually work."
        accentColor="#4ade80"
      >
        {hardwareProjects.map((project) => (
          <AnimatedSection key={project.slug} delay={0.1}>
            <ProjectCard
              project={project}
              stats={
                project.githubUrl
                  ? githubStats.get(project.githubUrl)
                  : null
              }
              accentColor="#4ade80"
            />
          </AnimatedSection>
        ))}
      </LayerSection>

      <hr className="section-rule max-w-5xl mx-auto" />

      <LayerSection
        layerNumber={2}
        label="Systems"
        title={`"Then I built the machines"`}
        description="Virtual machines, simulators, assembly. The layer between hardware and software."
        accentColor="#60a5fa"
      >
        {systemsProjects.map((project) => (
          <AnimatedSection key={project.slug} delay={0.1}>
            <ProjectCard
              project={project}
              stats={
                project.githubUrl
                  ? githubStats.get(project.githubUrl)
                  : null
              }
              accentColor="#60a5fa"
            />
          </AnimatedSection>
        ))}
      </LayerSection>

      <hr className="section-rule max-w-5xl mx-auto" />

      <LayerSection
        layerNumber={3}
        label="Software & AI"
        title={`"Now I write what runs on them"`}
        description="Production software, developer tools, and AI systems. Where I am today."
        accentColor="#c084fc"
      >
        {/* Professional experience -- NDA-safe */}
        <div className="md:col-span-2 mb-4">
          <AnimatedSection>
            <div className="text-xs text-neutral-600 mb-4">
              {"// "}production
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {professionalExperience.map((exp) => (
              <AnimatedSection key={exp.area} delay={0.1}>
                <ProfessionalCard
                  experience={exp}
                  accentColor="#c084fc"
                />
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* Open source projects */}
        <div className="md:col-span-2">
          <AnimatedSection>
            <div className="text-xs text-neutral-600 mb-4 mt-4">
              {"// "}open source
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {softwareProjects.map((project) => (
              <AnimatedSection key={project.slug} delay={0.1}>
                <ProjectCard
                  project={project}
                  stats={
                    project.githubUrl
                      ? githubStats.get(project.githubUrl)
                      : null
                  }
                  accentColor="#c084fc"
                />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </LayerSection>

      <hr className="section-rule max-w-5xl mx-auto" />

      <PersonalSection />

      <ContactFooter />
    </main>
    <DragonCurveBackground />
    </>
  );
}
