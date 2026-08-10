const fs = require('fs');
let code = fs.readFileSync('src/db/schema.ts', 'utf8');

code = code.replace(
  "export const communityFeed = pgTable('community_feed', {\\n  area: text('area') // communityFeed,",
  "export const communityFeed = pgTable('community_feed', {\n  area: text('area'), // communityFeed"
);

fs.writeFileSync('src/db/schema.ts', code);
