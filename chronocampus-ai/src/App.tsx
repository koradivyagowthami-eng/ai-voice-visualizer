import { useState } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, CalendarDays, Clock3, GraduationCap, ShieldCheck, UsersRound } from "lucide-react";
import { BuilderPanel } from "./components/BuilderPanel";
import { ExportBar } from "./components/ExportBar";
import { InsightsPanel } from "./components/InsightsPanel";
import { StatCard } from "./components/StatCard";
import { TimetableGrid } from "./components/TimetableGrid";
import { generateTimetable } from "./lib/generator";
import { initialCollege, initialSettings, initialSubjects } from "./lib/sampleData";
import type { CollegeDetails, Subject, TimetableSettings } from "./types/timetable";

function App() {
  const [college, setCollege] = useState<CollegeDetails>(initialCollege);
  const [settings, setSettings] = useState<TimetableSettings>(initialSettings);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [result, setResult] = useState(() => generateTimetable(initialSubjects, initialSettings));

  const facultyCount = new Set(subjects.map((subject) => subject.faculty)).size;
  const labCount = subjects.filter((subject) => subject.isLab).length;
  const handleGenerate = () => setResult(generateTimetable(subjects, settings));

  return (
    <main className="min-h-screen overflow-hidden bg-[#071017] text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(98,224,217,0.16),transparent_30%),radial-gradient(circle_at_84%_8%,rgba(245,201,106,0.11),transparent_28%),linear-gradient(135deg,#071017_0%,#0b1b20_45%,#101518_100%)]" />
      <div className="fixed inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)] [background-size:44px_44px]" />

      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-200/30 bg-cyan-200/10">
            <CalendarDays className="h-5 w-5 text-cyan-200" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">ChronoCampus AI</p>
            <p className="text-xs text-slate-400">chronocampus.ai</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300 sm:flex">
          <ShieldCheck className="h-4 w-4 text-emerald-300" />
          Local secure generation
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-14">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-2 text-sm text-cyan-100">
            <BrainCircuit className="h-4 w-4" />
            AI-powered academic scheduling
          </div>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Generate Perfect College Timetables with AI
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Build balanced weekly timetables with lab blocks, faculty conflict detection, workload analysis, and instant exports for academic teams.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button className="primary-button" onClick={handleGenerate} type="button">
              <BrainCircuit className="h-4 w-4" />
              Generate Timetable
            </button>
            <a className="secondary-button" href="#builder">
              Configure Inputs
            </a>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          className="glass-card rounded-lg border border-white/10 p-5 shadow-2xl shadow-black/30"
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-amber-200">Live optimizer</p>
              <h2 className="text-xl font-semibold text-white">{college.section} Preview</h2>
            </div>
            <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100">
              {result.qualityScore}% score
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {settings.workingDays.slice(0, 5).map((day, dayIndex) => (
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-3" key={day}>
                <p className="mb-3 text-xs font-medium text-slate-400">{day.slice(0, 3)}</p>
                <div className="space-y-2">
                  {result.entries
                    .filter((entry) => entry.day === day)
                    .slice(0, 4)
                    .map((entry) => (
                      <div
                        className="h-7 rounded"
                        key={`${entry.id}-${dayIndex}`}
                        style={{ backgroundColor: `${entry.color}42`, border: `1px solid ${entry.color}70` }}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-8 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <StatCard accent="#62e0d9" icon={<CalendarDays className="h-5 w-5" />} label="Weekly slots" value={String(result.entries.length)} />
        <StatCard accent="#8ff0b2" icon={<UsersRound className="h-5 w-5" />} label="Faculty" value={String(facultyCount)} />
        <StatCard accent="#f5c96a" icon={<GraduationCap className="h-5 w-5" />} label="Subjects" value={String(subjects.length)} />
        <StatCard accent="#f28f6b" icon={<Clock3 className="h-5 w-5" />} label="Lab blocks" value={String(labCount)} />
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8" id="builder">
        <div className="space-y-6">
          <BuilderPanel
            college={college}
            onGenerate={handleGenerate}
            setCollege={setCollege}
            setSettings={setSettings}
            setSubjects={setSubjects}
            settings={settings}
            subjects={subjects}
          />
          <ExportBar college={college} days={settings.workingDays} result={result} />
          <TimetableGrid days={settings.workingDays} entries={result.entries} slots={result.slots} />
        </div>
        <InsightsPanel conflicts={result.conflicts} qualityScore={result.qualityScore} suggestions={result.suggestions} workload={result.workload} />
      </section>
    </main>
  );
}

export default App;
