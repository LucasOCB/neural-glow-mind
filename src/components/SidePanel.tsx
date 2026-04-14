import { motion } from "framer-motion";

const recentNodes = [
  { name: "Quantum Computing", activity: 0.92, connections: 34 },
  { name: "Neural Architecture", activity: 0.87, connections: 28 },
  { name: "Graph Theory", activity: 0.74, connections: 45 },
  { name: "Cognitive Science", activity: 0.68, connections: 19 },
  { name: "Machine Learning", activity: 0.95, connections: 52 },
];

export function SidePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
      className="w-72 flex flex-col gap-4"
    >
      {/* Search */}
      <div className="rounded-xl bg-surface-elevated/50 border border-border/50 backdrop-blur-sm p-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-input/50 border border-border/30">
          <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <span className="text-sm text-muted-foreground">Search knowledge…</span>
        </div>
      </div>

      {/* Active Nodes */}
      <div className="rounded-xl bg-surface-elevated/50 border border-border/50 backdrop-blur-sm p-4 flex-1">
        <h3 className="text-xs font-mono tracking-wider uppercase text-muted-foreground mb-3">
          Active Nodes
        </h3>
        <div className="space-y-2.5">
          {recentNodes.map((node, i) => (
            <motion.div
              key={node.name}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 + i * 0.08 }}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  backgroundColor: `oklch(${0.5 + node.activity * 0.4} ${0.15 + node.activity * 0.1} ${250 + node.activity * 40})`,
                  boxShadow: `0 0 ${node.activity * 8}px oklch(${0.5 + node.activity * 0.4} 0.2 280 / 0.5)`,
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground/80 group-hover:text-foreground truncate transition-colors">
                  {node.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {node.connections} links · {Math.round(node.activity * 100)}% active
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-xl bg-surface-elevated/50 border border-border/50 backdrop-blur-sm p-4">
        <h3 className="text-xs font-mono tracking-wider uppercase text-muted-foreground mb-3">
          Quick Actions
        </h3>
        <div className="space-y-2">
          {["New Node", "Import Data", "Export Map"].map((action, i) => (
            <motion.button
              key={action}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 + i * 0.1 }}
              className="w-full text-left text-sm px-3 py-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all"
            >
              {action}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
