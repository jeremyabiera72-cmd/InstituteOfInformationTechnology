const fs = require('fs');

let usersCode = fs.readFileSync('src/db/users.ts', 'utf8');
const targetUsers = `export async function getOrCreateUser(uid: string, email: string) {
  const result = await db.insert(users)
    .values({
      uid,
      email,
    })
    .onConflictDoUpdate({
      target: users.uid,
      set: {
        email,
      },
    })
    .returning();
  return result[0];
}`;
const replacementUsers = `export async function getOrCreateUser(uid: string, email: string, fullName?: string, avatarUrl?: string) {
  const result = await db.insert(users)
    .values({
      uid,
      email,
      fullName,
      avatarUrl
    })
    .onConflictDoUpdate({
      target: users.uid,
      set: {
        email,
        fullName: fullName ?? undefined,
        avatarUrl: avatarUrl ?? undefined
      },
    })
    .returning();
  return result[0];
}`;
usersCode = usersCode.replace(targetUsers, replacementUsers);
fs.writeFileSync('src/db/users.ts', usersCode);

let serverCode = fs.readFileSync('server.ts', 'utf8');
const targetSync = `const user = await getOrCreateUser(req.user.uid, req.user.email || '');`;
const replacementSync = `const user = await getOrCreateUser(req.user.uid, req.user.email || '', req.user.name, req.user.picture);`;
serverCode = serverCode.replace(targetSync, replacementSync);
fs.writeFileSync('server.ts', serverCode);

