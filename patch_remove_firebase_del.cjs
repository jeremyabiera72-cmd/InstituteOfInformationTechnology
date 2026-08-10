const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `    // 4. Finally delete the user
    const [userToDelete] = await db.select().from(users).where(eq(users.id, id));
    if (userToDelete && userToDelete.uid) {
      try {
        await adminAuth.deleteUser(userToDelete.uid);
      } catch (err) {
        console.error('Firebase delete failed:', err);
      }
    }
    await db.delete(users).where(eq(users.id, id));`;

const replacement = `    // 4. Finally delete the user
    await db.delete(users).where(eq(users.id, id));`;

code = code.replace(target, replacement);

const target2 = `    // 4. Finally delete the user
    const [userToDelete2] = await db.select().from(users).where(eq(users.id, userObj.id));
    if (userToDelete2 && userToDelete2.uid) {
      try {
        await adminAuth.deleteUser(userToDelete2.uid);
      } catch (err) {
        console.error('Firebase delete failed:', err);
      }
    }
    await db.delete(users).where(eq(users.id, userObj.id));`;

if (code.includes("userToDelete2")) {
   code = code.replace(target2, `    await db.delete(users).where(eq(users.id, userObj.id));`);
}

fs.writeFileSync('server.ts', code);
