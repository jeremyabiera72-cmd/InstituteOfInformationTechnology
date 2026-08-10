const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const targetImport = `import { 
  BookOpen, 
  CheckSquare, 
  MessageSquare, 
  FileText, 
  CalendarClock, 
  Terminal,
  Asterisk
} from 'lucide-react';`;

const replacementImport = `import { 
  BookOpen, 
  CheckSquare, 
  MessageSquare, 
  FileText, 
  CalendarClock, 
  Terminal,
  Asterisk,
  ShieldAlert
} from 'lucide-react';`;

code = code.replace(targetImport, replacementImport);

const targetFeatures = `const FEATURES = [
  { icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50", title: "Class Notes", desc: "Centralized repository for lecture materials." },
  { icon: CheckSquare, color: "text-emerald-600", bg: "bg-emerald-50", title: "Assignments", desc: "Manage coursework and submissions." },
  { icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50", title: "Community Feed", desc: "Social discussion space for students." },
  { icon: Terminal, color: "text-teal-600", bg: "bg-teal-50", title: "Code Playground", desc: "Interactive environment for coding." },
  { icon: CalendarClock, color: "text-rose-600", bg: "bg-rose-50", title: "Deadlines", desc: "Track upcoming academic schedules." },
  { icon: FileText, color: "text-orange-600", bg: "bg-orange-50", title: "Excuse Area", desc: "Submit absence or excuse requests." },
];`;

const replacementFeatures = `const FEATURES = [
  { icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50", title: "Class Notes", desc: "Centralized repository for lecture materials." },
  { icon: CheckSquare, color: "text-emerald-600", bg: "bg-emerald-50", title: "Assignments", desc: "Manage coursework and submissions." },
  { icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50", title: "Community Feed", desc: "Social discussion space for students." },
  { icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50", title: "Report Bullying", desc: "Safely and anonymously report bullying incidents." },
  { icon: Terminal, color: "text-teal-600", bg: "bg-teal-50", title: "Code Playground", desc: "Interactive environment for coding." },
  { icon: CalendarClock, color: "text-rose-600", bg: "bg-rose-50", title: "Deadlines", desc: "Track upcoming academic schedules." },
  { icon: FileText, color: "text-orange-600", bg: "bg-orange-50", title: "Excuse Area", desc: "Submit absence or excuse requests." },
];`;

code = code.replace(targetFeatures, replacementFeatures);
fs.writeFileSync('src/pages/Home.tsx', code);
