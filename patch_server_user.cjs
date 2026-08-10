const fs = require('fs');

let serverCode = fs.readFileSync('server.ts', 'utf8');

const targetUserSelection = `const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));`;
const replacementUserSelection = `const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });`;

serverCode = serverCode.replaceAll(targetUserSelection, replacementUserSelection);

fs.writeFileSync('server.ts', serverCode);

