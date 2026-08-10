import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Plus, Link2, Clock, AlertCircle, CheckCircle2, Trash2,  Upload, Loader2, FileText, Target, BookOpen, AlertOctagon } from 'lucide-react';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { Image as ImageIcon, X, ExternalLink, Maximize2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';

export default function Assignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{type: 'delete' | 'done', id: number} | null>(null);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', priority: 'medium', imageUrl: '', linkUrl: '' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const userArea = localStorage.getItem('userArea') || 'BSCS';
      const res = await axios.get(`/api/assignments?area=${userArea}`);
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/assignments/${id}`);
      setAssignments((Array.isArray(assignments) ? assignments : []).filter(a => a.id !== id));
      setConfirmAction(null);
    } catch (error) {
      console.error(error);
      alert('Error deleting assignment');
    }
  };

  const handleMarkDone = async (id: number) => {
    try {
      await axios.patch(`/api/assignments/${id}/status`, { status: 'completed' });
      setAssignments((Array.isArray(assignments) ? assignments : []).map(a => a.id === id ? { ...a, status: 'completed' } : a));
      setConfirmAction(null);
    } catch (error) {
      console.error(error);
      alert('Error marking as done');
    }
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'delete') {
      handleDelete(confirmAction.id);
    } else if (confirmAction.type === 'done') {
      handleMarkDone(confirmAction.id);
    }
  };

  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const storage = getStorage();
      const fileRef = ref(storage, `assignments/${uuidv4()}_${file.name}`);
      const snapshot = await uploadBytesResumable(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setNewAssignment(prev => ({ ...prev, imageUrl: downloadURL }));
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userArea = localStorage.getItem('userArea') || 'BSCS';
      await axios.post('/api/assignments', { ...newAssignment, area: userArea });
      setIsAdding(false);
      setNewAssignment({ title: '', description: '', dueDate: '', priority: 'medium', imageUrl: '', linkUrl: '' });
      fetchAssignments();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg shadow-sm border border-indigo-200">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Task Tracker</h1>
            <p className="text-slate-500">Track and share community assignments.</p>
          </div>
        </div>
        <button 
          onClick={() => {
            if (isAdding) {
              setNewAssignment({ title: '', description: '', dueDate: '', priority: 'medium', imageUrl: '', linkUrl: '' });
            }
            setIsAdding(!isAdding);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors shadow-sm"
        >
          {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> Share Assignment</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 animate-in fade-in slide-in-from-top-4">
          <div className="mb-6">
            <h3 className="font-bold text-xl text-slate-800">New Assignment</h3>
            <p className="text-sm text-slate-500">Post a new task for the community to track.</p>
          </div>
          <form onSubmit={handleAdd} className="space-y-5 max-w-3xl">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assignment Title</label>
              <input type="text" required value={newAssignment.title} onChange={e => setNewAssignment({...newAssignment, title: e.target.value})} placeholder="e.g. Chapter 4 Quiz, Essay Draft..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors font-medium text-slate-800" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description / Instructions</label>
              <textarea value={newAssignment.description} onChange={e => setNewAssignment({...newAssignment, description: e.target.value})} placeholder="Add details or links to resources..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors text-slate-800 resize-y" rows={3} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Due Date & Time</label>
                <input type="datetime-local" required value={newAssignment.dueDate} onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors text-slate-800" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Priority Level</label>
                <select value={newAssignment.priority} onChange={e => setNewAssignment({...newAssignment, priority: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors text-slate-800">
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Attach Link (Optional)</label>
                <div className="flex bg-slate-50 border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-colors">
                  <div className="px-3 py-2.5 bg-slate-100 border-r border-slate-200 flex items-center justify-center">
                    <Link2 className="w-4 h-4 text-slate-500" />
                  </div>
                  <input type="url" value={newAssignment.linkUrl || ''} onChange={e => setNewAssignment({...newAssignment, linkUrl: e.target.value})} placeholder="https://..." className="w-full px-3 py-2.5 bg-transparent focus:outline-none text-sm text-slate-800" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Attach Image (Optional)</label>
                <div className="flex items-center gap-3">
                  {!newAssignment.imageUrl ? (
                    <label className="flex items-center justify-center px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors text-sm font-medium shadow-sm">
                      {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                      {uploadingImage ? 'Uploading...' : 'Choose Image'}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                    </label>
                  ) : (
                    <div className="relative inline-block mt-2">
                      <img src={newAssignment.imageUrl} alt="Preview" className="h-24 w-24 object-cover rounded-lg border border-slate-200 shadow-sm" />
                      <button type="button" onClick={() => setNewAssignment(prev => ({...prev, imageUrl: ''}))} className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1 shadow-md hover:bg-slate-900 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow-sm transition-colors">Publish Assignment</button>
            </div>
          </form>
        </div>
      )}

      {assignments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Calendar className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-800 font-medium text-lg">No assignments pending</p>
          <p className="text-slate-500 mt-1">You are all caught up! Enjoy your free time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(Array.isArray(assignments) ? assignments : []).map(assignment => {
            const isDueSoon = new Date(assignment.dueDate).getTime() - new Date().getTime() < 86400000;
            const pastDue = isPast(new Date(assignment.dueDate));
            
            return (
            <div key={assignment.id} className="group bg-white rounded-xl shadow-sm border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all p-5 sm:p-6 flex flex-col sm:flex-row gap-5 relative overflow-hidden">
              {/* Priority Indicator Line */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${assignment.priority === 'high' ? 'bg-rose-500' : assignment.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              
              <div className="flex-1 min-w-0 pl-2">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${assignment.priority === 'high' ? 'bg-rose-50 text-rose-700 border border-rose-200' : assignment.priority === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                    {assignment.priority}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">
                    {assignment.subject?.name || 'General'}
                  </span>
                </div>
                
                <h3 className="font-bold text-slate-900 text-xl leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{assignment.title}</h3>
                
                {assignment.description && (
                  <p className="text-slate-600 text-[15px] mb-4 leading-relaxed line-clamp-2">{assignment.description}</p>
                )}

                {assignment.linkUrl && (
                  <a href={assignment.linkUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2 text-sm font-medium mb-4 transition-colors w-fit">
                    <Link2 className="w-4 h-4" />
                    View Attached Link
                    <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                  </a>
                )}
                {assignment.imageUrl && (
                  <div className="mb-4 relative group cursor-pointer inline-block" onClick={() => setZoomImage(assignment.imageUrl)}>
                    <img src={assignment.imageUrl} alt="Assignment attachment" className="rounded-lg border border-slate-200 max-h-40 object-cover" />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors rounded-lg flex items-center justify-center">
                      <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 drop-shadow-md transition-opacity" />
                    </div>
                  </div>
                )}

                
                <div className="flex flex-wrap items-center gap-4 text-[13px] font-medium mt-auto pt-4 border-t border-slate-100">
                  <div className={`flex items-center gap-1.5 ${pastDue ? 'text-rose-600' : isDueSoon ? 'text-amber-600' : 'text-slate-500'}`}>
                    {pastDue ? <AlertOctagon className="w-4 h-4" /> : isDueSoon ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    <span>
                      {pastDue ? 'Past due ' : 'Due '} 
                      {format(new Date(assignment.dueDate), 'MMM d, h:mm a')}
                      <span className="hidden sm:inline"> ({formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })})</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <FileText className="w-4 h-4" />
                    <span>Posted by {assignment.user?.fullName || assignment.user?.email?.split('@')[0]}</span>
                  </div>
                </div>
              </div>
              
              {/* Optional actions area on right side */}
              <div className="flex sm:flex-col justify-end sm:justify-start items-center gap-2 sm:pl-4 sm:border-l border-slate-100 mt-4 sm:mt-0">
                 {assignment.status === 'completed' ? (
                   <span className="w-full sm:w-auto px-4 py-2 bg-emerald-50 text-emerald-600 font-semibold text-sm rounded-lg border border-emerald-200 flex items-center justify-center gap-2">
                     <CheckCircle2 className="w-4 h-4" /> Completed
                   </span>
                 ) : (
                   <button onClick={() => setConfirmAction({ type: 'done', id: assignment.id })} className="w-full sm:w-auto px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 font-semibold text-sm rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-2">
                     <CheckCircle2 className="w-4 h-4" /> Mark Done
                   </button>
                 )}
                 {assignment.userId === user?.uid || assignment.user?.email === user?.email ? (
                   <button onClick={() => setConfirmAction({ type: 'delete', id: assignment.id })} className="w-full sm:w-auto px-4 py-2 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-semibold text-sm rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-2" title="Delete">
                     <Trash2 className="w-4 h-4" /> Delete
                   </button>
                 ) : null}
              </div>
            </div>
            );
          })}
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl relative overflow-hidden">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              {confirmAction.type === 'delete' ? 'Delete Assignment?' : 'Mark as Done?'}
            </h3>
            <p className="text-slate-600 mb-6 text-sm">
              {confirmAction.type === 'delete' ? 'This action cannot be undone. Are you sure you want to permanently delete this assignment?' 
                : 'Are you sure you want to mark this assignment as completed?'}
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
                className={`px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors ${
                  confirmAction.type === 'delete' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                {confirmAction.type === 'delete' ? 'Delete' : 'Mark Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {zoomImage && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]" onClick={() => setZoomImage(null)}>
          <div className="relative max-w-5xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <button onClick={() => setZoomImage(null)} className="absolute -top-12 right-0 text-white hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 p-2 rounded-full transition-colors backdrop-blur-md">
              <X className="w-6 h-6" />
            </button>
            <img src={zoomImage} alt="Zoomed attachment" className="rounded-xl object-contain max-h-[85vh] shadow-2xl ring-1 ring-white/10" />
          </div>
        </div>
      )}

    </div>
  );
}