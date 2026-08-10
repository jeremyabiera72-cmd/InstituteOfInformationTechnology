const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(/import \{ \$\{p1\}, Plus \} from 'lucide-react';/g, "import { Trophy, Calendar, FileText, Link2, Loader2, Image as ImageIcon, X, Plus } from 'lucide-react';");

fs.writeFileSync('src/pages/Dashboard.tsx', code);
