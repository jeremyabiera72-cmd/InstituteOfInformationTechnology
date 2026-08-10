const fs = require('fs');
const files = [
  'src/pages/Dashboard.tsx',
  'src/pages/Assignments.tsx',
  'src/pages/Notes.tsx',
  'src/pages/Portfolio.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/👋|🎉|🚧|🚀|💡|🔥/g, '');
    fs.writeFileSync(file, content);
  }
}
console.log('Emojis removed');
