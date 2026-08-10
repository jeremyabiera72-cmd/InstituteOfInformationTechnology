const fs = require('fs');

// Fix Assignments.tsx
let assignments = fs.readFileSync('src/pages/Assignments.tsx', 'utf8');
if (!assignments.includes('const { user } = useAuth();')) {
  assignments = assignments.replace('export default function Assignments() {', 'export default function Assignments() {\n  const { user } = require("../contexts/AuthContext.tsx").useAuth();');
}
if (!assignments.includes('Trash2')) {
  assignments = assignments.replace("import { CheckCircle2, Clock, Calendar, Plus, FileText, AlertCircle, AlertOctagon } from 'lucide-react';", "import { CheckCircle2, Clock, Calendar, Plus, FileText, AlertCircle, AlertOctagon, Trash2 } from 'lucide-react';");
}
fs.writeFileSync('src/pages/Assignments.tsx', assignments);

// Fix SharedLinks.tsx
let links = fs.readFileSync('src/pages/SharedLinks.tsx', 'utf8');
if (!links.includes('import { Link2, Plus, Loader2, ExternalLink, Trash2 }')) {
  links = links.replace("import { Link2, Plus, Loader2, ExternalLink } from 'lucide-react';", "import { Link2, Plus, Loader2, ExternalLink, Trash2 } from 'lucide-react';");
}
fs.writeFileSync('src/pages/SharedLinks.tsx', links);
