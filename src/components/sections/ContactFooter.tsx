import { Github, Linkedin, Mail, FileText } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { contact } from "@/data/contact";

export default function ContactFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 px-4 border-t border-border">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatedSection>
          <h2 className="text-2xl font-bold mb-4">Get in touch</h2>
          <div className="flex items-center justify-center gap-8 mb-8">
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github size={24} />
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label="Email"
            >
              <Mail size={24} />
            </a>
            <a
              href={contact.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label="Resume"
            >
              <FileText size={24} />
            </a>
          </div>
          <p className="text-text-muted text-sm">
            &copy; {currentYear} Zacharia Hammad
          </p>
        </AnimatedSection>
      </div>
    </footer>
  );
}
