"use client";

import { useEffect, useRef, useState, useMemo } from "react";

/**
 * Dragon Curve fractal that grows as the user scrolls.
 *
 * Uses stroke-dashoffset on a pre-computed SVG path for GPU-accelerated
 * scroll-driven animation. The curve is generated once at mount using
 * the L-system turn sequence, then progressively revealed via CSS.
 *
 * Stroke color transitions to match the current stage/section accent.
 */

// Color stops matching hero stages + content sections
const COLOR_STOPS = [
  { at: 0.0, color: [74, 222, 128] },   // #4ade80 green — transistors
  { at: 0.15, color: [96, 165, 250] },   // #60a5fa blue — logic gates
  { at: 0.30, color: [245, 158, 11] },   // #f59e0b amber — chip die
  { at: 0.45, color: [252, 165, 165] },  // #fca5a5 red — assembly
  { at: 0.60, color: [216, 180, 254] },  // #d8b4fe purple — source code
  { at: 0.75, color: [192, 132, 252] },  // #c084fc purple — software section
  { at: 1.0, color: [192, 132, 252] },   // hold
] as const;

/** Interpolate between COLOR_STOPS at a given scroll fraction (clamped 0–1). */
function lerpColor(scrollFraction: number): string {
  const clamped = Math.max(0, Math.min(1, scrollFraction));
  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    const a = COLOR_STOPS[i];
    const b = COLOR_STOPS[i + 1];
    if (clamped >= a.at && clamped <= b.at) {
      const t = (clamped - a.at) / (b.at - a.at);
      const r = Math.round(a.color[0] + (b.color[0] - a.color[0]) * t);
      const g = Math.round(a.color[1] + (b.color[1] - a.color[1]) * t);
      const bl = Math.round(a.color[2] + (b.color[2] - a.color[2]) * t);
      return `rgb(${r},${g},${bl})`;
    }
  }
  const last = COLOR_STOPS[COLOR_STOPS.length - 1];
  return `rgb(${last.color[0]},${last.color[1]},${last.color[2]})`;
}

function generateDragonCurve(iterations: number) {
  // Build the turn sequence: at each iteration, take the reversed sequence
  // with flipped turns, then append. 0 = right turn, 1 = left turn.
  let turns: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const flipped = turns
      .slice()
      .reverse()
      .map((t) => 1 - t);
    turns = [...turns, 0, ...flipped];
  }

  // Walk the turn sequence to produce points.
  // Direction: 0=right, 1=down, 2=left, 3=up
  const dx = [1, 0, -1, 0];
  const dy = [0, 1, 0, -1];
  let dir = 1;
  const points = [{ x: 0, y: 0 }];
  for (const turn of turns) {
    // turn 0 = turn right (+1), turn 1 = turn left (-1)
    dir = (dir + (turn === 0 ? 1 : 3)) % 4;
    const last = points[points.length - 1];
    points.push({ x: last.x + dx[dir], y: last.y + dy[dir] });
  }
  // The first segment before any turn
  const first = points[0];
  points.unshift({ x: first.x - dx[0], y: first.y - dy[0] });

  return points;
}

function pointsToPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i].x} ${points[i].y}`;
  }
  return d;
}

export default function DragonCurveBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const stop0Ref = useRef<SVGStopElement>(null);
  const stop1Ref = useRef<SVGStopElement>(null);
  const stop2Ref = useRef<SVGStopElement>(null);
  const [totalLength, setTotalLength] = useState(0);

  const { path, viewBox } = useMemo(() => {
    const points = generateDragonCurve(14); // 2^14 = 16384 segments

    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    for (const p of points) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }

    const pad = 2;
    const vb = `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}`;
    const d = pointsToPath(points);

    return { path: d, viewBox: vb };
  }, []);

  useEffect(() => {
    if (!pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    setTotalLength(len);
    pathRef.current.style.strokeDasharray = `${len}`;
    // Show first 15% on load — visible immediately
    pathRef.current.style.strokeDashoffset = `${len * 0.85}`;
  }, [path]);

  useEffect(() => {
    if (!totalLength || !pathRef.current) return;

    function onScroll() {
      if (!pathRef.current || !containerRef.current) return;

      const scrollY = window.scrollY;
      const totalScrollRange =
        document.documentElement.scrollHeight - window.innerHeight;

      if (totalScrollRange <= 0) return;

      const scrollProgress = Math.min(scrollY / totalScrollRange, 1);

      // 15% baseline + 85% scroll-driven
      const progress = 0.15 + scrollProgress * 0.85;
      pathRef.current.style.strokeDashoffset = `${totalLength * (1 - progress)}`;

      // Shift vertical gradient to match current stage colors.
      // ±0.18 spread shows ~one stage transition in the viewport.
      const spread = 0.18;
      const topColor = lerpColor(scrollProgress - spread);
      const midColor = lerpColor(scrollProgress);
      const botColor = lerpColor(scrollProgress + spread);

      if (stop0Ref.current) stop0Ref.current.setAttribute("stop-color", topColor);
      if (stop1Ref.current) stop1Ref.current.setAttribute("stop-color", midColor);
      if (stop2Ref.current) stop2Ref.current.setAttribute("stop-color", botColor);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial
    return () => window.removeEventListener("scroll", onScroll);
  }, [totalLength]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-30"
      style={{ opacity: 0.25 }}
    >
      <svg
        ref={svgRef}
        viewBox={viewBox}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        <defs>
          <linearGradient id="dragonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop ref={stop0Ref} offset="0%" stopColor="#4ade80" />
            <stop ref={stop1Ref} offset="50%" stopColor="#4ade80" />
            <stop ref={stop2Ref} offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          d={path}
          stroke="url(#dragonGradient)"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
