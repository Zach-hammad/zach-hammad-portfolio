import { proofPillars } from "@/data/proof";

export default function ProofPillarsSection() {
  return (
    <div className="capabilities shell" aria-label="Engineering focus">
      {proofPillars.map((pillar) => (
        <div key={pillar.title} className="capability">
          <span
            className="capability-dot"
            style={{ backgroundColor: pillar.accentColor }}
            aria-hidden="true"
          />
          <div>
            <p>{pillar.title}</p>
            <span>{pillar.claim}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
