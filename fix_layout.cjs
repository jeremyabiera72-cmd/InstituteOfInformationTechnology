const fs = require('fs');
let layout = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

layout = layout.replace(
  "import {\n  Link2, Outlet,",
  "import {\n  Outlet,"
);

layout = layout.replace(
  "MessageSquare\n} from 'lucide-react';",
  "MessageSquare,\n  Link2\n} from 'lucide-react';"
);

fs.writeFileSync('src/layouts/DashboardLayout.tsx', layout);
