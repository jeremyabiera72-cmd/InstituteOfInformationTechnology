const fs = require('fs');
let code = fs.readFileSync('src/db/schema.ts', 'utf8');

const newTables = `
export const lostAndFound = pgTable('lost_and_found', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status').default('pending'), // 'pending', 'approved', 'resolved'
  imageUrl: text('image_url'),
  reportedById: integer('reported_by_id').references(() => users.id).notNull(),
  area: text('area'),
  type: text('type').default('lost'), // 'lost' or 'found'
  createdAt: timestamp('created_at').defaultNow(),
});

export const lostAndFoundRelations = relations(lostAndFound, ({ one }) => ({
  reportedBy: one(users, {
    fields: [lostAndFound.reportedById],
    references: [users.id],
  }),
}));
`;

code = code + "\n" + newTables;
fs.writeFileSync('src/db/schema.ts', code);
