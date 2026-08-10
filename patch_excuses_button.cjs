const fs = require('fs');
let code = fs.readFileSync('src/pages/Excuses.tsx', 'utf8');

// Find the print button and replace it with a Download button that triggers print dialog (which saves as PDF)
const regex = /<button onClick=\{\(\) => setConfirmAction\(\{ type: 'print', id: excuse\.id \}\)\} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Print\/Save as PDF">\s*<Printer className="w-4 h-4" \/>\s*<\/button>/;

const replacement = `<button onClick={() => { window.print(); }} className="flex items-center gap-2 p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors font-medium text-sm" title="Download Letter as PDF">
                    <Download className="w-4 h-4" /> Download
                  </button>`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/pages/Excuses.tsx', code);
