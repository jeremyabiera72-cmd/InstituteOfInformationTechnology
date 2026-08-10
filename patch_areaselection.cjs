const fs = require('fs');
let code = fs.readFileSync('src/pages/AreaSelection.tsx', 'utf8');

code = code.replace(
  "import { useAuth } from '../contexts/AuthContext.tsx';",
  "import { useAuth } from '../contexts/AuthContext.tsx';\nimport axios from 'axios';"
);

code = code.replace(
  "const { logout } = useAuth();",
  "const { logout, token } = useAuth();"
);

code = code.replace(
  "          localStorage.setItem('userArea', selectedArea);\n          navigate('/');",
  "          localStorage.setItem('userArea', selectedArea);\n          if (token) {\n            await axios.put('/api/users/area', { area: selectedArea }, {\n              headers: { Authorization: `Bearer ${token}` }\n            });\n          }\n          navigate('/');"
);

// Do it for the second occurrence too
code = code.replace(
  "          localStorage.setItem('userArea', selectedArea);\n          navigate('/');",
  "          localStorage.setItem('userArea', selectedArea);\n          if (token) {\n            await axios.put('/api/users/area', { area: selectedArea }, {\n              headers: { Authorization: `Bearer ${token}` }\n            });\n          }\n          navigate('/');"
);

fs.writeFileSync('src/pages/AreaSelection.tsx', code);
