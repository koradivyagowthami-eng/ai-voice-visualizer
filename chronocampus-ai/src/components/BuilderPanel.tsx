import { Plus, RefreshCcw, Trash2 } from "lucide-react";
import type { CollegeDetails, DayName, Subject, TimetableSettings } from "../types/timetable";

const allDays: DayName[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const palette = ["#62e0d9", "#8ff0b2", "#f5c96a", "#f28f6b", "#9ea8ff", "#ff9db2", "#7dd3fc", "#c4b5fd"];

type BuilderPanelProps = {
  college: CollegeDetails;
  setCollege: (college: CollegeDetails) => void;
  settings: TimetableSettings;
  setSettings: (settings: TimetableSettings) => void;
  subjects: Subject[];
  setSubjects: (subjects: Subject[]) => void;
  onGenerate: () => void;
};

export function BuilderPanel({ college, setCollege, settings, setSettings, subjects, setSubjects, onGenerate }: BuilderPanelProps) {
  const updateSubject = (id: string, patch: Partial<Subject>) => {
    setSubjects(subjects.map((subject) => (subject.id === id ? { ...subject, ...patch } : subject)));
  };

  const addSubject = () => {
    const index = subjects.length;
    setSubjects([
      ...subjects,
      {
        id: `subject-${Date.now()}`,
        name: "New Subject",
        faculty: "Faculty Name",
        classesPerWeek: 3,
        isLab: false,
        labHours: 3,
        color: palette[index % palette.length]
      }
    ]);
  };

  const removeSubject = (id: string) => setSubjects(subjects.filter((subject) => subject.id !== id));

  const toggleDay = (day: DayName) => {
    const nextDays = settings.workingDays.includes(day)
      ? settings.workingDays.filter((item) => item !== day)
      : [...settings.workingDays, day].sort((a, b) => allDays.indexOf(a) - allDays.indexOf(b));
    setSettings({ ...settings, workingDays: nextDays.length ? nextDays : [day] });
  };

  return (
    <section className="glass-card rounded-lg border border-white/10 p-4 shadow-2xl shadow-black/25 lg:p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Generator</p>
          <h2 className="text-xl font-semibold text-white">College Timetable Builder</h2>
        </div>
        <button className="primary-button" onClick={onGenerate} type="button">
          <RefreshCcw className="h-4 w-4" />
          Generate
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <TextField label="College" value={college.collegeName} onChange={(collegeName) => setCollege({ ...college, collegeName })} />
        <TextField label="Department" value={college.department} onChange={(department) => setCollege({ ...college, department })} />
        <TextField label="Semester" value={college.semester} onChange={(semester) => setCollege({ ...college, semester })} />
        <TextField label="Section" value={college.section} onChange={(section) => setCollege({ ...college, section })} />
        <TextField label="Room" value={college.room} onChange={(room) => setCollege({ ...college, room })} />
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Start" type="time" value={settings.startTime} onChange={(startTime) => setSettings({ ...settings, startTime })} />
          <TextField label="End" type="time" value={settings.endTime} onChange={(endTime) => setSettings({ ...settings, endTime })} />
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-slate-300">Working days</p>
        <div className="flex flex-wrap gap-2">
          {allDays.map((day) => (
            <button
              className={`day-chip ${settings.workingDays.includes(day) ? "day-chip-active" : ""}`}
              key={day}
              onClick={() => toggleDay(day)}
              type="button"
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-200">Subjects and faculty</p>
          <p className="text-xs text-slate-500">Labs are reserved as 3-4 continuous hours.</p>
        </div>
        <button className="icon-button" onClick={addSubject} type="button" aria-label="Add subject">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {subjects.map((subject) => (
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3" key={subject.id}>
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_86px_86px_44px]">
              <TextField label="Subject" value={subject.name} onChange={(name) => updateSubject(subject.id, { name })} />
              <TextField label="Faculty" value={subject.faculty} onChange={(faculty) => updateSubject(subject.id, { faculty })} />
              <NumberField
                label="Classes"
                min={1}
                max={8}
                value={subject.classesPerWeek}
                onChange={(classesPerWeek) => updateSubject(subject.id, { classesPerWeek })}
              />
              <NumberField
                label="Lab hrs"
                min={3}
                max={4}
                value={subject.labHours}
                onChange={(labHours) => updateSubject(subject.id, { labHours: labHours === 4 ? 4 : 3 })}
              />
              <button className="icon-button self-end" onClick={() => removeSubject(subject.id)} type="button" aria-label="Remove subject">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                <input
                  checked={subject.isLab}
                  className="h-4 w-4 accent-cyan-300"
                  onChange={(event) => updateSubject(subject.id, { isLab: event.target.checked })}
                  type="checkbox"
                />
                Lab subject
              </label>
              <input
                aria-label={`${subject.name} color`}
                className="h-8 w-12 rounded border border-white/20 bg-transparent"
                onChange={(event) => updateSubject(subject.id, { color: event.target.value })}
                type="color"
                value={subject.color}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
};

function TextField({ label, value, onChange, type = "text" }: TextFieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{label}</span>
      <input className="field" onChange={(event) => onChange(event.target.value)} type={type} value={value} />
    </label>
  );
}

type NumberFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

function NumberField({ label, value, min, max, onChange }: NumberFieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{label}</span>
      <input
        className="field"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        type="number"
        value={value}
      />
    </label>
  );
}
