const fs = require('fs');
let code = fs.readFileSync('src/db/schema.ts', 'utf8');

if (!code.includes("area: text('area') // assignments")) {
  code = code.replace(
    "export const assignments = pgTable('assignments', {",
    "export const assignments = pgTable('assignments', {\\n  area: text('area'), // assignments"
  );
  fs.writeFileSync('src/db/schema.ts', code);
}
