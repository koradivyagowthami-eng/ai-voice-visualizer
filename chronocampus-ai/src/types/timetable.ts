export type DayName = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

export type Subject = {
  id: string;
  name: string;
  faculty: string;
  classesPerWeek: number;
  isLab: boolean;
  labHours: 3 | 4;
  color: string;
};

export type CollegeDetails = {
  collegeName: string;
  department: string;
  semester: string;
  section: string;
  room: string;
};

export type TimetableSettings = {
  workingDays: DayName[];
  startTime: string;
  endTime: string;
  slotMinutes: number;
  breakAfterSlot: number;
};

export type TimetableEntry = {
  id: string;
  subjectId: string;
  subjectName: string;
  faculty: string;
  day: DayName;
  slot: number;
  startTime: string;
  endTime: string;
  isLab: boolean;
  durationSlots: number;
  color: string;
};

export type Conflict = {
  severity: "high" | "medium" | "low";
  message: string;
};

export type WorkloadDay = {
  day: DayName;
  filledSlots: number;
  labSlots: number;
  facultyCount: number;
};

export type GenerationResult = {
  entries: TimetableEntry[];
  conflicts: Conflict[];
  suggestions: string[];
  workload: WorkloadDay[];
  qualityScore: number;
  slots: string[];
};
