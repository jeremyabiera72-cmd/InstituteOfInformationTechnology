const fs = require('fs');

const code = `import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Users, Loader2, Edit3, X, ChevronDown, ChevronUp, Globe, Phone, MapPin, BadgeInfo, Mail, HeartPulse, ShieldAlert } from 'lucide-react';

export default function Portfolio() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    studentIdStr: '',
    facebookUrl: '',
    phoneNumber: '',
    address: '',
    emergencyContact: '',
    secondaryEmergencyContact: '',
    parentName: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, myPortfolioRes] = await Promise.all([
        axios.get('/api/students'),
        axios.get('/api/portfolio')
      ]);
      setStudents(studentsRes.data);
      if (myPortfolioRes.data) {
        const me = studentsRes.data.find((s: any) => s.uid === user?.uid);
        setFormData({
          fullName: me?.fullName || me?.displayName || '',
          studentIdStr: myPortfolioRes.data.studentIdStr || '',
          facebookUrl: myPortfolioRes.data.facebookUrl || '',
          phoneNumber: myPortfolioRes.data.phoneNumber || '',
          address: myPortfolioRes.data.address || '',
          emergencyContact: myPortfolioRes.data.emergencyContact || '',
          secondaryEmergencyContact: myPortfolioRes.data.secondaryEmergencyContact || '',
          parentName: myPortfolioRes.data.parentName || ''
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.put('/api/portfolio', formData);
      setEditing(false);
      fetchData(); // refresh the list
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  const selectedStudent = students.find(s => s.id === expandedId);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Student Directory</h1>
            <p className="text-slate-500">Discover your classmates and connect.</p>
          </div>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
        >
          <Edit3 className="w-4 h-4" /> Update My Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Array.isArray(students) ? students : []).map((student) => {
          return (
            <div key={student.id} 
                 className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 cursor-pointer hover:shadow-md hover:border-indigo-200"
                 onClick={() => setExpandedId(student.id)}>
              
              <div className="h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative">
                <div className="absolute -bottom-8 left-6">
                  <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-sm bg-white flex items-center justify-center overflow-hidden">
                    {student.avatarUrl ? (
                       <img src={student.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-indigo-600">
                        {student.displayName?.charAt(0) || student.fullName?.charAt(0) || student.email?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-10 px-6 pb-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">{student.fullName || student.displayName || student.email?.split('@')[0]}</h2>
                    <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
                       <Mail className="w-3.5 h-3.5" />
                       <span className="truncate max-w-[160px]">{student.email}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl border border-slate-100 shadow-sm bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                  {selectedStudent.avatarUrl ? (
                    <img src={selectedStudent.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-indigo-600">
                      {selectedStudent.displayName?.charAt(0) || selectedStudent.fullName?.charAt(0) || selectedStudent.email?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 leading-tight">{selectedStudent.fullName || selectedStudent.displayName || selectedStudent.email?.split('@')[0]}</h2>
                  <p className="text-sm text-slate-500 mt-1">{selectedStudent.email}</p>
                </div>
              </div>
              <button onClick={() => setExpandedId(null)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-slate-100 max-h-[60vh] overflow-y-auto pr-2">
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <BadgeInfo className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-slate-800 text-[13px] uppercase tracking-wider mb-0.5">Student ID</span>
                  {selectedStudent.portfolio?.studentIdStr || <span className="text-slate-400 italic">Not provided</span>}
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <Globe className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-slate-800 text-[13px] uppercase tracking-wider mb-0.5">Social Profile</span>
                  {selectedStudent.portfolio?.facebookUrl ? (
                    <a href={selectedStudent.portfolio.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium break-all">
                      {selectedStudent.portfolio.facebookUrl}
                    </a>
                  ) : <span className="text-slate-400 italic">Not provided</span>}
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <Phone className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-slate-800 text-[13px] uppercase tracking-wider mb-0.5">Contact</span>
                  {selectedStudent.portfolio?.phoneNumber || <span className="text-slate-400 italic">Not provided</span>}
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-slate-800 text-[13px] uppercase tracking-wider mb-0.5">Location</span>
                  {selectedStudent.portfolio?.address || <span className="text-slate-400 italic">Not provided</span>}
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-sm text-slate-600 mt-4 pt-4 border-t border-slate-100">
                <HeartPulse className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-slate-800 text-[13px] uppercase tracking-wider mb-0.5">Emergency Contact (Primary)</span>
                  {selectedStudent.portfolio?.emergencyContact || <span className="text-slate-400 italic">Not provided</span>}
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-slate-800 text-[13px] uppercase tracking-wider mb-0.5">Emergency Contact (Secondary)</span>
                  {selectedStudent.portfolio?.secondaryEmergencyContact || <span className="text-slate-400 italic">Not provided</span>}
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <Users className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-slate-800 text-[13px] uppercase tracking-wider mb-0.5">Name of Parent / Guardian</span>
                  {selectedStudent.portfolio?.parentName || <span className="text-slate-400 italic">Not provided</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Update Profile</h2>
              <button onClick={() => setEditing(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Student ID</label>
                <input
                  type="text"
                  placeholder="e.g. 2023-XXXXX"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                  value={formData.studentIdStr}
                  onChange={(e) => setFormData({...formData, studentIdStr: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Social URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors font-mono text-sm"
                  value={formData.facebookUrl}
                  onChange={(e) => setFormData({...formData, facebookUrl: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location / Address</label>
                <input
                  type="text"
                  placeholder="City, State, or exact address"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4">
                <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Emergency Contacts</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Primary Emergency Contact No.</label>
                    <input
                      type="text"
                      placeholder="e.g. +1 (555) 123-4567"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-colors"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Secondary Emergency Contact No.</label>
                    <input
                      type="text"
                      placeholder="e.g. +1 (555) 987-6543"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-colors"
                      value={formData.secondaryEmergencyContact}
                      onChange={(e) => setFormData({...formData, secondaryEmergencyContact: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Name of Parent / Guardian</label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                      value={formData.parentName}
                      onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-5 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold flex items-center gap-2 shadow-sm transition-colors"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
`
fs.writeFileSync('src/pages/Portfolio.tsx', code);
