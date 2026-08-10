const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');
code = code.replace(
  " || request.auth.token.email == 'jeremyabiera72@gmail.com'",
  ""
);
fs.writeFileSync('firestore.rules', code);
