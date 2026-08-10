const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AdminDeadlines.tsx', 'utf8');

if (!code.includes('isSubmitting')) {
  code = code.replace('const [isAdding, setIsAdding] = useState(false);', 'const [isAdding, setIsAdding] = useState(false);\n  const [isSubmitting, setIsSubmitting] = useState(false);');
  
  const handleAdd = `  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeadline.name || !newDeadline.eventDate) return;
    setIsSubmitting(true);
    try {
      await axios.post('/api/admin/deadlines', newDeadline);
      setNewDeadline({ name: '', eventDate: '', location: '', description: '' });
      setIsAdding(false);
      fetchDeadlines();
    } catch (err) {
      console.error(err);
      alert('Failed to save deadline');
    } finally {
      setIsSubmitting(false);
    }
  };`;
  
  code = code.replace(/const handleAdd = async \([\s\S]*?\} catch \(err\) \{\n      console\.error\(err\);\n    \}\n  \};/, handleAdd);
  
  code = code.replace(
    '<button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow-sm transition-colors">Save Deadline</button>',
    '<button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed">{isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}Save Deadline</button>'
  );
  
  fs.writeFileSync('src/pages/admin/AdminDeadlines.tsx', code);
}
