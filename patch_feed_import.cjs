const fs = require('fs');
let code = fs.readFileSync('src/pages/Feed.tsx', 'utf8');
code = code.replace("Share2, ", "");
fs.writeFileSync('src/pages/Feed.tsx', code);
