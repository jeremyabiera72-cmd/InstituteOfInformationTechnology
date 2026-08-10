const fs = require('fs');
let code = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');

const oldAdminSpecific = `{ name: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Manage Deadlines', href: '/admin/manage-deadlines', icon: CalendarCheck },
      { name: 'Manage Appointments', href: '/admin/manage-appointments', icon: CalendarClock },
      { name: 'Manage Funds', href: '/admin/manage-funds', icon: Landmark },
      { name: 'Manage Students', href: '/admin/students', icon: Users },
      { name: 'Manage Excuses', href: '/admin/excuses', icon: FileSignature },
      { name: 'Bullying Reports', href: '/admin/bullying-reports', icon: ShieldAlert },
      { name: 'Area Passwords', href: '/admin/passwords', icon: KeyRound },`;

const newAdminSpecific = `{ name: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Manage Announcements', href: '/admin/manage-announcements', icon: Megaphone },
      { name: 'Manage Deadlines', href: '/admin/manage-deadlines', icon: CalendarCheck },
      { name: 'Manage Appointments', href: '/admin/manage-appointments', icon: CalendarClock },
      { name: 'Manage Funds', href: '/admin/manage-funds', icon: Landmark },
      { name: 'Manage Students', href: '/admin/students', icon: Users },
      { name: 'Manage Lost & Found', href: '/admin/manage-lost-and-found', icon: Search },
      { name: 'Manage Excuses', href: '/admin/excuses', icon: FileSignature },
      { name: 'Bullying Reports', href: '/admin/bullying-reports', icon: ShieldAlert },
      { name: 'Area Passwords', href: '/admin/passwords', icon: KeyRound },`;

code = code.replace(oldAdminSpecific, newAdminSpecific);
code = code.replace(
  "import { LayoutDashboard, Users, CalendarCheck, FileSignature, LogOut, ShieldAlert, KeyRound, BookOpen, MessageSquare, Link2, Code2, Menu, Contact, CalendarClock, Landmark } from 'lucide-react';",
  "import { LayoutDashboard, Users, CalendarCheck, FileSignature, LogOut, ShieldAlert, KeyRound, BookOpen, MessageSquare, Link2, Code2, Menu, Contact, CalendarClock, Landmark, Megaphone, Search } from 'lucide-react';"
);

fs.writeFileSync('src/layouts/AdminLayout.tsx', code);
