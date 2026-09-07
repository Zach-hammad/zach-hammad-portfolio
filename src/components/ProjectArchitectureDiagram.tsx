"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import ArchitectureScene, { ArchitectureKind } from "@/components/ArchitectureScenes";

const STAGE_MS = 3000;
const TRAVEL_MS = 2000;
const github = "https://github.com/Zach-hammad";
const architectures = {
  apu: {
    label: "RepoToire / APU microarchitecture",
    note: "Illustrated software runtime · one instruction shown · CHECK can wait for workers",
    source: `${github}/repotoire-v2/tree/f7ac6edf09847bd58d9bae39c10128753095d9e1/crates/repotoire-cli/src/machine_tick`,
    stages: [
      { label: "FETCH", title: "Read from the approved image", detail: "The program counter selects an instruction from the immutable executable. FETCH records its address and image hash for later stages." },
      { label: "DECODE", title: "Latch the operation", detail: "DECODE recognizes the opcode and saves the typed operation. An unknown opcode stages a trap for RETIRE before any work is dispatched." },
      { label: "ISSUE", title: "Hand work to an execution unit", detail: "ISSUE dispatches agent work or records a test intent. A supervisor runs slow work between ticks, outside the Machine lock." },
      { label: "CHECK", title: "Bring evidence back to the machine", detail: "CHECK validates the worker result or test receipt and its connection to the issued instruction. It stages a verdict for RETIRE, waiting if the work is unfinished." },
      { label: "RETIRE", title: "Publish the checked outcome", detail: "Only RETIRE publishes architectural effects to registers, flags, status, and history. It can advance the PC, retry within a bound, or stop in a trap." },
    ],
  },
  "risc-v": {
    label: "Five-stage RISC-V datapath",
    note: "Coursework C model · conceptual data flow, not a cycle-accurate execution trace",
    source: `${github}/RISC-V/blob/668ca53de6342c7e929fac931a1035f31c7e7254/source%20code/core.c`,
    stages: [
      { label: "Fetch", title: "Start with the program counter", detail: "Fetch reads the instruction at the PC. This example follows a load instruction through the five stage functions." },
      { label: "Decode", title: "Read the base register", detail: "Decode extracts the source register, destination register, and immediate. Hazard logic checks for a load dependency." },
      { label: "Execute", title: "Calculate a memory address", detail: "The ALU adds the base register x2 and the zero offset. Forwarding logic supplies operands for supported dependencies." },
      { label: "Memory", title: "Read the word", detail: "The memory stage uses the calculated address to load data. Other instructions can store a value or pass the ALU result through." },
      { label: "Writeback", title: "Put the loaded value in x5", detail: "The writeback selector chooses memory data for a load and updates the destination register. Register x0 stays zero." },
    ],
  },
  "lc3-vm": {
    label: "LC-3 instruction & I/O loop",
    note: "16-bit C virtual machine · example program state",
    source: `${github}/lc3-vm/blob/982fcd68d9f03af19c7cbfa6096c3444904883bf/main.c`,
    stages: [
      { label: "Fetch", title: "Read a 16-bit word", detail: "The program counter addresses memory. Fetch reads xF021 at x3000, then increments the PC to x3001." },
      { label: "Decode", title: "Recognize a TRAP instruction", detail: "The upper four bits select the TRAP handler. The low byte, x21, selects the OUT routine." },
      { label: "Read R0", title: "Turn a register into a character", detail: "OUT reads R0. In this example it already holds x0041: the character code for A." },
      { label: "Output", title: "Make the machine visible", detail: "The C handler calls putchar and flushes stdout. Other paths support keyboard input and memory-mapped I/O." },
    ],
  },
  "chip-8-sim": {
    label: "CHIP-8 opcode → pixels",
    note: "Python + pygame · an example sprite on a 64 × 32 display",
    source: `${github}/chip_8_sim/blob/dff3721329322386588b9c0cbb9d0e1cb5db90b9/main.py`,
    stages: [
      { label: "Fetch", title: "Combine two bytes", detail: "The interpreter reads two bytes from memory as one 16-bit opcode, then advances the program counter by two." },
      { label: "Decode", title: "Dispatch D015", detail: "The leading D selects draw_sprite. The remaining fields select V0, V1, and a sprite height of five rows." },
      { label: "Locate", title: "Find the sprite and its position", detail: "I points to the font sprite for zero. V0 and V1 place its upper-left pixel at (30, 13)." },
      { label: "Draw", title: "XOR each row into the display", detail: "Each set sprite bit flips a display pixel. This empty-screen example draws a zero and leaves the collision flag VF clear." },
    ],
  },
} satisfies Record<ArchitectureKind, {
  label: string; note: string; source: string;
  stages: { label: string; title: string; detail: string }[];
}>;

function hasArchitecture(slug: string): slug is ArchitectureKind {
  return Object.prototype.hasOwnProperty.call(architectures, slug);
}

function Diagram({ kind, projectTitle }: { kind: ArchitectureKind; projectTitle: string }) {
  const architecture = architectures[kind];
  const figureRef = useRef<HTMLElement>(null);
  const id = useId();
  const [frame, setFrame] = useState({ stage: architecture.stages.length - 1, elapsedMs: TRAVEL_MS });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(preference.matches);
    if (!preference.matches) {
      setFrame({ stage: 0, elapsedMs: 0 });
      setIsPlaying(true);
    }
    const onMotionChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
      if (event.matches) {
        setIsPlaying(false);
        setFrame((current) => ({ ...current, elapsedMs: TRAVEL_MS }));
      }
    };
    let inView = false;
    const updateVisibility = () => setIsVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updateVisibility();
    });
    if (figureRef.current) observer.observe(figureRef.current);
    document.addEventListener("visibilitychange", updateVisibility);
    preference.addEventListener("change", onMotionChange);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
      preference.removeEventListener("change", onMotionChange);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || !isVisible || reducedMotion) return;
    let requestId: number;
    let previousTime: number | undefined;
    const tick = (time: number) => {
      const deltaMs = previousTime === undefined ? 0 : Math.min(time - previousTime, 64);
      previousTime = time;
      // One bounded clock owns the selected stage and every moving signal.
      setFrame((current) => {
        const elapsedMs = current.elapsedMs + deltaMs;
        return elapsedMs < STAGE_MS
          ? { ...current, elapsedMs }
          : { stage: (current.stage + 1) % architecture.stages.length, elapsedMs: elapsedMs - STAGE_MS };
      });
      requestId = window.requestAnimationFrame(tick);
    };
    requestId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(requestId);
  }, [architecture.stages.length, isPlaying, isVisible, reducedMotion]);

  const currentStage = architecture.stages[frame.stage];
  return <figure ref={figureRef} className="architecture-diagram" aria-label={`${projectTitle} diagram`}>
    <figcaption className="architecture-heading"><span>{architecture.label}</span><span>ILLUSTRATED</span></figcaption>
    <ArchitectureScene kind={kind} stage={frame.stage} progress={Math.min(1, frame.elapsedMs / TRAVEL_MS)} id={id} />
    <div className="architecture-steps" role="group" aria-label={`${projectTitle} instruction steps`} onFocusCapture={() => setIsPlaying(false)}>
      {architecture.stages.map((stage, index) => <button
        key={stage.label}
        type="button"
        aria-pressed={index === frame.stage}
        aria-controls={`${id}-detail`}
        onClick={() => { setIsPlaying(false); setFrame({ stage: index, elapsedMs: TRAVEL_MS }); }}
      ><span>{String(index + 1).padStart(2, "0")}</span>{stage.label}</button>)}
    </div>
    <div id={`${id}-detail`} className="architecture-detail" aria-live={isPlaying ? "off" : "polite"} aria-atomic="true">
      <strong>{currentStage.title}</strong>
      <p>{currentStage.detail}</p>
    </div>
    <div className="architecture-footer">
      <button type="button" disabled={reducedMotion} aria-label={reducedMotion ? `${projectTitle} animation disabled by reduced-motion preference` : `${isPlaying ? "Pause" : "Play"} ${projectTitle} animation`} onClick={() => setIsPlaying((current) => !current)}>
        {isPlaying ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
        {reducedMotion ? "Reduced motion" : isPlaying ? "Pause" : "Play"}
      </button>
      <a href={architecture.source} target="_blank" rel="noopener noreferrer" aria-label={`Read ${projectTitle} architecture source`}>Trace in source <ArrowUpRight size={14} aria-hidden="true" /></a>
    </div>
    <p className="architecture-note">{architecture.note}</p>
  </figure>;
}

export default function ProjectArchitectureDiagram({ projectSlug, projectTitle }: { projectSlug: string; projectTitle: string }) {
  return hasArchitecture(projectSlug) ? <Diagram key={projectSlug} kind={projectSlug} projectTitle={projectTitle} /> : null;
}
