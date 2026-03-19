"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import ParticleSystem from "./stages/ParticleSystem";
import CodeOverlay from "./overlays/CodeOverlay";

/**
 * Scroll progress tracked via both ref (for R3F, zero re-renders)
 * and state (for HTML overlay, needs React updates).
 *
 * The state is throttled to ~30fps to avoid over-rendering the HTML overlay
 * while the ref updates on every scroll event for butter-smooth 3D animation.
 */
function useScrollProgress() {
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight * 4; // 400vh
      const p = Math.min(scrollY / maxScroll, 1);

      // Ref updates immediately — R3F reads this in useFrame
      progressRef.current = p;

      // State update throttled via rAF for HTML overlay
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          setProgress(p);
          rafRef.current = null;
        });
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { progressRef, progress };
}

export default function CanvasHero() {
  const { progressRef, progress } = useScrollProgress();

  // Fade out canvas at scroll bottom
  const opacity = progress >= 1 ? 0 : progress > 0.95 ? (1 - progress) / 0.05 : 1;

  return (
    <div
      className="w-full h-full relative"
      style={{ opacity, transition: "opacity 0.3s ease-out" }}
    >
      <Canvas
        camera={{ position: [0, 0, 14.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <ParticleSystem progressRef={progressRef} />
      </Canvas>
      <CodeOverlay progress={progress} />
    </div>
  );
}
