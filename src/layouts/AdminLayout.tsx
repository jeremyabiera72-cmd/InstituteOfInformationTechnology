import ditLogo from '../assets/images/regenerated_image_1783588651815.png';
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import UserProfileCard from '../components/UserProfileCard.tsx';
import {
  BookOpen, MessageSquare, Link2, Code2,
  LayoutDashboard,
  CalendarCheck,
  Menu,
  X,
  Users,
  CalendarClock,
  Landmark,
  FileSignature,
  KeyRound,
  ArrowLeft,
  ShieldAlert,
  Megaphone,
  Search
} from 'lucide-react';

const navGroups = [
  {
    title: 'Admin specific',
    items: [
      { name: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Manage Announcements', href: '/admin/manage-announcements', icon: Megaphone },
      { name: 'Manage Deadlines', href: '/admin/manage-deadlines', icon: CalendarCheck },
      { name: 'Manage Appointments', href: '/admin/manage-appointments', icon: CalendarClock },
      { name: 'Manage Funds', href: '/admin/manage-funds', icon: Landmark },
      { name: 'Manage Students', href: '/admin/students', icon: Users },
      { name: 'Manage Lost & Found', href: '/admin/manage-lost-and-found', icon: Search },
      { name: 'Manage Excuses', href: '/admin/excuses', icon: FileSignature },
      { name: 'Bullying Reports', href: '/admin/bullying-reports', icon: ShieldAlert },
      { name: 'Area Passwords', href: '/admin/passwords', icon: KeyRound },
    ]
  },
  {
    title: 'User system',
    items: [
      { name: 'Class Notes', href: '/admin/notes', icon: BookOpen },
      { name: 'Assignments', href: '/admin/assignments', icon: CalendarCheck },
      { name: 'Community Feed', href: '/admin/feed', icon: MessageSquare },
      { name: 'Shared Links', href: '/admin/links', icon: Link2 },
      { name: 'Excuse Area', href: '/admin/user-excuses', icon: FileSignature },
      { name: 'Report Bullying', href: '/admin/report-bullying', icon: ShieldAlert },
      { name: 'Upcoming Deadlines', href: '/admin/user-deadlines', icon: CalendarCheck },
      { name: 'Code Playground', href: '/admin/playground', icon: Code2 },
      { name: 'Student Directory', href: '/admin/portfolio', icon: Users },
    ]
  }
];

export default function AdminLayout() {
  const { user, dbUser, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentPage = navGroups.flatMap(g => g.items).find(n => n.href === location.pathname)?.name || 'Admin Area';

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 text-slate-600 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Logo Area */}
        <div className="p-6 flex items-center justify-between lg:justify-start gap-3">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm overflow-hidden">
              <img src={ditLogo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-800 tracking-tight text-xl">AdminHub</h1>
            </div>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-6 px-4 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              <h3 className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 mt-4">{group.title}</h3>
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 transition-all duration-200 group relative rounded-lg ${
                        isActive
                          ? 'text-indigo-600 font-semibold bg-indigo-50/50'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50 font-medium'
                      }`}
                    >
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-r-full" />}
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} strokeWidth={isActive ? 2.5 : 2} />
                      <span className="text-[14px]">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Footer (Sidebar) */}
        <div className="mt-auto p-4 border-t border-slate-100">
          <UserProfileCard
            user={user}
            dbUser={dbUser}
            isAdmin={isAdmin}
            onLogout={logout}
          />
        </div>
      </div>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f8fafc]">
        {/* Top Header */}
        <header className="h-24 bg-[#f8fafc] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 text-slate-400">
              {location.pathname !== '/admin' && (
                <Link to="/admin" className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Back to Dashboard">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              )}
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                {currentPage}
              </h2>
            </div>
          </div>
          <div className="hidden sm:block">
            <UserProfileCard
              user={user}
              dbUser={dbUser}
              isAdmin={isAdmin}
              onLogout={logout}
              variant="compact"
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
