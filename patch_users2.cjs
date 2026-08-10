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
      ...(fullName && { fullName }),
      ...(avatarUrl && { avatarUrl })
    })
    .onConflictDoUpdate({
      target: users.uid,
      set: {
        email,
        ...(fullName && { fullName }),
        ...(avatarUrl && { avatarUrl })
      },
    })
    .returning();
  return result[0];
}`;

// Do simple replace instead of exact match in case of whitespace
usersCode = usersCode.replace(/export async function getOrCreateUser[\s\S]*?return result\[0\];\n}/, replacementUsers);

fs.writeFileSync('src/db/users.ts', usersCode);

let serverCode = fs.readFileSync('server.ts', 'utf8');
serverCode = serverCode.replace(
  "const user = await getOrCreateUser(req.user.uid, req.user.email || '');",
  "const user = await getOrCreateUser(req.user.uid, req.user.email || '', req.user.name, req.user.picture);"
);
fs.writeFileSync('server.ts', serverCode);
