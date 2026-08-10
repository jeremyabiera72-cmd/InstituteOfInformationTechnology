const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldGet = `  app.get('/api/assignments', requireAuth, async (req: AuthRequest, res) => {
    try {
      const allAssignments = await db.query.assignments.findMany({`;

const newGet = `  app.get('/api/assignments', requireAuth, async (req: AuthRequest, res) => {
    try {
      const area = req.query.area as string;
      const allAssignments = await db.query.assignments.findMany({
        where: area ? (assignments, { eq }) => eq(assignments.area, area) : undefined,`;

code = code.replace(oldGet, newGet);

const oldPost = `      const { title, description, dueDate, priority, imageUrl, linkUrl } = req.body;
      const newAssignments = await db.insert(assignments).values({
        title,
        description,
        dueDate: new Date(dueDate),
        priority,
        imageUrl,
        linkUrl,
        userId: user.id
      }).returning();`;

const newPost = `      const { title, description, dueDate, priority, imageUrl, linkUrl, area } = req.body;
      const newAssignments = await db.insert(assignments).values({
        title,
        description,
        dueDate: new Date(dueDate),
        priority,
        imageUrl,
        linkUrl,
        area,
        userId: user.id
      }).returning();`;

code = code.replace(oldPost, newPost);
fs.writeFileSync('server.ts', code);
