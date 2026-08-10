const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

if (!code.includes('import { Plus')) {
  // Let's just find the lucide-react import and add Plus
  code = code.replace(/import\s*\{([^}]+)\}\s*from\s*'lucide-react'/g, (match, p1) => {
    if (!p1.includes('Plus')) {
      return `import { \${p1}, Plus } from 'lucide-react'`;
    }
    return match;
  });
  
  fs.writeFileSync('src/pages/Dashboard.tsx', code);
}
