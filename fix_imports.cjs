const fs = require('fs');

function fixFile(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  // Remove ALL Megaphone and Search from all imports
  code = code.replace(/ Megaphone, /g, '');
  code = code.replace(/ Search, /g, '');
  code = code.replace(/ Megaphone,/g, '');
  code = code.replace(/ Search,/g, '');
  
  // Now add them ONLY to lucide-react
  code = code.replace(/from 'lucide-react';/, ", Megaphone, Search } from 'lucide-react';");
  code = code.replace(/} , Megaphone, Search }/g, ", Megaphone, Search }");
  code = code.replace(/} , Megaphone, Search }/g, ", Megaphone, Search }");

  fs.writeFileSync(file, code);
}

fixFile('src/layouts/DashboardLayout.tsx');
fixFile('src/layouts/AdminLayout.tsx');
