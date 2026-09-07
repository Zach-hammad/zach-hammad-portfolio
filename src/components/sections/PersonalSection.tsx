import { personalSections } from "@/data/personal";

function TrainingIllustration() {
  return (
    <svg viewBox="0 0 520 310" fill="none" aria-hidden="true" focusable="false">
      <path d="M50 252H470M91 267H429" stroke="currentColor" opacity=".2" />
      <g stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
        <path d="m211 57-51 22-63 84 53 34 34-43-9 99h170l-9-99 34 43 53-34-63-84-51-22" fill="var(--forest-panel)" />
        <path d="m211 57 49 16 49-16-12 52-49 100-36-14 63-124" />
        <path d="m211 57 12 52 23 46m-32-90 25 57m64-58-69 135" />
        <path d="m160 79 24 75m176-75-24 75M108 150l53 33m198 0 53-33" opacity=".55" />
        <path d="m188 184 69 9 78-9 1 20-80 8-70-8z" fill="var(--forest-panel)" />
        <path d="m251 191 21 2 4 21-24 3-8-14z" fill="var(--forest-panel)" />
        <path d="m253 213-20 61 23 5 11-64m5-1 13 55 23-6-32-51" fill="var(--forest-panel)" />
        <path d="m197 226-2 16h32m77 0h24l-2-16m-84 39 14 4m31-15 13-3" opacity=".45" />
        <path d="m148 116-13 17m235-17 13 17" strokeDasharray="2 4" opacity=".6" />
      </g>
    </svg>
  );
}

function FilmIllustration() {
  return (
    <svg viewBox="0 0 520 310" fill="none" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
        <path d="m324 118 73 17-26 132-97-22 13-63" opacity=".35" />
        <path d="m330 137 48 11-16 77-51-12" opacity=".35" />
        <path d="m154 158-10-50 18-57h151l20 57-10 50" fill="var(--surface)" />
        <path d="M151 87h174M160 68h38m-38 6h26" opacity=".5" />
        <rect x="278" y="61" width="29" height="17" rx="2" />
        <path d="m144 108-14 55 15 43h186l16-43-14-55z" fill="var(--surface)" />
        <path d="M130 163h217m-185 20h151" />
        <circle cx="238" cy="125" r="31" fill="var(--surface)" />
        <circle cx="238" cy="125" r="22" />
        <path d="M223 125a15 15 0 0 1 15-15" opacity=".5" />
        <circle cx="176" cy="126" r="7" />
        <path d="M291 116h26v18h-26z" />
        <path d="m181 184-7 97h130l-8-97" fill="var(--surface)" />
        <path d="m190 195-4 60h105l-5-60z" />
        <path d="m188 237 28-22 23 16 13-8 37 25m-80-8 11-9 15 10" opacity=".55" />
        <circle cx="266" cy="210" r="6" opacity=".55" />
      </g>
      <path d="M82 281h77m166 0h113" stroke="currentColor" opacity=".2" />
    </svg>
  );
}

export default function PersonalSection() {
  return (
    <section id="about" className="shell section-space personal-section">
      <div className="work-intro">
        <div>
          <p className="eyebrow">03 / About me</p>
          <h2>Outside work.</h2>
        </div>
      </div>
      <div className="personal-grid">
        {personalSections.map((section, index) => (
          <article key={section.title} className={`personal-story personal-story-${index === 0 ? "training" : "film"}`}>
            <div className="personal-art">
              <span className="eyebrow">{index === 0 ? "On the mat" : "On the road"}</span>
              {index === 0 ? <TrainingIllustration /> : <FilmIllustration />}
            </div>
            <div className="personal-story-copy">
              <h3>{section.title}</h3>
              <p>{section.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
