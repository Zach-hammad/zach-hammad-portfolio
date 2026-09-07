"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

const STAGE_DURATION_MS = 3400;
const DRAW_DURATION_MS = 1100;
const LOOP_FADE_MS = 550;
const stages = [
  {
    name: "Decode",
    detail: "Decode a video into frames that can be analyzed by a model.",
    tool: "Video decoding",
  },
  {
    name: "Detect",
    detail: "Detect objects and follow them across consecutive frames.",
    tool: "Object detection / tracking",
  },
  {
    name: "Crop",
    detail: "Extract an image of a detected object for closer inspection.",
    tool: "Image extraction",
  },
  {
    name: "Store",
    detail: "Make the extracted image and its source available to the application.",
    tool: "Results / application",
  },
] as const;

function smooth(value: number) {
  const bounded = Math.max(0, Math.min(1, value));
  return bounded * bounded * (3 - 2 * bounded);
}

export default function ComputerVisionDiagram() {
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
      // The frame, crop, captions, and loop fade share one pausable clock.
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
  const detection = frame.stage < 1 ? 0 : frame.stage > 1 ? 1 : progress;
  const crop = frame.stage < 2 ? 0 : frame.stage > 2 ? 1 : progress;
  const stored = frame.stage === 3 ? progress : 0;
  const sceneOpacity = frame.stage === 0
    ? smooth(frame.elapsedMs / LOOP_FADE_MS)
    : frame.stage === 3
      ? 1 - smooth((frame.elapsedMs - STAGE_DURATION_MS + LOOP_FADE_MS) / LOOP_FADE_MS)
      : 1;

  return (
    <figure ref={figureRef} className="vision-diagram" aria-label="Computer vision example">
      <figcaption className="vision-heading">
        <span>FROM VIDEO TO DETECTIONS</span>
        <span>SIMPLIFIED EXAMPLE</span>
      </figcaption>
      <svg className="vision-scene" viewBox="0 0 520 276" fill="none" aria-hidden="true">
        <defs>
          <g id={`${id}-vehicle`}>
            <path d="M0 30L10 13L35 9L48-8H96L114 9L138 18L143 37H128M12 37H0V30M40 37H100" />
            <path d="M42 9L52-2H89L102 9ZM76-2V9M50 16H95M3 25H15M130 23H140" />
            <circle cx="26" cy="37" r="14" />
            <circle cx="114" cy="37" r="14" />
            <circle cx="26" cy="37" r="5" />
            <circle cx="114" cy="37" r="5" />
          </g>
        </defs>
        <text x="12" y="17" className="vision-svg-label">SOURCE FRAME</text>
        <text x="348" y="17" className="vision-svg-label">OBJECT CROP</text>
        <rect x="12" y="32" width="298" height="202" className="vision-frame" />
        <rect x="338" y="52" width="170" height="126" className="vision-crop-outline" />
        <g opacity={sceneOpacity}>
          <path d="M13 112H309M30 112V67H72V112M79 112V49H121V112M270 112V75H296V112M13 196H309M46 233L108 196M265 233L228 196" className="vision-scenery" />
          <path d="M30 215H74M137 215H181M244 215H289" className="vision-road" />
          <use href={`#${id}-vehicle`} transform={`translate(${98 - (frame.stage === 0 ? (1 - progress) * 18 : 0)} 140)`} className="vision-vehicle" />
          <g opacity={detection}>
            <path d="M39 173H81" className="vision-track-history" strokeDasharray="3 5" />
            <rect x="87" y="120" width="164" height="73" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - detection} className="vision-detection" />
            <rect x="87" y="101" width="81" height="19" fill="#b9a77a" />
            <text x="93" y="114" className="vision-object-label">VEHICLE</text>
          </g>
          <path d="M252 156H288V115H335" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - crop} opacity={crop} className="vision-transfer" />
          <g opacity={crop} transform={`translate(${87 + crop * 256} ${120 - crop * 52}) scale(${1 - crop * 0.06})`}>
            <rect width="164" height="105" className="vision-crop" />
            <use href={`#${id}-vehicle`} transform="translate(10 40)" className="vision-vehicle" />
          </g>
          <g opacity={stored}>
            <path d="M350 198L354 202L362 193M350 221L354 225L362 216M350 244L354 248L362 239" className="vision-checks" />
            <text x="371" y="202" className="vision-result-label">SOURCE VIDEO</text>
            <text x="371" y="225" className="vision-result-label">FRAME + TRACK</text>
            <text x="371" y="248" className="vision-result-label">STORED CROP</text>
          </g>
        </g>
        <path d="M12 253H310" className="vision-frame-progress" />
        <path d="M12 253H310" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - (frame.stage + Math.min(frame.elapsedMs / STAGE_DURATION_MS, 1)) / stages.length} className="vision-progress" />
      </svg>
      <div className="vision-stages" role="group" aria-label="Explore the video pipeline" onFocusCapture={() => setIsPlaying(false)}>
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
      <div id={`${id}-detail`} className="vision-details" aria-live={isPlaying ? "off" : "polite"} aria-atomic="true">
        {stages.map((stage, index) => (
          <div key={stage.name} data-active={frame.stage === index} aria-hidden={frame.stage !== index}>
            <p>{stage.detail}</p>
            <small>{stage.tool}</small>
          </div>
        ))}
      </div>
      <div className="vision-playback">
        <span>Follow a frame through the pipeline.</span>
        <button
          type="button"
          aria-label={reducedMotion ? "Computer vision animation disabled by reduced-motion preference" : `${isPlaying ? "Pause" : "Play"} Computer vision animation`}
          disabled={reducedMotion}
          onClick={() => setIsPlaying((playing) => !playing)}
        >
          {isPlaying ? <Pause size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}
          {reducedMotion ? "Motion reduced" : isPlaying ? "Pause" : "Play"}
        </button>
      </div>
      <div className="vision-training">
        <p className="eyebrow">Developing the model</p>
        <ol aria-label="Model development steps">
          <li>Label</li><li>Train</li><li>Evaluate</li><li>Export ONNX</li>
        </ol>
        <p>Reviewed datasets. YOLO training. Experiments tracked in MLflow.</p>
      </div>
    </figure>
  );
}
