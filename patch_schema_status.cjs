const fs = require('fs');
let code = fs.readFileSync('src/db/schema.ts', 'utf8');

if (!code.includes("status: text('status')")) {
  code = code.replace(
    "createdAt: timestamp('created_at').defaultNow(),",
    "status: text('status').default('active'),\n  createdAt: timestamp('created_at').defaultNow(),"
  );
  fs.writeFileSync('src/db/schema.ts', code);
}
