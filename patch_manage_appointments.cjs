const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/ManageAppointments.tsx', 'utf8');

code = code.replace("import { Loader2, CalendarClock, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';", "import { Loader2, CalendarClock, Clock, MapPin, CheckCircle, XCircle, Trash2 } from 'lucide-react';");

const deleteFunc = `  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await axios.delete(\`/api/appointments/\${id}\`);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus =`;

code = code.replace("  const handleUpdateStatus =", deleteFunc);

const deleteButton = `                {apt.status === 'pending' && (
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={() => handleUpdateStatus(apt.id, 'approved')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-md hover:bg-emerald-100 text-sm font-medium transition-colors border border-emerald-200"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(apt.id, 'declined')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-md hover:bg-rose-100 text-sm font-medium transition-colors border border-rose-200"
                    >
                      <XCircle className="w-4 h-4" /> Decline
                    </button>
                    <button
                      onClick={() => handleDelete(apt.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-500 rounded-md hover:bg-rose-50 hover:text-rose-600 text-sm font-medium transition-colors border border-slate-200 hover:border-rose-200"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                )}
                {apt.status !== 'pending' && (
                   <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleDelete(apt.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-500 rounded-md hover:bg-rose-50 hover:text-rose-600 text-sm font-medium transition-colors border border-slate-200 hover:border-rose-200"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                )}`;
                
code = code.replace(/{apt.status === 'pending' && \([\s\S]*?<\/div>\s*\)\s*}/, deleteButton);

fs.writeFileSync('src/pages/admin/ManageAppointments.tsx', code);
