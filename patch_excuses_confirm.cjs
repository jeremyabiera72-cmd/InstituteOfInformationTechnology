const fs = require('fs');
let code = fs.readFileSync('src/pages/Excuses.tsx', 'utf8');

const stateRegex = /const \[uploadingProof, setUploadingProof\] = useState\(false\);/;
code = code.replace(stateRegex, "const [uploadingProof, setUploadingProof] = useState(false);\n  const [confirmAction, setConfirmAction] = useState<{type: 'delete' | 'done', id: number} | null>(null);");

const deleteRegex = /const handleDelete = async \(id: number\) => {[\s\S]*?alert\('Error deleting excuse letter'\);\s*}\s*};/;
const newActions = `const handleDelete = async (id: number) => {
    try {
      await axios.delete(\`/api/excuses/\${id}\`);
      setExcuses(excuses.filter(e => e.id !== id));
      setConfirmAction(null);
    } catch (error) {
      console.error(error);
      alert('Error deleting excuse letter');
    }
  };

  const handleMarkDone = async (id: number) => {
    try {
      const res = await axios.patch(\`/api/excuses/\${id}/status\`, { status: 'done' });
      setExcuses(excuses.map(e => e.id === id ? { ...e, status: 'done' } : e));
      setConfirmAction(null);
    } catch (error) {
      console.error(error);
      alert('Error marking as done');
    }
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'delete') {
      handleDelete(confirmAction.id);
    } else if (confirmAction.type === 'done') {
      handleMarkDone(confirmAction.id);
    }
  };`;
code = code.replace(deleteRegex, newActions);

fs.writeFileSync('src/pages/Excuses.tsx', code);
