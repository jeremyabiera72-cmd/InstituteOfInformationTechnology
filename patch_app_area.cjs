const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('AreaSelection')) {
  code = code.replace(
    "import AdminExcuses from './pages/admin/AdminExcuses.tsx';",
    "import AdminExcuses from './pages/admin/AdminExcuses.tsx';\nimport AreaSelection from './pages/AreaSelection.tsx';"
  );

  code = code.replace(
    "const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {\n  const { user, loading, isAdmin } = useAuth();\n  if (loading) return <div>Loading...</div>;\n  if (!user) return <Navigate to=\"/login\" />;\n  if (isAdmin) return <Navigate to=\"/admin\" />;\n  return <>{children}</>;\n};",
    "const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {\n  const { user, loading, isAdmin } = useAuth();\n  if (loading) return <div>Loading...</div>;\n  if (!user) return <Navigate to=\"/login\" />;\n  if (isAdmin) return <Navigate to=\"/admin\" />;\n  if (!localStorage.getItem('userArea')) return <Navigate to=\"/select-area\" />;\n  return <>{children}</>;\n};"
  );
  
  code = code.replace(
    "<Route path=\"/login\" element={<Login />} />",
    "<Route path=\"/login\" element={<Login />} />\n          <Route path=\"/select-area\" element={ <ProtectedRouteBase><AreaSelection /></ProtectedRouteBase> } />"
  );

  code = code.replace(
    "const AdminProtectedRoute",
    "const ProtectedRouteBase = ({ children }: { children: React.ReactNode }) => {\n  const { user, loading, isAdmin } = useAuth();\n  if (loading) return <div>Loading...</div>;\n  if (!user) return <Navigate to=\"/login\" />;\n  if (isAdmin) return <Navigate to=\"/admin\" />;\n  return <>{children}</>;\n};\n\nconst AdminProtectedRoute"
  );

  fs.writeFileSync('src/App.tsx', code);
}
