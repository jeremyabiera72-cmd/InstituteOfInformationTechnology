import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import { db } from '../db/index.ts';
import { users } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

import { getOrCreateUser } from '../db/users.ts';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
  dbUser?: any;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;

    // Automatically sync/ensure user exists in DB
    try {
      req.dbUser = await getOrCreateUser(
        decodedToken.uid,
        decodedToken.email || `${decodedToken.uid}@systemhub.com`,
        decodedToken.name || decodedToken.email?.split('@')[0],
        decodedToken.picture
      );
    } catch (dbErr) {
      console.warn('Warning: Could not auto-sync user in requireAuth:', dbErr);
    }

    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;

    const adminEmails = (process.env.ADMIN_EMAILS || 'theadmindinasour@gmail.com,theadmindinasour@2008gmail.com').split(',');
    const userEmail = decodedToken.email || '';
    const isEmailAdmin = adminEmails.includes(userEmail);

    let dbUser;
    try {
      dbUser = await getOrCreateUser(
        decodedToken.uid,
        userEmail || `${decodedToken.uid}@systemhub.com`,
        decodedToken.name || userEmail.split('@')[0],
        decodedToken.picture
      );
      req.dbUser = dbUser;
    } catch (e) {
      console.warn('Warning: Could not sync admin user:', e);
    }

    if (isEmailAdmin) {
      if (dbUser && dbUser.role !== 'admin') {
        await db.update(users).set({ role: 'admin' }).where(eq(users.id, dbUser.id));
      }
      return next();
    }

    if (!dbUser || dbUser.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Error verifying Admin role:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
