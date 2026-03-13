import { Github, Linkedin, Mail, FileText } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { contact } from "@/data/contact";

export default function IntroSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatedSection>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Zacharia Hammad
          </h1>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <p className="text-xl text-text-secondary mb-6">
            Computer Engineer. I build from transistors to interfaces.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <p className="text-text-muted max-w-xl mx-auto mb-8 leading-relaxed">
            Computer Engineering graduate from Drexel University. I&apos;ve
            designed CPUs, built virtual machines, shipped developer tools in
            Rust, and deployed production ML pipelines. I care about
            understanding systems from the ground up.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.3}>
          <div className="flex items-center justify-center gap-6">
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors"
            >
              <Github size={18} />
              <span className="text-sm">GitHub</span>
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors"
            >
              <Linkedin size={18} />
              <span className="text-sm">LinkedIn</span>
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors"
            >
              <Mail size={18} />
              <span className="text-sm">Email</span>
            </a>
            <a
              href={contact.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors"
            >
              <FileText size={18} />
              <span className="text-sm">Resume</span>
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
