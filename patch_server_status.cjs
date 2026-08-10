const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

if (!code.includes('/api/users/:id/status')) {
  const statusRoute = `
  app.patch('/api/users/:id/status', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { status } = req.body;
      await db.update(users).set({ status }).where(eq(users.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
`;
  code = code.replace(
    "  // User sync route",
    statusRoute + "\n  // User sync route"
  );
  fs.writeFileSync('server.ts', code);
}
