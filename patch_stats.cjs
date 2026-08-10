const fs = require('fs');
let dashboard = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

dashboard = dashboard.replace(
  "{ name: 'Links Shared', value: '0', icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-50' }",
  "{ name: 'Links Shared', value: '0', icon: Link2, color: 'text-purple-500', bg: 'bg-purple-50' }"
);

// We need to make sure Link2 is imported
if (!dashboard.includes('Link2')) {
  dashboard = dashboard.replace('Brain,', 'Brain, Link2,');
}

fs.writeFileSync('src/pages/Dashboard.tsx', dashboard);
