const fs = require('fs');
let schema = fs.readFileSync('src/db/schema.ts', 'utf8');

if (!schema.includes('sharedLinks')) {
  schema += `

export const sharedLinks = pgTable('shared_links', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  description: text('description'),
  uploaderId: integer('uploader_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const sharedLinksRelations = relations(sharedLinks, ({ one }) => ({
  uploader: one(users, {
    fields: [sharedLinks.uploaderId],
    references: [users.id],
  }),
}));
`;
  fs.writeFileSync('src/db/schema.ts', schema);
  console.log('Schema updated');
} else {
  console.log('Already updated');
}
