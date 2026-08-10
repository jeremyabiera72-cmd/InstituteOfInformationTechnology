import { adminAuth } from './src/lib/firebase-admin.ts';
import { getFirestore } from 'firebase-admin/firestore';

const ADMIN_ACCOUNTS = [
  { email: 'admin@systemhub.com', password: 'adminpassword123', displayName: 'System Admin' },
  { email: 'theadmindinasour@2008gmail.com', password: 'Stellarofthestar2008', displayName: 'Admin Dinosaur' },
];

async function ensureAdminAccount(email: string, password: string, displayName: string) {
  try {
    await adminAuth.getUserByEmail(email);
    console.log(`Admin already exists: ${email}`);
  } catch (err: any) {
    if (err.code === 'auth/user-not-found') {
      await adminAuth.createUser({ email, password, displayName });
      console.log(`Created admin account: ${email}`);
    } else {
      console.error(err);
    }
  }
}

async function run() {
  for (const admin of ADMIN_ACCOUNTS) {
    await ensureAdminAccount(admin.email, admin.password, admin.displayName);
  }

  const db = getFirestore();
  const settingsRef = db.collection('settings').doc('passwords');
  const doc = await settingsRef.get();
  if (!doc.exists) {
    await settingsRef.set({
      BSIS: 'bsis123',
      BSCS: 'bscs123'
    });
    console.log('Created default passwords: BSIS=bsis123, BSCS=bscs123');
  } else {
    console.log('Passwords already set');
  }
}
run().catch(console.error);
