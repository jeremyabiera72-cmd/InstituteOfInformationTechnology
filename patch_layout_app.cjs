const fs = require('fs');
let layout = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

if (!layout.includes('/links')) {
  layout = layout.replace(
    "import {",
    "import {\n  Link2,"
  );
  layout = layout.replace(
    "{ name: 'Community Feed', href: '/feed', icon: MessageSquare },",
    "{ name: 'Community Feed', href: '/feed', icon: MessageSquare },\n  { name: 'Shared Links', href: '/links', icon: Link2 },"
  );
  fs.writeFileSync('src/layouts/DashboardLayout.tsx', layout);
  console.log('Layout patched');
}

let app = fs.readFileSync('src/App.tsx', 'utf8');
if (!app.includes('SharedLinks')) {
  app = app.replace(
    "import Deadlines from './pages/Deadlines.tsx';",
    "import Deadlines from './pages/Deadlines.tsx';\nimport SharedLinks from './pages/SharedLinks.tsx';"
  );
  app = app.replace(
    '<Route path="deadlines" element={<Deadlines />} />',
    '<Route path="deadlines" element={<Deadlines />} />\n            <Route path="links" element={<SharedLinks />} />'
  );
  fs.writeFileSync('src/App.tsx', app);
  console.log('App patched');
}
