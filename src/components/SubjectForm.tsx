import { Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Subject, TimetableFormData } from "../types/timetable";

const dayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface SubjectFormProps {
  form: TimetableFormData;
  onChange: (form: TimetableFormData) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const newSubject = (): Subject => ({
  id: crypto.randomUUID(),
  name: "",
  faculty: "",
  classesPerWeek: 3,
  type: "Theory",
});

export default function SubjectForm({ form, onChange, onGenerate, isLoading }: SubjectFormProps) {
  const updateField = <K extends keyof TimetableFormData>(field: K, value: TimetableFormData[K]) => {
    onChange({ ...form, [field]: value });
  };

  const updateSubject = (id: string, patch: Partial<Subject>) => {
    updateField(
      "subjects",
      form.subjects.map((subject) => (subject.id === id ? { ...subject, ...patch } : subject)),
    );
  };

  return (
    <motion.section
      id="generator"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      className="glass-panel p-5 sm:p-6"
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">Input</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">Timetable requirements</h2>
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onGenerate}
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Generating..." : "Generate Timetable"}
        </motion.button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <label className="field-label">
          College Name
          <input className="field-input" value={form.collegeName} onChange={(e) => updateField("collegeName", e.target.value)} />
        </label>
        <label className="field-label">
          Department Name
          <input className="field-input" value={form.departmentName} onChange={(e) => updateField("departmentName", e.target.value)} />
        </label>
        <label className="field-label">
          Semester
          <input className="field-input" value={form.semester} onChange={(e) => updateField("semester", e.target.value)} />
        </label>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div className="field-label">
          Working Days
          <div className="mt-2 flex flex-wrap gap-2">
            {dayOptions.map((day) => {
              const active = form.workingDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() =>
                    updateField(
                      "workingDays",
                      active ? form.workingDays.filter((item) => item !== day) : [...form.workingDays, day],
                    )
                  }
                  className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-slate-950 text-white dark:bg-cyan-400 dark:text-slate-950"
                      : "bg-white/70 text-slate-700 dark:bg-white/10 dark:text-slate-200"
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              );
            })}
          </div>
        </div>
        <label className="field-label">
          Start Time
          <input className="field-input" type="time" value={form.startTime} onChange={(e) => updateField("startTime", e.target.value)} />
        </label>
        <label className="field-label">
          End Time
          <input className="field-input" type="time" value={form.endTime} onChange={(e) => updateField("endTime", e.target.value)} />
        </label>
        <label className="field-label">
          Break Time
          <input className="field-input" type="time" value={form.breakTime} onChange={(e) => updateField("breakTime", e.target.value)} />
        </label>
      </div>

      <div className="mt-7 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Subjects</h3>
        <button
          type="button"
          onClick={() => updateField("subjects", [...form.subjects, newSubject()])}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-cyan-400 dark:border-white/10 dark:bg-white/10 dark:text-white"
        >
          <Plus className="size-4" /> Add Subject
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        {form.subjects.map((subject) => (
          <div key={subject.id} className="grid gap-3 rounded-2xl border border-slate-200/80 bg-white/60 p-3 dark:border-white/10 dark:bg-white/5 md:grid-cols-[1.1fr_1.1fr_0.7fr_0.7fr_auto]">
            <input className="field-input" placeholder="Subject name" value={subject.name} onChange={(e) => updateSubject(subject.id, { name: e.target.value })} />
            <input className="field-input" placeholder="Faculty name" value={subject.faculty} onChange={(e) => updateSubject(subject.id, { faculty: e.target.value })} />
            <input
              className="field-input"
              type="number"
              min={1}
              max={10}
              value={subject.classesPerWeek}
              onChange={(e) => updateSubject(subject.id, { classesPerWeek: Number(e.target.value) })}
            />
            <select className="field-input" value={subject.type} onChange={(e) => updateSubject(subject.id, { type: e.target.value as Subject["type"] })}>
              <option>Theory</option>
              <option>Lab</option>
            </select>
            <button
              type="button"
              onClick={() => updateField("subjects", form.subjects.filter((item) => item.id !== subject.id))}
              className="grid size-11 place-items-center rounded-xl bg-rose-50 text-rose-600 transition hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300"
              aria-label={`Remove ${subject.name || "subject"}`}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
