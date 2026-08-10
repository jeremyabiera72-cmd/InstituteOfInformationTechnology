import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Settings, Shield, GraduationCap, Sparkles } from 'lucide-react';
import type { User } from 'firebase/auth';

interface UserProfileCardProps {
  user: User | null;
  dbUser?: {
    fullName?: string | null;
    email?: string;
    role?: string;
    xp?: number;
    area?: string | null;
    avatarUrl?: string | null;
    createdAt?: string;
  } | null;
  isAdmin?: boolean;
  onLogout: () => void;
  settingsHref?: string;
  variant?: 'sidebar' | 'compact';
}

function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.charAt(0).toUpperCase();
  }
  return email?.charAt(0).toUpperCase() || 'U';
}

function getDisplayName(user: User | null, dbUser?: UserProfileCardProps['dbUser']) {
  return dbUser?.fullName || user?.displayName || user?.email?.split('@')[0] || 'User';
}

export default function UserProfileCard({
  user,
  dbUser,
  isAdmin = false,
  onLogout,
  settingsHref,
  variant = 'sidebar',
}: UserProfileCardProps) {
  const displayName = getDisplayName(user, dbUser);
  const email = user?.email || dbUser?.email || '';
  const avatarSrc = dbUser?.avatarUrl || user?.photoURL;
  const initials = getInitials(displayName, email);
  const role = isAdmin ? 'Administrator' : 'Student';
  const xp = dbUser?.xp ?? 0;

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 p-[2px] shadow-md">
            <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center overflow-hidden">
              {avatarSrc ? (
                <img src={avatarSrc} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-indigo-600">{initials}</span>
              )}
            </div>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{displayName}</p>
          <p className="text-xs text-slate-500 truncate">{role}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 p-[2px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center overflow-hidden">
              {avatarSrc ? (
                <img src={avatarSrc} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-bold text-indigo-600">{initials}</span>
              )}
            </div>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" title="Online" />
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-sm font-bold text-slate-900 truncate leading-tight">{displayName}</p>
          <p className="text-xs text-slate-500 truncate mt-0.5">{email}</p>
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
              isAdmin
                ? 'bg-violet-100 text-violet-700 border border-violet-200'
                : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
            }`}>
              {isAdmin ? <Shield className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
              {role}
            </span>
            {!isAdmin && dbUser?.area && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600 border border-slate-200">
                {dbUser.area}
              </span>
            )}
          </div>
        </div>
      </div>

      {!isAdmin && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Experience
            </span>
            <span className="font-bold text-indigo-600">{xp} XP</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, (xp % 100) || (xp > 0 ? 15 : 0))}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        {settingsHref && (
          <Link
            to={settingsHref}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
          >
            <Settings className="w-3.5 h-3.5" />
            Settings
          </Link>
        )}
        <button
          onClick={onLogout}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100 transition-all ${settingsHref ? '' : 'flex-1'}`}
          title="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
          {settingsHref ? '' : 'Sign Out'}
        </button>
      </div>
    </div>
  );
}
