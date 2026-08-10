import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Plus, MapPin, Upload, Loader2, Info } from 'lucide-react';


import { format } from 'date-fns';

export default function LostAndFound() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    type: 'lost'
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const area = localStorage.getItem('userArea') || 'BSCS';
      const res = await axios.get(`/api/lost-and-found?area=${area}`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let imageUrl = null;
      if (file) {
        imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }

      const area = localStorage.getItem('userArea') || 'BSCS';
      await axios.post('/api/lost-and-found', {
        ...newItem,
        imageUrl,
        area
      });

      setShowModal(false);
      setNewItem({ title: '', description: '', type: 'lost' });
      setFile(null);
      alert('Your report has been submitted to the admin for approval.');
      fetchItems();
    } catch (err) {
      console.error(err);
      alert('Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Search className="w-5 h-5 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Lost and Found</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Report Item
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 text-blue-800 text-sm mb-6">
        <Info className="w-5 h-5 flex-shrink-0" />
        <p>If you lost or found something, you can report it here. A message will be sent to the administrator (mayor/governor) for approval before it appears on the board.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              {item.imageUrl ? (
                <div className="h-48 w-full bg-slate-100 border-b border-slate-200">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-48 w-full bg-slate-100 flex items-center justify-center border-b border-slate-200">
                  <Search className="w-12 h-12 text-slate-300" />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {item.type}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{format(new Date(item.createdAt), 'MMM d, yyyy')}</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 mb-4 flex-1 line-clamp-3">{item.description}</p>
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                     {item.reportedBy?.avatarUrl ? <img src={item.reportedBy.avatarUrl} className="w-full h-full object-cover"/> : <span className="text-xs font-bold text-indigo-700">{item.reportedBy?.fullName?.[0] || 'A'}</span>}
                  </div>
                  <span className="text-xs font-medium text-slate-700">Reported by {item.reportedBy?.fullName || 'Anonymous'}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No items found</h3>
            <p className="text-slate-500">There are no approved lost or found items at the moment.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Report Item</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setNewItem({ ...newItem, type: 'lost' })}
                  className={`py-2 rounded-xl font-medium text-sm transition-colors border ${
                    newItem.type === 'lost' 
                      ? 'bg-red-50 text-red-700 border-red-200' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  I Lost Something
                </button>
                <button
                  type="button"
                  onClick={() => setNewItem({ ...newItem, type: 'found' })}
                  className={`py-2 rounded-xl font-medium text-sm transition-colors border ${
                    newItem.type === 'found' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  I Found Something
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Blue Hydroflask"
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={newItem.title}
                  onChange={e => setNewItem({...newItem, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description & Location</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the item and where you last saw it / found it..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={newItem.description}
                  onChange={e => setNewItem({...newItem, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Photo (Optional)</label>
                <label className="flex items-center justify-center w-full min-h-[8rem] px-4 py-4 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors relative overflow-hidden group">
                  {file ? (
                    <div className="flex flex-col items-center gap-2">
                      <img src={URL.createObjectURL(file)} alt="Preview" className="max-h-32 object-contain rounded-lg shadow-sm" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                        <Upload className="w-6 h-6 mb-1" />
                        <span className="text-sm font-medium">Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      <span className="text-sm text-slate-500 font-medium group-hover:text-indigo-600 transition-colors">
                        Click to upload image
                      </span>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
