const fs = require('fs');

['src/layouts/DashboardLayout.tsx', 'src/layouts/AdminLayout.tsx'].forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace('ChevronDown\n  ArrowLeft', 'ChevronDown,\n  ArrowLeft');
  fs.writeFileSync(file, code);
});
