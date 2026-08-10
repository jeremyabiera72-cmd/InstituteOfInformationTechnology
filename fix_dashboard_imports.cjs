const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

if (!code.includes("import { Link } from 'react-router-dom';")) {
  code = `import { Link } from 'react-router-dom';\n` + code;
}

code = code.replace("import { Trophy, Calendar, FileText, Link2, Loader2, Image as ImageIcon, X, Plus } from 'lucide-react';", 
"import { Trophy, Calendar, FileText, Link2, Loader2, Image as ImageIcon, X, Plus, BookOpen, CheckSquare, ShieldAlert, Users, CalendarClock } from 'lucide-react';");

fs.writeFileSync('src/pages/Dashboard.tsx', code);
