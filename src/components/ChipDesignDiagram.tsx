"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

const DRAW_MS = 2200;
const FADE_MS = 600;
const stages = [
  { name: "Compile", title: "From RTL to logic", detail: "Synthesis maps the hardware description to a gate-level netlist using a cell library.", duration: 3600 },
  { name: "Place", title: "Give every cell a home", detail: "Define the floorplan, then arrange the cells in rows while balancing area, timing, and routability.", duration: 3400 },
  { name: "CTS", title: "Build the clock tree", detail: "Insert clock buffers and build a network that manages clock arrival times at the sequential cells.", duration: 3400 },
  { name: "M1", title: "Draw the local connections", detail: "The first metal layer connects nearby cells. Routes are drawn here one layer at a time to make them visible.", duration: 3200 },
  { name: "M2", title: "Connect across the rows", detail: "Another routing layer adds paths in a different preferred direction. Vias connect the metal layers.", duration: 3200 },
  { name: "M3", title: "Build up the interconnect", detail: "Upper layers carry longer connections. The exploded view separates the layers so you can follow each route.", duration: 3200 },
  { name: "Layout", title: "One connected layout", detail: "Cells and interconnect come together in the chip layout. Timing analysis and physical verification check the result.", duration: 5400 },
] as const;

// An illustrative circuit, not geometry from a benchmark or a particular PDK.
const cells = Array.from({ length: 80 }, (_, index) => ({
  x: -116 + (index % 10) * 24,
  y: -86 + Math.floor(index / 10) * 23,
  looseX: ((index * 67) % 225) - 112,
  looseY: ((index * 43) % 167) - 83,
  width: index % 3 === 0 ? 18 : 14,
}));
const metalLayers = [
  { name: "M1", height: 42, color: "#91bea1", stage: 3, paths: Array.from({ length: 8 }, (_, row) => {
    const y = -80 + row * 23;
    return `M-110 ${y}H${row % 2 ? 76 : 100}v8h${row % 2 ? 24 : -24}`;
  }) },
  { name: "M2", height: 85, color: "#c8b482", stage: 4, paths: Array.from({ length: 10 }, (_, column) => {
    const x = -110 + column * 24;
    return `M${x} -80V${column % 2 ? 58 : 81}`;
  }) },
  { name: "M3", height: 128, color: "#97bfc1", stage: 5, paths: [
    "M-130-98H-38V-57H106", "M-130-12H34V12H130",
    "M-130 102H58V58H130", "M-86-108V35H106V108",
  ] },
] as const;
const viaSites = [
  { x: -86, y: -57 }, { x: -38, y: -57 }, { x: 34, y: 12 },
  { x: -86, y: 35 }, { x: 58, y: 58 }, { x: 106, y: 58 },
];
const clockBranches = [
  "M0-108V0", "M0 0H-60M0 0H60",
  "M-60 0V-46M-60 0V46M60 0V-46M60 0V46",
  "M-60-46H-96M-60-46H-24M60-46H24M60-46H96M-60 46H-96M-60 46H-24M60 46H24M60 46H96",
];

function smooth(value: number) {
  const bounded = Math.max(0, Math.min(1, value));
  return bounded * bounded * (3 - 2 * bounded);
}

function plane(height: number) {
  return `matrix(.9 .38 -.75 .44 300 ${282 - height})`;
}

export default function ChipDesignDiagram() {
  const figureRef = useRef<HTMLElement>(null);
  const id = useId();
  const [frame, setFrame] = useState({ stage: 6, elapsedMs: DRAW_MS });
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
        setFrame((current) => ({ ...current, elapsedMs: DRAW_MS }));
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
      // Cells, routes, layer movement, and the loop fade use one pausable clock.
      setFrame((current) => {
        const elapsedMs = current.elapsedMs + deltaMs;
        const duration = stages[current.stage].duration;
        return elapsedMs < duration
          ? { ...current, elapsedMs }
          : { stage: (current.stage + 1) % stages.length, elapsedMs: elapsedMs - duration };
      });
      requestId = window.requestAnimationFrame(tick);
    };
    requestId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(requestId);
  }, [isPlaying, isVisible, reducedMotion]);

  const stageProgress = (stage: number, delay = 0, duration = DRAW_MS) => frame.stage < stage
    ? 0 : frame.stage > stage ? 1 : smooth((frame.elapsedMs - delay) / duration);
  const placed = stageProgress(1);
  const clock = stageProgress(2);
  const assembled = stageProgress(6);
  const sceneOpacity = frame.stage === 0
    ? smooth(frame.elapsedMs / FADE_MS)
    : frame.stage === 6
      ? 1 - smooth((frame.elapsedMs - stages[6].duration + FADE_MS) / FADE_MS)
      : 1;
  const layerHeight = (index: number) => metalLayers[index].height * (1 - assembled) + (index + 1) * 5 * assembled;

  return (
    <figure ref={figureRef} className="chip-diagram" aria-label="Illustrated ASIC design flow">
      <figcaption className="chip-heading"><span>RTL → CHIP LAYOUT</span><span>ILLUSTRATED FLOW</span></figcaption>
      <svg className="chip-scene" viewBox="0 0 600 422" fill="none" aria-hidden="true">
        <defs>
          <pattern id={`${id}-grid`} width="24" height="23" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V23" stroke="#6e8b75" strokeOpacity=".16" strokeWidth=".7" />
          </pattern>
        </defs>
        <g opacity={sceneOpacity}>
          <g className="chip-source" opacity={1 - placed}>
            <path d="M34 26H228V113H34Z" fill="#10261a" stroke="#355442" />
            <text x="48" y="45" className="chip-svg-label">RTL + CELL LIBRARY</text>
            <text x="48" y="67" className="chip-code">always @(posedge clk)</text>
            <text x="60" y="85" className="chip-code">q &lt;= a + b;</text>
            <path d="M48 100H214" stroke="#2f4938" />
            <path d="M48 100H214" stroke="#b9a77a" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - stageProgress(0)} />
            <path d="M134 114V140L180 158" className="chip-guide" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - stageProgress(0)} />
          </g>

          <g opacity={.22 + placed * .78}>
            <path d="M79.5 279.7L340.5 389.9L520.5 284.3V296.3L340.5 401.9L79.5 291.7Z" fill="#12271c" stroke="#53725a" strokeWidth=".8" />
            <g transform={plane(0)}>
              <rect x="-145" y="-120" width="290" height="240" fill="#0c1b13" stroke="#718b6f" />
              <rect x="-126" y="-99" width="252" height="194" fill={`url(#${id}-grid)`} stroke="#496b50" strokeDasharray="4 4" />
              {Array.from({ length: 12 }, (_, index) => (
                <g key={index} fill="#a99b72" opacity={.4 + assembled * .6}>
                  <rect x={-132 + index * 23} y="-116" width="9" height="9" />
                  <rect x={-132 + index * 23} y="105" width="9" height="9" />
                </g>
              ))}
              {Array.from({ length: 9 }, (_, index) => (
                <g key={index} fill="#a99b72" opacity={.4 + assembled * .6}>
                  <rect x="-141" y={-95 + index * 23} width="9" height="9" />
                  <rect x="132" y={-95 + index * 23} width="9" height="9" />
                </g>
              ))}
            </g>
          </g>

          <g transform={plane(2)}>
            <g opacity={stageProgress(0) * (1 - placed) * .45} stroke="#72977b" strokeWidth=".8">
              {cells.slice(1, 22).map((cell, index) => (
                <path key={index} d={`M${cells[index].looseX} ${cells[index].looseY}L${cell.looseX} ${cell.looseY}`} />
              ))}
            </g>
            {cells.map((cell, index) => (
              <g key={index} opacity={stageProgress(0, (index % 10) * 55, 1400)} transform={`translate(${cell.looseX + (cell.x - cell.looseX) * placed} ${cell.looseY + (cell.y - cell.looseY) * placed})`}>
                <rect width={cell.width} height="12" fill={index % 5 === 0 ? "#8b9c74" : "#3e684c"} stroke="#99b894" strokeWidth=".6" />
                <path d={`M3 4H${cell.width - 3}M3 8H${cell.width - 6}`} stroke="#142b1c" strokeWidth="1" />
              </g>
            ))}
          </g>

          <g transform={plane(5)} opacity={clock * (1 - assembled * .5)} stroke="#dfca8d" strokeWidth="2">
            {clockBranches.map((path, index) => (
              <path key={path} d={path} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - stageProgress(2, index * 380, 900)} />
            ))}
            {[-60, 60].flatMap((x) => [-46, 46].map((y) => (
              <path key={`${x}-${y}`} d={`M${x - 4} ${y - 5}l9 5-9 5Z`} fill="#dfca8d" strokeWidth=".6" opacity={stageProgress(2, 900, 700)} />
            )))}
            <circle cx="0" cy="-108" r="4" fill="#dfca8d" />
          </g>

          {metalLayers.map((layer, index) => {
            const progress = stageProgress(layer.stage);
            const height = layerHeight(index);
            return (
              <g key={layer.name} data-layer={layer.name} opacity={progress}>
                <g stroke={layer.color} strokeWidth="1" opacity={.45 * progress}>
                  {viaSites.map(({ x, y }, via) => {
                    const bottom = index === 0 ? 2 : layerHeight(index - 1);
                    const screenX = 300 + .9 * x - .75 * y;
                    const screenY = 282 + .38 * x + .44 * y;
                    return <path key={via} d={`M${screenX} ${screenY - bottom}V${screenY - bottom - (height - bottom) * stageProgress(layer.stage, 750, 1300)}`} />;
                  })}
                </g>
                <g transform={plane(height)}>
                  <rect x="-145" y="-120" width="290" height="240" fill="#102b20" fillOpacity={.2 * (1 - assembled)} stroke={layer.color} strokeOpacity={.3 * (1 - assembled)} strokeWidth=".7" />
                  {layer.paths.map((path, pathIndex) => (
                    <path key={path} d={path} stroke={layer.color} strokeWidth={index === 2 ? 3 : 1.8} strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - stageProgress(layer.stage, pathIndex * 65, 1400)} />
                  ))}
                  {viaSites.map(({ x, y }, via) => (
                    <rect key={via} x={x - 2} y={y - 2} width="4" height="4" fill={layer.color} opacity={stageProgress(layer.stage, 1400, 800)} />
                  ))}
                </g>
                <g opacity={1 - assembled}>
                  <path d={`M507 ${281 - height}H538`} stroke={layer.color} strokeOpacity=".65" />
                  <text x="547" y={285 - height} className="chip-layer-label" fill={layer.color}>{layer.name}</text>
                </g>
              </g>
            );
          })}

          <g opacity={placed * (1 - assembled)}>
            <path d="M90 307H41V325" className="chip-guide" />
            <text x="25" y="344" className="chip-svg-label">CELLS</text>
          </g>
          <g opacity={clock * (1 - stageProgress(3))}>
            <path d="M381 229H482V246" stroke="#dfca8d" strokeWidth=".8" />
            <text x="420" y="265" className="chip-svg-label">CLOCK TREE</text>
          </g>
          <g opacity={assembled}>
            <text x="300" y="58" textAnchor="middle" className="chip-finish-label">LOGIC + CLOCK + INTERCONNECT</text>
            <path d="M300 72V133" className="chip-guide" />
          </g>
        </g>
      </svg>
      <div className="chip-stages" role="group" aria-label="Explore ASIC design stages" onFocusCapture={() => setIsPlaying(false)}>
        {stages.map((stage, index) => (
          <button key={stage.name} type="button" aria-pressed={frame.stage === index} aria-controls={`${id}-detail`} onClick={() => {
            setIsPlaying(false);
            setFrame({ stage: index, elapsedMs: DRAW_MS });
          }}>
            <span aria-hidden="true">0{index + 1}</span>{stage.name}
          </button>
        ))}
      </div>
      <div id={`${id}-detail`} className="chip-details" aria-live={isPlaying ? "off" : "polite"} aria-atomic="true">
        {stages.map((stage, index) => (
          <div key={stage.name} data-active={frame.stage === index} aria-hidden={frame.stage !== index}>
            <h4>{stage.title}</h4><p>{stage.detail}</p>
          </div>
        ))}
      </div>
      <div className="chip-playback">
        <span>Three metal layers shown. Actual stacks vary.</span>
        <button type="button" disabled={reducedMotion} aria-label={reducedMotion ? "Chip animation disabled by reduced-motion preference" : `${isPlaying ? "Pause" : "Play"} chip animation`} onClick={() => setIsPlaying((playing) => !playing)}>
          {isPlaying ? <Pause size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}
          {reducedMotion ? "Motion reduced" : isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </figure>
  );
}
