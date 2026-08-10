const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('AdminPasswords')) {
  code = code.replace(
    "import AdminExcuses from './pages/admin/AdminExcuses.tsx';",
    "import AdminExcuses from './pages/admin/AdminExcuses.tsx';\nimport AdminPasswords from './pages/admin/AdminPasswords.tsx';"
  );

  code = code.replace(
    "<Route path=\"excuses\" element={<AdminExcuses />} />",
    "<Route path=\"excuses\" element={<AdminExcuses />} />\n            <Route path=\"passwords\" element={<AdminPasswords />} />"
  );
  
  fs.writeFileSync('src/App.tsx', code);
}
