const fs = require('fs');
let code = fs.readFileSync('src/pages/AreaSelection.tsx', 'utf8');

// Add ArrowLeft to imports
code = code.replace(
  "import { Lock, ArrowRight } from 'lucide-react';",
  "import { Lock, ArrowRight, ArrowLeft } from 'lucide-react';\nimport { useAuth } from '../contexts/AuthContext.tsx';"
);

// Add useAuth and handleBack
code = code.replace(
  "const navigate = useNavigate();",
  "const navigate = useNavigate();\n  const { logout } = useAuth();\n  const handleBack = async () => {\n    await logout();\n    navigate('/login');\n  };"
);

// Add back button to UI and center the header
code = code.replace(
  '<div className="p-8">',
  '<div className="p-8 relative">\n          <button \n            type="button"\n            onClick={handleBack}\n            className="absolute top-6 left-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"\n            title="Back to Login"\n          >\n            <ArrowLeft className="w-5 h-5" />\n          </button>'
);

code = code.replace(
  '<div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">',
  '<div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 mx-auto">'
);

code = code.replace(
  '<h1 className="text-2xl font-bold text-slate-800 mb-2">Select Area</h1>',
  '<h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">Select Area</h1>'
);

code = code.replace(
  '<p className="text-slate-500 text-sm mb-8">Choose your program and enter the access code provided by the administrator.</p>',
  '<p className="text-slate-500 text-sm mb-8 text-center">Choose your program and enter the access code provided by the administrator.</p>'
);

fs.writeFileSync('src/pages/AreaSelection.tsx', code);
