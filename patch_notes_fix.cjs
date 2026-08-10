const fs = require('fs');
let code = fs.readFileSync('src/pages/Notes.tsx', 'utf8');

const regex = /<div className="max-w-6xl mx-auto space-y-6">/;

code = code.replace(regex, `const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (note.subject?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="max-w-6xl mx-auto space-y-6">`);
    
const badSyntax = /  const filteredNotes = notes\.filter\(note => \n    note\.title\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\) \|\| \n    \(note\.subject\?\.name \|\| ''\)\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\)\n  \);\n  \n      \{filteredNotes\.length === 0 \? \(/;

code = code.replace(badSyntax, "{filteredNotes.length === 0 ? (");

fs.writeFileSync('src/pages/Notes.tsx', code);
