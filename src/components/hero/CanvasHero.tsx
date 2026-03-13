"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";

function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight * 4; // 400vh
      setProgress(Math.min(scrollY / maxScroll, 1));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

function AnimationScene() {
  const progress = useScrollProgress();

  // Stage boundaries
  const stage =
    progress < 0.2
      ? 1
      : progress < 0.4
        ? 2
        : progress < 0.6
          ? 3
          : progress < 0.8
            ? 4
            : 5;

  // TODO: Replace with actual stage-specific Three.js scenes.
  // Each stage should be its own component:
  //   - TransistorStage (0-0.2): MOSFET symbols, silicon traces, electrical paths
  //   - LogicGateStage (0.2-0.4): AND/OR/NOT gates forming, connecting wires
  //   - ChipStage (0.4-0.6): Functional blocks (ALU, REG, CACHE) in die layout
  //   - AssemblyStage (0.6-0.8): Dissolve to scrolling assembly text
  //   - CodeStage (0.8-1.0): Morph to syntax-highlighted source code
  //
  // For now, render a placeholder that proves scroll tracking works.

  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        color={
          stage === 1
            ? "#4ade80"
            : stage === 2
              ? "#60a5fa"
              : stage === 3
                ? "#f59e0b"
                : stage === 4
                  ? "#f87171"
                  : "#c084fc"
        }
        wireframe
      />
    </mesh>
  );
}

export default function CanvasHero() {
  const progress = useScrollProgress();

  return (
    <div
      className="w-full h-full"
      style={{ opacity: progress >= 1 ? 0 : 1, transition: "opacity 0.5s" }}
    >
      <Canvas camera={{ position: [0, 0, 5] }}>
        <AnimationScene />
      </Canvas>
    </div>
  );
}
