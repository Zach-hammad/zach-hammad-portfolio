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
          <p>© {new Date().getFullYear()} Zacharia Hammad</p>
          <FastPathLinks />
        </div>
      </div>
    </footer>
  );
}
