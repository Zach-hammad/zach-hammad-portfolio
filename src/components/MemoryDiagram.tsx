"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

const STAGE_DURATION_MS = 3600;
const DRAW_DURATION_MS = 1350;
const LOOP_FADE_MS = 550;
const stages = [
  {
    name: "Resolve",
    detail: "Match information to the right person, while accounting for uncertain or incomplete evidence.",
    tool: "Identity matching",
  },
  {
    name: "Extract",
    detail: "Turn conversation text into structured information that an application can use.",
    tool: "Python / LLM extraction",
  },
  {
    name: "Connect",
    detail: "Connect related information while preserving its source and time.",
    tool: "Neo4j / source-linked evidence",
  },
  {
    name: "Retrieve",
    detail: "Retrieve relevant context for a later request, subject to access and consent checks.",
    tool: "Context retrieval / source references",
  },
] as const;

function smooth(value: number) {
  const bounded = Math.max(0, Math.min(1, value));
  return bounded * bounded * (3 - 2 * bounded);
}

export default function MemoryDiagram() {
  const figureRef = useRef<HTMLElement>(null);
  const id = useId();
  const [frame, setFrame] = useState({ stage: 3, elapsedMs: DRAW_DURATION_MS });
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
    const handleMotionChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
      if (event.matches) {
        setIsPlaying(false);
        setFrame((current) => ({ ...current, elapsedMs: DRAW_DURATION_MS }));
      }
    };
    let isInView = false;
    const updateVisibility = () => setIsVisible(isInView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      isInView = entry.isIntersecting;
      updateVisibility();
    });
    if (figureRef.current) observer.observe(figureRef.current);
    document.addEventListener("visibilitychange", updateVisibility);
    preference.addEventListener("change", handleMotionChange);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
      preference.removeEventListener("change", handleMotionChange);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || !isVisible || reducedMotion) return;
    let requestId: number;
    let previousTime: number | undefined;
    const tick = (time: number) => {
      const deltaMs = previousTime === undefined ? 0 : Math.min(time - previousTime, 64);
      previousTime = time;
      // Every drawn edge and the returned context use the same pausable clock.
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

  const progress = smooth(frame.elapsedMs / DRAW_DURATION_MS);
  const identity = frame.stage === 0 ? progress : 1;
  const extraction = frame.stage < 1 ? 0 : frame.stage === 1 ? progress : 1;
  const connection = frame.stage < 2 ? 0 : frame.stage === 2 ? progress : 1;
  const retrieval = frame.stage === 3 ? progress : 0;
  const sceneOpacity = frame.stage === 0
    ? smooth(frame.elapsedMs / LOOP_FADE_MS)
    : frame.stage === 3
      ? 1 - smooth((frame.elapsedMs - STAGE_DURATION_MS + LOOP_FADE_MS) / LOOP_FADE_MS)
      : 1;

  return (
    <figure ref={figureRef} className="kg-diagram" aria-label="AI memory example">
      <figcaption className="kg-heading">
        <span>FROM CONVERSATION TO CONTEXT</span>
        <span>SIMPLIFIED EXAMPLE</span>
      </figcaption>
      <svg className="kg-scene" viewBox="0 0 440 278" fill="none" aria-hidden="true">
        <path d="M220 14V266M8 66H432M8 193H432" className="kg-construction" strokeDasharray="2 6" />
        <g opacity={sceneOpacity}>
          <g opacity={identity}>
            <path d="M120 66H184" className="kg-edge" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - identity} />
            <rect x="8" y="42" width="112" height="48" className="kg-node" />
            <text x="64" y="71" textAnchor="middle" className="kg-node-title">Identifier</text>
            <circle cx="220" cy="66" r="36" className="kg-person" />
            <text x="220" y="72" textAnchor="middle" className="kg-node-title">Profile</text>
            <text x="277" y="63" className="kg-svg-note">ONE IDENTITY</text>
            <text x="277" y="82" className="kg-svg-note">ACROSS SOURCES</text>
          </g>
          <g opacity={extraction}>
            <rect x="8" y="153" width="166" height="81" className="kg-node" />
            <text x="22" y="177" className="kg-node-title">Conversation</text>
            <text x="22" y="201" className="kg-quote">“Friday works.”</text>
            <text x="22" y="220" className="kg-svg-note">ORIGINAL STATEMENT</text>
            <path d="M174 193H276" className="kg-edge" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - extraction} />
            <path d="M269 189L276 193L269 197" className="kg-edge" opacity={extraction} />
            <text x="225" y="180" textAnchor="middle" className="kg-svg-note">EXTRACT</text>
            <rect x="276" y="153" width="156" height="81" className="kg-node" />
            <text x="290" y="177" className="kg-node-title">Preference</text>
            <text x="290" y="201" className="kg-quote">Friday</text>
            <text x="290" y="220" className="kg-svg-note">STATED PREFERENCE</text>
          </g>
          <g opacity={connection}>
            <path d="M220 102V115Q220 130 202 130H109Q91 130 91 148V153" className="kg-edge" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - connection} />
            <circle cx="91" cy="153" r="3" className="kg-junction" />
            <path d="M22 253L26 257L33 248" className="kg-source-mark" />
            <text x="42" y="257" className="kg-svg-note">SOURCE + TIME RETAINED</text>
          </g>
          <g opacity={retrieval}>
            <path d="M355 234V250Q355 260 365 260H432" className="kg-read-edge" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - retrieval} />
            <circle cx="432" cy="260" r="3" className="kg-read-dot" />
            <rect x="276" y="153" width="156" height="81" className="kg-read-edge" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - retrieval} />
          </g>
        </g>
      </svg>
      <div className="kg-readout" aria-hidden="true">
        <div className="kg-readout-heading">
          <span>ON A LATER READ</span>
          <span style={{ opacity: retrieval * sceneOpacity }}>Scope + consent checked</span>
        </div>
        <div className="kg-readout-content">
          <p style={{ opacity: (1 - smooth(retrieval * 2)) * sceneOpacity }}>Context keeps a path back to the source.</p>
          <p style={{ opacity: smooth(retrieval * 2 - 1) * sceneOpacity }}><span>Preference:</span> Friday <small>↳ Conversation · original statement</small></p>
        </div>
      </div>
      <div className="kg-stages" role="group" aria-label="Explore AI memory" onFocusCapture={() => setIsPlaying(false)}>
        {stages.map((stage, index) => (
          <button
            key={stage.name}
            type="button"
            aria-pressed={frame.stage === index}
            aria-controls={`${id}-detail`}
            onClick={() => {
              setIsPlaying(false);
              setFrame({ stage: index, elapsedMs: DRAW_DURATION_MS });
            }}
          >
            <span aria-hidden="true">0{index + 1}</span>{stage.name}
          </button>
        ))}
      </div>
      <div id={`${id}-detail`} className="kg-details" aria-live={isPlaying ? "off" : "polite"} aria-atomic="true">
        {stages.map((stage, index) => (
          <div key={stage.name} data-active={frame.stage === index} aria-hidden={frame.stage !== index}>
            <p>{stage.detail}</p>
            <small>{stage.tool}</small>
          </div>
        ))}
      </div>
      <div className="kg-playback">
        <span>Follow a statement into memory.</span>
        <button
          type="button"
          aria-label={reducedMotion ? "AI memory animation disabled by reduced-motion preference" : `${isPlaying ? "Pause" : "Play"} AI memory animation`}
          disabled={reducedMotion}
          onClick={() => setIsPlaying((playing) => !playing)}
        >
          {isPlaying ? <Pause size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}
          {reducedMotion ? "Motion reduced" : isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </figure>
  );
}
