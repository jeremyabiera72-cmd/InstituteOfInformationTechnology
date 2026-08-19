import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Link2, Plus, ExternalLink, Loader2, User, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function SharedLinks() {
  const { user } = useAuth();
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{type: 'delete', id: number} | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: ''
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await axios.get('/api/links');
      setLinks(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/links/${id}`);
      setLinks((Array.isArray(links) ? links : []).filter(l => l.id !== id));
      setConfirmAction(null);
    } catch (error) {
      console.error(error);
      alert('Error deleting link');
    }
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'delete') {
      handleDelete(confirmAction.id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post('/api/links', formData);
      setLinks([res.data, ...links]);
      setShowModal(false);
      setFormData({ title: '', url: '', description: '' });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-indigo-600 text-white rounded-xl shadow-md border border-indigo-500">
            <Link2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Shared Resources</h1>
            <p className="text-slate-500 font-medium">Discover and share useful links, lessons, and tutorials.</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-bold text-sm shadow-[0_2px_4px_rgba(79,70,229,0.3)]"
        >
          <Plus className="w-5 h-5" /> Share Resource
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {links.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Link2 className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">No shared links yet.</p>
            <p className="text-slate-400 text-sm mt-1">Be the first to share a useful resource!</p>
          </div>
        ) : (
          (Array.isArray(links) ? links : []).map((link) => (
            <div key={link.id} className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-200 flex flex-col h-full hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-4 gap-4">
                <h2 className="text-[17px] font-bold text-slate-800 leading-snug line-clamp-2">{link.title}</h2>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors flex-shrink-0"
                  title="Open Link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              
              <div className="space-y-4 mb-6 flex-1">
                <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {link.description}
                </p>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-indigo-500 truncate block hover:underline hover:text-indigo-700 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/50">
                  {link.url}
                </a>
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs overflow-hidden">
                    {link.uploader?.avatarUrl ? <img src={link.uploader.avatarUrl} alt="Profile" className="w-full h-full object-cover" /> : link.uploader?.fullName?.charAt(0) || link.uploader?.email?.charAt(0) || 'U'}
                  </div>
                  <span className="font-semibold text-slate-700 truncate max-w-[120px]">{link.uploader?.fullName || link.uploader?.email?.split('@')[0]}</span>
                </div>
                <span className="font-medium text-slate-400">{format(new Date(link.createdAt), 'MMM d, yyyy')}</span>
                {(link.uploaderId === user?.uid || link.uploader?.email === user?.email) && (
                  <button onClick={() => setConfirmAction({ type: 'delete', id: link.id })} className="ml-2 text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Link2 className="w-6 h-6 text-indigo-600" /> Share a Resource
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Resource Title</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Complete Guide to React Hooks"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">URL (Link)</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors font-mono text-sm"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Description / Note</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Why is this resource helpful to others?"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold flex items-center gap-2 transition-colors shadow-sm"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Share Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl relative overflow-hidden">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Link?</h3>
            <p className="text-slate-600 mb-6 text-sm">
              This action cannot be undone. Are you sure you want to permanently delete this link?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirm}
                className="px-4 py-2 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}