const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldGet = `  app.get('/api/dashboard', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });`;

const newGet = `  app.get('/api/dashboard', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });
      const area = req.query.area as string;`;

code = code.replace(oldGet, newGet);

const oldAnnouncements = `      const userAnnouncements = await db.query.announcements.findMany({
        with: {
          author: true
        },
        orderBy: (announcements, { desc }) => [desc(announcements.createdAt)]
      });`;

const newAnnouncements = `      const userAnnouncements = await db.query.announcements.findMany({
        where: area ? (announcements, { eq }) => eq(announcements.area, area) : undefined,
        with: {
          author: true
        },
        orderBy: (announcements, { desc }) => [desc(announcements.createdAt)]
      });`;

code = code.replace(oldAnnouncements, newAnnouncements);

const oldPost = `  app.post('/api/dashboard/announcements', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });
      
      const { content, imageUrl } = req.body;
      const newAnnouncements = await db.insert(announcements).values({
        content,
        imageUrl,
        authorId: user.id
      }).returning();`;

const newPost = `  app.post('/api/dashboard/announcements', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });
      
      const { content, imageUrl, area } = req.body;
      const newAnnouncements = await db.insert(announcements).values({
        content,
        imageUrl,
        area,
        authorId: user.id
      }).returning();`;

code = code.replace(oldPost, newPost);
fs.writeFileSync('server.ts', code);
