const fs = require('fs');
let code = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

// Move useParams out of the map loop
code = code.replace(
  "const { area } = useParams<{ area: string }>();\\n  const userArea = area ? area.toUpperCase() : localStorage.getItem('userArea') || 'Student System';",
  "const { area } = useParams<{ area: string }>();\\n  const userArea = area ? area.toUpperCase() : localStorage.getItem('userArea') || 'Student System';"
);

// Remove the one inside map
code = code.replace(
  /const { area } = useParams<{ area: string }>\(\);\n                  const basePath = `\/\${area}`;/g,
  "const basePath = `/${area}`;"
);

// Fix the other one
code = code.replace(
  /location.pathname !== `\/\${useParams\(\).area}`/g,
  "location.pathname !== `/${area}`"
);

code = code.replace(
  /to={`\/\${useParams\(\).area}`}/g,
  "to={`/${area}`}"
);

fs.writeFileSync('src/layouts/DashboardLayout.tsx', code);
