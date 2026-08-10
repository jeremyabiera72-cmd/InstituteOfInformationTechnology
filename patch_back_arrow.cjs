const fs = require('fs');
let code = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

if (!code.includes('ArrowLeft')) {
  code = code.replace(
    "} from 'lucide-react';",
    "  ArrowLeft,\n} from 'lucide-react';"
  );
}

code = code.replace(
  '<span className="font-medium">«</span>',
  `{location.pathname !== '/' && (
                <Link to="/" className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Back to Home">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              )}`
);

fs.writeFileSync('src/layouts/DashboardLayout.tsx', code);
