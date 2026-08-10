const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const newRoute = `
  app.put('/api/users/area', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { area } = req.body;
      const [user] = await db.update(users).set({ area }).where(eq(users.uid, req.user.uid)).returning();
      res.json({ user });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
`;

code = code.replace(
  "app.get('/api/me', requireAuth, async (req: AuthRequest, res) => {",
  newRoute + "\n  app.get('/api/me', requireAuth, async (req: AuthRequest, res) => {"
);

fs.writeFileSync('server.ts', code);
