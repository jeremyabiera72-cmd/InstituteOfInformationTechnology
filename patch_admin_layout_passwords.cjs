const fs = require('fs');
let code = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');

if (!code.includes('Area Passwords')) {
  code = code.replace(
    "import {\n  LayoutDashboard,\n  CalendarCheck,\n  LogOut,\n  Menu,\n  X,\n  Users,\n  FileSignature\n} from 'lucide-react';",
    "import {\n  LayoutDashboard,\n  CalendarCheck,\n  LogOut,\n  Menu,\n  X,\n  Users,\n  FileSignature,\n  KeyRound\n} from 'lucide-react';"
  );

  code = code.replace(
    "{ name: 'Manage Excuses', href: '/admin/excuses', icon: FileSignature },",
    "{ name: 'Manage Excuses', href: '/admin/excuses', icon: FileSignature },\n  { name: 'Area Passwords', href: '/admin/passwords', icon: KeyRound },"
  );
  
  fs.writeFileSync('src/layouts/AdminLayout.tsx', code);
}
