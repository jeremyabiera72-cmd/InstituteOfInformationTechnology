const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\\\$/g, '$');
  content = content.replace(/\\\`/g, '`');
  fs.writeFileSync(file, content);
}

fix('src/pages/LostAndFound.tsx');
fix('src/pages/admin/ManageLostAndFound.tsx');
fix('src/pages/admin/ManageAnnouncements.tsx');
