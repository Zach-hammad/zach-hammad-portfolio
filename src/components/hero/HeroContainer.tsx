"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import StaticHero from "./StaticHero";

const canvasEnabled =
  process.env.NEXT_PUBLIC_ENABLE_CANVAS_HERO === "true";

const CanvasHero = canvasEnabled
  ? dynamic(() => import("./CanvasHero"), { ssr: false })
  : null;

function useCanvasCapability(): boolean {
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    // Check viewport width (disable on mobile)
    if (window.innerWidth < 768) return;

    // Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) return;
    } catch {
      return;
    }

    setCapable(true);
  }, []);

  return capable;
}

export default function HeroContainer() {
  const capable = useCanvasCapability();

  if (CanvasHero && capable) {
    return (
      <div className="relative">
        {/* Sticky canvas occupies viewport */}
        <div className="sticky top-0 h-screen z-10">
          <CanvasHero />
        </div>
        {/* Spacer divs provide scroll distance for animation */}
        <div className="h-[400vh]" aria-hidden="true" />
      </div>
    );
  }

  return <StaticHero />;
}
