import jsPDF from "jspdf";
import type { GeneratedTimetable, TimetableFormData } from "../types/timetable";

export const exportTimetablePdf = (form: TimetableFormData, timetable: GeneratedTimetable) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const margin = 32;
  const pageWidth = doc.internal.pageSize.getWidth();
  const columnWidth = (pageWidth - margin * 2 - 110) / timetable.days.length;
  let y = 42;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(`${form.collegeName || "College"} Timetable`, margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`${form.departmentName} - Semester ${form.semester}`, margin, y + 18);

  y += 52;
  doc.setFont("helvetica", "bold");
  doc.text("Time", margin, y);
  timetable.days.forEach((day, index) => {
    doc.text(day, margin + 110 + index * columnWidth, y);
  });

  doc.setFont("helvetica", "normal");
  timetable.timeSlots.forEach((slot) => {
    y += 34;
    doc.text(slot.label, margin, y);
    timetable.days.forEach((day, index) => {
      const cell = timetable.schedule[day]?.[slot.id];
      const x = margin + 110 + index * columnWidth;
      doc.setFillColor(slot.isBreak ? 244 : 239, slot.isBreak ? 247 : 246, slot.isBreak ? 251 : 255);
      doc.roundedRect(x - 5, y - 17, columnWidth - 8, 28, 4, 4, "F");
      doc.text(cell?.subjectName ?? "Free", x, y - 2, { maxWidth: columnWidth - 18 });
      doc.setFontSize(8);
      doc.text(cell?.facultyName ?? "Open", x, y + 9, { maxWidth: columnWidth - 18 });
      doc.setFontSize(10);
    });
  });

  doc.save(`${form.collegeName || "college"}-timetable.pdf`.replace(/\s+/g, "-").toLowerCase());
};

export const downloadTimetableJson = (form: TimetableFormData, timetable: GeneratedTimetable) => {
  const blob = new Blob([JSON.stringify({ form, timetable }, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${form.collegeName || "college"}-timetable.json`.replace(/\s+/g, "-").toLowerCase();
  anchor.click();
  URL.revokeObjectURL(url);
};
