"use client";

import { motion } from "framer-motion";

export default function StaticHero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle animated background */}
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
        className="text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.p
          className="text-xs font-mono tracking-[0.3em] uppercase text-text-muted mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Transistors &rarr; Logic &rarr; Architecture &rarr; Assembly &rarr; Code
        </motion.p>
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Zacharia Hammad
        </motion.h1>
        <motion.p
          className="text-xl text-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          Computer Engineer
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-text-muted to-transparent mx-auto"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </motion.div>
    </section>
  );
}
