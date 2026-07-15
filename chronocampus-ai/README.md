# ChronoCampus AI

**Generate Perfect College Timetables with AI**

ChronoCampus AI is a React + TypeScript + Tailwind CSS SaaS dashboard for generating balanced weekly college timetables. It schedules labs as continuous 3-4 hour blocks, detects faculty conflicts, distributes subjects across the week, avoids repetitive adjacent slots, and provides workload insights with PDF, Excel, JSON, and print export options.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Framer Motion
- jsPDF
- Lucide React

## Features

- AI timetable generation
- Lab scheduling in continuous blocks
- Faculty conflict detection
- Workload analysis
- AI suggestions and quality score
- Responsive glassmorphism dashboard
- PDF export
- Excel-compatible export
- JSON download
- Print support

## Getting Started

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5174`.

## Build

```bash
npm run build
```

## Project Structure

```text
chronocampus-ai/
  public/
  src/
    components/
    lib/
    types/
    App.tsx
    index.css
    main.tsx
  package.json
  vite.config.ts
  tsconfig.json
```

## Notes

The current generation engine runs locally in the browser and uses deterministic scoring to produce an AI-style optimized timetable. It can be connected to an LLM or backend optimization service later without changing the UI contract.
