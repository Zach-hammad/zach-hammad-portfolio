"use client";

import dynamic from "next/dynamic";
import StaticHero from "./StaticHero";

const canvasEnabled =
  process.env.NEXT_PUBLIC_ENABLE_CANVAS_HERO === "true";

// Lazy load canvas hero only when enabled
const CanvasHero = canvasEnabled
  ? dynamic(() => import("./CanvasHero"), { ssr: false })
  : null;

export default function HeroContainer() {
  if (CanvasHero) {
    return <CanvasHero />;
  }
  return <StaticHero />;
}
