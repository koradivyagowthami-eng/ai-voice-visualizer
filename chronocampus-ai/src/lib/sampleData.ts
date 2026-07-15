import type { CollegeDetails, Subject, TimetableSettings } from "../types/timetable";

export const initialCollege: CollegeDetails = {
  collegeName: "Chrono Institute of Technology",
  department: "Computer Science and Engineering",
  semester: "Semester V",
  section: "CSE-A",
  room: "Block B / Smart Room 304"
};

export const initialSettings: TimetableSettings = {
  workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  startTime: "09:00",
  endTime: "16:00",
  slotMinutes: 60,
  breakAfterSlot: 3
};

export const initialSubjects: Subject[] = [
  {
    id: "ai",
    name: "Artificial Intelligence",
    faculty: "Dr. Mira Sen",
    classesPerWeek: 4,
    isLab: false,
    labHours: 3,
    color: "#62e0d9"
  },
  {
    id: "dbms",
    name: "Database Systems",
    faculty: "Prof. Arjun Rao",
    classesPerWeek: 4,
    isLab: false,
    labHours: 3,
    color: "#8ff0b2"
  },
  {
    id: "cn",
    name: "Computer Networks",
    faculty: "Dr. Kavya Iyer",
    classesPerWeek: 3,
    isLab: false,
    labHours: 3,
    color: "#f5c96a"
  },
  {
    id: "se",
    name: "Software Engineering",
    faculty: "Prof. Neil Dsouza",
    classesPerWeek: 3,
    isLab: false,
    labHours: 3,
    color: "#f28f6b"
  },
  {
    id: "ai-lab",
    name: "AI Lab",
    faculty: "Dr. Mira Sen",
    classesPerWeek: 1,
    isLab: true,
    labHours: 3,
    color: "#9ea8ff"
  },
  {
    id: "dbms-lab",
    name: "DBMS Lab",
    faculty: "Prof. Arjun Rao",
    classesPerWeek: 1,
    isLab: true,
    labHours: 4,
    color: "#ff9db2"
  }
];
