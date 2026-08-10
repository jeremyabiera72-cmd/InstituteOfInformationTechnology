const fs = require('fs');
let code = fs.readFileSync('src/pages/Assignments.tsx', 'utf8');

code = code.replace('  const { user } = require("../contexts/AuthContext.tsx").useAuth();', '  const { user } = useAuth();');
if (!code.includes('import { useAuth }')) {
  code = code.replace("import { CheckCircle2,", "import { useAuth } from '../contexts/AuthContext.tsx';\nimport { CheckCircle2,");
}
fs.writeFileSync('src/pages/Assignments.tsx', code);
