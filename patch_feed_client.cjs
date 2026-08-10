const fs = require('fs');
let code = fs.readFileSync('src/pages/Feed.tsx', 'utf8');

code = code.replace(
  "const res = await axios.get('/api/feed');",
  "const userArea = localStorage.getItem('userArea') || 'BSCS';\n      const res = await axios.get(`/api/feed?area=${userArea}`);"
);

code = code.replace(
  "const res = await axios.post('/api/feed', { content });",
  "const userArea = localStorage.getItem('userArea') || 'BSCS';\n      const res = await axios.post('/api/feed', { content, area: userArea });"
);

fs.writeFileSync('src/pages/Feed.tsx', code);
