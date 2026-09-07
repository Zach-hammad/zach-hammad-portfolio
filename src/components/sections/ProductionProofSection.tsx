import { professionalExperience } from "@/data/professional";
import ComputerVisionDiagram from "@/components/ComputerVisionDiagram";
import MemoryDiagram from "@/components/MemoryDiagram";
import VoiceAgentDiagram from "@/components/VoiceAgentDiagram";

export default function ProductionProofSection() {
  return (
    <section
      id="production"
      className="production-section"
      aria-labelledby="production-title"
    >
      <div className="section-context">
        <h3 id="production-title">At Visionary Solutions</h3>
        <p>
          Software Engineer <span aria-hidden="true">/</span> Aug 2025 — Present
        </p>
      </div>
      <p className="work-privacy-note">
        Selected work, with project names and details generalized. Diagrams use illustrative examples.
      </p>
      {professionalExperience.map((experience, index) => (
        <article
          className="work-row work-row-animated"
          id={experience.id}
          key={experience.id}
        >
          <div className="work-index">0{index + 2}</div>
          <div className="work-row-copy">
            <p className="eyebrow">{experience.category}</p>
            <h4>{experience.area}</h4>
            <p className="work-tagline">{experience.description}</p>
            <p className="work-summary">{experience.summary}</p>
            <details className="engineering-notes">
              <summary>
                Engineering notes{" "}
                <span className="detail-symbol" aria-hidden="true" />
              </summary>
              <div className="notes-body">
                {experience.notes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
            </details>
          </div>
          {experience.id === "computer-vision" ? (
            <ComputerVisionDiagram />
          ) : experience.id === "ai-memory" ? (
            <MemoryDiagram />
          ) : (
            <VoiceAgentDiagram />
          )}
        </article>
      ))}
    </section>
  );
}
