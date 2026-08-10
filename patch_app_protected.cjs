const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldProtected = `const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/home" />;
  if (isAdmin) return <Navigate to="/admin" />;
  
  const savedArea = localStorage.getItem('userArea');
  if (!savedArea) return <Navigate to="/select-area" />;
  
  // Ensure the user is in their saved area
  const currentArea = location.pathname.split('/')[1]?.toUpperCase();
  if (currentArea && currentArea !== savedArea) {
    return <Navigate to={\`/\${savedArea.toLowerCase()}\`} />;
  }
  
  return <>{children}</>;
};`;

const newProtected = `const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, dbUser, loading, isAdmin } = useAuth();
  const location = useLocation();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/home" />;
  if (isAdmin) return <Navigate to="/admin" />;
  
  const savedArea = dbUser?.area || localStorage.getItem('userArea');
  if (!savedArea) return <Navigate to="/select-area" />;
  
  // Ensure the user is in their saved area
  const currentArea = location.pathname.split('/')[1]?.toUpperCase();
  if (currentArea && currentArea !== savedArea) {
    return <Navigate to={\`/\${savedArea.toLowerCase()}\`} />;
  }
  
  return <>{children}</>;
};`;

code = code.replace(oldProtected, newProtected);
fs.writeFileSync('src/App.tsx', code);
