import { ArrowUpRight } from "lucide-react";
import ProjectCard from "@/components/cards/ProjectCard";
import ChipDesignDiagram from "@/components/ChipDesignDiagram";
import { projects } from "@/data/projects";
import { contact } from "@/data/contact";

export default function FoundationsSection() {
  return (
    <section id="foundations" className="foundations section-space">
      <div className="shell">
        <div className="work-intro">
          <div>
            <p className="eyebrow">02 / Architecture & experiments</p>
            <h2>Computer architecture.</h2>
          </div>
          <p>
            I love designing pipelines and thinking through how they behave.
            At Drexel, I worked on instruction execution, pipelining, and
            ASIC timing and area.
          </p>
        </div>
        <article className="asic-feature">
          <div className="asic-copy">
            <p className="eyebrow">Drexel / ASIC design I & II</p>
            <h3>Five circuits, different libraries.</h3>
            <p>
              My project partner and I used Tcl scripts and Synopsys tools to
              synthesize and implement five benchmark circuits. We ran them
              across technology libraries, including SkyWater and ASAP7,
              and compared timing and area.
            </p>
            <p className="asic-note">
              Getting the ASAP7 flow to complete took weeks. Much of the work
              was finding the right commands, adapting the scripts, and
              reading the reports to understand what changed between runs.
            </p>
            <ul className="technology-list" aria-label="ASIC tools">
              <li>Tcl</li>
              <li>Design Compiler</li>
              <li>IC Compiler</li>
              <li>Fusion Compiler</li>
            </ul>
            <a
              className="text-link"
              href={`mailto:${contact.email}?subject=ASIC%20project`}
            >
              Ask me about the project{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <ChipDesignDiagram />
          <dl className="asic-details">
            <div>
              <dt>Benchmark circuits</dt>
              <dd>5 completed</dd>
            </div>
            <div>
              <dt>Libraries included</dt>
              <dd>SkyWater / ASAP7</dd>
            </div>
            <div>
              <dt>Compared across runs</dt>
              <dd>Timing & area</dd>
            </div>
          </dl>
        </article>
        <div className="experiments-heading">
          <h3>Architecture projects</h3>
          <p>Simulators, interpreters, and architecture experiments.</p>
        </div>
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              accentColor="var(--brass)"
            />
          ))}
        </div>
        <a
          className="text-link all-projects"
          href={contact.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          More on GitHub <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
