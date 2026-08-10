const fs = require('fs');
let code = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');

code = code.replace(
  "import { BookOpen, MessageSquare, Link2, Code2, Outlet, Link, useLocation } from 'react-router-dom';",
  "import { Outlet, Link, useLocation } from 'react-router-dom';"
);

code = code.replace(
  "import { useAuth } from '../contexts/AuthContext.tsx';\nimport {\n  LayoutDashboard,",
  "import { useAuth } from '../contexts/AuthContext.tsx';\nimport {\n  BookOpen, MessageSquare, Link2, Code2,\n  LayoutDashboard,"
);

fs.writeFileSync('src/layouts/AdminLayout.tsx', code);
