const fs = require('fs');
let code = fs.readFileSync('src/pages/Notes.tsx', 'utf8');

const stateRegex = /const \[searchQuery, setSearchQuery\] = useState\(''\);/;
const stateReplacement = `const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');`;
code = code.replace(stateRegex, stateReplacement);

const filterRegex = /const filteredNotes = notes\.filter\(note => \n    note\.title\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\) \|\| \n    \(note\.subject\?\.name \|\| ''\)\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\)\n  \);/;

const filterReplacement = `const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (note.subject?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                          (filterType === 'my-notes' && (note.uploaderId === user?.uid || note.uploader?.email === user?.email));
    return matchesSearch && matchesFilter;
  });`;
code = code.replace(filterRegex, filterReplacement);

const buttonRegex = /<button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium">\s*<Filter className="w-4 h-4" \/> Filter\s*<\/button>/;

const buttonReplacement = `<select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium appearance-none cursor-pointer"
          >
            <option value="all">All Notes</option>
            <option value="my-notes">My Notes</option>
          </select>`;
code = code.replace(buttonRegex, buttonReplacement);

fs.writeFileSync('src/pages/Notes.tsx', code);
