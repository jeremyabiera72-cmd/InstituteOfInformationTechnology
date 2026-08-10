const fs = require('fs');
let code = fs.readFileSync('src/db/schema.ts', 'utf8');

code = code.replace(
  "export const assignments = pgTable('assignments', {\\n  area: text('area'), // assignments",
  "export const assignments = pgTable('assignments', {\n  area: text('area'), // assignments"
);
fs.writeFileSync('src/db/schema.ts', code);
