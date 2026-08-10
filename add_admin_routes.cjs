const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const adminRoutes = `
  // Admin Routes
  app.get('/api/admin/stats', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      // In a real app we'd verify admin role here
      const allUsers = await db.select().from(users);
      const allDeadlines = await db.select().from(upcomingDeadlines);
      const allNotes = await db.select().from(notes);
      const allExcuses = await db.select().from(excuses);
      
      res.json({
        students: allUsers.length,
        deadlines: allDeadlines.length,
        notes: allNotes.length,
        excuses: allExcuses.filter(e => e.status === 'pending').length
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/admin/students', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const allUsers = await db.select().from(users);
      res.json(allUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/admin/deadlines', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const allDeadlines = await db.query.upcomingDeadlines.findMany({
        with: { uploader: true },
        orderBy: (d, { asc }) => [asc(d.eventDate)]
      });
      res.json(allDeadlines);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/api/admin/deadlines', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      const { name, eventDate, description, location } = req.body;
      const newDeadlines = await db.insert(upcomingDeadlines).values({
        name,
        eventDate: new Date(eventDate),
        description: description || 'No description',
        location: location || 'TBA',
        uploaderId: user.id
      }).returning();
      res.json(newDeadlines[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.delete('/api/admin/deadlines/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      await db.delete(upcomingDeadlines).where(eq(upcomingDeadlines.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/admin/excuses', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const allExcuses = await db.query.excuses.findMany({
        with: { user: true },
        orderBy: (e, { desc }) => [desc(e.createdAt)]
      });
      res.json(allExcuses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.patch('/api/admin/excuses/:id/status', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { status } = req.body;
      await db.update(excuses).set({ status }).where(eq(excuses.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
`;

if (!code.includes('/api/admin/stats')) {
  code = code.replace(
    "  // User sync route",
    adminRoutes + "\n  // User sync route"
  );
  fs.writeFileSync('server.ts', code);
}
