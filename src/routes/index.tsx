import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { NeuralSphere } from "../components/NeuralSphere";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Cortex — Knowledge Brain" },
      { name: "description", content: "A neural knowledge mapping interface for connected thinking" },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden relative">
      {/* Full-screen sphere */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 60% at 50% 50%, oklch(0.65 0.15 280 / 0.06), transparent)",
          }}
        />
        <NeuralSphere />
      </div>

      {/* Minimal floating brand */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-6 left-6 z-10 flex items-center gap-2.5"
      >
        <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center backdrop-blur-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse-glow" />
        </div>
        <span className="font-display font-semibold text-foreground/80 tracking-tight text-sm">
          Cortex
        </span>
      </motion.div>

      {/* Center label */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      >
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground/90 tracking-tight">
            Knowledge Brain
          </h1>
          <p className="text-sm text-muted-foreground mt-3 font-mono tracking-wide">
            2,847 nodes · 41.2K connections
          </p>
        </div>
      </motion.div>

      {/* Bottom subtle info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-center"
      >
        <p className="text-xs text-muted-foreground/60 font-mono">
          move cursor to interact
        </p>
      </motion.div>
    </div>
  );
}
