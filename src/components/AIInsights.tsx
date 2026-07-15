import { AlertTriangle, BarChart3, Lightbulb, WandSparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { GeneratedTimetable } from "../types/timetable";

interface AIInsightsProps {
  timetable?: GeneratedTimetable;
}

export default function AIInsights({ timetable }: AIInsightsProps) {
  const analysis = timetable?.analysis;

  return (
    <motion.aside
      id="insights"
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-panel p-5"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-2xl bg-indigo-500/15 text-indigo-700 dark:text-indigo-200">
          <WandSparkles className="size-5" />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">AI Insights</p>
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Schedule analysis</h2>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-slate-950 p-5 text-white dark:bg-white/10">
        <p className="text-sm text-slate-300">Workload score</p>
        <div className="mt-3 flex items-end gap-3">
          <span className="text-5xl font-semibold">{analysis?.workloadScore ?? 0}</span>
          <span className="pb-2 text-slate-300">/ 100</span>
        </div>
        <div className="mt-4 h-2 rounded-full bg-white/10">
          <div className="h-full rounded-full bg-cyan-400" style={{ width: `${analysis?.workloadScore ?? 0}%` }} />
        </div>
      </div>

      <InsightList icon={BarChart3} title="Distribution" items={analysis?.subjectDistribution} empty="Generate to inspect subject spread." />
      <InsightList icon={Lightbulb} title="Suggestions" items={analysis?.suggestions} empty="AI suggestions will appear after generation." />
      <InsightList icon={AlertTriangle} title="Warnings" items={analysis?.conflictWarnings} empty="Conflict checks will appear here." />
    </motion.aside>
  );
}

interface InsightListProps {
  icon: typeof BarChart3;
  title: string;
  items?: string[];
  empty: string;
}

function InsightList({ icon: Icon, title, items, empty }: InsightListProps) {
  return (
    <div className="mt-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
        <Icon className="size-4 text-cyan-600 dark:text-cyan-300" />
        {title}
      </div>
      <div className="space-y-2">
        {(items?.length ? items : [empty]).map((item) => (
          <p key={item} className="rounded-xl bg-white/55 px-3 py-2 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
