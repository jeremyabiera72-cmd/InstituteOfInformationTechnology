const fs = require('fs');

function patchDashboardLayout() {
  const file = 'src/layouts/DashboardLayout.tsx';
  let code = fs.readFileSync(file, 'utf8');
  
  if (!code.includes('import ditLogo')) {
    code = `import ditLogo from '../assets/images/regenerated_image_1783588651815.png';\n` + code;
  }
  
  const target = `<div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center font-bold text-white text-xs shadow-sm">
              SH
            </div>
            <div>
              <h1 className="font-extrabold text-slate-800 tracking-tight text-xl">SystemHub</h1>
            </div>`;
            
  const replacement = `<div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm overflow-hidden">
              <img src={ditLogo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-800 tracking-tight text-xl">Student System</h1>
            </div>`;
            
  code = code.replace(target, replacement);
  fs.writeFileSync(file, code);
}

function patchAdminLayout() {
  const file = 'src/layouts/AdminLayout.tsx';
  let code = fs.readFileSync(file, 'utf8');
  
  if (!code.includes('import ditLogo')) {
    code = `import ditLogo from '../assets/images/regenerated_image_1783588651815.png';\n` + code;
  }
  
  const target = `<div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center font-bold text-white text-xs shadow-sm">
              AH
            </div>
            <div>
              <h1 className="font-extrabold text-slate-800 tracking-tight text-xl">AdminHub</h1>
            </div>`;
            
  const replacement = `<div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm overflow-hidden">
              <img src={ditLogo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-800 tracking-tight text-xl">AdminHub</h1>
            </div>`;
            
  code = code.replace(target, replacement);
  fs.writeFileSync(file, code);
}

patchDashboardLayout();
patchAdminLayout();
