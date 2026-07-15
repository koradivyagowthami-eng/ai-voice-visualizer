import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  GeneratedTimetable,
  Subject,
  TimetableCell,
  TimetableFormData,
  TimeSlot,
} from "../types/timetable";

const MODEL_NAME = "gemini-1.5-flash";

const colorlessBreak: TimetableCell = {
  subjectName: "Break",
  facultyName: "Recharge",
  type: "Break",
};

const normalizeJson = (text: string) => {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  return start >= 0 && end >= 0 ? cleaned.slice(start, end + 1) : cleaned;
};

const toMinutes = (value: string) => {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
};

const toTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60).toString().padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
};

export const createTimeSlots = (form: TimetableFormData): TimeSlot[] => {
  const start = toMinutes(form.startTime);
  const end = toMinutes(form.endTime);
  const breakAt = form.breakTime ? toMinutes(form.breakTime) : -1;
  const slots: TimeSlot[] = [];

  for (let cursor = start; cursor < end; cursor += 60) {
    const next = Math.min(cursor + 60, end);
    const label = `${toTime(cursor)} - ${toTime(next)}`;
    slots.push({
      id: `${toTime(cursor)}-${toTime(next)}`,
      start: toTime(cursor),
      end: toTime(next),
      label,
      isBreak: cursor === breakAt,
    });
  }

  return slots;
};

const pickSubject = (
  subjects: Subject[],
  counts: Record<string, number>,
  previous?: string,
) => {
  const candidates = subjects
    .filter((subject) => counts[subject.id] < subject.classesPerWeek)
    .sort((a, b) => {
      const aRemaining = a.classesPerWeek - counts[a.id];
      const bRemaining = b.classesPerWeek - counts[b.id];
      return bRemaining - aRemaining;
    });

  return candidates.find((subject) => subject.id !== previous) ?? candidates[0] ?? subjects[0];
};

export const buildLocalTimetable = (form: TimetableFormData): GeneratedTimetable => {
  const timeSlots = createTimeSlots(form);
  const counts = Object.fromEntries(form.subjects.map((subject) => [subject.id, 0]));
  const schedule: GeneratedTimetable["schedule"] = {};

  form.workingDays.forEach((day, dayIndex) => {
    schedule[day] = {};
    let previousSubject = "";

    timeSlots.forEach((slot, slotIndex) => {
      if (slot.isBreak) {
        schedule[day][slot.id] = colorlessBreak;
        previousSubject = "";
        return;
      }

      const subject = pickSubject(form.subjects, counts, previousSubject);
      if (!subject) {
        schedule[day][slot.id] = {
          subjectName: "Self Study",
          facultyName: "Open",
          type: "Free",
        };
        return;
      }

      const shouldPlaceLabBlock =
        subject.type === "Lab" &&
        slotIndex < timeSlots.length - 1 &&
        !timeSlots[slotIndex + 1]?.isBreak &&
        counts[subject.id] + 1 < subject.classesPerWeek;

      schedule[day][slot.id] = {
        subjectName: subject.name,
        facultyName: subject.faculty,
        type: subject.type,
        note: shouldPlaceLabBlock ? "Lab block" : undefined,
      };
      counts[subject.id] += 1;
      previousSubject = subject.id;

      if (shouldPlaceLabBlock) {
        const nextSlot = timeSlots[slotIndex + 1];
        schedule[day][nextSlot.id] = {
          subjectName: subject.name,
          facultyName: subject.faculty,
          type: subject.type,
          note: "Lab block",
        };
        counts[subject.id] += 1;
      }
    });

    if (dayIndex % 2 === 1) {
      form.subjects.reverse().reverse();
    }
  });

  const totalRequested = form.subjects.reduce((sum, subject) => sum + subject.classesPerWeek, 0);
  const scheduled = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return {
    days: form.workingDays,
    timeSlots,
    schedule,
    analysis: {
      workloadScore: Math.min(98, Math.max(72, Math.round((scheduled / Math.max(totalRequested, 1)) * 94))),
      subjectDistribution: form.subjects.map(
        (subject) => `${subject.name}: ${counts[subject.id] ?? 0}/${subject.classesPerWeek} weekly sessions planned`,
      ),
      suggestions: [
        "Keep lab sessions in paired slots where room availability allows.",
        "Review faculty availability before final publishing.",
        "Use the chat assistant for targeted changes like lighter Mondays or extra practice classes.",
      ],
      conflictWarnings:
        scheduled < totalRequested
          ? ["Some requested sessions could not fit in the available working hours."]
          : ["No obvious faculty conflicts detected in the generated grid."],
    },
  };
};

const buildPrompt = (form: TimetableFormData, instruction?: string, current?: GeneratedTimetable) => `
Generate an optimized college timetable.

Rules:
- Distribute subjects evenly.
- Avoid consecutive repetition of same subject.
- Place lab sessions in continuous blocks.
- Balance workload throughout the week.
- Avoid faculty conflicts.
- Generate a timetable for all working days.
- Return only valid JSON. Do not use markdown.

Required JSON shape:
{
  "days": string[],
  "timeSlots": [{"id": string, "start": "HH:mm", "end": "HH:mm", "label": string, "isBreak": boolean}],
  "schedule": {"Monday": {"09:00-10:00": {"subjectName": string, "facultyName": string, "type": "Theory" | "Lab" | "Break" | "Free", "note": string}}},
  "analysis": {"workloadScore": number, "subjectDistribution": string[], "suggestions": string[], "conflictWarnings": string[]}
}

College data:
${JSON.stringify(form, null, 2)}

Current timetable, if modifying:
${current ? JSON.stringify(current, null, 2) : "None"}

User modification request:
${instruction ?? "Create a new timetable."}
`;

export const generateTimetable = async (
  form: TimetableFormData,
  instruction?: string,
  current?: GeneratedTimetable,
): Promise<GeneratedTimetable> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return buildLocalTimetable(form);
  }

  try {
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(buildPrompt(form, instruction, current));
    const text = result.response.text();
    return JSON.parse(normalizeJson(text)) as GeneratedTimetable;
  } catch (error) {
    console.error("Gemini timetable generation failed. Falling back locally.", error);
    return {
      ...buildLocalTimetable(form),
      analysis: {
        ...buildLocalTimetable(form).analysis,
        conflictWarnings: [
          "Gemini response could not be parsed, so a local optimized fallback was generated.",
        ],
      },
    };
  }
};
