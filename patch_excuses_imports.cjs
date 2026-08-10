const fs = require('fs');
let code = fs.readFileSync('src/pages/Excuses.tsx', 'utf8');
code = code.replace("Trash2, Printer, X, Download, Paperclip", "Trash2, Printer, X, Download, Paperclip, CheckCircle");
fs.writeFileSync('src/pages/Excuses.tsx', code);
