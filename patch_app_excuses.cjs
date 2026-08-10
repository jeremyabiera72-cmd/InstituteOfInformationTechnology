const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('AdminExcuses')) {
  code = code.replace(
    "import AdminStudents from './pages/admin/AdminStudents.tsx';",
    "import AdminStudents from './pages/admin/AdminStudents.tsx';\nimport AdminExcuses from './pages/admin/AdminExcuses.tsx';"
  );

  code = code.replace(
    "<Route path=\"students\" element={<AdminStudents />} />",
    "<Route path=\"students\" element={<AdminStudents />} />\n            <Route path=\"excuses\" element={<AdminExcuses />} />"
  );
  
  fs.writeFileSync('src/App.tsx', code);
}
