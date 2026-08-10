const fs = require('fs');
const config = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
config.exclude = ["dist", "node_modules"];
config.include = ["src/**/*", "server.ts"];
fs.writeFileSync('tsconfig.json', JSON.stringify(config, null, 2));
