const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = JSON.parse(fs.readFileSync('firebase-service-account.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seed() {
  await db.collection('settings').doc('passwords').set({
    BSIS: 'admin',
    BSCS: 'admin'
  });
  console.log('Passwords seeded successfully');
}

seed().catch(console.error);
