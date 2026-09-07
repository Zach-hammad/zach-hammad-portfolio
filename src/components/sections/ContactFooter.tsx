import { ArrowUpRight } from "lucide-react";
import FastPathLinks from "@/components/FastPathLinks";
import { roleIdentity } from "@/data/proof";
import { contact } from "@/data/contact";

export default function ContactFooter() {
  return (
    <footer className="contact-footer relative z-10">
      <div className="shell">
        <p className="eyebrow">Contact</p>
        <h2>{roleIdentity.footerLine}</h2>
        <div className="footer-contact">
          <a className="email-link" href={`mailto:${contact.email}`}>
            {contact.email}
            <ArrowUpRight size={24} aria-hidden="true" />
          </a>
          <p>AI products · Developer tools · Computer architecture</p>
        </div>
        <div className="footer-bottom">
          <p>
            <span className="mb-1 block text-xs">
              I built this site with AI.{" "}
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ask me how I built this site with AI on LinkedIn"
                className="underline underline-offset-4 hover:text-[var(--accent)]"
              >
                Ask me how.
              </a>
            </span>
            © {new Date().getFullYear()} Zacharia Hammad
          </p>
          <FastPathLinks />
        </div>
      </div>
    </footer>
  );
}
