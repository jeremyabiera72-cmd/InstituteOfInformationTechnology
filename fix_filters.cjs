const fs = require('fs');

const filesToFix = [
  'src/pages/SharedLinks.tsx',
  'src/pages/Dashboard.tsx',
  'src/pages/Deadlines.tsx',
  'src/pages/Assignments.tsx',
  'src/pages/Excuses.tsx'
];

for (const file of filesToFix) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/setLinks\(links\.filter/g, 'setLinks((Array.isArray(links) ? links : []).filter');
  content = content.replace(/const assignmentsDue = assignments\.filter/g, 'const assignmentsDue = (Array.isArray(assignments) ? assignments : []).filter');
  content = content.replace(/setDeadlines\(deadlines\.filter/g, 'setDeadlines((Array.isArray(deadlines) ? deadlines : []).filter');
  content = content.replace(/const dayEvents = deadlines\.filter/g, 'const dayEvents = (Array.isArray(deadlines) ? deadlines : []).filter');
  content = content.replace(/setAssignments\(assignments\.filter/g, 'setAssignments((Array.isArray(assignments) ? assignments : []).filter');
  content = content.replace(/setExcuses\(excuses\.filter/g, 'setExcuses((Array.isArray(excuses) ? excuses : []).filter');
  fs.writeFileSync(file, content);
}
console.log("Filters fixed.");
