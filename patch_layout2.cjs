const fs = require('fs');
let code = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

code = code.replace(
  "const userArea = localStorage.getItem('userArea') || 'Student System';",
  "const { area } = useParams<{ area: string }>();\n  const userArea = area ? area.toUpperCase() : localStorage.getItem('userArea') || 'Student System';"
);

fs.writeFileSync('src/layouts/DashboardLayout.tsx', code);
