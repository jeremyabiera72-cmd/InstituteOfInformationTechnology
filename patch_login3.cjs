const fs = require('fs');
let code = fs.readFileSync('src/pages/Login.tsx', 'utf8');

const targetDestruct = `const { login, loginWithEmail, user, isAdmin } = useAuth();`;
const replacementDestruct = `const { login, loginWithEmail, signupWithEmail, user, isAdmin } = useAuth();`;
code = code.replace(targetDestruct, replacementDestruct);

fs.writeFileSync('src/pages/Login.tsx', code);
