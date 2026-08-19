import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Megaphone, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext.tsx';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const area = localStorage.getItem('userArea') || 'BSCS';
      const res = await axios.get(`/api/announcements?area=${area}`);
      setAnnouncements(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Megaphone className="w-5 h-5 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Announcements</h1>
      </div>

      <div className="space-y-6">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-800">{announcement.title}</h3>
                <div className="flex items-center text-sm text-slate-500 gap-1 bg-slate-100 px-3 py-1 rounded-full font-medium">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(announcement.createdAt), 'PPP')}
                </div>
              </div>
              
              <div className="prose prose-slate max-w-none mb-4 whitespace-pre-wrap">
                {announcement.content}
              </div>

              {announcement.imageUrl && (
                <div className="mt-4 rounded-xl overflow-hidden border border-slate-100 max-h-96 flex items-center justify-center bg-slate-50">
                  <img src={announcement.imageUrl} alt="Announcement Attachment" className="max-w-full max-h-96 object-contain" />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No Announcements Yet</h3>
            <p className="text-slate-500">Check back later for updates from the mayor or governor.</p>
          </div>
        )}
      </div>
    </div>
  );
}
