import { contact } from "@/data/contact";
import { resume } from "@/data/resume";
import { site } from "@/data/site";

export default function ProfileSchema({ path }: { path: "/" | "/resume" }) {
  const url = new URL(path, site.url).href;
  const profile = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#profile`,
    url,
    name: path === "/" ? site.title : `${resume.name} — Résumé`,
    inLanguage: "en-US",
    mainEntity: {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: resume.name,
      url: `${site.url}/`,
      jobTitle: resume.experience[0].role,
      description: resume.summary,
      sameAs: [contact.linkedin, contact.github],
      worksFor: {
        "@type": "Organization",
        name: resume.experience[0].organization,
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: resume.education.school,
      },
      knowsAbout: [
        "AI products",
        "Computer vision",
        "Knowledge graphs",
        "Voice agents",
        "Runtime systems",
        "Computer architecture",
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(profile).replace(/</g, "\\u003c"),
      }}
    />
  );
}
