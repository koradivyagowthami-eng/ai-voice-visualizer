import { Download, FileJson, FileSpreadsheet, Printer } from "lucide-react";
import type { CollegeDetails, DayName, GenerationResult } from "../types/timetable";
import { exportExcel, exportJson, exportPdf } from "../lib/exporters";

type ExportBarProps = {
  college: CollegeDetails;
  result: GenerationResult;
  days: DayName[];
};

export function ExportBar({ college, result, days }: ExportBarProps) {
  return (
    <div className="glass-card flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 p-3">
      <p className="text-sm text-slate-300">Export your timetable for approval, faculty review, or classroom notice boards.</p>
      <div className="flex flex-wrap gap-2">
        <button className="secondary-button" onClick={() => exportPdf(college, result, days)} type="button">
          <Download className="h-4 w-4" />
          PDF
        </button>
        <button className="secondary-button" onClick={() => exportExcel(college, result, days)} type="button">
          <FileSpreadsheet className="h-4 w-4" />
          Excel
        </button>
        <button className="secondary-button" onClick={() => exportJson(college, result)} type="button">
          <FileJson className="h-4 w-4" />
          JSON
        </button>
        <button className="secondary-button" onClick={() => window.print()} type="button">
          <Printer className="h-4 w-4" />
          Print
        </button>
      </div>
    </div>
  );
}
