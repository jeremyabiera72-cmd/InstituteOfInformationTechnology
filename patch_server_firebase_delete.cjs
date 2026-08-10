const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

if (!code.includes("import { adminAuth }")) {
  code = code.replace("import { requireAuth, AuthRequest } from './src/middleware/auth.ts';", "import { requireAuth, AuthRequest } from './src/middleware/auth.ts';\nimport { adminAuth } from './src/lib/firebase-admin.ts';");
}

const targetDelete = `    // 4. Finally delete the user
    await db.delete(users).where(eq(users.id, id));
  }`;

const replaceDelete = `    // 4. Finally delete the user
    const [userToDelete] = await db.select().from(users).where(eq(users.id, id));
    if (userToDelete && userToDelete.uid) {
      try {
        await adminAuth.deleteUser(userToDelete.uid);
      } catch (err) {
        console.error('Firebase delete failed:', err);
      }
    }
    await db.delete(users).where(eq(users.id, id));
  }`;

code = code.replace(targetDelete, replaceDelete);
fs.writeFileSync('server.ts', code);
