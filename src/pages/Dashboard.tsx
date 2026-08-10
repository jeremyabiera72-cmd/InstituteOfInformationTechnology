import { Link, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Calendar, FileText, Link2, Loader2, Image as ImageIcon, X, Plus, BookOpen, CheckSquare, ShieldAlert, Users, CalendarClock } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export default function Dashboard() {
  const { area } = useParams<{ area: string }>();
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementImage, setAnnouncementImage] = useState('');
  const [posting, setPosting] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "", priority: "medium" });
  const [submittingTask, setSubmittingTask] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const userArea = localStorage.getItem('userArea') || 'BSCS';
      const res = await axios.get(`/api/dashboard?area=${userArea}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingTask(true);
    try {
      await axios.post('/api/assignments', newTask);
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', dueDate: '', priority: 'medium' });
      fetchDashboard();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingTask(false);
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  const notesCount = data?.notesCount || 0;
  const assignments = data?.assignments || [];
  const announcements = data?.announcements || [];
  const assignmentsDue = (Array.isArray(assignments) ? assignments : []).filter((a: any) => a.status === 'pending').length;

  const stats = [
    { name: 'Assignments Due', value: assignmentsDue.toString(), color: 'text-orange-700', bg: 'bg-orange-50' },
    { name: 'Notes Uploaded', value: notesCount.toString(), color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { name: 'Links Shared', value: '0', color: 'text-blue-700', bg: 'bg-blue-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6 mt-2">
        <h3 className="text-lg font-bold text-slate-800">Key indicators</h3>
        <button onClick={() => setShowTaskModal(true)} className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2">
           <Plus className="w-4 h-4" /> Add new task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className={`${stat.bg} rounded-2xl p-6 shadow-sm border border-transparent flex flex-col justify-between h-32`}>
            <p className="text-sm font-medium text-slate-700">{stat.name}</p>
            <p className={`text-4xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 lg:col-span-2">
          <h3 className="font-semibold text-slate-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to={`/${area}/notes`} className="flex flex-col items-center justify-center p-6 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors">
              <BookOpen className="w-8 h-8 mb-2" />
              <span className="font-medium text-sm">Class Notes</span>
            </Link>
            <Link to={`/${area}/assignments`} className="flex flex-col items-center justify-center p-6 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors">
              <CheckSquare className="w-8 h-8 mb-2" />
              <span className="font-medium text-sm">Assignments</span>
            </Link>
            <Link to={`/${area}/excuses`} className="flex flex-col items-center justify-center p-6 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-colors">
              <FileText className="w-8 h-8 mb-2" />
              <span className="font-medium text-sm">Submit Excuse</span>
            </Link>
            <Link to={`/${area}/report-bullying`} className="flex flex-col items-center justify-center p-6 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors">
              <ShieldAlert className="w-8 h-8 mb-2" />
              <span className="font-medium text-sm">Report Issue</span>
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h3 className="font-semibold text-slate-800 mb-6">Upcoming Deadlines</h3>
          <div className="space-y-4">
            {assignments.length > 0 ? (Array.isArray(assignments) ? assignments : []).map((deadline: any, i: number) => (
              <div key={i} className="flex items-center gap-4 p-3 border border-slate-100 rounded-lg bg-white">
                <div className={`w-2 h-10 rounded-full ${deadline.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800 text-sm">{deadline.title}</h4>
                  <p className="text-xs text-slate-500">{deadline.subject?.name || 'General'} • Due {deadline.dueDate ? format(new Date(deadline.dueDate), 'PPP') : 'N/A'}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-500 py-4">No upcoming deadlines!</p>
            )}
          </div>
        </div>
      </div>

      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Add New Task</h3>
              <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                  <input
                    required
                    type="date"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newTask.dueDate}
                    onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newTask.priority}
                    onChange={e => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowTaskModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
                <button type="submit" disabled={submittingTask} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                  {submittingTask ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
