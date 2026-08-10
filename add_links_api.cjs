const fs = require('fs');
let serverTs = fs.readFileSync('server.ts', 'utf8');

if (!serverTs.includes('/api/links')) {
  const insertIndex = serverTs.lastIndexOf('app.get(\'/api/portfolio\'');
  
  const apiCode = `
  // Shared Links
  app.get('/api/links', requireAuth, async (req: AuthRequest, res) => {
    try {
      const allLinks = await db.query.sharedLinks.findMany({
        with: {
          uploader: {
            columns: {
              fullName: true,
              email: true,
              avatarUrl: true
            }
          }
        },
        orderBy: (link, { desc }) => [desc(link.createdAt)]
      });
      res.json(allLinks);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/links', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      
      const { title, url, description } = req.body;
      const newLinks = await db.insert(require('./src/db/schema.ts').sharedLinks).values({
        title,
        url,
        description,
        uploaderId: user.id
      }).returning();
      const newLink = newLinks[0];
      
      const populatedLink = await db.query.sharedLinks.findFirst({
        where: (l, { eq }) => eq(l.id, newLink.id),
        with: {
          uploader: {
             columns: { fullName: true, email: true, avatarUrl: true }
          }
        }
      });
      res.json(populatedLink);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

`;
  
  serverTs = serverTs.slice(0, insertIndex) + apiCode + serverTs.slice(insertIndex);
  // Also need to add sharedLinks to import from schema
  serverTs = serverTs.replace('projects } from', 'projects, sharedLinks } from');
  fs.writeFileSync('server.ts', serverTs);
  console.log('Added API endpoints');
} else {
  console.log('API already exists');
}
