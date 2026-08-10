const fs = require('fs');
let code = fs.readFileSync('src/pages/Notes.tsx', 'utf8');

code = code.replace("const [uploading, setUploading] = useState(false);", "const [uploading, setUploading] = useState(false);\n  const [confirmAction, setConfirmAction] = useState<{type: 'delete', id: number} | null>(null);");

fs.writeFileSync('src/pages/Notes.tsx', code);
