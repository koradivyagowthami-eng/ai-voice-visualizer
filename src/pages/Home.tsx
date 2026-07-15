import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, CalendarCheck2, GraduationCap, Loader2, MessageSquareText, Send, UsersRound } from "lucide-react";
import AIInsights from "../components/AIInsights";
import ExportButtons from "../components/ExportButtons";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import SubjectForm from "../components/SubjectForm";
import TimetableGrid from "../components/TimetableGrid";
import { generateTimetable } from "../services/gemini";
import type { ChatMessage, GeneratedTimetable, TimetableFormData } from "../types/timetable";

const defaultForm: TimetableFormData = {
  collegeName: "Northbridge Institute of Technology",
  departmentName: "Computer Science and Engineering",
  semester: "5",
  workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  startTime: "09:00",
  endTime: "16:00",
  breakTime: "13:00",
  subjects: [
    { id: crypto.randomUUID(), name: "DBMS", faculty: "Dr. Meera Rao", classesPerWeek: 4, type: "Theory" },
    { id: crypto.randomUUID(), name: "DSA", faculty: "Prof. Arjun Sen", classesPerWeek: 4, type: "Theory" },
    { id: crypto.randomUUID(), name: "AI Lab", faculty: "Dr. Isha Nair", classesPerWeek: 2, type: "Lab" },
    { id: crypto.randomUUID(), name: "Computer Networks", faculty: "Prof. Kabir Shah", classesPerWeek: 3, type: "Theory" },
  ],
};

export default function Home() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") !== "light");
  const [form, setForm] = useState(defaultForm);
  const [timetable, setTimetable] = useState<GeneratedTimetable>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "Ask me to rebalance the timetable, move a class, or add extra sessions after generation.",
    },
  ]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const stats = useMemo(
    () => [
      { label: "Subjects", value: form.subjects.length, icon: GraduationCap },
      { label: "Working days", value: form.workingDays.length, icon: CalendarCheck2 },
      { label: "Faculty", value: new Set(form.subjects.map((subject) => subject.faculty).filter(Boolean)).size, icon: UsersRound },
    ],
    [form.subjects, form.workingDays.length],
  );

  const handleGenerate = async (instruction?: string) => {
    setError("");
    setIsLoading(true);
    try {
      const result = await generateTimetable(form, instruction, timetable);
      setTimetable(result);
      if (instruction) {
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "I regenerated the timetable with your requested change and refreshed the analysis.",
          },
        ]);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to generate timetable.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChat = async () => {
    const instruction = chatInput.trim();
    if (!instruction || isLoading) return;

    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: instruction },
    ]);
    setChatInput("");
    await handleGenerate(instruction);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-white">
      <Navbar isDark={isDark} onToggleTheme={() => setIsDark((value) => !value)} />
      <Hero />

      <main id="dashboard" className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="glass-panel hidden h-fit p-4 lg:block">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-950 p-4 text-white dark:bg-white/10">
            <Bot className="size-5 text-cyan-300" />
            <div>
              <p className="text-sm font-semibold">Scheduler AI</p>
              <p className="text-xs text-slate-300">Gemini assisted</p>
            </div>
          </div>
          <nav className="mt-4 grid gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
            {["Generator", "Timetable", "AI Insights", "Exports"].map((item) => (
              <a key={item} href={item === "Generator" ? "#generator" : "#insights"} className="rounded-xl px-3 py-2 transition hover:bg-white/65 hover:text-slate-950 dark:hover:bg-white/10 dark:hover:text-white">
                {item}
              </a>
            ))}
          </nav>
        </aside>

        <div className="grid gap-6">
          <section className="grid gap-4 md:grid-cols-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="glass-panel p-5"
              >
                <stat.icon className="size-5 text-cyan-700 dark:text-cyan-300" />
                <p className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">{stat.value}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{stat.label}</p>
              </motion.div>
            ))}
          </section>

          <SubjectForm form={form} onChange={setForm} onGenerate={() => handleGenerate()} isLoading={isLoading} />

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white/70 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Export center</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">Save the active timetable as PDF, print, or JSON.</p>
            </div>
            <ExportButtons form={form} timetable={timetable} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <TimetableGrid timetable={timetable} />
            <div className="grid gap-6">
              <AIInsights timetable={timetable} />
              <section className="glass-panel p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-2xl bg-cyan-500/15 text-cyan-700 dark:text-cyan-200">
                    <MessageSquareText className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">Assistant</p>
                    <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Refine with chat</h2>
                  </div>
                </div>
                <div className="mt-5 max-h-72 space-y-3 overflow-y-auto pr-1">
                  <AnimatePresence initial={false}>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`rounded-2xl px-4 py-3 text-sm ${
                          message.role === "user"
                            ? "ml-8 bg-slate-950 text-white dark:bg-cyan-400 dark:text-slate-950"
                            : "mr-8 bg-white/65 text-slate-700 dark:bg-white/10 dark:text-slate-200"
                        }`}
                      >
                        {message.content}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="mt-4 flex gap-2">
                  <input
                    className="field-input"
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && handleChat()}
                    placeholder="Move DBMS to Friday"
                  />
                  <button
                    onClick={handleChat}
                    disabled={isLoading || !chatInput.trim()}
                    className="grid size-11 shrink-0 place-items-center rounded-xl bg-cyan-500 text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Send chat instruction"
                  >
                    {isLoading ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
