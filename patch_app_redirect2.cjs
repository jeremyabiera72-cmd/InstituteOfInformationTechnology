const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const RootRedirect = \(\) => \{[\s\S]*?return <Navigate to=\{`\/\$\{area\.toLowerCase\(\)\}`\} \/>;\n\};/,
  `const RootRedirect = () => {
  const { user, dbUser, loading, isAdmin } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/home" />;
  if (isAdmin) return <Navigate to="/admin" />;
  
  const area = dbUser?.area || localStorage.getItem('userArea');
  if (!area) return <Navigate to="/select-area" />;
  return <Navigate to={\`/\${area.toLowerCase()}\`} />;
};`
);

fs.writeFileSync('src/App.tsx', code);
