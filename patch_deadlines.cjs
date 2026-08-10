const fs = require('fs');
let code = fs.readFileSync('src/pages/Deadlines.tsx', 'utf8');

const stateRegex = /const \[submitting, setSubmitting\] = useState\(false\);/;
code = code.replace(stateRegex, "const [submitting, setSubmitting] = useState(false);\n  const [confirmAction, setConfirmAction] = useState<{type: 'delete', id: number} | null>(null);");

const deleteRegex = /const handleDelete = async \(id: number\) => {[\s\S]*?alert\('Error deleting event'\);\s*}\s*};/;
const newActions = `const handleDelete = async (id: number) => {
    try {
      await axios.delete(\`/api/community-deadlines/\${id}\`);
      setDeadlines(deadlines.filter(d => d.id !== id));
      setConfirmAction(null);
    } catch (error) {
      console.error(error);
      alert('Error deleting event');
    }
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'delete') {
      handleDelete(confirmAction.id);
    }
  };`;
code = code.replace(deleteRegex, newActions);

const buttonRegex = /onClick=\{\(\) => handleDelete\(deadline.id\)\}/;
code = code.replace(buttonRegex, "onClick={() => setConfirmAction({ type: 'delete', id: deadline.id })}");

const modalCode = `
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl relative overflow-hidden">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Event?</h3>
            <p className="text-slate-600 mb-6 text-sm">
              This action cannot be undone. Are you sure you want to permanently delete this event?
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
                className="px-4 py-2 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

code = code.replace(/    <\/div>\n  \);\n}\s*$/, modalCode);

fs.writeFileSync('src/pages/Deadlines.tsx', code);
console.log("Patched Deadlines.tsx");
