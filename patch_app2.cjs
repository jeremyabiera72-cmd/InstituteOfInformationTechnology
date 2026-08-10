const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {\n  const { user, loading } = useAuth();",
  "const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {\n  const { user, loading, isAdmin } = useAuth();"
);

fs.writeFileSync('src/App.tsx', code);
