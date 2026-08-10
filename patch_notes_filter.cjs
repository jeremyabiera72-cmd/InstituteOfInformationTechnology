const fs = require('fs');
let code = fs.readFileSync('src/pages/Notes.tsx', 'utf8');

code = code.replace("const [uploading, setUploading] = useState(false);", "const [uploading, setUploading] = useState(false);\n  const [searchQuery, setSearchQuery] = useState('');");

const inputRegex = /<input \s*type="text" \s*placeholder="Search documents, subjects..." \s*className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"\s*\/>/;

const newInput = `<input 
            type="text" 
            placeholder="Search documents, subjects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
          />`;

code = code.replace(inputRegex, newInput);

const mapRegex = /\{notes\.length === 0 \? \(/;

const newMap = `
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (note.subject?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  
      {filteredNotes.length === 0 ? (`;

code = code.replace(mapRegex, newMap);

const renderRegex = /\{notes\.map\(note => \(/;
code = code.replace(renderRegex, "{filteredNotes.map(note => (");

fs.writeFileSync('src/pages/Notes.tsx', code);
