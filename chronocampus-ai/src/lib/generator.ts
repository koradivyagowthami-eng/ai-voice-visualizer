import type {
  Conflict,
  DayName,
  GenerationResult,
  Subject,
  TimetableEntry,
  TimetableSettings,
  WorkloadDay
} from "../types/timetable";
import { buildSlots, slotBounds } from "./time";

type Grid = Record<DayName, Array<TimetableEntry | null>>;

function createGrid(days: DayName[], slotCount: number): Grid {
  return days.reduce((grid, day) => {
    grid[day] = Array.from({ length: slotCount }, () => null);
    return grid;
  }, {} as Grid);
}

function hasFacultyConflict(grid: Grid, day: DayName, slot: number, faculty: string, duration = 1) {
  return grid[day].slice(slot, slot + duration).some((entry) => entry?.faculty === faculty);
}

function dayLoad(grid: Grid, day: DayName) {
  return grid[day].filter(Boolean).length;
}

function subjectCountOnDay(grid: Grid, day: DayName, subjectId: string) {
  return grid[day].filter((entry) => entry?.subjectId === subjectId).length;
}

function adjacentSubjectPenalty(grid: Grid, day: DayName, slot: number, subjectId: string) {
  const previous = grid[day][slot - 1];
  const next = grid[day][slot + 1];
  return (previous?.subjectId === subjectId ? 20 : 0) + (next?.subjectId === subjectId ? 20 : 0);
}

function makeEntry(
  subject: Subject,
  day: DayName,
  slot: number,
  settings: TimetableSettings,
  durationSlots = 1
): TimetableEntry {
  const bounds = slotBounds(settings.startTime, slot, settings.slotMinutes, durationSlots);
  return {
    id: `${subject.id}-${day}-${slot}`,
    subjectId: subject.id,
    subjectName: subject.name,
    faculty: subject.faculty,
    day,
    slot,
    isLab: subject.isLab,
    durationSlots,
    color: subject.color,
    ...bounds
  };
}

function reserve(grid: Grid, entry: TimetableEntry) {
  for (let index = 0; index < entry.durationSlots; index += 1) {
    grid[entry.day][entry.slot + index] = index === 0 ? entry : { ...entry, id: `${entry.id}-${index}` };
  }
}

function placeLab(grid: Grid, subject: Subject, settings: TimetableSettings, slotCount: number) {
  const duration = subject.labHours;
  let best: { day: DayName; slot: number; score: number } | null = null;

  for (const day of settings.workingDays) {
    for (let slot = 0; slot <= slotCount - duration; slot += 1) {
      const target = grid[day].slice(slot, slot + duration);
      const overlaps = target.some(Boolean);
      if (overlaps || hasFacultyConflict(grid, day, slot, subject.faculty, duration)) continue;

      const crossesBreak = slot < settings.breakAfterSlot && slot + duration > settings.breakAfterSlot;
      const score = dayLoad(grid, day) * 4 + subjectCountOnDay(grid, day, subject.id) * 8 + (crossesBreak ? 6 : 0);
      if (!best || score < best.score) best = { day, slot, score };
    }
  }

  if (!best) return false;
  reserve(grid, makeEntry(subject, best.day, best.slot, settings, duration));
  return true;
}

function placeLecture(grid: Grid, subject: Subject, settings: TimetableSettings, slotCount: number) {
  let best: { day: DayName; slot: number; score: number } | null = null;

  for (const day of settings.workingDays) {
    for (let slot = 0; slot < slotCount; slot += 1) {
      if (grid[day][slot] || hasFacultyConflict(grid, day, slot, subject.faculty)) continue;

      const score =
        dayLoad(grid, day) * 5 +
        subjectCountOnDay(grid, day, subject.id) * 14 +
        adjacentSubjectPenalty(grid, day, slot, subject.id) +
        Math.abs(settings.breakAfterSlot - slot);

      if (!best || score < best.score) best = { day, slot, score };
    }
  }

  if (!best) return false;
  reserve(grid, makeEntry(subject, best.day, best.slot, settings));
  return true;
}

function detectConflicts(entries: TimetableEntry[], subjects: Subject[], settings: TimetableSettings, slots: string[]): Conflict[] {
  const conflicts: Conflict[] = [];
  const firstCells = entries.filter((entry) => entry.id === `${entry.subjectId}-${entry.day}-${entry.slot}`);
  const facultyMap = new Map<string, TimetableEntry[]>();

  for (const entry of entries) {
    const key = `${entry.day}-${entry.slot}-${entry.faculty}`;
    facultyMap.set(key, [...(facultyMap.get(key) ?? []), entry]);
  }

  for (const [key, items] of facultyMap) {
    if (items.length > 1) {
      conflicts.push({ severity: "high", message: `Faculty conflict detected at ${key.replaceAll("-", " ")}.` });
    }
  }

  for (const subject of subjects) {
    const required = subject.isLab ? subject.labHours * subject.classesPerWeek : subject.classesPerWeek;
    const scheduled = entries.filter((entry) => entry.subjectId === subject.id).length;
    if (scheduled < required) {
      conflicts.push({
        severity: "medium",
        message: `${subject.name} needs ${required} slots but only ${scheduled} could be scheduled.`
      });
    }
  }

  for (const lab of firstCells.filter((entry) => entry.isLab)) {
    if (lab.durationSlots < 3 || lab.durationSlots > 4) {
      conflicts.push({ severity: "high", message: `${lab.subjectName} is not scheduled as a 3-4 hour continuous block.` });
    }
  }

  const capacity = settings.workingDays.length * slots.length;
  if (entries.length > capacity) {
    conflicts.push({ severity: "high", message: "Requested workload exceeds available weekly capacity." });
  }

  return conflicts;
}

function analyzeWorkload(grid: Grid, settings: TimetableSettings): WorkloadDay[] {
  return settings.workingDays.map((day) => {
    const entries = grid[day].filter(Boolean) as TimetableEntry[];
    return {
      day,
      filledSlots: entries.length,
      labSlots: entries.filter((entry) => entry.isLab).length,
      facultyCount: new Set(entries.map((entry) => entry.faculty)).size
    };
  });
}

function suggestions(workload: WorkloadDay[], conflicts: Conflict[], subjects: Subject[]): string[] {
  const average = workload.reduce((sum, day) => sum + day.filledSlots, 0) / Math.max(workload.length, 1);
  const lightest = [...workload].sort((a, b) => a.filledSlots - b.filledSlots)[0];
  const heaviest = [...workload].sort((a, b) => b.filledSlots - a.filledSlots)[0];
  const labCount = subjects.filter((subject) => subject.isLab).length;

  return [
    conflicts.length === 0
      ? "No faculty conflicts found. The generated plan is ready for review."
      : "Resolve highlighted conflicts by increasing working hours or reducing weekly class load.",
    `${heaviest.day} is the busiest day with ${heaviest.filledSlots} active slots; ${lightest.day} has ${lightest.filledSlots}.`,
    average > 5 ? "Consider adding an extra working day to reduce daily fatigue." : "Daily workload is within a healthy academic range.",
    labCount > 0 ? `${labCount} lab block${labCount > 1 ? "s" : ""} placed as continuous practical sessions.` : "Add lab subjects to let the generator reserve longer practical blocks."
  ];
}

export function generateTimetable(subjects: Subject[], settings: TimetableSettings): GenerationResult {
  const slots = buildSlots(settings.startTime, settings.endTime, settings.slotMinutes);
  const grid = createGrid(settings.workingDays, slots.length);
  const conflicts: Conflict[] = [];

  const labs = subjects.filter((subject) => subject.isLab);
  for (const lab of labs) {
    for (let count = 0; count < lab.classesPerWeek; count += 1) {
      if (!placeLab(grid, lab, settings, slots.length)) {
        conflicts.push({ severity: "high", message: `${lab.name} could not fit into a continuous ${lab.labHours}-hour lab block.` });
      }
    }
  }

  const lectureQueue = subjects
    .filter((subject) => !subject.isLab)
    .flatMap((subject) => Array.from({ length: subject.classesPerWeek }, () => subject))
    .sort((a, b) => b.classesPerWeek - a.classesPerWeek);

  for (const subject of lectureQueue) {
    if (!placeLecture(grid, subject, settings, slots.length)) {
      conflicts.push({ severity: "medium", message: `${subject.name} could not be placed without breaking a scheduling rule.` });
    }
  }

  const entries = settings.workingDays.flatMap((day) => grid[day].filter(Boolean) as TimetableEntry[]);
  const workload = analyzeWorkload(grid, settings);
  const detectedConflicts = detectConflicts(entries, subjects, settings, slots);
  const allConflicts = [...conflicts, ...detectedConflicts];
  const maxLoad = Math.max(...workload.map((day) => day.filledSlots), 0);
  const minLoad = Math.min(...workload.map((day) => day.filledSlots), 0);
  const conflictPenalty = allConflicts.filter((item) => item.severity === "high").length * 16 + allConflicts.length * 5;
  const balancePenalty = (maxLoad - minLoad) * 4;
  const qualityScore = Math.max(62, Math.min(99, 96 - conflictPenalty - balancePenalty));

  return {
    entries,
    conflicts: allConflicts,
    suggestions: suggestions(workload, allConflicts, subjects),
    workload,
    qualityScore,
    slots
  };
}
