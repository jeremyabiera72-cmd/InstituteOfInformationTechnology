import React, { useEffect, useState } from 'react';
import { Search, Upload, Download, FileText, Filter, Loader2, BookOpen, Clock, MoreVertical, File, Trash2 } from 'lucide-react';
import axios from 'axios';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext.tsx';

export default function Notes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [confirmAction, setConfirmAction] = useState<{type: 'delete', id: number} | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get('/api/notes');
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/notes/${id}`);
      setNotes((Array.isArray(notes) ? notes : []).filter(n => n.id !== id));
      setConfirmAction(null);
    } catch (error) {
      console.error(error);
      alert('Error deleting note');
    }
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirmAction) return;
    if (confirmAction.type === 'delete') {
      handleDelete(confirmAction.id);
    }
  };
  
  const triggerDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setConfirmAction({ type: 'delete', id });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const storage = getStorage();
      const fileRef = ref(storage, `notes/${uuidv4()}_${file.name}`);
      const snapshot = await uploadBytesResumable(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      await axios.post('/api/notes', {
        title: file.name,
        description: 'Uploaded note',
        fileUrl: downloadURL,
        subjectId: null
      });
      fetchNotes();
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Note: The app may use default Firebase storage which requires permissions.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  const filteredNotes = (Array.isArray(notes) ? notes : []).filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (note.subject?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                          (filterType === 'my-notes' && (note.uploaderId === user?.uid || note.uploader?.email === user?.email));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg shadow-sm border border-indigo-200">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Class Notes</h1>
            <p className="text-slate-500">Access and share study materials.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors shadow-sm font-medium text-sm">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading...' : 'Upload Notes'}
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search documents, subjects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium appearance-none cursor-pointer"
          >
            <option value="all">All Notes</option>
            <option value="my-notes">My Notes</option>
          </select>
        </div>
      </div>

      {/* Content Grid */}
      
{filteredNotes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <FileText className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-800 font-medium text-lg">No notes found</p>
          <p className="text-slate-500 mt-1">Upload the first document to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredNotes.map(note => (
            <div key={note.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all group flex flex-col h-full cursor-pointer relative">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-slate-400 hover:text-slate-700 bg-white rounded-md p-1 shadow-sm border border-slate-200">
                  <MoreVertical className="w-4 h-4" />
                </button>
                {(note.uploaderId === user?.uid || note.uploader?.email === user?.email) && (
                  <button onClick={(e) => triggerDelete(e, note.id)} className="text-rose-400 hover:text-rose-700 bg-white rounded-md p-1 shadow-sm border border-slate-200 ml-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 border border-indigo-100">
                <File className="w-6 h-6" />
              </div>
              
              <h3 className="font-bold text-slate-900 mb-1 line-clamp-2 leading-tight" title={note.title}>{note.title}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-1">{note.subject?.name || 'General'}</p>
              
              <div className="mt-auto pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                    {note.uploader?.fullName?.charAt(0) || note.uploader?.email?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-medium text-slate-600 truncate">
                    {note.uploader?.fullName || note.uploader?.email?.split('@')[0] || 'Unknown'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <a href={note.fileUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 font-semibold" onClick={e => e.stopPropagation()}>
                      <Download className="w-3 h-3" />
                      {note.downloads}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl relative overflow-hidden">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Note?</h3>
            <p className="text-slate-600 mb-6 text-sm">
              This action cannot be undone. Are you sure you want to permanently delete this note?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={(e) => { e.stopPropagation(); setConfirmAction(null); }}
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