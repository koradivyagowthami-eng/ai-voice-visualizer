import { AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import type { Conflict, WorkloadDay } from "../types/timetable";

type InsightsPanelProps = {
  qualityScore: number;
  conflicts: Conflict[];
  suggestions: string[];
  workload: WorkloadDay[];
};

export function InsightsPanel({ qualityScore, conflicts, suggestions, workload }: InsightsPanelProps) {
  return (
    <aside className="space-y-4">
      <div className="glass-card rounded-lg border border-white/10 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-200">AI quality</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">{qualityScore}%</h2>
          </div>
          <Sparkles className="h-8 w-8 text-cyan-200" />
        </div>
        <div className="mt-4 h-2 rounded-full bg-white/10">
          <div className="h-2 rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300" style={{ width: `${qualityScore}%` }} />
        </div>
      </div>

      <div className="glass-card rounded-lg border border-white/10 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">AI Suggestions</h3>
        <div className="mt-4 space-y-3">
          {suggestions.map((item) => (
            <div className="flex gap-3 rounded-md border border-white/10 bg-white/[0.04] p-3" key={item}>
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-300" />
              <p className="text-sm leading-relaxed text-slate-200">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-lg border border-white/10 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">Faculty Conflicts</h3>
        <div className="mt-4 space-y-3">
          {conflicts.length === 0 ? (
            <p className="rounded-md border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm text-emerald-100">No conflicts detected.</p>
          ) : (
            conflicts.map((conflict) => (
              <div className="flex gap-3 rounded-md border border-amber-300/20 bg-amber-300/10 p-3" key={conflict.message}>
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-none text-amber-200" />
                <p className="text-sm leading-relaxed text-amber-50">{conflict.message}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="glass-card rounded-lg border border-white/10 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">Workload</h3>
        <div className="mt-4 space-y-3">
          {workload.map((day) => (
            <div key={day.day}>
              <div className="mb-1 flex justify-between text-xs text-slate-300">
                <span>{day.day}</span>
                <span>{day.filledSlots} slots</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-cyan-300" style={{ width: `${Math.min(100, day.filledSlots * 14)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
