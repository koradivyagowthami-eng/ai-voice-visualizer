import { Download, FileJson, FileText, Printer } from "lucide-react";
import { motion } from "framer-motion";
import type { GeneratedTimetable, TimetableFormData } from "../types/timetable";
import { downloadTimetableJson, exportTimetablePdf } from "../utils/pdfExport";

interface ExportButtonsProps {
  form: TimetableFormData;
  timetable?: GeneratedTimetable;
}

export default function ExportButtons({ form, timetable }: ExportButtonsProps) {
  const disabled = !timetable;

  return (
    <div className="flex flex-wrap gap-3">
      <ExportButton
        icon={FileText}
        label="Export PDF"
        disabled={disabled}
        onClick={() => timetable && exportTimetablePdf(form, timetable)}
      />
      <ExportButton icon={Printer} label="Print Timetable" disabled={disabled} onClick={() => window.print()} />
      <ExportButton
        icon={FileJson}
        label="Download JSON"
        disabled={disabled}
        onClick={() => timetable && downloadTimetableJson(form, timetable)}
      />
    </div>
  );
}

interface ExportButtonProps {
  icon: typeof Download;
  label: string;
  disabled: boolean;
  onClick: () => void;
}

function ExportButton({ icon: Icon, label, disabled, onClick }: ExportButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/10 dark:bg-white/10 dark:text-white"
    >
      <Icon className="size-4" />
      {label}
    </motion.button>
  );
}
