const fs = require('fs');

let code = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');
code = code.replace('KeyRound\n  ArrowLeft', 'KeyRound,\n  ArrowLeft');
fs.writeFileSync('src/layouts/AdminLayout.tsx', code);
