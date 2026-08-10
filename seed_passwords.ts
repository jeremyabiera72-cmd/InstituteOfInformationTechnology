import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    projectId: 'ins-cs',
  });
}

const db = getFirestore();

async function seed() {
  await db.collection('settings').doc('passwords').set({
    BSIS: 'admin',
    BSCS: 'admin'
  });
  console.log('Passwords seeded successfully');
}

seed().catch(console.error);
