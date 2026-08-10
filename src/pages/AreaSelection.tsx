import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { db } from '../lib/firebase.ts';
import axios from 'axios';

export default function AreaSelection() {
  const [selectedArea, setSelectedArea] = useState<'BSIS' | 'BSCS' | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout, token, user } = useAuth();

  const handleBack = async () => {
    await logout();
    navigate('/login');
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArea || !password) return;
    
    setLoading(true);
    setError('');
    
    try {
      let isValid = false;

      // 1. Try Express API verification
      try {
        const apiRes = await axios.post('/api/passwords/verify', { area: selectedArea, password });
        if (apiRes.data && apiRes.data.valid) {
          isValid = true;
        }
      } catch (err) {
        console.warn('API password verification check failed, checking Firestore fallback:', err);
      }

      // 2. Fallback to Firestore check
      if (!isValid) {
        try {
          const docRef = doc(db, 'settings', 'passwords');
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data[selectedArea] && data[selectedArea] === password) {
              isValid = true;
            } else if (!data[selectedArea] && password === 'admin') {
              isValid = true;
            }
          } else {
            if (password === 'admin') {
              isValid = true;
            }
          }
        } catch (fsErr) {
          console.warn('Firestore fallback check failed:', fsErr);
        }
      }

      if (isValid) {
        localStorage.setItem('userArea', selectedArea);

        // Sync to backend DB
        if (token) {
          try {
            await axios.put('/api/users/area', { area: selectedArea }, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } catch (e) {
            console.error('Failed to sync area to API:', e);
          }
        }

        // Sync to Firebase Firestore user document
        if (user) {
          try {
            await setDoc(doc(db, 'users', user.uid), { area: selectedArea, updatedAt: new Date().toISOString() }, { merge: true });
          } catch (e) {
            console.error('Failed to sync area to Firestore:', e);
          }
        }

        navigate('/');
      } else {
        setError(`Incorrect access password for ${selectedArea}. Please ask your administrator for the current access code.`);
      }
    } catch (err) {
      console.error(err);
      setError('Error verifying password. ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8 relative">
          <button 
            type="button"
            onClick={handleBack}
            className="absolute top-6 left-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Back to Login"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
            <Lock className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">Select Area</h1>
          <p className="text-slate-500 text-sm mb-8 text-center">Choose your program and enter the access code provided by the administrator.</p>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">Program Area</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedArea('BSIS')}
                  className={`py-3 px-4 rounded-xl font-medium transition-all ${
                    selectedArea === 'BSIS'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  BSIS
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedArea('BSCS')}
                  className={`py-3 px-4 rounded-xl font-medium transition-all ${
                    selectedArea === 'BSCS'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  BSCS
                </button>
              </div>
            </div>

            {selectedArea && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="text-sm font-semibold text-slate-700">Access Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder={`Enter ${selectedArea} password`}
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-rose-50 text-rose-600 rounded-lg text-sm border border-rose-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedArea || !password || loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Verifying...' : 'Access System'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
