import jsPDF from "jspdf";
import type { CollegeDetails, DayName, GenerationResult, TimetableEntry } from "../types/timetable";

function downloadBlob(filename: string, content: BlobPart, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function entryAt(entries: TimetableEntry[], day: DayName, slot: number) {
  return entries.find((entry) => entry.day === day && entry.slot === slot);
}

export function exportJson(college: CollegeDetails, result: GenerationResult) {
  downloadBlob(
    "chronocampus-timetable.json",
    JSON.stringify({ college, generatedAt: new Date().toISOString(), ...result }, null, 2),
    "application/json"
  );
}

export function exportExcel(college: CollegeDetails, result: GenerationResult, days: DayName[]) {
  const rows = result.slots
    .map((slotLabel, slotIndex) => {
      const cells = days
        .map((day) => {
          const entry = entryAt(result.entries, day, slotIndex);
          return `<td>${entry ? `${entry.subjectName}<br/>${entry.faculty}` : "Free"}</td>`;
        })
        .join("");
      return `<tr><th>${slotLabel}</th>${cells}</tr>`;
    })
    .join("");

  const html = `
    <html>
      <head><meta charset="UTF-8" /></head>
      <body>
        <h1>${college.collegeName}</h1>
        <h2>${college.department} - ${college.semester} - ${college.section}</h2>
        <table border="1">
          <thead><tr><th>Time</th>${days.map((day) => `<th>${day}</th>`).join("")}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `;

  downloadBlob("chronocampus-timetable.xls", html, "application/vnd.ms-excel");
}

export function exportPdf(college: CollegeDetails, result: GenerationResult, days: DayName[]) {
  const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const margin = 36;
  const width = pdf.internal.pageSize.getWidth() - margin * 2;
  const cellWidth = width / (days.length + 1);
  const cellHeight = 58;
  let y = 42;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("ChronoCampus AI Timetable", margin, y);
  y += 24;
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`${college.collegeName} | ${college.department} | ${college.semester} | ${college.section}`, margin, y);
  y += 28;

  const drawCell = (text: string, x: number, top: number, w: number, h: number, header = false) => {
    pdf.setDrawColor(75, 95, 108);
    pdf.setFillColor(header ? 18 : 9, header ? 42 : 24, header ? 49 : 31);
    pdf.rect(x, top, w, h, "FD");
    pdf.setTextColor(240, 248, 250);
    pdf.setFontSize(header ? 9 : 8);
    const lines = pdf.splitTextToSize(text, w - 12);
    pdf.text(lines, x + 6, top + 17);
  };

  drawCell("Time", margin, y, cellWidth, 34, true);
  days.forEach((day, index) => drawCell(day, margin + cellWidth * (index + 1), y, cellWidth, 34, true));
  y += 34;

  result.slots.forEach((slotLabel, slotIndex) => {
    if (y + cellHeight > pdf.internal.pageSize.getHeight() - margin) {
      pdf.addPage();
      y = margin;
    }

    drawCell(slotLabel, margin, y, cellWidth, cellHeight);
    days.forEach((day, dayIndex) => {
      const entry = entryAt(result.entries, day, slotIndex);
      const text = entry ? `${entry.subjectName}\n${entry.faculty}${entry.isLab ? "\nLab block" : ""}` : "Free";
      drawCell(text, margin + cellWidth * (dayIndex + 1), y, cellWidth, cellHeight);
    });
    y += cellHeight;
  });

  pdf.save("chronocampus-timetable.pdf");
}
