import { ArrowRight, BrainCircuit, CalendarDays, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 animated-gradient opacity-90" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.55),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(34,211,238,0.35),transparent_26%),radial-gradient(circle_at_50%_90%,rgba(99,102,241,0.30),transparent_30%)] dark:opacity-60" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/30 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:text-cyan-100">
            <BrainCircuit className="size-4" />
            AI scheduling for real college constraints
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight text-slate-950 sm:text-6xl lg:text-7xl dark:text-white">
            Generate balanced college timetables in minutes.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg dark:text-slate-200">
            Enter departments, working hours, subjects, faculty, and lab loads. Gemini builds an optimized timetable with
            workload insights, conflicts, exports, and chat-based refinements.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="#generator"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-semibold text-white shadow-xl shadow-slate-900/20 transition hover:bg-cyan-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
            >
              Generate Timetable <ArrowRight className="size-5" />
            </motion.a>
            <a
              href="#dashboard"
              className="inline-flex items-center justify-center rounded-full border border-white/50 bg-white/35 px-6 py-3 font-semibold text-slate-900 backdrop-blur-xl transition hover:bg-white/55 dark:border-white/10 dark:bg-white/10 dark:text-white"
            >
              View Dashboard
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="glass-panel p-4 sm:p-6"
        >
          <div className="grid gap-3">
            {["Monday", "Tuesday", "Wednesday", "Thursday"].map((day, index) => (
              <div key={day} className="grid grid-cols-[88px_1fr_1fr] gap-3">
                <div className="rounded-xl bg-slate-950/90 px-3 py-4 text-sm font-semibold text-white dark:bg-white/15">
                  {day}
                </div>
                <div className="rounded-xl bg-cyan-400/25 px-3 py-4 text-sm text-slate-800 dark:text-cyan-50">
                  {index % 2 ? "DSA Lab" : "DBMS"}
                </div>
                <div className="rounded-xl bg-indigo-500/20 px-3 py-4 text-sm text-slate-800 dark:text-indigo-50">
                  {index % 2 ? "Networks" : "AI Theory"}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/55 p-4 dark:bg-white/10">
              <CalendarDays className="size-5 text-cyan-700 dark:text-cyan-300" />
              <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">94%</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">Workload score</p>
            </div>
            <div className="rounded-2xl bg-white/55 p-4 dark:bg-white/10">
              <ShieldCheck className="size-5 text-emerald-700 dark:text-emerald-300" />
              <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">0</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">Faculty conflicts</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
