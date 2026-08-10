const fs = require('fs');
let code = fs.readFileSync('src/pages/Notes.tsx', 'utf8');

const regex = /  return \(\n    const filteredNotes = notes\.filter\(note => \n    note\.title\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\) \|\| \n    \(note\.subject\?\.name \|\| ''\)\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\)\n  \);\n  \n  return \(/;

const replacement = `  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (note.subject?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (`

code = code.replace(regex, replacement);
fs.writeFileSync('src/pages/Notes.tsx', code);
