import React, { useState, useEffect } from 'react';
import { KeyRound, Save, Eye, EyeOff, Copy, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase.ts';
import axios from 'axios';

export default function AdminPasswords() {
  const [passwords, setPasswords] = useState({ BSIS: '', BSCS: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showBSIS, setShowBSIS] = useState(false);
  const [showBSCS, setShowBSCS] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fetchPasswords = async () => {
    setLoading(true);
    try {
      // Primary: Firestore (persists across restarts)
      const docSnap = await getDoc(doc(db, 'settings', 'passwords'));
      if (docSnap.exists()) {
        const data = docSnap.data() as { BSIS?: string; BSCS?: string };
        setPasswords({
          BSIS: data.BSIS || '',
          BSCS: data.BSCS || '',
        });
        setLoading(false);

        // Also sync to server memory (no auth required - just a local sync)
        try {
          await axios.post('/api/passwords/sync', { BSIS: data.BSIS, BSCS: data.BSCS });
        } catch (_) { /* silent */ }
        return;
      }
    } catch (err) {
      console.warn('Firestore fetch failed, trying backend:', err);
    }

    // Fallback: Express backend memory
    try {
      const apiRes = await axios.get('/api/admin/passwords');
      if (apiRes.data) {
        setPasswords({ BSIS: apiRes.data.BSIS || '', BSCS: apiRes.data.BSCS || '' });
      }
    } catch (err) {
      console.error('Backend API fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.BSIS.trim() || !passwords.BSCS.trim()) {
      setMessage({ text: 'Both passwords are required.', type: 'error' });
      return;
    }
    setSaving(true);
    setMessage({ text: '', type: '' });

    let firestoreOk = false;
    let apiOk = false;

    // 1. Save to Firestore (primary storage - survives restarts)
    try {
      await setDoc(doc(db, 'settings', 'passwords'), {
        BSIS: passwords.BSIS,
        BSCS: passwords.BSCS,
        updatedAt: new Date().toISOString(),
      });
      firestoreOk = true;
    } catch (err) {
      console.error('Firestore save error:', err);
    }

    // 2. Also sync to server memory (for immediate use)
    try {
      await axios.post('/api/admin/passwords', passwords);
      apiOk = true;
    } catch (err) {
      console.warn('Backend API sync failed:', err);
    }

    if (firestoreOk) {
      setMessage({ text: '✅ Area passwords saved successfully! Students will need to use the new passwords.', type: 'success' });
    } else if (apiOk) {
      setMessage({ text: '⚠️ Saved to server memory only (Firestore unavailable). Will reset on server restart.', type: 'warning' });
    } else {
      setMessage({ text: '❌ Failed to save passwords. Check your connection.', type: 'error' });
    }
    setSaving(false);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <KeyRound className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Area Passwords</h1>
          <p className="text-sm text-slate-500">Set access codes for BSIS and BSCS programs</p>
        </div>
        <button
          onClick={fetchPasswords}
          type="button"
          className="ml-auto p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>📋 How it works:</strong> Set a password for each area. When new students log in, they will be asked for the password for their area (BSIS or BSCS) before accessing the system. Share these passwords only with students in the respective programs.
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">

        {message.text && (
          <div className={`p-4 rounded-xl text-sm font-medium ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
            message.type === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
            'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="py-8 text-center text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading current passwords...
          </div>
        ) : (
          <>
            <div className="space-y-5">
              {/* BSIS Password */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  BSIS Program Password
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showBSIS ? 'text' : 'password'}
                      required
                      value={passwords.BSIS}
                      onChange={(e) => setPasswords({ ...passwords, BSIS: e.target.value })}
                      className="w-full px-4 py-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                      placeholder="Enter BSIS password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowBSIS(!showBSIS)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showBSIS ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwords.BSIS && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(passwords.BSIS, 'BSIS')}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
                      title="Copy to clipboard"
                    >
                      {copiedField === 'BSIS' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      {copiedField === 'BSIS' ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
              </div>

              {/* BSCS Password */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  BSCS Program Password
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showBSCS ? 'text' : 'password'}
                      required
                      value={passwords.BSCS}
                      onChange={(e) => setPasswords({ ...passwords, BSCS: e.target.value })}
                      className="w-full px-4 py-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                      placeholder="Enter BSCS password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowBSCS(!showBSCS)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showBSCS ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwords.BSCS && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(passwords.BSCS, 'BSCS')}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
                      title="Copy to clipboard"
                    >
                      {copiedField === 'BSCS' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      {copiedField === 'BSCS' ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-semibold transition-colors shadow-md"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Area Passwords'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
