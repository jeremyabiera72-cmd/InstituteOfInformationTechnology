const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /\['admin@systemhub\.com', 'coffee2008@gmail\.com', 'cake2008@gmail\.com', 'jeremyabiera72@gmail\.com'\]/g,
  "['admin@systemhub.com', 'coffee2008@gmail.com', 'cake2008@gmail.com']"
);

fs.writeFileSync('server.ts', code);
