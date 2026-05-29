"use client";

import { motion, useReducedMotion } from "framer-motion";
import HeroCopy from "./HeroCopy";

export default function StaticHero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(74, 222, 128, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(74, 222, 128, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 1 }}
      >
        <HeroCopy />
      </motion.div>

      <motion.div
        className="absolute bottom-8"
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : { delay: 1.2 }}
      >
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-neutral-400 to-transparent mx-auto"
          animate={shouldReduceMotion ? undefined : { scaleY: [1, 0.5, 1] }}
          transition={
            shouldReduceMotion ? undefined : { repeat: Infinity, duration: 2 }
          }
        />
      </motion.div>
    </section>
  );
}
