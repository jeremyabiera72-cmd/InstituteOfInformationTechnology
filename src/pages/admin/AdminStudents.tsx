import React, { useState, useEffect } from 'react';
import { Users, Search, Ban, CheckCircle, Trash2, Edit3, X, Save, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Student {
  id: number;
  uid: string;
  email: string;
  fullName?: string;
  area?: string;
  status?: string;
  createdAt?: string;
  role?: string;
  portfolio?: {
    bio?: string;
    studentIdStr?: string;
    phoneNumber?: string;
  };
}

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState({ fullName: '', area: '', status: '' });
  const [saving, setSaving] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('/api/admin/students');
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const toggleStatus = async (id: number, currentStatus: string | undefined) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      await axios.patch(`/api/users/${id}/status`, { status: newStatus });
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteStudent = async (id: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this student? This cannot be undone.')) return;
    try {
      await axios.delete(`/api/users/${id}`);
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert('Failed to delete student. Please try again.');
    }
  };

  const openEdit = (student: Student) => {
    setEditingStudent(student);
    setEditForm({
      fullName: student.fullName || '',
      area: student.area || '',
      status: student.status || 'active',
    });
  };

  const saveEdit = async () => {
    if (!editingStudent) return;
    setSaving(true);
    try {
      await axios.put(`/api/admin/students/${editingStudent.id}`, editForm);
      setEditingStudent(null);
      await fetchStudents();
    } catch (err) {
      console.error(err);
      alert('Failed to update student info.');
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(s =>
    (s.email || '').toLowerCase().includes(search.toLowerCase()) ||
    ((s.fullName || '')).toLowerCase().includes(search.toLowerCase()) ||
    ((s.area || '')).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Students</h1>
          <p className="text-sm text-slate-500 mt-0.5">{filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found</p>
        </div>

        <div className="relative w-full sm:w-auto">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email or area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors shadow-sm text-sm"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Area</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-400">
                    No students found.
                  </td>
                </tr>
              ) : filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                        {(student.fullName || student.email || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{student.fullName || 'Unnamed Student'}</p>
                        <p className="text-xs text-slate-500">{student.email}</p>
                        {student.portfolio?.studentIdStr && (
                          <p className="text-xs text-indigo-500 font-medium">ID: {student.portfolio.studentIdStr}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                      {student.area || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {student.status === 'suspended' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-600 border border-rose-100">
                        <Ban className="w-3.5 h-3.5" />
                        Suspended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(student)}
                        className="p-2 rounded-lg text-indigo-500 hover:bg-indigo-50 transition-colors"
                        title="Edit Student Info"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleStatus(student.id, student.status)}
                        className={`p-2 rounded-lg transition-colors ${
                          student.status === 'suspended'
                          ? 'text-emerald-500 hover:bg-emerald-50'
                          : 'text-orange-500 hover:bg-orange-50'
                        }`}
                        title={student.status === 'suspended' ? 'Activate Student' : 'Suspend Student'}
                      >
                        {student.status === 'suspended' ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteStudent(student.id)}
                        className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Delete Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <Edit3 className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Edit Student Info</h2>
                  <p className="text-xs text-slate-500">{editingStudent.email}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="p-2 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  placeholder="Student full name"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Area / Program</label>
                <select
                  value={editForm.area}
                  onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                >
                  <option value="">Select Area</option>
                  <option value="BSIS">BSIS</option>
                  <option value="BSCS">BSCS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="px-6 pb-6 flex justify-end gap-3">
              <button
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors shadow-md"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
