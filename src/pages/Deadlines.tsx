import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Calendar as CalendarIcon, Plus, Loader2, MapPin, Clock, AlignLeft, User, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameDay, isSameMonth, formatDistanceToNow } from 'date-fns';

export default function Deadlines() {
  const { user } = useAuth();
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{type: 'delete', id: number} | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const today = new Date();

  const [formData, setFormData] = useState({
    name: '',
    eventDate: '',
    location: '',
    description: ''
  });

  useEffect(() => {
    fetchDeadlines();
  }, []);

  const fetchDeadlines = async () => {
    try {
      const res = await axios.get('/api/community-deadlines');
      setDeadlines(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      setDeadlines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/community-deadlines/${id}`);
      setDeadlines((Array.isArray(deadlines) ? deadlines : []).filter(d => d.id !== id));
      setConfirmAction(null);
    } catch (error) {
      console.error(error);
      alert('Error deleting event');
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
      const res = await axios.post('/api/community-deadlines', formData);
      setDeadlines([...deadlines, res.data].sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()));
      setShowModal(false);
      setFormData({ name: '', eventDate: '', location: '', description: '' });
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg shadow-sm border border-indigo-200">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Upcoming Deadlines</h1>
            <p className="text-slate-500">Stay on top of community events and due dates.</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-[0_2px_4px_rgba(79,70,229,0.3)]"
        >
          <Plus className="w-5 h-5" /> Add Event
        </button>
      </div>

      {/* Modern Month Calendar View */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-12">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-500" />
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded-lg">
            <button onClick={prevMonth} className="p-1.5 hover:bg-slate-50 rounded-md text-slate-600 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCurrentMonth(new Date())}
              className="px-4 py-1.5 text-sm font-semibold hover:bg-slate-50 rounded-md text-slate-700 transition-all"
            >
              Today
            </button>
            <button onClick={nextMonth} className="p-1.5 hover:bg-slate-50 rounded-md text-slate-600 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 border-b border-slate-200 bg-white">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <div key={i} className="py-4 text-center border-r border-slate-100 last:border-r-0">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{day}</div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 bg-white">
          {calendarDays.map((day, i) => {
            const dayEvents = (Array.isArray(deadlines) ? deadlines : []).filter(d => isSameDay(new Date(d.eventDate), day));
            const isToday = isSameDay(day, today);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            
            return (
              <div key={i} className={`p-2 sm:p-3 border-r border-b border-slate-100 min-h-[100px] sm:min-h-[140px] group transition-all relative ${!isCurrentMonth ? 'bg-slate-50/50' : 'hover:bg-slate-50/30'}`}>
                <div className={`text-sm font-semibold w-8 h-8 flex items-center justify-center rounded-full mb-2 ${
                  isToday 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : !isCurrentMonth 
                      ? 'text-slate-400' 
                      : 'text-slate-700 group-hover:text-indigo-600'
                }`}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1.5">
                  {dayEvents.slice(0, 3).map(event => (
                    <div key={event.id} className="text-[10px] sm:text-xs px-2 py-1.5 rounded bg-indigo-50 border border-indigo-100/50 cursor-pointer hover:border-indigo-300 transition-colors flex items-center gap-1.5 overflow-hidden">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>
                      <div className="font-medium text-indigo-900 truncate">{event.name}</div>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-slate-500 font-medium pl-1">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
                
                {dayEvents.length > 0 && (
                  <div className="absolute hidden group-hover:block top-full left-1/2 -translate-x-1/2 mt-1 w-56 bg-slate-800 text-white p-3 rounded-xl z-20 shadow-xl pointer-events-none">
                    <div className="font-bold text-xs mb-2 text-indigo-200 border-b border-slate-700 pb-2">{format(day, 'MMMM d, yyyy')}</div>
                    <div className="space-y-2">
                      {dayEvents.map(e => (
                        <div key={e.id}>
                          <div className="font-medium text-sm truncate">{e.name}</div>
                          <div className="text-[10px] text-slate-300 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" /> {format(new Date(e.eventDate), 'h:mm a')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* List View */}
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <CalendarIcon className="w-5 h-5 text-indigo-500" /> All Upcoming Events
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {deadlines.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">No upcoming events found.</p>
            <p className="text-slate-400 text-sm mt-1">Click "Add Event" to create one.</p>
          </div>
        ) : (
          (Array.isArray(deadlines) ? deadlines : []).map((deadline) => (
            <div key={deadline.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col h-full hover:shadow-md transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex flex-col items-center justify-center border border-indigo-100 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 mb-0.5">{format(new Date(deadline.eventDate), 'MMM')}</span>
                  <span className="font-bold text-xl leading-none">{format(new Date(deadline.eventDate), 'dd')}</span>
                </div>
                <div className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {format(new Date(deadline.eventDate), 'h:mm a')}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-4 line-clamp-2 leading-snug">{deadline.name}</h3>
              
              <div className="space-y-3 mb-6 flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-start gap-3 text-slate-600 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 text-indigo-500 shrink-0" />
                  <span className="font-medium">{deadline.location}</span>
                </div>
                <div className="flex items-start gap-3 text-slate-600 text-sm">
                  <AlignLeft className="w-4 h-4 mt-0.5 text-indigo-500 shrink-0" />
                  <p className="line-clamp-3 leading-relaxed">{deadline.description}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 overflow-hidden">
                  {deadline.uploader?.avatarUrl ? <img src={deadline.uploader.avatarUrl} alt="Profile" className="w-full h-full object-cover" /> : deadline.uploader?.fullName?.charAt(0) || deadline.uploader?.email?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-medium text-slate-700 truncate">Added by {deadline.uploader?.fullName || deadline.uploader?.email?.split('@')[0]}</p>
                  <p className="text-slate-400">{formatDistanceToNow(new Date(deadline.createdAt), { addSuffix: true })}</p>
                </div>
                {(deadline.uploaderId === user?.uid || deadline.uploader?.email === user?.email) && (
                  <button onClick={() => setConfirmAction({ type: 'delete', id: deadline.id })} className="ml-auto text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors" title="Delete">
                    <Trash2 className="w-5 h-5" />
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
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-indigo-500" /> Add Event
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Event Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Final Project Submission"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location / Platform</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Room 101 or Zoom Link"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Additional details..."
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
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl relative overflow-hidden">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Event?</h3>
            <p className="text-slate-600 mb-6 text-sm">
              This action cannot be undone. Are you sure you want to permanently delete this event?
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