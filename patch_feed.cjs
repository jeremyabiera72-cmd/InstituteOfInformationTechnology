const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldFeedGet = `  app.get('/api/feed', requireAuth, async (req: AuthRequest, res) => {
    try {
      const allFeed = await db.query.communityFeed.findMany({`;

const newFeedGet = `  app.get('/api/feed', requireAuth, async (req: AuthRequest, res) => {
    try {
      const area = req.query.area as string;
      const allFeed = await db.query.communityFeed.findMany({
        where: area ? (feed, { eq }) => eq(feed.area, area) : undefined,`;

code = code.replace(oldFeedGet, newFeedGet);

const oldFeedPost = `      const { content, imageUrl } = req.body;
      const newPosts = await db.insert(communityFeed).values({
        content,
        imageUrl,
        authorId: user.id
      }).returning();`;

const newFeedPost = `      const { content, imageUrl, area } = req.body;
      const newPosts = await db.insert(communityFeed).values({
        content,
        imageUrl,
        area,
        authorId: user.id
      }).returning();`;

code = code.replace(oldFeedPost, newFeedPost);

fs.writeFileSync('server.ts', code);
