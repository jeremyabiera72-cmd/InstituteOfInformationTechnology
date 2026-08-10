const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(
  "const res = await axios.get('/api/dashboard');",
  "const userArea = localStorage.getItem('userArea') || 'BSCS';\n      const res = await axios.get(`/api/dashboard?area=${userArea}`);"
);

code = code.replace(
  "const res = await axios.post('/api/dashboard/announcements', { content: announcement });",
  "const userArea = localStorage.getItem('userArea') || 'BSCS';\n      const res = await axios.post('/api/dashboard/announcements', { content: announcement, area: userArea });"
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
