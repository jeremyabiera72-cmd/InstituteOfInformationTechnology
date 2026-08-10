const fs = require('fs');

const files = [
  'src/pages/admin/AdminBullyingReports.tsx',
  'src/pages/admin/AdminDeadlines.tsx',
  'src/pages/Settings.tsx'
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');
  // Simple regex replacement: remove the if (window.confirm(...)) { ... }
  // It's safer to use manual replacement
  if (file.includes('AdminBullyingReports.tsx')) {
    code = code.replace(/if \(window\.confirm\("Are you sure you want to delete this report\? This action cannot be undone\."\)\) {/g, 'if (true) {');
  } else if (file.includes('AdminDeadlines.tsx')) {
    code = code.replace(/if \(!window\.confirm\('Delete this deadline\?'\)\) return;/g, '');
  } else if (file.includes('Settings.tsx')) {
    code = code.replace(/if \(window\.confirm\('Are you absolutely sure you want to delete your account\? This action cannot be undone and will delete all your data\.'\)\) {/g, 'if (true) {');
  }
  fs.writeFileSync(file, code);
}
