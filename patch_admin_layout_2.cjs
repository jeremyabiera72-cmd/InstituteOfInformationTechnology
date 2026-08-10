const fs = require('fs');
let code = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');

const navRenderOld = `{navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={\`flex items-center gap-3 px-4 py-3 transition-all duration-200 group relative \${
                  isActive
                    ? 'text-indigo-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-900 font-medium'
                }\`}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" />}
                <item.icon className={\`w-5 h-5 \${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}\`} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[14px]">{item.name}</span>
              </Link>
            );
          })}`;

const navRenderNew = `{navGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              <h3 className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 mt-4">{group.title}</h3>
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={\`flex items-center gap-3 px-4 py-2.5 transition-all duration-200 group relative rounded-lg \${
                        isActive
                          ? 'text-indigo-600 font-semibold bg-indigo-50/50'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50 font-medium'
                      }\`}
                    >
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-r-full" />}
                      <item.icon className={\`w-5 h-5 \${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}\`} strokeWidth={isActive ? 2.5 : 2} />
                      <span className="text-[14px]">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}`;

code = code.replace(navRenderOld, navRenderNew);
fs.writeFileSync('src/layouts/AdminLayout.tsx', code);
