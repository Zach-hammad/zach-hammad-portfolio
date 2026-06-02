import type { Metadata } from "next";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import { contact } from "@/data/contact";
import { resume, ResumeExperience, ResumeProject } from "@/data/resume";

export const metadata: Metadata = {
  title: "Resume | Zacharia Hammad",
  description:
    "Resume for Zacharia Hammad, a Full Stack Software Engineer building secure AI workflows, knowledge graphs, agentic interfaces, and event-driven systems.",
  alternates: {
    canonical: "/resume",
  },
  openGraph: {
    title: "Resume | Zacharia Hammad",
    description:
      "Full Stack Software Engineer resume focused on secure AI workflows, knowledge graphs, agentic interfaces, and event-driven architecture.",
    url: "/resume",
    siteName: "Zacharia Hammad",
    type: "profile",
  },
};

const actions = [
  {
    label: "portfolio",
    href: "/",
    ariaLabel: "Return to Zacharia Hammad portfolio",
  },
  {
    label: "download pdf",
    href: contact.resumePdf,
    ariaLabel: "Download Zacharia Hammad resume PDF",
  },
  {
    label: "linkedin",
    href: contact.linkedin,
    ariaLabel: "Open Zacharia Hammad LinkedIn profile",
    external: true,
  },
  {
    label: "github",
    href: contact.github,
    ariaLabel: "Open Zacharia Hammad GitHub profile",
    external: true,
  },
  {
    label: "email",
    href: `mailto:${contact.email}`,
    ariaLabel: "Email Zacharia Hammad",
  },
] as const;

function BracketLink({
  href,
  label,
  ariaLabel,
  external = false,
}: {
  href: string;
  label: string;
  ariaLabel: string;
  external?: boolean;
}) {
  const className =
    "inline-flex min-h-11 items-center rounded-sm px-2 text-xs text-neutral-400 hover:text-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors";

  if (external || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-label={ariaLabel}
        className={className}
      >
        [{label}]
      </a>
    );
  }

  return (
    <Link href={href} aria-label={ariaLabel} className={className}>
      [{label}]
    </Link>
  );
}

function ResumeSection({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-10">
      <div className="mb-6">
        <div className="mb-3 text-xs text-neutral-400">{"// "}{label}</div>
        <h2 className="text-xl font-normal text-neutral-100 md:text-2xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function TokenList({ items }: { items: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-neutral-400">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function ExperienceBlock({
  experience,
  accentColor,
}: {
  experience: ResumeExperience;
  accentColor: string;
}) {
  return (
    <article
      className="border border-l-2 border-neutral-800 bg-neutral-950/50 transition-colors duration-200 hover:border-neutral-400"
      style={{ borderLeftColor: accentColor }}
    >
      <div className="border-b border-neutral-800 bg-neutral-900/50 px-4 py-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div>
            <h3 className="text-sm text-neutral-200">{experience.role}</h3>
            <p className="text-xs text-neutral-400">
              {experience.organization}
            </p>
          </div>
          <p className="text-xs text-neutral-400">{experience.period}</p>
        </div>
      </div>
      <ul className="space-y-3 px-4 py-4 text-xs leading-relaxed text-neutral-400">
        {experience.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3">
            <span className="mt-2 h-px w-3 shrink-0 bg-neutral-500" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function ProjectBlock({ project }: { project: ResumeProject }) {
  return (
    <article className="border border-l-2 border-neutral-800 border-l-purple-400 bg-neutral-950/50 transition-colors duration-200 hover:border-neutral-400">
      <div className="border-b border-neutral-800 bg-neutral-900/50 px-4 py-3">
        <h3 className="text-sm text-neutral-200">{project.name}</h3>
        <p className="text-xs text-neutral-400">{project.stack}</p>
      </div>
      <div className="space-y-3 px-4 py-4 text-xs leading-relaxed text-neutral-400">
        <p>{project.description}</p>
        {project.result ? (
          <p className="text-neutral-300">Result: {project.result}</p>
        ) : null}
      </div>
    </article>
  );
}

export default function ResumePage() {
  return (
    <>
      <main className="font-mono relative z-10 min-h-screen px-4 pb-24 pt-28">
        <TopBar />

        <div className="mx-auto max-w-5xl">
          <header className="pb-12">
            <p className="mb-4 text-xs uppercase tracking-[0.22em] text-purple-300">
              Resume
            </p>
            <h1 className="mb-4 text-4xl font-bold text-neutral-100 md:text-6xl">
              {resume.name}
            </h1>
            <p className="mb-3 text-base text-neutral-300 md:text-lg">
              {resume.title}
            </p>
            <p className="max-w-3xl text-sm leading-relaxed text-neutral-400">
              {resume.focus}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-400">
              {resume.details.map((detail) => (
                <span key={detail}>{detail}</span>
              ))}
            </div>
            <nav
              aria-label="Resume actions"
              className="mt-6 flex flex-wrap items-center gap-2"
            >
              {actions.map((action) => (
                <BracketLink key={action.label} {...action} />
              ))}
            </nav>
          </header>

          <hr className="section-rule" />

          <ResumeSection label="SUMMARY" title="Secure AI workflow systems">
            <p className="max-w-4xl text-sm leading-relaxed text-neutral-400">
              {resume.summary}
            </p>
          </ResumeSection>

          <hr className="section-rule" />

          <ResumeSection label="TECHNICAL SKILLS" title="Technical Skills">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {resume.skillGroups.map((group) => (
                <article
                  key={group.label}
                  className="border border-l-2 border-neutral-800 border-l-purple-400 bg-neutral-950/50 px-4 py-4"
                >
                  <h3 className="mb-3 text-sm text-neutral-200">
                    {group.label}
                  </h3>
                  <TokenList items={group.items} />
                </article>
              ))}
            </div>
          </ResumeSection>

          <hr className="section-rule" />

          <ResumeSection
            label="PROFESSIONAL EXPERIENCE"
            title="Professional Experience"
          >
            <div className="space-y-4">
              {resume.experience.map((experience, index) => (
                <ExperienceBlock
                  key={`${experience.organization}-${experience.role}`}
                  experience={experience}
                  accentColor={index === 0 ? "#c084fc" : "#60a5fa"}
                />
              ))}
            </div>
          </ResumeSection>

          <hr className="section-rule" />

          <ResumeSection label="PROJECTS" title="Selected projects">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {resume.projects.map((project) => (
                <ProjectBlock key={project.name} project={project} />
              ))}
            </div>
          </ResumeSection>

          <hr className="section-rule" />

          <ResumeSection label="EDUCATION" title="Education">
            <article className="border border-l-2 border-neutral-800 border-l-green-400 bg-neutral-950/50 px-4 py-4">
              <h3 className="text-sm text-neutral-200">
                {resume.education.school}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-400">
                {resume.education.degree}
              </p>
              <p className="mt-2 text-xs text-neutral-400">
                {resume.education.detail}
              </p>
            </article>
          </ResumeSection>
        </div>
      </main>
    </>
  );
}
