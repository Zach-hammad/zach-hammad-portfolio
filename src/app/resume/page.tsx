import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Download } from "lucide-react";
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
  const sectionLinks = [
    { label: "Skills", href: "#skills-title" },
    { label: "Experience", href: "#experience-title" },
    { label: "Projects", href: "#projects-title" },
    { label: "Education", href: "#education-title" },
    { label: "Certifications", href: "#certifications-title" },
  ].map(({ label, href }) => (
    <li key={href}>
      <a href={href}>{label}</a>
    </li>
  ));

  return (
    <>
      <ProfileSchema path="/resume" />
      <TopBar />
      <main id="main-content" tabIndex={-1} className="resume-page shell">
        <nav aria-label="Resume actions" className="resume-actions">
          <Link className="text-link" href="/">
            View selected work <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <a
            href={contact.resumePdf}
            download="Zacharia_Hammad_Resume.pdf"
            className="button-primary"
            aria-label="Download Zacharia Hammad resume PDF"
          >
            Download PDF <Download size={17} aria-hidden="true" />
          </a>
        </nav>
        <div className="resume-workspace">
          <nav aria-label="Resume sections" className="resume-contents">
            <p>In this résumé</p>
            <ul>{sectionLinks}</ul>
          </nav>
          <article className="resume-document" aria-label={`${resume.name} resume`}>
            <details className="resume-mobile-contents">
              <summary>
                Jump to section <ChevronDown size={16} aria-hidden="true" />
              </summary>
              <nav aria-label="Resume sections">
                <ul>{sectionLinks}</ul>
              </nav>
            </details>
            <header className="resume-header">
              <p className="eyebrow">Résumé</p>
              <div className="resume-heading">
                <div className="resume-identity">
                  <h1>{resume.name}</h1>
                  <p className="resume-title">{resume.title}</p>
                </div>
              </div>
              <div className="resume-meta">
                {resume.details.map((detail) => (
                  <span key={detail}>
                    {detail === contact.email ? (
                      <a href={`mailto:${contact.email}`}>{detail}</a>
                    ) : (
                      detail
                    )}
                  </span>
                ))}
              </div>
              <div className="resume-meta resume-links">
                <a href={site.url}>{new URL(site.url).hostname}</a>
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn <ArrowUpRight size={14} aria-hidden="true" />
                </a>
                <a href={contact.github} target="_blank" rel="noopener noreferrer">
                  GitHub <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </div>
              <p className="resume-summary">{resume.summary}</p>
            </header>
            <div className="resume-layout">
              <section className="resume-section" aria-labelledby="skills-title">
                <h2 id="skills-title">Technical Skills</h2>
                {resume.skillGroups.map((group) => (
                  <div className="resume-skill" key={group.label}>
                    <h3>{group.label}</h3>
                    <p>{group.items.join(", ")}</p>
                  </div>
                ))}
              </section>
              <section className="resume-section" aria-labelledby="experience-title">
                <h2 id="experience-title">Professional Experience</h2>
                {resume.experience.map((experience) => (
                  <article key={experience.organization} className="resume-entry">
                    <header>
                      <div className="resume-entry-heading">
                        <h3>{experience.organization}</h3>
                        <p className="resume-role">{experience.role}</p>
                      </div>
                      <p className="resume-period">{experience.period}</p>
                    </header>
                    <ul>
                      {experience.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </section>
              <section className="resume-section" aria-labelledby="projects-title">
                <h2 id="projects-title">Projects</h2>
                {resume.projects.map((project) => (
                  <article key={project.name} className="resume-entry">
                    <h3>{project.name}</h3>
                    <p className="resume-role">{project.stack}</p>
                    <p>{project.description}</p>
                  </article>
                ))}
              </section>
              <section className="resume-section" aria-labelledby="education-title">
                <h2 id="education-title">Education</h2>
                <div className="resume-entry">
                  <header>
                    <div className="resume-entry-heading">
                      <h3>{resume.education.school}</h3>
                      <p className="resume-role">{resume.education.degree}</p>
                    </div>
                    <p className="resume-period">{resume.education.period}</p>
                  </header>
                  <p>
                    {resume.education.minor} · GPA {resume.education.gpa}
                  </p>
                </div>
              </section>
              <section className="resume-section" aria-labelledby="certifications-title">
                <h2 id="certifications-title">Certifications</h2>
                {resume.certifications.map((certification) => (
                  <article key={certification.name} className="resume-entry">
                    <header>
                      <h3>{certification.name}</h3>
                      <p className="resume-period">{certification.period}</p>
                    </header>
                  </article>
                ))}
              </section>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
