const fs = require('fs');
let code = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

code = code.replace(
  "import { Outlet, Link, useLocation } from 'react-router-dom';",
  "import { Outlet, Link, useLocation, useParams } from 'react-router-dom';"
);

const oldNav = `{group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}`;

const newNav = `{group.items.map((item) => {
                  const { area } = useParams<{ area: string }>();
                  const basePath = \`/\${area}\`;
                  const targetHref = item.href === '/' ? basePath : \`\${basePath}\${item.href}\`;
                  const isActive = location.pathname === targetHref || location.pathname === \`\${targetHref}/\`;
                  return (
                    <Link
                      key={item.name}
                      to={targetHref}`;

code = code.replace(oldNav, newNav);

const backToHomeOld = `              {location.pathname !== '/' && (
                <Link to="/" className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Back to Home">`;
                
const backToHomeNew = `              {location.pathname !== \`/\${useParams().area}\` && (
                <Link to={\`/\${useParams().area}\`} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Back to Home">`;

code = code.replace(backToHomeOld, backToHomeNew);

fs.writeFileSync('src/layouts/DashboardLayout.tsx', code);
