const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const anchor = "  app.post('/api/notes', requireAuth, async (req: AuthRequest, res) => {";

const deleteRoute = `  app.delete('/api/notes/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });
      
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

`;

if (!code.includes("app.delete('/api/notes/:id'")) {
    code = code.replace(anchor, deleteRoute + anchor);
    fs.writeFileSync('server.ts', code);
}
