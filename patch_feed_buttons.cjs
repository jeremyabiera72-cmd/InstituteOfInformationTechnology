const fs = require('fs');
let code = fs.readFileSync('src/pages/Feed.tsx', 'utf8');

const regex = /<button type="button" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Attach Link">\s*<Link className="w-5 h-5" \/>\s*<\/button>/;

code = code.replace(regex, "");

fs.writeFileSync('src/pages/Feed.tsx', code);
