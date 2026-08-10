const fs = require('fs');
let code = fs.readFileSync('src/pages/Excuses.tsx', 'utf8');

const regex = /<button onClick=\{\(\) => setConfirmAction\(\{ type: 'print', id: excuse\.id \}\)\} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Print\/Save as PDF">\s*<Printer className="w-4 h-4" \/>\s*<\/button>/;

const replacement = `<button onClick={() => setConfirmAction({ type: 'print', id: excuse.id })} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Print/Save as PDF">
                    <Printer className="w-4 h-4" />
                  </button>
                  {excuse.proofUrl && (
                    <a href={excuse.proofUrl} download="proof-file" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center" title="Download Proof File">
                      <Download className="w-4 h-4" />
                    </a>
                  )}`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/pages/Excuses.tsx', code);
