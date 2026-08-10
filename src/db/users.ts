import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, fullName?: string, avatarUrl?: string) {
  const adminEmails = (process.env.ADMIN_EMAILS || 'theadmindinasour@gmail.com,theadmindinasour@2008gmail.com').split(',');
  const role = adminEmails.includes(email) ? 'admin' : 'student';

  const result = await db.insert(users)
    .values({
      uid,
      email,
      role,
      ...(fullName && { fullName }),
      ...(avatarUrl && { avatarUrl })
    })
    .onConflictDoUpdate({
      target: users.uid,
      set: {
        email,
        role,
        ...(fullName && { fullName }),
        ...(avatarUrl && { avatarUrl })
      },
    })
    .returning();
  return result[0];
}
