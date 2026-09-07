"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildDragonCurve, getDragonFoldFrame, MAX_DRAGON_ITERATIONS } from "@/lib/dragon-curve";

const DRAW_DURATION_MS = 1800;
const ITERATION_HOLD_MS = 600;
const COMPLETED_CURVE_HOLD_MS = 2200;

type PlaybackFrame = { from: number; to: number; elapsedMs: number };

export default function DragonCurve() {
  const figureRef = useRef<HTMLElement>(null);
  const [frame, setFrame] = useState<PlaybackFrame>({ from: 1, to: 2, elapsedMs: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const curves = useMemo(() => Array.from({ length: MAX_DRAGON_ITERATIONS }, (_, index) => buildDragonCurve(index + 1)), []);
  const iterations = frame.elapsedMs === 0 ? frame.from : frame.to;
  const curve = curves[(reducedMotion ? iterations : Math.min(frame.from, frame.to)) - 1];
  const progress = Math.min(frame.elapsedMs / DRAW_DURATION_MS, 1);
  const easedProgress = progress * progress * (3 - 2 * progress);
  const fold = reducedMotion || frame.from === frame.to ? 0 : frame.to > frame.from ? easedProgress : 1 - easedProgress;
  const drawing = getDragonFoldFrame(curve, fold);
  const segments = curves[iterations - 1].segments;

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionPreference.matches);
    setIsPlaying(!motionPreference.matches);
    if (motionPreference.matches) {
      setFrame({ from: MAX_DRAGON_ITERATIONS, to: MAX_DRAGON_ITERATIONS, elapsedMs: 0 });
    }

    const handleMotionChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
      if (event.matches) {
        setIsPlaying(false);
        setFrame((current) => ({ from: current.to, to: current.to, elapsedMs: 0 }));
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
      // One clock owns drawing, rotation, framing, and holds. Resume never skips a fold.
      const deltaMs = previousTime === undefined ? 0 : Math.min(time - previousTime, 64);
      previousTime = time;
      setFrame((current) => {
        const elapsedMs = current.elapsedMs + deltaMs;
        const atEnd = current.to === MAX_DRAGON_ITERATIONS || current.to === 1;
        const durationMs = DRAW_DURATION_MS + (atEnd ? COMPLETED_CURVE_HOLD_MS : ITERATION_HOLD_MS);
        if (elapsedMs < durationMs) return { ...current, elapsedMs };
        const direction = current.to === MAX_DRAGON_ITERATIONS ? -1 : current.to === 1 ? 1 : Math.sign(current.to - current.from);
        return { from: current.to, to: current.to + direction, elapsedMs: elapsedMs - durationMs };
      });
      requestId = window.requestAnimationFrame(tick);
    };
    requestId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(requestId);
  }, [isPlaying, isVisible, reducedMotion]);

  return (
    <figure ref={figureRef} className="dragon-project">
      <div className="dragon-heading">
        <p className="eyebrow">My first coding project</p>
        <h2>Dragon curve</h2>
      </div>
      <svg
        className="dragon-canvas"
        viewBox={drawing.viewBox}
        role="img"
        aria-labelledby="dragon-title dragon-description"
        fill="none"
      >
        <title id="dragon-title">{`Dragon curve at ${iterations} iterations`}</title>
        <desc id="dragon-description">
          {`A folding fractal made from ${segments} connected line segments.`}
        </desc>
        <path
          className="dragon-base"
          d={curve.path}
          stroke="currentColor"
          strokeWidth="0.45%"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="dragon-fold"
          d={curve.reversePath}
          transform={`rotate(${drawing.rotation} ${drawing.pivot.x} ${drawing.pivot.y})`}
          pathLength={1}
          stroke="currentColor"
          strokeWidth="0.45%"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={1}
          strokeDashoffset={1 - fold}
          opacity={fold === 0 ? 0 : 1}
        />
      </svg>
      <div className="dragon-controls">
        <div className="dragon-control-label">
          <label htmlFor="dragon-iterations">Iterations</label>
          <output htmlFor="dragon-iterations" aria-live="off">{iterations} / {MAX_DRAGON_ITERATIONS}</output>
        </div>
        <input
          id="dragon-iterations"
          type="range"
          min={1}
          max={MAX_DRAGON_ITERATIONS}
          step={1}
          value={iterations}
          aria-valuetext={`${iterations} iterations, ${segments} segments`}
          onFocus={() => setIsPlaying(false)}
          onChange={(event) => {
            setIsPlaying(false);
            const selected = Number(event.target.value);
            setFrame({ from: selected, to: selected, elapsedMs: 0 });
          }}
        />
        <div className="dragon-playback">
          <p className="dragon-segments">{segments.toLocaleString("en-US")} line segments</p>
          <button
            type="button"
            className="dragon-toggle"
            aria-label={reducedMotion ? "Dragon curve animation disabled by reduced-motion preference" : `${isPlaying ? "Pause" : "Play"} dragon curve animation`}
            disabled={reducedMotion}
            onClick={() => {
              if (!isPlaying) {
                setFrame((current) => current.from === current.to
                  ? { from: current.from, to: current.from === MAX_DRAGON_ITERATIONS ? current.from - 1 : current.from + 1, elapsedMs: 0 }
                  : current);
              }
              setIsPlaying((playing) => !playing);
            }}
          >
            {reducedMotion ? "Motion reduced" : isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      </div>
      <figcaption>
        The dragon curve was the first project I ever coded.
        Watch it take shape, or move the slider to explore each fold.
      </figcaption>
    </figure>
  );
}
