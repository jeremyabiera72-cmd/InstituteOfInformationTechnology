const fs = require('fs');
let code = fs.readFileSync('src/pages/Excuses.tsx', 'utf8');

code = code.replace("const [confirmAction, setConfirmAction] = useState<{type: 'delete' | 'done', id: number} | null>(null);", 
  "const [confirmAction, setConfirmAction] = useState<{type: 'delete' | 'done' | 'print', id: number} | null>(null);");

code = code.replace(`  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'delete') {
      handleDelete(confirmAction.id);
    } else if (confirmAction.type === 'done') {
      handleMarkDone(confirmAction.id);
    }`, `  const handlePrint = () => {
    window.print();
    setConfirmAction(null);
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'delete') {
      handleDelete(confirmAction.id);
    } else if (confirmAction.type === 'done') {
      handleMarkDone(confirmAction.id);
    } else if (confirmAction.type === 'print') {
      handlePrint();
    }`);

fs.writeFileSync('src/pages/Excuses.tsx', code);
