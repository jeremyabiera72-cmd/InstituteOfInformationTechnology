import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.tsx';
import { FileSignature, Plus, Loader2, Trash2, Printer, X, Download, Paperclip, CheckCircle } from 'lucide-react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import SignatureCanvas from 'react-signature-canvas';
import * as htmlToImage from 'html-to-image';

export default function Excuses() {
  const { user } = useAuth();
  const [excuses, setExcuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{type: 'delete' | 'done' | 'print', id: number} | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    reason: 'Sickness',
    details: '',
    studentName: '',
    parentName: '',
    proofUrl: ''
  });

  const studentSigRef = useRef<SignatureCanvas>(null);
  const parentSigRef = useRef<SignatureCanvas>(null);

  useEffect(() => {
    fetchExcuses();
  }, []);

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProof(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setFormData({ ...formData, proofUrl: dataUrl });
        setUploadingProof(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      alert('Failed to read file');
      setUploadingProof(false);
    };
    reader.readAsDataURL(file);
  };

  
  const handleDownloadImage = async (id: number, studentName: string) => {
    const element = document.getElementById(`excuse-letter-${id}`);
    if (element) {
      try {
        const dataUrl = await htmlToImage.toPng(element, { backgroundColor: '#ffffff', pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `Excuse_Letter_${studentName.replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error generating image', error);
      }
    }
  };
const fetchExcuses = async () => {
    try {
      const res = await axios.get('/api/excuses');
      setExcuses(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (studentSigRef.current?.isEmpty() || parentSigRef.current?.isEmpty()) {
      alert("Both student and parent signatures are required.");
      return;
    }
    
    setSubmitting(true);
    try {
      const studentSignature = studentSigRef.current?.getCanvas().toDataURL('image/png');
      const parentSignature = parentSigRef.current?.getCanvas().toDataURL('image/png');
      
      const payload = {
        ...formData,
        studentSignature,
        parentSignature
      };
      
      const res = await axios.post('/api/excuses', payload);
      setExcuses([res.data, ...excuses]);
      setIsAdding(false);
      setFormData({ name: '', course: '', reason: 'Sickness', details: '', studentName: '', parentName: '', proofUrl: '' });
      studentSigRef.current?.clear();
      parentSigRef.current?.clear();
    } catch (error) {
      console.error(error);
      alert('Failed to submit excuse letter');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/excuses/${id}`);
      setExcuses((Array.isArray(excuses) ? excuses : []).filter(e => e.id !== id));
      setConfirmAction(null);
    } catch (error) {
      console.error(error);
      alert('Error deleting excuse letter');
    }
  };

  const handleMarkDone = async (id: number) => {
    try {
      const res = await axios.patch(`/api/excuses/${id}/status`, { status: 'done' });
      setExcuses((Array.isArray(excuses) ? excuses : []).map(e => e.id === id ? { ...e, status: 'done' } : e));
      setConfirmAction(null);
    } catch (error) {
      console.error(error);
      alert('Error marking as done');
    }
  };

  const handlePrint = () => {
    window.print();
    setConfirmAction(null);
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'delete') {
      handleDelete(confirmAction.id);
    } else if (confirmAction.type === 'done') {
      handleMarkDone(confirmAction.id);
    } else if (confirmAction.type === 'print') {
      handlePrint();
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg shadow-sm border border-indigo-200">
            <FileSignature className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Excuse Area</h1>
            <p className="text-slate-500">Generate and manage official student excuse letters.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors shadow-sm"
        >
          {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Excuse</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 animate-in fade-in slide-in-from-top-4">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-xl text-slate-800">New Excuse Letter</h3>
              <p className="text-sm text-slate-500">Fill out the details below and sign.</p>
            </div>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Student Name</label>
                <input 
                  type="text" required
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g. John Doe" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Course / Section</label>
                <input 
                  type="text" required
                  value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} 
                  placeholder="e.g. BSCS-3A" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Reason for Absence</label>
                <select 
                  value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
                >
                  <option value="Sickness">Sickness</option>
                  <option value="Family Emergency">Family Emergency</option>
                  <option value="Medical Appointment">Medical Appointment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Details / Explanation</label>
                <textarea 
                  required
                  value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} 
                  placeholder="Please provide additional details about the absence..." 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors resize-y" 
                  rows={3} 
                />
              </div>
            </div>

            <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Attach Proof (Medical Certificate, etc.)</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors shadow-sm font-medium text-sm">
                    {uploadingProof ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                    {uploadingProof ? 'Uploading...' : 'Choose File (Image)'}
                    <input type="file" className="hidden" accept="image/*" onChange={handleProofUpload} />
                  </label>
                  {formData.proofUrl && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                      <Download className="w-4 h-4" /> Proof attached successfully
                    </div>
                  )}
                </div>
              </div>
{/* Signatures Area */}
            <div className="pt-8 border-t border-slate-100">
              <h4 className="font-bold text-lg text-slate-800 mb-4">Signatures Required</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Student Signature */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Student's Printed Name</label>
                    <input 
                      type="text" required
                      value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} 
                      placeholder="Student's Name" 
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Student Signature</label>
                    <div className="border border-slate-300 rounded-lg bg-white overflow-hidden shadow-inner">
                      <SignatureCanvas 
                        ref={studentSigRef} 
                        penColor="black"
                        canvasProps={{className: "w-full h-40"}} 
                      />
                    </div>
                    <div className="flex justify-end mt-1">
                      <button type="button" onClick={() => studentSigRef.current?.clear()} className="text-xs text-indigo-600 hover:underline">Clear Signature</button>
                    </div>
                  </div>
                </div>

                {/* Parent Signature */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Parent/Guardian's Printed Name</label>
                    <input 
                      type="text" required
                      value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} 
                      placeholder="Parent's Name" 
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Parent Signature</label>
                    <div className="border border-slate-300 rounded-lg bg-white overflow-hidden shadow-inner">
                      <SignatureCanvas 
                        ref={parentSigRef} 
                        penColor="black"
                        canvasProps={{className: "w-full h-40"}} 
                      />
                    </div>
                    <div className="flex justify-end mt-1">
                      <button type="button" onClick={() => parentSigRef.current?.clear()} className="text-xs text-indigo-600 hover:underline">Clear Signature</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button 
                type="submit" 
                disabled={submitting}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow-sm transition-colors flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Generate Excuse Letter
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Generated Excuse Letters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {excuses.length === 0 && !isAdding ? (
          <div className="col-span-full text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <FileSignature className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-800 font-medium text-lg">No excuse letters found</p>
            <p className="text-slate-500 mt-1">Generate your first official excuse letter here.</p>
          </div>
        ) : (
          (Array.isArray(excuses) ? excuses : []).map(excuse => (
            <div key={excuse.id} className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col group overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-600">
                  <FileSignature className="w-5 h-5 text-indigo-500" />
                  <span className="font-semibold text-sm">Official Excuse Letter</span>
                </div>
                <div className="flex gap-2 items-center">
                  {excuse.status === 'done' ? (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Done
                    </span>
                  ) : (
                    <button onClick={() => setConfirmAction({ type: 'done', id: excuse.id })} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Mark as Done">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleDownloadImage(excuse.id, excuse.name)} className="flex items-center gap-2 p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors font-medium text-sm" title="Download Letter as Image">
                    <Download className="w-4 h-4" /> Download
                  </button>
                  {excuse.proofUrl && (
                    <a href={excuse.proofUrl} download="proof-file" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center" title="Download Proof File">
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                  <button onClick={() => setConfirmAction({ type: 'delete', id: excuse.id })} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div id={`excuse-letter-${excuse.id}`} className="p-8 pb-10 flex-1 font-serif text-slate-800 bg-white" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e2e8f0 31px, #e2e8f0 32px)', lineHeight: '32px' }}>
                <div className="text-right mb-6 text-sm">
                  Date: {format(new Date(excuse.createdAt), 'MMMM d, yyyy')}
                </div>
                <h2 className="text-xl font-bold text-center mb-8 uppercase tracking-widest border-b-2 border-slate-800 pb-2 inline-block mx-auto">Excuse Letter</h2>
                
                <div className="mb-6">
                  <p>To Whom It May Concern,</p>
                </div>
                
                <div className="mb-8">
                  <p className="text-justify">
                    Please excuse <strong>{excuse.name}</strong>, a student in course/section <strong>{excuse.course}</strong>, for being absent. 
                    The reason for the absence is <strong>{excuse.reason}</strong>.
                  </p>
                  <p className="text-justify mt-4">
                    Additional details: <em>{excuse.details}</em>
                  </p>
                </div>

                {excuse.proofUrl && (
                  <div className="mt-8">
                    <p className="font-bold mb-2">Attached Proof:</p>
                    <img src={excuse.proofUrl} alt="Proof" className="max-w-full h-auto rounded-lg border border-slate-200 shadow-sm max-h-64 object-contain" />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-8 mt-16 pt-8">
                  <div className="text-center flex flex-col items-center">
                    <div className="h-16 flex items-end justify-center mb-2 w-full border-b border-slate-400 relative">
                      {excuse.studentSignature && <img src={excuse.studentSignature} alt="Student Signature" className="h-20 absolute bottom-0 object-contain" />}
                    </div>
                    <span className="font-bold">{excuse.studentName}</span>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Student</span>
                  </div>
                  <div className="text-center flex flex-col items-center">
                    <div className="h-16 flex items-end justify-center mb-2 w-full border-b border-slate-400 relative">
                      {excuse.parentSignature && <img src={excuse.parentSignature} alt="Parent Signature" className="h-20 absolute bottom-0 object-contain" />}
                    </div>
                    <span className="font-bold">{excuse.parentName}</span>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Parent / Guardian</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl relative overflow-hidden">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              {confirmAction.type === 'delete' ? 'Delete Excuse Letter?' 
                : confirmAction.type === 'print' ? 'Print Excuse Letter?' 
                : 'Mark as Done?'}
            </h3>
            <p className="text-slate-600 mb-6 text-sm">
              {confirmAction.type === 'delete' ? 'This action cannot be undone. Are you sure you want to permanently delete this letter?' 
                : confirmAction.type === 'print' ? 'Are you sure you want to print this letter?' 
                : 'Are you sure you want to mark this letter as done?'}
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
                className={`px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors ${
                  confirmAction.type === 'delete' ? 'bg-rose-500 hover:bg-rose-600'
                  : confirmAction.type === 'print' ? 'bg-indigo-500 hover:bg-indigo-600'
                  : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                {confirmAction.type === 'delete' ? 'Delete' 
                  : confirmAction.type === 'print' ? 'Print' 
                  : 'Mark Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}