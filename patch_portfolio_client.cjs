const fs = require('fs');
let code = fs.readFileSync('src/pages/Portfolio.tsx', 'utf8');

code = code.replace(
  "axios.get('/api/students')",
  "axios.get(`/api/students?area=${localStorage.getItem('userArea') || 'BSCS'}`)"
);

fs.writeFileSync('src/pages/Portfolio.tsx', code);
