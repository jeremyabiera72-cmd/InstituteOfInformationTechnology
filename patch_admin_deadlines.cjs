const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AdminDeadlines.tsx', 'utf8');

code = code.replace(
  "interface Deadline {",
  "interface Deadline {\n  description?: string;"
);

code = code.replace(
  "const [newDeadline, setNewDeadline] = useState({ title: '', date: '', course: '' });",
  "const [newDeadline, setNewDeadline] = useState({ name: '', eventDate: '', location: '', description: '' });"
);

code = code.replace(
  "if (!newDeadline.title || !newDeadline.date) return;",
  "if (!newDeadline.name || !newDeadline.eventDate) return;"
);

code = code.replace(
  "setNewDeadline({ title: '', date: '', course: '' });",
  "setNewDeadline({ name: '', eventDate: '', location: '', description: '' });"
);

code = code.replace(
  `<div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Title</label>
            <input 
              type="text" 
              required
              value={newDeadline.title}
              onChange={e => setNewDeadline({...newDeadline, title: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Course (Optional)</label>
            <input 
              type="text" 
              value={newDeadline.course}
              onChange={e => setNewDeadline({...newDeadline, course: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Date</label>
            <input 
              type="date" 
              required
              value={newDeadline.date}
              onChange={e => setNewDeadline({...newDeadline, date: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>`,
  `<div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Title</label>
            <input 
              type="text" 
              required
              value={newDeadline.name}
              onChange={e => setNewDeadline({...newDeadline, name: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Location</label>
            <input 
              type="text" 
              value={newDeadline.location}
              onChange={e => setNewDeadline({...newDeadline, location: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
            <input 
              type="text" 
              value={newDeadline.description}
              onChange={e => setNewDeadline({...newDeadline, description: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Date</label>
            <input 
              type="date" 
              required
              value={newDeadline.eventDate}
              onChange={e => setNewDeadline({...newDeadline, eventDate: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>`
);

code = code.replace(
  `<th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Course</th>`,
  `<th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>\n                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>`
);

code = code.replace(
  `{deadline.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{deadline.course || '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{deadline.date}</td>`,
  `{(deadline as any).name || deadline.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{(deadline as any).location || '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{deadline.description || '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{new Date((deadline as any).eventDate || deadline.date).toLocaleDateString()}</td>`
);

fs.writeFileSync('src/pages/admin/AdminDeadlines.tsx', code);
