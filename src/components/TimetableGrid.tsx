import { motion } from "framer-motion";
import type { GeneratedTimetable } from "../types/timetable";

const palette = [
  "bg-cyan-100 text-cyan-950 border-cyan-200 dark:bg-cyan-400/15 dark:text-cyan-100 dark:border-cyan-300/20",
  "bg-indigo-100 text-indigo-950 border-indigo-200 dark:bg-indigo-400/15 dark:text-indigo-100 dark:border-indigo-300/20",
  "bg-emerald-100 text-emerald-950 border-emerald-200 dark:bg-emerald-400/15 dark:text-emerald-100 dark:border-emerald-300/20",
  "bg-amber-100 text-amber-950 border-amber-200 dark:bg-amber-400/15 dark:text-amber-100 dark:border-amber-300/20",
  "bg-rose-100 text-rose-950 border-rose-200 dark:bg-rose-400/15 dark:text-rose-100 dark:border-rose-300/20",
];

const colorFor = (name: string) => {
  if (name === "Break") return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/5 dark:text-slate-300 dark:border-white/10";
  const total = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return palette[total % palette.length];
};

interface TimetableGridProps {
  timetable?: GeneratedTimetable;
}

export default function TimetableGrid({ timetable }: TimetableGridProps) {
  if (!timetable) {
    return (
      <section className="glass-panel grid min-h-[420px] place-items-center p-8 text-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">Preview</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Your AI timetable appears here</h2>
          <p className="mt-3 max-w-md text-slate-600 dark:text-slate-300">
            Add subjects and generate a schedule to see color-coded slots, faculty assignments, and break blocks.
          </p>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel overflow-hidden"
    >
      <div className="flex flex-col justify-between gap-2 border-b border-slate-200/80 p-5 dark:border-white/10 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">Generated</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">Optimized timetable</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">{timetable.days.length} days, {timetable.timeSlots.length} slots</p>
      </div>

      <div className="overflow-x-auto">
        <div
          className="min-w-[820px] grid"
          style={{ gridTemplateColumns: `140px repeat(${timetable.days.length}, minmax(150px, 1fr))` }}
        >
          <div className="sticky left-0 z-10 bg-white/80 p-3 text-sm font-semibold text-slate-600 backdrop-blur dark:bg-slate-950/80 dark:text-slate-300">
            Time
          </div>
          {timetable.days.map((day) => (
            <div key={day} className="border-l border-slate-200/80 p-3 text-sm font-semibold text-slate-950 dark:border-white/10 dark:text-white">
              {day}
            </div>
          ))}

          {timetable.timeSlots.map((slot) => (
            <div key={slot.id} className="contents">
              <div className="sticky left-0 z-10 border-t border-slate-200/80 bg-white/85 p-3 text-sm font-medium text-slate-600 backdrop-blur dark:border-white/10 dark:bg-slate-950/85 dark:text-slate-300">
                {slot.label}
              </div>
              {timetable.days.map((day) => {
                const cell = timetable.schedule[day]?.[slot.id];
                return (
                  <div key={`${day}-${slot.id}`} className="border-l border-t border-slate-200/80 p-2 dark:border-white/10">
                    <motion.div
                      whileHover={{ y: -3, scale: 1.01 }}
                      className={`min-h-20 rounded-2xl border p-3 shadow-sm transition ${colorFor(cell?.subjectName ?? "Free")}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold">{cell?.subjectName ?? "Free"}</p>
                        <span className="rounded-full bg-white/50 px-2 py-1 text-[10px] font-semibold dark:bg-white/10">
                          {cell?.type ?? "Free"}
                        </span>
                      </div>
                      <p className="mt-2 text-xs opacity-80">{cell?.facultyName ?? "Open"}</p>
                      {cell?.note ? <p className="mt-2 text-[11px] font-medium opacity-75">{cell.note}</p> : null}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
