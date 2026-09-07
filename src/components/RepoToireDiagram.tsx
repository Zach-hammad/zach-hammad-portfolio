"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, Pause, Play } from "lucide-react";

const STAGE_HOLD_MS = 2600;
const STAGE_TRAVEL_MS = 1200;
const STAGE_DURATION_MS = STAGE_HOLD_MS + STAGE_TRAVEL_MS;
const FLOW_PATH = "M50 24H450C480 24 480 68 450 68H50C20 68 20 24 50 24";

const stages = [
  {
    name: "FETCH",
    title: "Read the next instruction.",
    detail:
      "The runtime reads the program counter and latches an instruction from the approved executable. Later stages check that they are still using the same image.",
    boundary: "Input: approved executable + program counter",
  },
  {
    name: "DECODE",
    title: "Determine what kind of work it is.",
    detail:
      "Each opcode selects agent work, a deterministic test, or control flow. An unknown instruction stages a trap before any work is dispatched.",
    boundary: "Agent work · Tests · Control flow",
  },
  {
    name: "ISSUE",
    title: "Dispatch work within its scope.",
    detail:
      "Agent instructions dispatch to a worker. TEST records an intent for the test runner. The pipeline can park while supervised work runs outside the Machine lock.",
    boundary: "Workers and test tools return results to the runtime",
  },
  {
    name: "CHECK",
    title: "Check the evidence that came back.",
    detail:
      "The runtime validates receipts, worker identity, and required gates. A failed check and a failed tool are distinct outcomes; an unknown effect cannot count as success.",
    boundary: "A worker’s completion claim is one input to the checks",
  },
  {
    name: "RETIRE",
    title: "Advance the Machine’s state.",
    detail:
      "The runtime applies the checked outcome to registers, flags, and history. It advances, retries within a bound, or traps. Workers cannot declare their own retirement.",
    boundary: "This commits runtime state; it is not a Git commit",
  },
] as const;

export default function RepoToireDiagram() {
  const figureRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [frame, setFrame] = useState({ stage: 0, elapsedMs: 0 });
  const [pathLength, setPathLength] = useState(940);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const selected = stages[frame.stage];
  const travel = Math.max(0, (frame.elapsedMs - STAGE_HOLD_MS) / STAGE_TRAVEL_MS);
  const easedTravel = travel * travel * (3 - 2 * travel);
  const distance = frame.stage < stages.length - 1
    ? frame.stage * 100 + easedTravel * 100
    : 400 + easedTravel * (pathLength - 400);

  useEffect(() => {
    if (pathRef.current) setPathLength(pathRef.current.getTotalLength());
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionPreference.matches);
    setIsPlaying(!motionPreference.matches);
    const handleMotionChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
      if (event.matches) setIsPlaying(false);
    };
    let isInView = false;
    const updateVisibility = () => setIsVisible(isInView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      isInView = entry.isIntersecting;
      updateVisibility();
    });
    if (figureRef.current) observer.observe(figureRef.current);
    document.addEventListener("visibilitychange", updateVisibility);
    motionPreference.addEventListener("change", handleMotionChange);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
      motionPreference.removeEventListener("change", handleMotionChange);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || !isVisible || reducedMotion) return;
    let requestId: number;
    let previousTime: number | undefined;
    const tick = (time: number) => {
      const deltaMs = previousTime === undefined ? 0 : Math.min(time - previousTime, 64);
      previousTime = time;
      // One clock owns the trace and stage selection; pausing preserves its position.
      setFrame((current) => {
        const elapsedMs = current.elapsedMs + deltaMs;
        return elapsedMs < STAGE_DURATION_MS
          ? { ...current, elapsedMs }
          : { stage: (current.stage + 1) % stages.length, elapsedMs: elapsedMs - STAGE_DURATION_MS };
      });
      requestId = window.requestAnimationFrame(tick);
    };
    requestId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(requestId);
  }, [isPlaying, isVisible, reducedMotion]);

  return (
    <figure ref={figureRef} className="runtime-diagram" aria-label="RepoToire architecture">
      <figcaption className="diagram-label">
        <span>FROM GOAL TO EXECUTION</span>
        <span>RUST</span>
      </figcaption>
      <p className="runtime-input">Your goal + current codebase context</p>
      <ArrowDown className="diagram-arrow" size={16} aria-hidden="true" />
      <ol className="runtime-preparation">
        <li>
          <span className="stage-index" aria-hidden="true">01</span>
          <span><strong>Goal Program</strong><small>Targets, constraints, success criteria</small></span>
        </li>
        <li>
          <span className="stage-index" aria-hidden="true">02</span>
          <span><strong>Compiler → executable</strong><small>Validated instructions and repository checks</small></span>
        </li>
        <li>
          <span className="stage-index" aria-hidden="true">03</span>
          <span><strong>Human approval</strong><small>Bound to this executable’s exact image hash</small></span>
        </li>
      </ol>
      <ArrowDown className="diagram-arrow" size={16} aria-hidden="true" />
      <div className="runtime-engine">
        <div className="runtime-engine-label">
          <span>AGENT PROCESSING UNIT</span>
          <span>FOLLOW AN INSTRUCTION ↓</span>
        </div>
        <div
          className="runtime-stage-controls"
          role="group"
          aria-label="Explore the five execution stages"
          onFocusCapture={() => setIsPlaying(false)}
        >
          {stages.map((stage, index) => (
            <button
              type="button"
              key={stage.name}
              aria-pressed={selected.name === stage.name}
              aria-controls="runtime-stage-detail"
              onClick={() => {
                setIsPlaying(false);
                setFrame({ stage: index, elapsedMs: 0 });
              }}
            >
              {stage.name}
            </button>
          ))}
        </div>
        <svg className="runtime-flow" viewBox="0 0 500 92" fill="none" aria-hidden="true">
          <path ref={pathRef} d={FLOW_PATH} className="runtime-flow-track" />
          <path
            d={FLOW_PATH}
            className="runtime-flow-trace"
            pathLength={1}
            strokeDasharray={`${36 / pathLength} ${1 - 36 / pathLength}`}
            strokeDashoffset={-(distance - 36) / pathLength}
          />
          {stages.map((stage, index) => (
            <circle
              key={stage.name}
              cx={50 + index * 100}
              cy={24}
              r={4}
              className="runtime-flow-node"
              data-active={selected.name === stage.name}
            />
          ))}
        </svg>
        <div className="runtime-playback">
          <span aria-live="off">{String(frame.stage + 1).padStart(2, "0")} / 05 · {selected.name}</span>
          <button
            type="button"
            className="runtime-toggle"
            aria-label={reducedMotion ? "Animation disabled by reduced-motion preference" : `${isPlaying ? "Pause" : "Play"} RepoToire animation`}
            disabled={reducedMotion}
            onClick={() => setIsPlaying((playing) => !playing)}
          >
            {isPlaying ? <Pause size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}
            {reducedMotion ? "Motion reduced" : isPlaying ? "Pause" : "Play"}
          </button>
        </div>
        <div id="runtime-stage-detail" className="runtime-stage-detail" aria-live={isPlaying ? "off" : "polite"} aria-atomic="true">
          {stages.map((stage) => (
            <div
              key={stage.name}
              className="runtime-stage-copy"
              data-active={selected.name === stage.name}
              aria-hidden={selected.name !== stage.name}
            >
              <h4>{stage.title}</h4>
              <p>{stage.detail}</p>
              <small>{stage.boundary}</small>
            </div>
          ))}
        </div>
      </div>
      <p className="diagram-caption">
        Each instruction passes through these five stages. This diagram
        explains the design; it is not a live execution trace.
      </p>
    </figure>
  );
}
