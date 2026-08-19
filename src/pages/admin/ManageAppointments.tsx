import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, CalendarClock, Clock, MapPin, CheckCircle, XCircle, Trash2, CalendarHeart } from 'lucide-react';
import { format } from 'date-fns';

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/appointments/${id}`);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await axios.put(`/api/appointments/${id}`, { status });
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
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 opacity-10">
            <CalendarHeart className="w-64 h-64" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
            <CalendarClock className="w-7 h-7 text-indigo-100" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Appointments</h1>
            <p className="text-indigo-200">Review and manage student guidance sessions.</p>
          </div>
        </div>
        <div className="relative z-10 mt-6 md:mt-0 flex gap-4">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-xl text-center">
              <div className="text-3xl font-bold text-white">{appointments.length}</div>
              <div className="text-xs text-indigo-200 uppercase tracking-wider font-semibold">Total</div>
            </div>
            <div className="bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 px-6 py-3 rounded-xl text-center">
              <div className="text-3xl font-bold text-amber-300">{pendingCount}</div>
              <div className="text-xs text-amber-200 uppercase tracking-wider font-semibold">Pending</div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {appointments.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarClock className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">No appointments yet</h3>
            <p className="text-slate-500 font-medium">When students book a session, they will appear here.</p>
          </div>
        ) : (
          appointments.map(apt => (
            <div key={apt.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-slate-200" style={{ 
                backgroundColor: apt.status === 'approved' ? '#10b981' : apt.status === 'declined' ? '#f43f5e' : '#f59e0b'
               }}></div>
              
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                      {apt.user?.avatarUrl ? (
                        <img src={apt.user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold text-indigo-600 text-lg">{apt.user?.fullName?.charAt(0) || apt.user?.email?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg leading-tight">{apt.user?.fullName || apt.user?.email}</h3>
                      <p className="text-xs font-medium text-slate-500">{apt.user?.email}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm border ${
                    apt.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    apt.status === 'declined' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                    'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {apt.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                    <CalendarClock className="w-4 h-4 text-indigo-500" />
                    <span>{format(new Date(apt.eventDate), 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    <span>{apt.time}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{apt.location}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Reason for visit</p>
                  <p className="text-slate-700 text-sm leading-relaxed">{apt.reason}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                {apt.status === 'pending' ? (
                  <div className="flex gap-2 w-full">
                    <button 
                      onClick={() => handleUpdateStatus(apt.id, 'approved')}
                      className="flex-1 flex justify-center items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 text-sm font-bold transition-colors border border-emerald-200 shadow-sm"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(apt.id, 'declined')}
                      className="flex-1 flex justify-center items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 text-sm font-bold transition-colors border border-rose-200 shadow-sm"
                    >
                      <XCircle className="w-4 h-4" /> Decline
                    </button>
                  </div>
                ) : (
                  <div className="w-full"></div>
                )}
                
                <button
                  onClick={() => handleDelete(apt.id)}
                  className={`flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ${apt.status === 'pending' ? 'ml-2 border border-slate-200' : 'w-full bg-slate-50 border border-slate-200 hover:border-rose-200'}`}
                  title="Delete Appointment"
                >
                  <Trash2 className="w-4 h-4" /> {apt.status !== 'pending' && <span className="ml-1.5 text-sm font-medium">Delete Record</span>}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
