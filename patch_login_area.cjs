const fs = require('fs');
let code = fs.readFileSync('src/pages/Login.tsx', 'utf8');

code = code.replace(
  "setError('System not configured by admin yet.');",
  "// If not configured, allow access for now or use default\n        if (areaPassword === 'admin') {\n          localStorage.setItem('userArea', selectedArea);\n          setAreaVerified(true);\n        } else {\n          setError('System not configured by admin yet (Hint: use password admin)');\n        }"
);

fs.writeFileSync('src/pages/Login.tsx', code);

let code2 = fs.readFileSync('src/pages/AreaSelection.tsx', 'utf8');
code2 = code2.replace(
  "setError('System not configured by admin yet.');",
  "if (password === 'admin') {\n          localStorage.setItem('userArea', selectedArea);\n          navigate('/');\n        } else {\n          setError('System not configured by admin yet (Hint: use password admin)');\n        }"
);
fs.writeFileSync('src/pages/AreaSelection.tsx', code2);
