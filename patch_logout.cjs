const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

code = code.replace(
  "  const logout = async () => {\n    await signOut(auth);\n  };",
  "  const logout = async () => {\n    localStorage.removeItem('userArea');\n    await signOut(auth);\n  };"
);

fs.writeFileSync('src/contexts/AuthContext.tsx', code);
