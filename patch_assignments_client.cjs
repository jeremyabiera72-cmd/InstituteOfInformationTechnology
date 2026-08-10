const fs = require('fs');
let code = fs.readFileSync('src/pages/Assignments.tsx', 'utf8');

code = code.replace(
  "const res = await axios.get('/api/assignments');",
  "const userArea = localStorage.getItem('userArea') || 'BSCS';\n      const res = await axios.get(`/api/assignments?area=${userArea}`);"
);

code = code.replace(
  "await axios.post('/api/assignments', newAssignment);",
  "const userArea = localStorage.getItem('userArea') || 'BSCS';\n      await axios.post('/api/assignments', { ...newAssignment, area: userArea });"
);

fs.writeFileSync('src/pages/Assignments.tsx', code);
