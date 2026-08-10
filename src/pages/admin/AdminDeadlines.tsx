import React, { useState, useEffect } from 'react';
import { CalendarCheck, Plus, Trash2, MapPin, Clock, Loader2, Calendar } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';

interface Deadline {
  description?: string;
  id: string;
  title: string;
  name?: string;
  date: string;
  eventDate?: string;
  location?: string;
  course: string;
}

export default function AdminDeadlines() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newDeadline, setNewDeadline] = useState({ name: '', eventDate: '', location: '', description: '' });

  const fetchDeadlines = async () => {
    try {
      const res = await axios.get('/api/admin/deadlines');
      setDeadlines(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeadlines();
  }, []);

    const handleAdd = async (e: React.FormEvent) => {
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
  };

  const handleDelete = async (id: string) => {
    
    try {
      await axios.delete(`/api/admin/deadlines/${id}`);
      fetchDeadlines();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manage Deadlines</h1>
            <p className="text-slate-500">Post and manage upcoming campus deadlines.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors shadow-sm"
        >
          {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Deadline</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">New Deadline</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title</label>
                  <input type="text" required value={newDeadline.name} onChange={e => setNewDeadline({...newDeadline, name: e.target.value})} placeholder="e.g. Final Exams Registration" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date</label>
                  <input type="date" required value={newDeadline.eventDate} onChange={e => setNewDeadline({...newDeadline, eventDate: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location (Optional)</label>
                <input type="text" value={newDeadline.location} onChange={e => setNewDeadline({...newDeadline, location: e.target.value})} placeholder="e.g. Main Hall" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description (Optional)</label>
                <textarea value={newDeadline.description} onChange={e => setNewDeadline({...newDeadline, description: e.target.value})} placeholder="Details about this deadline..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px] transition-colors resize-none" />
              </div>
              
              <div className="flex justify-end pt-4">
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed">{isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}Save Deadline</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {deadlines.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
            <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No deadlines posted yet.</p>
          </div>
        ) : (
          deadlines.map(deadline => (
            <div key={deadline.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between gap-4 transition-all hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{deadline.name || deadline.title}</h4>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-600">
                    <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md font-medium text-slate-700">
                      <Clock className="w-4 h-4 text-indigo-500" />
                      {format(new Date(deadline.eventDate || deadline.date), 'MMMM d, yyyy')}
                    </span>
                    {(deadline.location) && (
                      <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md font-medium text-slate-700">
                        <MapPin className="w-4 h-4 text-slate-500" /> {deadline.location}
                      </span>
                    )}
                  </div>
                  {deadline.description && (
                    <p className="mt-3 text-slate-600 text-sm leading-relaxed">{deadline.description}</p>
                  )}
                </div>
              </div>
              <div className="shrink-0 pt-1">
                <button 
                  onClick={() => handleDelete(deadline.id)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white text-slate-500 rounded-md hover:bg-rose-50 hover:text-rose-600 text-sm font-medium transition-colors border border-slate-200 hover:border-rose-200 shadow-sm"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
