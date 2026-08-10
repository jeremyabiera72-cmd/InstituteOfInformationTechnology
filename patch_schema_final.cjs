const fs = require('fs');
let code = fs.readFileSync('src/db/schema.ts', 'utf8');

if (!code.includes("area: text('area') // communityFeed")) {
  code = code.replace(
    "export const communityFeed = pgTable('community_feed', {\\n  id: serial('id').primaryKey(),\\n  content: text('content').notNull(),\\n  imageUrl: text('image_url'),\\n  authorId: integer('author_id').references(() => users.id).notNull(),\\n  createdAt: timestamp('created_at').defaultNow(),\\n});",
    "export const communityFeed = pgTable('community_feed', {\\n  id: serial('id').primaryKey(),\\n  content: text('content').notNull(),\\n  imageUrl: text('image_url'),\\n  authorId: integer('author_id').references(() => users.id).notNull(),\\n  area: text('area'), // communityFeed\\n  createdAt: timestamp('created_at').defaultNow(),\\n});"
  );
}

fs.writeFileSync('src/db/schema.ts', code);
