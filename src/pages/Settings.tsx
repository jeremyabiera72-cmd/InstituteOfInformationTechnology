import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  AlertTriangle,
  Mail,
  Shield,
  GraduationCap,
  MapPin,
  Calendar,
  Sparkles,
  User as UserIcon
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.tsx';

function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.charAt(0).toUpperCase();
  }
  return email?.charAt(0).toUpperCase() || 'U';
}

export default function Settings() {
  const { logout, user, dbUser, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayName = dbUser?.fullName || user?.displayName || user?.email?.split('@')[0] || 'User';
  const email = user?.email || dbUser?.email || '';
  const avatarSrc = dbUser?.avatarUrl || user?.photoURL;
  const initials = getInitials(displayName, email);
  const memberSince = dbUser?.createdAt
    ? new Date(dbUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete('/api/users/me');
      if (user) {
        await user.delete();
      }
      await logout();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        setError('Please log out and log back in before deleting your account to verify your identity.');
      } else {
        setError('Failed to delete account. You may need to sign in again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center shadow-sm border border-indigo-100">
          <SettingsIcon className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 mt-1">View your profile and manage account preferences.</p>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHNhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclSpaceT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDMwaDMwTTEzIDBoMzBNMzAgMzBoMzBNNDUgMTNoMzBNNDUgNDVoMzBNNDUgMTNoMzBNNDUgNDVoMzAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA4KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')] opacity-60" />
        </div>

        <div className="px-6 sm:px-8 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-12 relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-[3px] shadow-xl shadow-indigo-500/25 shrink-0">
              <div className="w-full h-full rounded-[13px] bg-white flex items-center justify-center overflow-hidden">
                {avatarSrc ? (
                  <img src={avatarSrc} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-indigo-600">{initials}</span>
                )}
              </div>
            </div>
            <div className="flex-1 pb-1">
              <h2 className="text-2xl font-bold text-slate-900">{displayName}</h2>
              <p className="text-slate-500 flex items-center gap-1.5 mt-1">
                <Mail className="w-4 h-4" />
                {email}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  isAdmin
                    ? 'bg-violet-100 text-violet-700 border border-violet-200'
                    : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                }`}>
                  {isAdmin ? <Shield className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
                  {isAdmin ? 'Administrator' : 'Student'}
                </span>
                {dbUser?.area && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-600 border border-slate-200">
                    <MapPin className="w-3.5 h-3.5" />
                    {dbUser.area}
                  </span>
                )}
                {memberSince && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-500 border border-slate-200">
                    <Calendar className="w-3.5 h-3.5" />
                    Member since {memberSince}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                <UserIcon className="w-3.5 h-3.5" /> Display Name
              </div>
              <p className="text-sm font-bold text-slate-800">{displayName}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </div>
              <p className="text-sm font-bold text-slate-800 truncate">{email}</p>
            </div>
            {!isAdmin && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100">
                <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> Experience Points
                </div>
                <p className="text-2xl font-bold text-indigo-700">{dbUser?.xp ?? 0} <span className="text-sm font-semibold">XP</span></p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
          Danger Zone
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="border border-rose-100 bg-rose-50/50 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Delete Account</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-lg">
              Once you delete your account, there is no going back. Please be certain.
              This will permanently delete your profile, posts, files, and all associated data.
            </p>
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={loading}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm shrink-0 disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete My Account'}
          </button>
        </div>
      </div>
    </div>
  );
}
