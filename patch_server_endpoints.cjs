const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const newEndpoints = `
  // --- Announcements (Admin & Student) ---
  app.get('/api/announcements', requireAuth, async (req: AuthRequest, res) => {
    try {
      const area = req.query.area as string;
      const all = await db.query.announcements.findMany({
        where: area ? (announcements, { eq }) => eq(announcements.area, area) : undefined,
        with: {
          author: true
        },
        orderBy: (announcements, { desc }) => [desc(announcements.createdAt)]
      });
      res.json(all);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/admin/announcements', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      
      const { title, content, imageUrl, area } = req.body;
      const newAnnouncements = await db.insert(announcements).values({
        title,
        content,
        imageUrl,
        area,
        authorId: user.id
      }).returning();
      res.json(newAnnouncements[0]);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/admin/announcements/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      await db.delete(announcements).where(eq(announcements.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // --- Lost and Found ---
  app.get('/api/lost-and-found', requireAuth, async (req: AuthRequest, res) => {
    try {
      const area = req.query.area as string;
      const all = await db.query.lostAndFound.findMany({
        where: area ? (lf, { eq, and }) => and(eq(lf.area, area), eq(lf.status, 'approved')) : (lf, { eq }) => eq(lf.status, 'approved'),
        with: {
          reportedBy: true
        },
        orderBy: (lf, { desc }) => [desc(lf.createdAt)]
      });
      res.json(all);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/lost-and-found', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      
      const { title, description, imageUrl, area, type } = req.body;
      const isAdmin = ['admin@systemhub.com', 'coffee2008@gmail.com', 'cake2008@gmail.com'].includes(user.email);
      
      const newItem = await db.insert(lostAndFound).values({
        title,
        description,
        imageUrl,
        area,
        type: type || 'lost',
        status: isAdmin ? 'approved' : 'pending',
        reportedById: user.id
      }).returning();
      res.json(newItem[0]);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/admin/lost-and-found', requireAuth, async (req: AuthRequest, res) => {
    try {
      const all = await db.query.lostAndFound.findMany({
        with: {
          reportedBy: true
        },
        orderBy: (lf, { desc }) => [desc(lf.createdAt)]
      });
      res.json(all);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.patch('/api/admin/lost-and-found/:id/status', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { status } = req.body;
      const updated = await db.update(lostAndFound)
        .set({ status })
        .where(eq(lostAndFound.id, parseInt(req.params.id)))
        .returning();
      res.json(updated[0]);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
`;

code = code.replace(
  "app.get('/api/health', (req, res) => {",
  newEndpoints + "\n  app.get('/api/health', (req, res) => {"
);

fs.writeFileSync('server.ts', code);
