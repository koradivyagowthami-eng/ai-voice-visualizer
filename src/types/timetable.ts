export type SubjectType = "Theory" | "Lab";

export interface Subject {
  id: string;
  name: string;
  faculty: string;
  classesPerWeek: number;
  type: SubjectType;
}

export interface TimetableFormData {
  collegeName: string;
  departmentName: string;
  semester: string;
  workingDays: string[];
  startTime: string;
  endTime: string;
  breakTime: string;
  subjects: Subject[];
}

export interface TimeSlot {
  id: string;
  start: string;
  end: string;
  label: string;
  isBreak?: boolean;
}

export interface TimetableCell {
  subjectName: string;
  facultyName: string;
  type: SubjectType | "Break" | "Free";
  note?: string;
}

export interface GeneratedTimetable {
  days: string[];
  timeSlots: TimeSlot[];
  schedule: Record<string, Record<string, TimetableCell>>;
  analysis: {
    workloadScore: number;
    subjectDistribution: string[];
    suggestions: string[];
    conflictWarnings: string[];
  };
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
