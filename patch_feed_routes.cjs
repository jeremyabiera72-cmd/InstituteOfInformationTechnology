const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

// Update get feed to include comments and reactions
server = server.replace(`      const allFeed = await db.query.communityFeed.findMany({
        with: {
          author: {
            columns: {
              fullName: true,
              email: true,
              avatarUrl: true
            }
          }
        },
        orderBy: (feed, { desc }) => [desc(feed.createdAt)]
      });`, `      const allFeed = await db.query.communityFeed.findMany({
        with: {
          author: {
            columns: {
              fullName: true,
              email: true,
              avatarUrl: true
            }
          },
          comments: {
            with: {
              author: {
                columns: {
                  fullName: true,
                  email: true,
                  avatarUrl: true
                }
              }
            }
          },
          reactions: true
        },
        orderBy: (feed, { desc }) => [desc(feed.createdAt)]
      });`);

server = server.replace(`const feedPost = await db.query.communityFeed.findFirst({
        where: (feed, { eq }) => eq(feed.id, newPost.id),
        with: {
          author: { 
             columns: { fullName: true, email: true, avatarUrl: true }
          }
        }
      });`, `const feedPost = await db.query.communityFeed.findFirst({
        where: (feed, { eq }) => eq(feed.id, newPost.id),
        with: {
          author: { 
             columns: { fullName: true, email: true, avatarUrl: true }
          },
          comments: {
            with: { author: { columns: { fullName: true, email: true, avatarUrl: true } } }
          },
          reactions: true
        }
      });`);

// Append comments and reactions routes
if (!server.includes('/api/feed/:id/comments')) {
  server = server.replace("  // Upcoming Deadlines (Community)", `  app.post('/api/feed/:id/comments', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      const { content } = req.body;
      const postId = parseInt(req.params.id);
      
      const newComments = await db.insert(require('./src/db/schema.ts').postComments).values({
        postId,
        content,
        authorId: user.id
      }).returning();
      
      const populatedComment = await db.query.postComments.findFirst({
        where: (c, { eq }) => eq(c.id, newComments[0].id),
        with: {
          author: { columns: { fullName: true, email: true, avatarUrl: true } }
        }
      });
      
      res.json(populatedComment);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post('/api/feed/:id/reactions', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      const postId = parseInt(req.params.id);
      
      const { postReactions } = require('./src/db/schema.ts');
      const { and } = require('drizzle-orm');
      
      const existing = await db.select().from(postReactions).where(and(eq(postReactions.postId, postId), eq(postReactions.userId, user.id)));
      
      if (existing.length > 0) {
        await db.delete(postReactions).where(and(eq(postReactions.postId, postId), eq(postReactions.userId, user.id)));
        res.json({ action: 'removed', userId: user.id });
      } else {
        const newReaction = await db.insert(postReactions).values({
          postId,
          userId: user.id
        }).returning();
        res.json({ action: 'added', reaction: newReaction[0] });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Upcoming Deadlines (Community)`);
}

fs.writeFileSync('server.ts', server);
console.log("Patched feed routes");
