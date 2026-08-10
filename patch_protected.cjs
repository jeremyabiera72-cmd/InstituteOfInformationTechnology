const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldProtected = `const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/home" />;
  if (isAdmin) return <Navigate to="/admin" />;
  if (!localStorage.getItem('userArea')) return <Navigate to="/select-area" />;
  return <>{children}</>;
};`;

const newProtected = `import { useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/home" />;
  if (isAdmin) return <Navigate to="/admin" />;
  
  const savedArea = localStorage.getItem('userArea');
  if (!savedArea) return <Navigate to="/select-area" />;
  
  // Ensure the user is in their saved area
  const currentPath = location.pathname;
  if (currentPath !== '/' && !currentPath.startsWith(\`/\${savedArea.toLowerCase()}\`)) {
    return <Navigate to={\`/\${savedArea.toLowerCase()}\`} />;
  }
  
  return <>{children}</>;
};`;

code = code.replace("import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';", "import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';");
code = code.replace(oldProtected, newProtected);

// Remove the extra useLocation import if it was duplicated inside
code = code.replace("import { useLocation } from 'react-router-dom';\n\nconst ProtectedRoute", "const ProtectedRoute");

fs.writeFileSync('src/App.tsx', code);
