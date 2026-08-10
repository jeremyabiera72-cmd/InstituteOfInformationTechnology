const fs = require('fs');
let layout = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');

layout = layout.replace(
  "import {",
  "import { BookOpen, MessageSquare, Link2, Code2,"
);

layout = layout.replace(
  `const navigation = [
  { name: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Manage Deadlines', href: '/admin/deadlines', icon: CalendarCheck },
  { name: 'Manage Students', href: '/admin/students', icon: Users },
  { name: 'Manage Excuses', href: '/admin/excuses', icon: FileSignature },
  { name: 'Area Passwords', href: '/admin/passwords', icon: KeyRound },
];`,
  `const navigation = [
  // Admin specific
  { name: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Manage Deadlines', href: '/admin/manage-deadlines', icon: CalendarCheck },
  { name: 'Manage Students', href: '/admin/students', icon: Users },
  { name: 'Manage Excuses', href: '/admin/excuses', icon: FileSignature },
  { name: 'Area Passwords', href: '/admin/passwords', icon: KeyRound },
  
  // User system
  { name: 'Class Notes', href: '/admin/notes', icon: BookOpen },
  { name: 'Assignments', href: '/admin/assignments', icon: CalendarCheck },
  { name: 'Community Feed', href: '/admin/feed', icon: MessageSquare },
  { name: 'Shared Links', href: '/admin/links', icon: Link2 },
  { name: 'Excuse Area', href: '/admin/user-excuses', icon: FileSignature },
  { name: 'Upcoming Deadlines', href: '/admin/user-deadlines', icon: CalendarCheck },
  { name: 'Code Playground', href: '/admin/playground', icon: Code2 },
  { name: 'Student Directory', href: '/admin/portfolio', icon: Users },
];`
);

fs.writeFileSync('src/layouts/AdminLayout.tsx', layout);
