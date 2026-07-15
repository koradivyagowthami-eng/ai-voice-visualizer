import { Moon, Sparkles, Sun } from "lucide-react";
import { motion } from "framer-motion";

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Navbar({ isDark, onToggleTheme }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-white/65 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3 font-semibold text-slate-950 dark:text-white">
          <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
            <Sparkles className="size-5" />
          </span>
          <span>AI College Timetable Generator</span>
        </a>
        <div className="flex items-center gap-3">
          <a
            href="#generator"
            className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-400 hover:text-cyan-700 dark:border-white/10 dark:text-slate-200 dark:hover:text-cyan-200 sm:inline-flex"
          >
            Open Generator
          </a>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={onToggleTheme}
            className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:border-cyan-400 dark:border-white/10 dark:bg-white/10 dark:text-white"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </motion.button>
        </div>
      </nav>
    </header>
  );
}
