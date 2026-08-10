const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldBase = `const ProtectedRouteBase = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/home" />;
  if (isAdmin) return <Navigate to="/admin" />;
  return <>{children}</>;
};`;

const newBase = `const ProtectedRouteBase = ({ children }: { children: React.ReactNode }) => {
  const { user, dbUser, loading, isAdmin } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/home" />;
  if (isAdmin) return <Navigate to="/admin" />;
  
  const savedArea = dbUser?.area || localStorage.getItem('userArea');
  if (savedArea) return <Navigate to={\`/\${savedArea.toLowerCase()}\`} />;
  
  return <>{children}</>;
};`;

code = code.replace(oldBase, newBase);
fs.writeFileSync('src/App.tsx', code);
