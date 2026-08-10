import React, { useState, useEffect } from 'react';
import { Users, CalendarCheck, BookOpen, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase.ts';
import { ShieldAlert } from 'lucide-react';


export default function AdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    deadlines: 0,
    notes: 0,
    excuses: 0,
    bullyingReports: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/admin/stats');
        
        let bullyingCount = 0;
        try {
          const q = query(collection(db, 'bullying_reports'), where('status', '==', 'pending'));
          const snapshot = await getDocs(q);
          bullyingCount = snapshot.size;
        } catch(e) {
          console.error("Firebase error", e);
        }

        setStats({...res.data, bullyingReports: bullyingCount});
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Admin Overview</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Students</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.students}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-rose-50 flex items-center justify-center">
              <CalendarCheck className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Deadlines</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.deadlines}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Class Notes</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.notes}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Excuses</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.excuses}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <p className="text-slate-500 text-sm">System operational. Real-time data from Firestore connected.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
