const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldStudents = `  app.get('/api/students', requireAuth, async (req: AuthRequest, res) => {
    try {
      const allUsers = await db.query.users.findMany({
        with: {
          portfolio: {
            with: {
              projects: true
            }
          }
        }
      });
      res.json(allUsers.filter(u => !(['admin@systemhub.com', 'coffee2008@gmail.com', 'cake2008@gmail.com'].includes(u.email))));`;

const newStudents = `  app.get('/api/students', requireAuth, async (req: AuthRequest, res) => {
    try {
      const area = req.query.area as string;
      const allUsers = await db.query.users.findMany({
        where: area ? (users, { eq }) => eq(users.area, area) : undefined,
        with: {
          portfolio: {
            with: {
              projects: true
            }
          }
        }
      });
      res.json(allUsers.filter(u => !(['admin@systemhub.com', 'coffee2008@gmail.com', 'cake2008@gmail.com'].includes(u.email))));`;

code = code.replace(oldStudents, newStudents);
fs.writeFileSync('server.ts', code);
