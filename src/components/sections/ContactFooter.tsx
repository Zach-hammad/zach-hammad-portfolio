import { Github, Linkedin, Mail } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { contact } from "@/data/contact";

export default function ContactFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 px-4 font-mono">
      <div className="max-w-3xl mx-auto">
        <hr className="section-rule mb-12" />
        <AnimatedSection>
          <div className="text-center">
            <div className="text-xs text-neutral-600 mb-8">
              {"// "}CONTACT
            </div>
            <div className="flex items-center justify-center gap-8 mb-10 text-xs text-neutral-600">
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-neutral-300 transition-colors"
                aria-label="GitHub"
              >
                <Github size={14} />
                github
              </a>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-neutral-300 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={14} />
                linkedin
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-1.5 hover:text-neutral-300 transition-colors"
                aria-label="Email"
              >
                <Mail size={14} />
                email
              </a>
            </div>
            <p className="text-neutral-700 text-[10px] tracking-wider">
              &copy; {currentYear} Zacharia Hammad
            </p>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  );
}
