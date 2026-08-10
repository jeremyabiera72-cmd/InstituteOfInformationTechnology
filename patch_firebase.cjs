const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

if (!code.includes('getFirestore')) {
  code = code.replace(
    "import { getAuth, GoogleAuthProvider } from 'firebase/auth';",
    "import { getAuth, GoogleAuthProvider } from 'firebase/auth';\nimport { getFirestore } from 'firebase/firestore';"
  );
  code += "\nexport const db = getFirestore(app);\n";
  fs.writeFileSync('src/lib/firebase.ts', code);
}
