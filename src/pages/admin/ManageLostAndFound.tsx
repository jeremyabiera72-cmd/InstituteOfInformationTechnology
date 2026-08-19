import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function ManageLostAndFound() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get('/api/admin/lost-and-found');
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    setProcessingId(id);
    try {
      await axios.patch(`/api/admin/lost-and-found/${id}/status`, { status });
      setItems(items.map(item => item.id === id ? { ...item, status } : item));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Search className="w-5 h-5 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Manage Lost & Found</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.length > 0 ? items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            {item.imageUrl && (
              <div className="w-full h-48 bg-slate-100 border-b border-slate-200">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {item.type}
                </span>
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                  item.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                  item.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {item.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
              <p className="text-sm text-slate-600 mb-4">{item.description}</p>
              
              <div className="text-xs text-slate-500 space-y-1 mb-4 border-t border-slate-100 pt-3">
                <p><strong>Area:</strong> {item.area}</p>
                <p><strong>Reported by:</strong> {item.reportedBy?.fullName || item.reportedBy?.email}</p>
                <p><strong>Date:</strong> {format(new Date(item.createdAt), 'PP p')}</p>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-2 pt-2">
                {item.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(item.id, 'approved')}
                      disabled={processingId === item.id}
                      className="flex items-center justify-center gap-1 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-medium text-sm"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(item.id, 'rejected')}
                      disabled={processingId === item.id}
                      className="flex items-center justify-center gap-1 py-2 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors font-medium text-sm"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </>
                )}
                {item.status === 'approved' && (
                  <button
                    onClick={() => handleStatusUpdate(item.id, 'resolved')}
                    disabled={processingId === item.id}
                    className="col-span-2 flex items-center justify-center gap-1 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium text-sm"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No lost and found items reported yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
