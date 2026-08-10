const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

// Add delete endpoints if they don't exist
if (!server.includes("app.delete('/api/notes/:id'")) {
  server = server.replace("  // Assignments Routes", `  app.delete('/api/notes/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      const [note] = await db.select().from(notes).where(eq(notes.id, parseInt(req.params.id)));
      if (note && note.uploaderId === user.id) {
         await db.delete(notes).where(eq(notes.id, parseInt(req.params.id)));
         res.json({ success: true });
      } else {
         res.status(403).json({ error: 'Forbidden' });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Assignments Routes`);
}

if (!server.includes("app.delete('/api/assignments/:id'")) {
  server = server.replace("  // Community Feed", `  app.delete('/api/assignments/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      const [assignment] = await db.select().from(assignments).where(eq(assignments.id, parseInt(req.params.id)));
      if (assignment && assignment.userId === user.id) {
         await db.delete(assignments).where(eq(assignments.id, parseInt(req.params.id)));
         res.json({ success: true });
      } else {
         res.status(403).json({ error: 'Forbidden' });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Community Feed`);
}

if (!server.includes("app.delete('/api/community-deadlines/:id'")) {
  server = server.replace("  // Portfolio Routes", `  app.delete('/api/community-deadlines/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      const [deadline] = await db.select().from(upcomingDeadlines).where(eq(upcomingDeadlines.id, parseInt(req.params.id)));
      if (deadline && deadline.uploaderId === user.id) {
         await db.delete(upcomingDeadlines).where(eq(upcomingDeadlines.id, parseInt(req.params.id)));
         res.json({ success: true });
      } else {
         res.status(403).json({ error: 'Forbidden' });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Portfolio Routes`);
}

if (!server.includes("app.delete('/api/links/:id'")) {
  server = server.replace("app.get('/api/portfolio'", `  app.delete('/api/links/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      const [link] = await db.select().from(require('./src/db/schema.ts').sharedLinks).where(eq(require('./src/db/schema.ts').sharedLinks.id, parseInt(req.params.id)));
      if (link && link.uploaderId === user.id) {
         await db.delete(require('./src/db/schema.ts').sharedLinks).where(eq(require('./src/db/schema.ts').sharedLinks.id, parseInt(req.params.id)));
         res.json({ success: true });
      } else {
         res.status(403).json({ error: 'Forbidden' });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

app.get('/api/portfolio'`);
}

fs.writeFileSync('server.ts', server);
console.log("Patched delete endpoints");
