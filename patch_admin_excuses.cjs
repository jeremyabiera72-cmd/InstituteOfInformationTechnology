const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AdminExcuses.tsx', 'utf8');

code = code.replace(
  "import { FileSignature, CheckCircle, XCircle } from 'lucide-react';",
  "import { FileSignature, CheckCircle, XCircle, Eye, X } from 'lucide-react';"
);

code = code.replace(
  "interface Excuse {\n  id: string;\n  studentName: string;\n  reason: string;\n  date: string;\n  status: 'pending' | 'approved' | 'rejected';\n}",
  "interface Excuse {\n  id: string;\n  studentName: string;\n  course: string;\n  reason: string;\n  details: string;\n  parentName: string;\n  parentSignature: string;\n  studentSignature: string;\n  proofUrl?: string;\n  createdAt: string;\n  date?: string;\n  status: 'pending' | 'approved' | 'rejected';\n}"
);

code = code.replace(
  "const [loading, setLoading] = useState(true);",
  "const [loading, setLoading] = useState(true);\n  const [selectedExcuse, setSelectedExcuse] = useState<Excuse | null>(null);"
);

code = code.replace(
  `<td className="px-6 py-4 flex justify-end gap-2">
                    {excuse.status !== 'approved' && (
                      <button 
                        onClick={() => handleStatusUpdate(excuse.id, 'approved')}
                        className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {excuse.status !== 'rejected' && (
                      <button 
                        onClick={() => handleStatusUpdate(excuse.id, 'rejected')}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </td>`,
  `<td className="px-6 py-4 flex justify-end gap-2">
                    <button 
                      onClick={() => setSelectedExcuse(excuse)}
                      className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {excuse.status !== 'approved' && (
                      <button 
                        onClick={() => handleStatusUpdate(excuse.id, 'approved')}
                        className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {excuse.status !== 'rejected' && (
                      <button 
                        onClick={() => handleStatusUpdate(excuse.id, 'rejected')}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </td>`
);

code = code.replace(
  "          </table>\n        </div>\n      </div>\n    </div>\n  );\n}",
  `          </table>
        </div>
      </div>

      {selectedExcuse && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-800">Excuse Details</h2>
              <button onClick={() => setSelectedExcuse(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Student Name</label>
                  <p className="text-sm font-medium text-slate-800">{selectedExcuse.studentName}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Course</label>
                  <p className="text-sm font-medium text-slate-800">{selectedExcuse.course}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Date Submitted</label>
                  <p className="text-sm font-medium text-slate-800">{new Date(selectedExcuse.createdAt || selectedExcuse.date || '').toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                  <span className={\`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border \${
                    selectedExcuse.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    selectedExcuse.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                    'bg-orange-50 text-orange-600 border-orange-100'
                  }\`}>
                    {selectedExcuse.status?.charAt(0).toUpperCase() + selectedExcuse.status?.slice(1) || 'Pending'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Reason</label>
                <p className="text-sm text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">{selectedExcuse.reason}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Detailed Explanation</label>
                <p className="text-sm text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap">{selectedExcuse.details}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Student Signature</label>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <img src={selectedExcuse.studentSignature} alt="Student Signature" className="max-h-16 object-contain" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Parent Signature ({selectedExcuse.parentName})</label>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <img src={selectedExcuse.parentSignature} alt="Parent Signature" className="max-h-16 object-contain" />
                  </div>
                </div>
              </div>

              {selectedExcuse.proofUrl && (
                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Attached Proof</label>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <img src={selectedExcuse.proofUrl} alt="Proof" className="w-full rounded-lg" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              {selectedExcuse.status !== 'approved' && (
                <button 
                  onClick={() => { handleStatusUpdate(selectedExcuse.id, 'approved'); setSelectedExcuse(null); }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium text-sm flex items-center gap-2 shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
              )}
              {selectedExcuse.status !== 'rejected' && (
                <button 
                  onClick={() => { handleStatusUpdate(selectedExcuse.id, 'rejected'); setSelectedExcuse(null); }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors font-medium text-sm flex items-center gap-2 shadow-sm"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`
);

fs.writeFileSync('src/pages/admin/AdminExcuses.tsx', code);
