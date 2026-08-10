const fs = require('fs');

const filesToFix = [
  'src/pages/Assignments.tsx',
  'src/pages/Dashboard.tsx',
  'src/pages/Deadlines.tsx',
  'src/pages/Excuses.tsx',
  'src/pages/Feed.tsx',
  'src/pages/Playground.tsx',
  'src/pages/Portfolio.tsx',
  'src/pages/SharedLinks.tsx'
];

for (const file of filesToFix) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/assignments\.map\(/g, '(Array.isArray(assignments) ? assignments : []).map(');
    content = content.replace(/announcements\.map\(/g, '(Array.isArray(announcements) ? announcements : []).map(');
    content = content.replace(/excuses\.map\(/g, '(Array.isArray(excuses) ? excuses : []).map(');
    content = content.replace(/feed\.map\(/g, '(Array.isArray(feed) ? feed : []).map(');
    content = content.replace(/dailyChallenges\.map\(/g, '(Array.isArray(dailyChallenges) ? dailyChallenges : []).map(');
    content = content.replace(/students\.map\(/g, '(Array.isArray(students) ? students : []).map(');
    content = content.replace(/links\.map\(/g, '(Array.isArray(links) ? links : []).map(');
    content = content.replace(/deadlines\.map\(/g, '(Array.isArray(deadlines) ? deadlines : []).map(');
    fs.writeFileSync(file, content);
  }
}
console.log("Maps fixed.");
