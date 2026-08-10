const fs = require('fs');
let code = fs.readFileSync('src/pages/Excuses.tsx', 'utf8');

const buttonsRegex = /<div className="flex gap-2">\s*<button onClick=\{\(\) => window\.print\(\)\} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Print\/Save as PDF">\s*<Printer className="w-4 h-4" \/>\s*<\/button>\s*<button onClick=\{\(\) => handleDelete\(excuse\.id\)\} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">\s*<Trash2 className="w-4 h-4" \/>\s*<\/button>\s*<\/div>/;

const newButtons = `<div className="flex gap-2 items-center">
                  {excuse.status === 'done' ? (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Done
                    </span>
                  ) : (
                    <button onClick={() => setConfirmAction({ type: 'done', id: excuse.id })} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Mark as Done">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => setConfirmAction({ type: 'print', id: excuse.id })} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Print/Save as PDF">
                    <Printer className="w-4 h-4" />
                  </button>
                  <button onClick={() => setConfirmAction({ type: 'delete', id: excuse.id })} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>`;

code = code.replace(buttonsRegex, newButtons);

const modalCode = `
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl relative overflow-hidden">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              {confirmAction.type === 'delete' ? 'Delete Excuse Letter?' 
                : confirmAction.type === 'print' ? 'Print Excuse Letter?' 
                : 'Mark as Done?'}
            </h3>
            <p className="text-slate-600 mb-6 text-sm">
              {confirmAction.type === 'delete' ? 'This action cannot be undone. Are you sure you want to permanently delete this letter?' 
                : confirmAction.type === 'print' ? 'Are you sure you want to print this letter?' 
                : 'Are you sure you want to mark this letter as done?'}
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirm}
                className={\`px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors \${
                  confirmAction.type === 'delete' ? 'bg-rose-500 hover:bg-rose-600'
                  : confirmAction.type === 'print' ? 'bg-indigo-500 hover:bg-indigo-600'
                  : 'bg-emerald-500 hover:bg-emerald-600'
                }\`}
              >
                {confirmAction.type === 'delete' ? 'Delete' 
                  : confirmAction.type === 'print' ? 'Print' 
                  : 'Mark Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

code = code.replace(/    <\/div>\n  \);\n}\s*$/, modalCode);

fs.writeFileSync('src/pages/Excuses.tsx', code);
