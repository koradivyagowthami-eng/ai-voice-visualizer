import type { ReactNode } from "react";
import { motion } from "framer-motion";

type StatCardProps = {
  label: string;
  value: string;
  icon: ReactNode;
  accent: string;
};

export function StatCard({ label, value, icon, accent }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card min-h-28 rounded-lg border border-white/10 p-5 shadow-2xl shadow-black/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
        </div>
        <div className="rounded-lg border border-white/10 p-3" style={{ color: accent, backgroundColor: `${accent}16` }}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
