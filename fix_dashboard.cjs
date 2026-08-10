const fs = require('fs');
let dash = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');
dash = dash.replace('Brain, Trophy,', 'Brain, Trophy, Link2,');
fs.writeFileSync('src/pages/Dashboard.tsx', dash);
