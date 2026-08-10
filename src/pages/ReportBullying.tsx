import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase.ts';
import { useAuth } from '../contexts/AuthContext.tsx';
import { ShieldAlert, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ReportBullying() {
  const { user } = useAuth();
  const [incidentType, setIncidentType] = useState('Verbal');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const [victimName, setVictimName] = useState('');
  const [course, setCourse] = useState('');
  const [section, setSection] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !date) {
      setError('Please provide a description and date of the incident.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const reportsRef = collection(db, 'bullying_reports');
      await addDoc(reportsRef, {
        incidentType,
        description,
        date,
        isAnonymous,
        victimName,
        course,
        section,
        userId: isAnonymous ? null : user?.uid,
        userName: isAnonymous ? 'Anonymous' : user?.displayName || 'Unknown Student',
        userEmail: isAnonymous ? null : user?.email,
        createdAt: serverTimestamp(),
        status: 'pending' // pending, investigating, resolved
      });

      setSuccess(true);
      setIncidentType('Verbal');
      setDescription('');
      setDate('');
      setIsAnonymous(false);
      setVictimName('');
      setCourse('');
      setSection('');
    } catch (err: any) {
      console.error("Error submitting report:", err);
      setError('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center shadow-sm">
          <ShieldAlert className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Report Bullying</h1>
          <p className="text-slate-500 mt-1">Safely and securely report any incidents. You can choose to remain anonymous.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 text-red-700 items-start">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex gap-3 text-emerald-700 items-start">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold">Report Submitted Successfully</p>
            <p className="text-sm mt-1">Thank you for speaking up. The administration has received your report and will review it shortly.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Victim's Name (Optional)</label>
              <input
                type="text"
                value={victimName}
                onChange={(e) => setVictimName(e.target.value)}
                placeholder="Name of the person bullied"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Course</label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. BSIT"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Section</label>
                <input
                  type="text"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="e.g. 3A"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Type of Incident</label>
            <select
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all appearance-none font-medium"
            >
              <option value="Verbal">Verbal Bullying</option>
              <option value="Physical">Physical Bullying</option>
              <option value="Cyberbullying">Cyberbullying</option>
              <option value="Social">Social/Relational Bullying</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Date of Incident</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe what happened in detail..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none font-medium placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="anonymous" className="text-sm font-medium text-slate-700 cursor-pointer">
              Submit this report anonymously
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-4 px-6 rounded-xl text-white font-bold bg-red-600 hover:bg-red-700 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 disabled:opacity-50"
            >
              {loading ? 'Submitting Report...' : 'Submit Report'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
