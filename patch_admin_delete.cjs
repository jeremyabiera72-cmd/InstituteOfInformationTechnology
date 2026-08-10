const fs = require('fs');

let fundsCode = fs.readFileSync('src/pages/admin/ManageFunds.tsx', 'utf8');
fundsCode = fundsCode.replace(
  /<button\s+onClick=\{\(\) => handleDelete\(fund\.id\)\}\s+className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"\s*>\s*<Trash2 className="w-5 h-5" \/>\s*<\/button>/g,
  `<button onClick={() => handleDelete(fund.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-500 rounded-md hover:bg-rose-50 hover:text-rose-600 text-sm font-medium transition-colors border border-slate-200 hover:border-rose-200"><Trash2 className="w-4 h-4" /> Delete</button>`
);
fs.writeFileSync('src/pages/admin/ManageFunds.tsx', fundsCode);

let deadlinesCode = fs.readFileSync('src/pages/admin/AdminDeadlines.tsx', 'utf8');
deadlinesCode = deadlinesCode.replace(
  /<button\s+onClick=\{\(\) => handleDelete\(deadline\.id\)\}\s+className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"\s*>\s*<Trash2 className="w-4 h-4" \/>\s*<\/button>/g,
  `<button onClick={() => handleDelete(deadline.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-500 rounded-md hover:bg-rose-50 hover:text-rose-600 text-sm font-medium transition-colors border border-slate-200 hover:border-rose-200"><Trash2 className="w-4 h-4" /> Delete</button>`
);
fs.writeFileSync('src/pages/admin/AdminDeadlines.tsx', deadlinesCode);
