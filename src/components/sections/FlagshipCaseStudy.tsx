import { ArrowUpRight, Braces } from "lucide-react";
import { flagshipCaseStudy } from "@/data/proof";
import { contact } from "@/data/contact";
import RepoToireDiagram from "@/components/RepoToireDiagram";

export default function FlagshipCaseStudy() {
  return (
    <article id="repotoire" className="flagship">
      <div className="flagship-copy">
        <p className="eyebrow">
          <Braces size={16} aria-hidden="true" /> Independent project / In
          development
        </p>
        <h3>{flagshipCaseStudy.title}</h3>
        <p className="project-subtitle">{flagshipCaseStudy.subtitle}</p>
        <p>{flagshipCaseStudy.problem}</p>
        <ul className="technology-list" aria-label="RepoToire technologies">
          {flagshipCaseStudy.proof.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <details className="engineering-notes">
          <summary>
            Inside the runtime{" "}
            <span className="detail-symbol" aria-hidden="true" />
          </summary>
          <div className="notes-body">
            <p>{flagshipCaseStudy.approach}</p>
            <p className="instruction-label">One compiled repair sequence</p>
            <p className="runtime-program" aria-label="Load, test, implement, verify, branch if needed, halt">
              LOAD → TEST → IMPL → VERIFY → BNZ → HALT
            </p>
            <p>
              These are instructions. Each one runs through the five stages
              shown here. TEST runs a repository check; VERIFY dispatches an
              agent to verify the work. BNZ can return to IMPL within a fixed
              retry limit.
            </p>
            <p>{flagshipCaseStudy.result}</p>
            <a
              className="text-link"
              href={`mailto:${contact.email}?subject=RepoToire%20walkthrough`}
            >
              Ask me about RepoToire{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </details>
      </div>
      <RepoToireDiagram />
    </article>
  );
}
