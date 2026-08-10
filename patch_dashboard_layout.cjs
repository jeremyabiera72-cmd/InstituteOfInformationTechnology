const fs = require('fs');
let code = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

const oldCommunity = `{ name: 'Community Feed', href: '/feed', icon: MessageSquare },
      { name: 'Student Directory', href: '/portfolio', icon: Users },
      { name: 'Shared Links', href: '/links', icon: Link2 },`;

const newCommunity = `{ name: 'Announcements', href: '/announcements', icon: Megaphone },
      { name: 'Community Feed', href: '/feed', icon: MessageSquare },
      { name: 'Student Directory', href: '/portfolio', icon: Users },
      { name: 'Shared Links', href: '/links', icon: Link2 },
      { name: 'Lost and Found', href: '/lost-and-found', icon: Search },`;

code = code.replace(oldCommunity, newCommunity);
code = code.replace(
  "import { LayoutDashboard, BookOpen, MessageSquare, Terminal, Users, CalendarCheck, Link2, FileText, Settings, LogOut, Code, Menu, ShieldAlert, FileClock, ShieldQuestion } from 'lucide-react';",
  "import { LayoutDashboard, BookOpen, MessageSquare, Terminal, Users, CalendarCheck, Link2, FileText, Settings, LogOut, Code, Menu, ShieldAlert, FileClock, ShieldQuestion, Megaphone, Search } from 'lucide-react';"
);

fs.writeFileSync('src/layouts/DashboardLayout.tsx', code);
