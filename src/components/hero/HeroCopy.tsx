import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { roleIdentity } from "@/data/proof";

export default function HeroCopy() {
  return (
    <div className="hero-copy">
      <p className="eyebrow">
        <span className="status-dot" />
        {roleIdentity.eyebrow}
      </p>
      <h1>{roleIdentity.name}</h1>
      <p className="hero-statement">
        I build
        <br />
        <span>AI software.</span>
      </p>
      <p className="hero-lead">{roleIdentity.lead}</p>
      <div className="hero-actions">
        <a className="button-primary" href="#work">
          Explore the work <ArrowDown size={17} aria-hidden="true" />
        </a>
        <Link className="text-link" href="/resume">
          View résumé <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
      <p className="hero-location">Based in the DC area</p>
    </div>
  );
}
