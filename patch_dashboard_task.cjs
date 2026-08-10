const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

if (!code.includes('const [showTaskModal, setShowTaskModal] = useState(false);')) {
  code = code.replace('const [posting, setPosting] = useState(false);', 
    'const [posting, setPosting] = useState(false);\n  const [showTaskModal, setShowTaskModal] = useState(false);\n  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "", priority: "medium" });\n  const [submittingTask, setSubmittingTask] = useState(false);');
}

const handleTaskSubmit = `
  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingTask(true);
    try {
      await axios.post('/api/assignments', newTask);
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', dueDate: '', priority: 'medium' });
      fetchDashboard();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingTask(false);
    }
  };
`;

if (!code.includes('const handleTaskSubmit')) {
  code = code.replace('const handleImageUpload', handleTaskSubmit + '\n  const handleImageUpload');
}

code = code.replace(
  '<button className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2">',
  '<button onClick={() => setShowTaskModal(true)} className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2">'
);

const modalCode = `
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Add New Task</h3>
              <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                  <input
                    required
                    type="date"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newTask.dueDate}
                    onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newTask.priority}
                    onChange={e => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowTaskModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
                <button type="submit" disabled={submittingTask} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                  {submittingTask ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
`;

if (!code.includes('showTaskModal && (')) {
  code = code.replace('</div>\n    </div>\n  );\n}', modalCode + '\n    </div>\n  );\n}');
}

fs.writeFileSync('src/pages/Dashboard.tsx', code);
