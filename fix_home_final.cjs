const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');
code = `import ditLogo from '../assets/images/regenerated_image_1783588651815.png';\n` + code;
fs.writeFileSync('src/pages/Home.tsx', code);
