const fs = require('fs');
let code = fs.readFileSync('src/pages/Assignments.tsx', 'utf8');

code = code.replace("const [isAdding, setIsAdding] = useState(false);", "const [isAdding, setIsAdding] = useState(false);\n  const [confirmAction, setConfirmAction] = useState<{type: 'delete' | 'done', id: number} | null>(null);");

fs.writeFileSync('src/pages/Assignments.tsx', code);
