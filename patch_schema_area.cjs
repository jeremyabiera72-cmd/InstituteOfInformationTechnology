const fs = require('fs');
let code = fs.readFileSync('src/db/schema.ts', 'utf8');

if (!code.includes("area: text('area')")) {
  code = code.replace(
    "status: text('status').default('active'),",
    "status: text('status').default('active'),\n  area: text('area'),"
  );

  code = code.replace(
    "authorId: integer('author_id').references(() => users.id).notNull(),\n  createdAt: timestamp('created_at').defaultNow(),\n});",
    "authorId: integer('author_id').references(() => users.id).notNull(),\n  area: text('area'),\n  createdAt: timestamp('created_at').defaultNow(),\n});"
  );

  fs.writeFileSync('src/db/schema.ts', code);
}
