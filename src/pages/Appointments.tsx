import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Loader2, Plus, CalendarClock, Clock, MapPin, X, CalendarHeart, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    eventDate: '',
    time: '',
    location: '',
    reason: ''
  });

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('/api/appointments');
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/appointments', newAppointment);
      setIsAdding(false);
      setNewAppointment({ eventDate: '', time: '', location: '', reason: '' });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/appointments/${id}`);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  const pendingCount = appointments.filter(a => a.status === 'pending').length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 opacity-10">
            <CalendarHeart className="w-64 h-64" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
            <CalendarClock className="w-7 h-7 text-indigo-100" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Guidance Appointments</h1>
            <p className="text-indigo-200">Set and track your appointments with the council mayor.</p>
          </div>
        </div>
        <div className="relative z-10 mt-6 md:mt-0 flex gap-4">
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-900 rounded-xl hover:bg-indigo-50 font-bold transition-colors shadow-sm"
          >
            {isAdding ? 'Cancel' : <><Plus className="w-5 h-5" /> Book Appointment</>}
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">New Appointment Request</h2>
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                  <input type="date" required value={newAppointment.eventDate} onChange={e => setNewAppointment({...newAppointment, eventDate: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Time</label>
                  <input type="time" required value={newAppointment.time} onChange={e => setNewAppointment({...newAppointment, time: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                  <input type="text" required value={newAppointment.location} onChange={e => setNewAppointment({...newAppointment, location: e.target.value})} placeholder="e.g. Mayor's Office" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Reason / Description</label>
                <textarea required value={newAppointment.reason} onChange={e => setNewAppointment({...newAppointment, reason: e.target.value})} placeholder="Why do you need this appointment?" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] transition-colors resize-none" />
              </div>
              
              <div className="flex justify-end pt-4">
                <button type="submit" className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-sm transition-colors">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5">
        {appointments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarClock className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">No appointments scheduled</h3>
            <p className="text-slate-500 font-medium">Book a session to get started.</p>
          </div>
        ) : (
          appointments.map(apt => (
            <div key={apt.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-200" style={{ 
                backgroundColor: apt.status === 'approved' ? '#10b981' : apt.status === 'declined' ? '#f43f5e' : '#f59e0b'
               }}></div>
               
              <div className="flex items-start gap-5 pl-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                  {apt.user?.avatarUrl ? (
                    <img src={apt.user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-indigo-600 text-lg">{apt.user?.fullName?.charAt(0) || apt.user?.email?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-slate-900 text-lg">{apt.user?.fullName || apt.user?.email}</h3>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm border ${
                      apt.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      apt.status === 'declined' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                      'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg font-medium text-slate-700 text-sm border border-slate-100"><CalendarClock className="w-4 h-4 text-indigo-500" /> {format(new Date(apt.eventDate), 'EEEE, MMM d, yyyy')}</span>
                    <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg font-medium text-slate-700 text-sm border border-slate-100"><Clock className="w-4 h-4 text-indigo-500" /> {apt.time}</span>
                    <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg font-medium text-slate-700 text-sm border border-slate-100"><MapPin className="w-4 h-4 text-slate-400" /> {apt.location}</span>
                  </div>
                  <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Reason</p>
                    <p className="text-slate-700 text-sm leading-relaxed">{apt.reason}</p>
                  </div>
                </div>
              </div>
              
              <div className="shrink-0 pl-2 md:pl-0 mt-4 md:mt-0 flex self-end md:self-center">
                <button
                  onClick={() => handleDelete(apt.id)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-slate-500 rounded-xl hover:bg-rose-50 hover:text-rose-600 text-sm font-bold transition-colors border border-slate-200 hover:border-rose-200 shadow-sm"
                  title="Delete Appointment"
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
