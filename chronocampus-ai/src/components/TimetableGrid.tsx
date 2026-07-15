import { motion } from "framer-motion";
import type { DayName, TimetableEntry } from "../types/timetable";

type TimetableGridProps = {
  days: DayName[];
  slots: string[];
  entries: TimetableEntry[];
};

export function TimetableGrid({ days, slots, entries }: TimetableGridProps) {
  const entryFor = (day: DayName, slot: number) => entries.find((entry) => entry.day === day && entry.slot === slot);

  return (
    <section className="glass-card rounded-lg border border-white/10 p-4 shadow-2xl shadow-black/25">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Weekly grid</p>
          <h2 className="text-xl font-semibold text-white">Generated Timetable</h2>
        </div>
        <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100">
          Conflict-aware layout
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[920px]">
          <div className="grid" style={{ gridTemplateColumns: `140px repeat(${days.length}, minmax(136px, 1fr))` }}>
            <div className="timetable-head">Time</div>
            {days.map((day) => (
              <div className="timetable-head" key={day}>
                {day}
              </div>
            ))}
            {slots.map((slotLabel, slotIndex) => (
              <div className="contents" key={slotLabel}>
                <div className="timetable-time">{slotLabel}</div>
                {days.map((day) => {
                  const entry = entryFor(day, slotIndex);
                  return (
                    <div className="timetable-cell" key={`${day}-${slotIndex}`}>
                      {entry ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="h-full rounded-md border p-3"
                          style={{
                            borderColor: `${entry.color}70`,
                            background: `linear-gradient(135deg, ${entry.color}28, rgba(255,255,255,0.05))`
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold leading-tight text-white">{entry.subjectName}</p>
                            {entry.isLab && <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-cyan-100">LAB</span>}
                          </div>
                          <p className="mt-2 text-xs text-slate-300">{entry.faculty}</p>
                        </motion.div>
                      ) : (
                        <span className="text-xs text-slate-600">Available</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
