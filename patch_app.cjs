const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const rootRedirect = `
const RootRedirect = () => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/home" />;
  if (isAdmin) return <Navigate to="/admin" />;
  const area = localStorage.getItem('userArea');
  if (!area) return <Navigate to="/select-area" />;
  return <Navigate to={\`/\${area.toLowerCase()}\`} />;
};
`;

code = code.replace("export default function App() {", rootRedirect + "\nexport default function App() {");

const oldRoutes = `<Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >`;

const newRoutes = `<Route path="/" element={<RootRedirect />} />
          <Route
            path="/:area"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >`;

code = code.replace(oldRoutes, newRoutes);
fs.writeFileSync('src/App.tsx', code);
