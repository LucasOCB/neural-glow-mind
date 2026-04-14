import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { NeuralSphere } from "../components/NeuralSphere";
import { KnowledgeStats } from "../components/KnowledgeStats";
import { SidePanel } from "../components/SidePanel";
import { TopNav } from "../components/TopNav";

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
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <TopNav />

      <div className="flex-1 flex">
        {/* Main sphere area */}
        <div className="flex-1 flex flex-col relative">
          {/* Ambient background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 50% 50% at 50% 45%, oklch(0.65 0.15 280 / 0.08), transparent)",
            }}
          />

          {/* Sphere */}
          <div className="flex-1 relative">
            <NeuralSphere />

            {/* Center label */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground/90 tracking-tight">
                  Your Knowledge
                </h1>
                <p className="text-sm text-muted-foreground mt-2 font-mono">
                  2,847 nodes · 41.2K connections
                </p>
              </div>
            </motion.div>
          </div>

          {/* Bottom stats */}
          <div className="relative z-10 px-6 pb-6">
            <KnowledgeStats />
          </div>
        </div>

        {/* Side panel - hidden on mobile */}
        <div className="hidden lg:block p-4 pl-0">
          <SidePanel />
        </div>
      </div>
    </div>
  );
}
