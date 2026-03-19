import { Github, Linkedin, Mail, FileText } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { contact } from "@/data/contact";

export default function IntroSection() {
  return (
    <section className="py-24 px-4 font-mono">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatedSection>
          <h1 className="text-4xl md:text-6xl font-normal mb-4 text-neutral-100 tracking-tight">
            Zacharia Hammad
          </h1>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <p className="text-sm text-neutral-500 mb-6 tracking-wide">
            Computer Engineer. Transistors to interfaces.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <p className="text-xs text-neutral-600 max-w-lg mx-auto mb-10 leading-relaxed">
            Computer Engineering graduate from Drexel University. Designed CPUs,
            built virtual machines, shipped developer tools in Rust, deployed
            production ML pipelines. Systems from the ground up.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.3}>
          <div className="flex items-center justify-center gap-6 text-xs text-neutral-600">
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-neutral-300 transition-colors"
            >
              <Github size={12} />
              github
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-neutral-300 transition-colors"
            >
              <Linkedin size={12} />
              linkedin
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-1.5 hover:text-neutral-300 transition-colors"
            >
              <Mail size={12} />
              email
            </a>
            <a
              href={contact.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-neutral-300 transition-colors"
            >
              <FileText size={12} />
              resume
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
