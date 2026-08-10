const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

code = code.replace(
  "match /settings/{settingId} {\n      allow read: if isSignedIn();",
  "match /settings/{settingId} {\n      allow read: if true;"
);

fs.writeFileSync('firestore.rules', code);
