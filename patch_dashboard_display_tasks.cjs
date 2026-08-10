const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const replacement = `
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h3 className="font-semibold text-slate-800 mb-6">Upcoming Deadlines</h3>
          <div className="space-y-4">
            {assignments.length > 0 ? (Array.isArray(assignments) ? assignments : []).map((deadline: any, i: number) => (
              <div key={i} className="flex items-center gap-4 p-3 border border-slate-100 rounded-lg bg-white">
                <div className={\`w-2 h-10 rounded-full \${deadline.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'}\`} />
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800 text-sm">{deadline.title}</h4>
                  <p className="text-xs text-slate-500">{deadline.subject?.name || 'General'} • Due {format(new Date(deadline.dueDate), 'PPP')}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-500 py-4">No upcoming deadlines!</p>
            )}
          </div>
        </div>
      </div>
`;

code = code.replace(
  `      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h3 className="font-semibold text-slate-800 mb-6">Quick Actions</h3>`,
  `      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 lg:col-span-2">
          <h3 className="font-semibold text-slate-800 mb-6">Quick Actions</h3>`
);

// We replace "Student Resources" entirely with "Upcoming Deadlines" 
code = code.replace(/<div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">\s*<h3 className="font-semibold text-slate-800 mb-6">Student Resources<\/h3>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, replacement);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
