import { motion } from "framer-motion";

const stats = [
  { label: "Neural Nodes", value: "2,847", sub: "Active connections" },
  { label: "Knowledge Maps", value: "156", sub: "Mapped domains" },
  { label: "Synapse Links", value: "41.2K", sub: "Cross-references" },
  { label: "Memory Depth", value: "94%", sub: "Retention score" },
];

export function KnowledgeStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
          className="rounded-xl bg-surface-elevated/50 border border-border/50 px-4 py-3 backdrop-blur-sm"
        >
          <p className="text-xs text-muted-foreground font-mono tracking-wider uppercase">
            {stat.label}
          </p>
          <p className="text-xl font-display font-bold text-foreground mt-1">
            {stat.value}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{stat.sub}</p>
        </motion.div>
      ))}
    </div>
  );
}
