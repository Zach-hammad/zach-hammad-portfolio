import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { contact } from "@/data/contact";

export default function TopBar() {
  return (
    <header className="site-header">
      <nav aria-label="Main navigation" className="shell nav-inner">
        <Link href="/" aria-label="Home" className="brand min-h-11">
          <span className="brand-mark" aria-hidden="true">
            zh<span>.</span>
          </span>
          <span className="brand-name">Zacharia Hammad</span>
        </Link>
        <div className="nav-links">
          <Link href="/#work">Work</Link>
          <Link href="/#about">About</Link>
          <Link href="/resume" aria-label="Resume">
            Résumé
          </Link>
          <a
            className="nav-contact"
            href={`mailto:${contact.email}`}
            aria-label="Email"
          >
            Let’s talk <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </nav>
    </header>
  );
}
