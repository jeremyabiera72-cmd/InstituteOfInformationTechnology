import React, { useState, useEffect } from 'react';
import { FileSignature, CheckCircle, XCircle, Eye, X } from 'lucide-react';
import axios from 'axios';


interface Excuse {
  id: string;
  studentName: string;
  course: string;
  reason: string;
  details: string;
  parentName: string;
  parentSignature: string;
  studentSignature: string;
  proofUrl?: string;
  createdAt: string;
  date?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function AdminExcuses() {
  const [excuses, setExcuses] = useState<Excuse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExcuse, setSelectedExcuse] = useState<Excuse | null>(null);

  const fetchExcuses = async () => {
    try {
      const res = await axios.get('/api/admin/excuses');
      setExcuses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchExcuses();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await axios.patch(`/api/admin/excuses/${id}/status`, { status: newStatus });
      fetchExcuses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Manage Excuses</h1>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">Loading excuses...</td>
                </tr>
              ) : excuses.map((excuse) => (
                <tr key={excuse.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileSignature className="w-5 h-5 text-indigo-500" />
                      <span className="font-medium text-slate-800">{excuse.studentName || 'Unknown Student'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{excuse.reason}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{excuse.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      excuse.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      excuse.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                      'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                      {excuse.status?.charAt(0).toUpperCase() + excuse.status?.slice(1) || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-end gap-2">
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
                  </td>
                </tr>
              ))}
              {!loading && excuses.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No excuses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                    selectedExcuse.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    selectedExcuse.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                    'bg-orange-50 text-orange-600 border-orange-100'
                  }`}>
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
}
