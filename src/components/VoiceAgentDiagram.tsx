"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

const STAGE_DURATION_MS = 3800;
const DRAW_DURATION_MS = 1450;
const LOOP_FADE_MS = 550;
const stages = [
  {
    name: "Listen",
    detail: "A caller asks what is available. The voice provider carries the conversation; application tools handle the request.",
    tool: "Vapi / OpenAI Realtime",
  },
  {
    name: "Bind",
    detail: "Check the caller’s context and permissions before taking an action.",
    tool: "Caller context / access checks",
  },
  {
    name: "Search",
    detail: "An application tool looks up relevant information for the caller’s request.",
    tool: "TypeScript / application tools",
  },
  {
    name: "Reply",
    detail: "The tool returns a result so the assistant can answer using information from the application.",
    tool: "Tool result / conversation continues",
  },
] as const;
const providers = [{ id: "vapi", name: "Vapi" }, { id: "realtime", name: "OpenAI Realtime" }] as const;
const waveform = Array.from({ length: 28 }, (_, index) => index);

function smooth(value: number) {
  const bounded = Math.max(0, Math.min(1, value));
  return bounded * bounded * (3 - 2 * bounded);
}

export default function VoiceAgentDiagram() {
  const figureRef = useRef<HTMLElement>(null);
  const id = useId();
  const [provider, setProvider] = useState<"vapi" | "realtime">("vapi");
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
      // The voice waveform, request, and reply share one pausable clock.
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
  const bound = frame.stage < 1 ? 0 : frame.stage === 1 ? progress : 1;
  const search = frame.stage < 2 ? 0 : frame.stage === 2 ? progress : 1;
  const reply = frame.stage === 3 ? progress : 0;
  const sceneOpacity = frame.stage === 0
    ? smooth(frame.elapsedMs / LOOP_FADE_MS)
    : frame.stage === 3
      ? 1 - smooth((frame.elapsedMs - STAGE_DURATION_MS + LOOP_FADE_MS) / LOOP_FADE_MS)
      : 1;
  const isVapi = provider === "vapi";
  const voiceTime = frame.stage === 0 || frame.stage === 3 ? frame.elapsedMs / 250 : 0;

  return (
    <figure ref={figureRef} className="voice-diagram" aria-label="Voice agent tool flow">
      <figcaption className="voice-heading">
        <span>FROM A QUESTION TO AN ANSWER</span>
        <span>SIMPLIFIED EXAMPLE</span>
      </figcaption>
        <div className="voice-request" data-provider={provider} aria-hidden="true">
          <div className="voice-waveform">
            {waveform.map((index) => {
              const envelope = Math.sin((index + 1) / (waveform.length + 1) * Math.PI);
              const amplitude = 0.3 + 0.7 * Math.abs(Math.sin(index * 1.7 + voiceTime));
              return <span key={index} style={{ height: `${4 + 26 * envelope * amplitude}px` }} />;
            })}
          </div>
          <p>“What is available this week?”</p>
        </div>
      <div className="voice-providers" role="group" aria-label="Choose the voice provider">
        {providers.map((option) => (
          <button
            type="button"
            key={option.id}
            aria-pressed={provider === option.id}
            aria-controls={`${id}-scene`}
            onClick={() => setProvider(option.id)}
          >{option.name}</button>
        ))}
      </div>
      <div id={`${id}-scene`} className="voice-call" aria-hidden="true">
        <svg className="voice-scene" viewBox="0 60 440 238" fill="none">
          <path d="M220 0V290M8 188H432" className="voice-construction" strokeDasharray="2 6" />
          <g opacity={sceneOpacity}>
            <path d={isVapi ? "M100 60V78Q100 88 110 88H210Q220 88 220 98V116" : "M340 60V78Q340 88 330 88H230Q220 88 220 98V116"} className="voice-edge" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - bound} opacity={bound} />
            <g opacity={bound}>
              <rect x="85" y="116" width="270" height="58" className="voice-context" />
              <text x="220" y="141" textAnchor="middle" className="voice-node-title">Call context</text>
              <text x="220" y="161" textAnchor="middle" className="voice-svg-note">CONTEXT + PERMISSIONS</text>
            </g>
            <path d="M220 174V220M215 214L220 220L225 214" className="voice-edge" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - search} opacity={search} />
            <g opacity={search}>
              <rect x="85" y="220" width="270" height="62" className="voice-node" />
              <text x="220" y="247" textAnchor="middle" className="voice-node-title">Search availability</text>
              <text x="220" y="268" textAnchor="middle" className="voice-svg-note">APPLICATION TOOL</text>
            </g>
            <g opacity={reply}>
              <rect x="85" y="220" width="270" height="62" className="voice-reply-edge" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - reply} />
              <path d={isVapi ? "M85 251H30Q20 251 20 241V80Q20 70 30 70H55Q65 70 65 60" : "M355 251H410Q420 251 420 241V80Q420 70 410 70H385Q375 70 375 60"} className="voice-reply-edge" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - reply} />
              <path d={isVapi ? "M60 66L65 60L70 66" : "M370 66L375 60L380 66"} className="voice-reply-edge" opacity={smooth(reply * 3 - 2)} />
            </g>
          </g>
        </svg>
        <div className="voice-result">
          <div className="voice-result-heading"><span>TOOL RESULT</span><span style={{ opacity: reply * sceneOpacity }}>BACK TO {isVapi ? "VAPI" : "REALTIME"}</span></div>
          <div className="voice-result-content">
            <p style={{ opacity: (1 - smooth(reply * 2)) * sceneOpacity }}>A spoken request becomes an application query.</p>
            <p style={{ opacity: smooth(reply * 2 - 1) * sceneOpacity }}>Available options<small>From the application’s results.</small></p>
          </div>
        </div>
      </div>
      <div className="voice-stages" role="group" aria-label="Explore the voice agent flow" onFocusCapture={() => setIsPlaying(false)}>
        {stages.map((stage, index) => (
          <button key={stage.name} type="button" aria-pressed={frame.stage === index} aria-controls={`${id}-detail`}
            onClick={() => { setIsPlaying(false); setFrame({ stage: index, elapsedMs: DRAW_DURATION_MS }); }}>
            <span aria-hidden="true">0{index + 1}</span>{stage.name}
          </button>
        ))}
      </div>
      <div id={`${id}-detail`} className="voice-details" aria-live={isPlaying ? "off" : "polite"} aria-atomic="true">
        {stages.map((stage, index) => (
          <div key={stage.name} data-active={frame.stage === index} aria-hidden={frame.stage !== index}>
            <p>{stage.detail}</p><small>{stage.tool}</small>
          </div>
        ))}
      </div>
      <div className="voice-playback">
        <span>Follow a request through a voice agent.</span>
        <button type="button"
          aria-label={reducedMotion ? "Voice agent animation disabled by reduced-motion preference" : `${isPlaying ? "Pause" : "Play"} Voice agent animation`}
          disabled={reducedMotion} onClick={() => setIsPlaying((playing) => !playing)}>
          {isPlaying ? <Pause size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}
          {reducedMotion ? "Motion reduced" : isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </figure>
  );
}
