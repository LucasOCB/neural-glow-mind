import { motion } from "framer-motion";

export function TopNav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between px-6 py-4 border-b border-border/30 backdrop-blur-md bg-background/60 relative z-10"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse-glow" />
        </div>
        <span className="font-display font-semibold text-foreground tracking-tight text-lg">
          Cortex
        </span>
        <span className="text-[10px] font-mono text-muted-foreground bg-surface-elevated px-2 py-0.5 rounded-full border border-border/50">
          v2.4
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-6">
        {["Brain", "Explore", "Clusters", "Timeline"].map((item, i) => (
          <motion.a
            key={item}
            href="#"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className={`text-sm transition-colors ${
              i === 0
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item}
          </motion.a>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-surface-elevated border border-border/50 flex items-center justify-center">
          <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-medium text-primary-foreground">
          A
        </div>
      </div>
    </motion.header>
  );
}
