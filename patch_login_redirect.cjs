const fs = require('fs');
let code = fs.readFileSync('src/pages/Login.tsx', 'utf8');

if (!code.includes('useNavigate')) {
  code = code.replace(
    "import React, { useState } from 'react';",
    "import React, { useState, useEffect } from 'react';\nimport { useNavigate } from 'react-router-dom';"
  );
  
  code = code.replace(
    "const { login, loginWithEmail } = useAuth();",
    "const { login, loginWithEmail, user, isAdmin } = useAuth();\n  const navigate = useNavigate();\n  \n  useEffect(() => {\n    if (user) {\n      if (isAdmin) {\n        navigate('/admin');\n      } else {\n        navigate('/');\n      }\n    }\n  }, [user, isAdmin, navigate]);"
  );

  fs.writeFileSync('src/pages/Login.tsx', code);
}
