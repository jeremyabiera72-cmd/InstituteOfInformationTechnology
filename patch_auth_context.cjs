const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');
code = code.replace(
  " || user.email === 'jeremyabiera72@gmail.com'",
  ""
);
fs.writeFileSync('src/contexts/AuthContext.tsx', code);
