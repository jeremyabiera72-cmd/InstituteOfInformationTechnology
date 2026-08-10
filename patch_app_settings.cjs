const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetImport = `import Deadlines from './pages/Deadlines.tsx';`;
const replaceImport = `import Deadlines from './pages/Deadlines.tsx';
import Settings from './pages/Settings.tsx';`;
code = code.replace(targetImport, replaceImport);

const targetRoute = `            <Route path="report-bullying" element={<ReportBullying />} />`;
const replaceRoute = `            <Route path="report-bullying" element={<ReportBullying />} />
            <Route path="settings" element={<Settings />} />`;
code = code.replace(targetRoute, replaceRoute);

fs.writeFileSync('src/App.tsx', code);

// Patch DashboardLayout.tsx to include Settings in the sidebar or just somewhere
let layoutCode = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');
const targetLayoutImport = `import { LayoutDashboard, BookOpen, User, LogOut, CheckSquare, MessageSquare, Menu, Link as LinkIcon, FileText, CalendarClock, ShieldAlert, GraduationCap, X } from 'lucide-react';`;
const replaceLayoutImport = `import { LayoutDashboard, BookOpen, User, LogOut, CheckSquare, MessageSquare, Menu, Link as LinkIcon, FileText, CalendarClock, ShieldAlert, GraduationCap, X, Settings as SettingsIcon } from 'lucide-react';`;
layoutCode = layoutCode.replace(targetLayoutImport, replaceLayoutImport);

const targetMenuItems = `    { icon: ShieldAlert, label: 'Report Bullying', path: '/report-bullying' }
  ];`;
const replaceMenuItems = `    { icon: ShieldAlert, label: 'Report Bullying', path: '/report-bullying' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' }
  ];`;
layoutCode = layoutCode.replace(targetMenuItems, replaceMenuItems);

fs.writeFileSync('src/layouts/DashboardLayout.tsx', layoutCode);
