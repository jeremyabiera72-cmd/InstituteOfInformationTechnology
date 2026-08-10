import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase.ts';
import { ShieldAlert, Trash2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminBullyingReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'bullying_reports'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReports(reportsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (reportId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'bullying_reports', reportId), {
        status: newStatus
      });
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (reportId: string) => {
    if (true) {
      try {
        await deleteDoc(doc(db, 'bullying_reports', reportId));
      } catch (err) {
        console.error("Error deleting report:", err);
        alert("Failed to delete report.");
      }
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-500 font-medium">Loading reports...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center shadow-sm">
            <ShieldAlert className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Bullying Reports</h1>
            <p className="text-slate-500 mt-1">Manage and review incident reports submitted by students.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reports.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No reports found</h3>
            <p className="text-slate-500 mt-2">There are currently no bullying reports to review.</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      {report.incidentType} Incident
                      {report.status === 'pending' && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800"><AlertCircle className="w-3 h-3" /> Pending</span>}
                      {report.status === 'investigating' && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800"><Clock className="w-3 h-3" /> Investigating</span>}
                      {report.status === 'resolved' && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800"><CheckCircle2 className="w-3 h-3" /> Resolved</span>}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Reported by: <span className="font-semibold text-slate-700">{report.userName}</span> 
                      {report.userEmail && <span className="text-slate-400 ml-1">({report.userEmail})</span>}
                    </p>
                  </div>
                  
                  {(report.victimName || report.course || report.section) && (
                    <div className="mt-4 md:mt-0 bg-red-50 px-4 py-3 rounded-xl border border-red-100 flex flex-col gap-1 text-sm">
                      {report.victimName && (
                        <p className="text-red-900"><span className="font-semibold">Victim:</span> {report.victimName}</p>
                      )}
                      {(report.course || report.section) && (
                        <p className="text-red-800"><span className="font-semibold">Class:</span> {report.course} {report.section}</p>
                      )}
                    </div>
                  )}
                  
                  <div className="text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 inline-flex items-center self-start">
                    Date of incident: {report.date}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{report.description}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-600">Update Status:</span>
                    <select
                      value={report.status}
                      onChange={(e) => handleUpdateStatus(report.id, e.target.value)}
                      className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="investigating">Investigating</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                    title="Delete Report"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="text-sm font-medium hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
