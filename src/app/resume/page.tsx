import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";
import TopBar from "@/components/TopBar";
import { contact } from "@/data/contact";
import { resume } from "@/data/resume";
import { site } from "@/data/site";
import ProfileSchema from "@/components/ProfileSchema";

export const metadata: Metadata = {
  title: "Zacharia Hammad Résumé | Software Engineer, AI Products",
  description: resume.summary,
  alternates: { canonical: "/resume" },
  openGraph: {
    title: "Zacharia Hammad Résumé | Software Engineer, AI Products",
    description: resume.summary,
    url: "/resume",
    type: "profile",
    images: [site.socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zacharia Hammad Résumé | Software Engineer, AI Products",
    description: resume.summary,
    images: [site.socialImage],
  },
};

export default function ResumePage() {
  return (
    <>
      <ProfileSchema path="/resume" />
      <TopBar />
      <main id="main-content" tabIndex={-1} className="resume-page shell">
        <header className="resume-header">
          <p className="eyebrow">Résumé</p>
          <h1>{resume.name}</h1>
          <p className="resume-title">{resume.title}</p>
          <div className="resume-meta">
            {resume.details.map((detail) => (
              <span key={detail}>{detail}</span>
            ))}
          </div>
          <nav aria-label="Resume actions" className="resume-actions">
            <a
              href={contact.resumePdf}
              download="Zacharia_Hammad_Resume.pdf"
              className="button-primary"
              aria-label="Download Zacharia Hammad resume PDF"
            >
              Download PDF <Download size={17} aria-hidden="true" />
            </a>
            <Link className="text-link" href="/">
              View selected work <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <a
              className="text-link"
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a
              className="text-link"
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </nav>
        </header>
        <p className="resume-summary">{resume.summary}</p>
        <div className="resume-layout">
          <div>
            <section
              className="resume-section"
              aria-labelledby="experience-title"
            >
              <h2 id="experience-title">Professional Experience</h2>
              {resume.experience.map((experience) => (
                <article key={experience.organization} className="resume-entry">
                  <header>
                    <div>
                      <h3>{experience.organization}</h3>
                      <p className="resume-role">{experience.role}</p>
                    </div>
                    <p>{experience.period}</p>
                  </header>
                  <ul>
                    {experience.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </section>
            <section
              className="resume-section"
              aria-labelledby="projects-title"
            >
              <h2 id="projects-title">Selected projects</h2>
              {resume.projects.map((project) => (
                <article key={project.name} className="resume-entry">
                  <h3>{project.name}</h3>
                  <p className="resume-role">{project.stack}</p>
                  <p>{project.description}</p>
                </article>
              ))}
            </section>
          </div>
          <aside aria-label="Skills and education">
            <section className="resume-section" aria-labelledby="skills-title">
              <h2 id="skills-title">Technical Skills</h2>
              {resume.skillGroups.map((group) => (
                <div className="resume-skill" key={group.label}>
                  <h3>{group.label}</h3>
                  <p>{group.items.join(" · ")}</p>
                </div>
              ))}
            </section>
            <section
              className="resume-section"
              aria-labelledby="education-title"
            >
              <h2 id="education-title">Education & certification</h2>
              <div className="resume-entry">
                <h3>{resume.education.school}</h3>
                <p>{resume.education.degree}</p>
                <p>{resume.education.detail}</p>
                <p>{resume.education.certification}</p>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </>
  );
}
