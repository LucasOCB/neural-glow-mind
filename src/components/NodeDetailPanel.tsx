import { motion, AnimatePresence } from "framer-motion";
import type { SelectedNodeInfo } from "./NeuralSphere";

interface NodeDetailPanelProps {
  node: SelectedNodeInfo | null;
  onClose: () => void;
}

export function NodeDetailPanel({ node, onClose }: NodeDetailPanelProps) {
  return (
    <AnimatePresence>
      {node && (
        <motion.div
          key={node.name}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-[420px] max-w-[90vw]"
        >
          <div className="rounded-2xl border border-primary/20 bg-surface-elevated/80 backdrop-blur-xl shadow-[0_0_80px_oklch(0.65_0.2_280/0.15)] overflow-hidden">
            {/* Glow bar */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse-glow shadow-[0_0_12px_oklch(0.65_0.2_280/0.5)]" />
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-base leading-tight">
                      {node.name}
                    </h3>
                    <span className="text-[10px] font-mono text-primary/80 tracking-wider uppercase">
                      {node.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-primary/10"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-foreground/70 mt-3 leading-relaxed">
                {node.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {node.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary/90 border border-primary/15"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Connected nodes */}
              {node.connectedNames.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border/30">
                  <p className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase mb-2">
                    Conexões ativas · {node.connectedNames.length}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {node.connectedNames.slice(0, 8).map((name) => (
                      <span
                        key={name}
                        className="text-xs px-2.5 py-1 rounded-lg bg-accent/10 text-accent/90 border border-accent/15"
                      >
                        {name}
                      </span>
                    ))}
                    {node.connectedNames.length > 8 && (
                      <span className="text-xs px-2 py-1 text-muted-foreground">
                        +{node.connectedNames.length - 8}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
