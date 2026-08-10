import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import DashboardLayout from './layouts/DashboardLayout.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Notes from './pages/Notes.tsx';
import Assignments from './pages/Assignments.tsx';
import Login from './pages/Login.tsx';
import Home from './pages/Home.tsx';
import Portfolio from './pages/Portfolio.tsx';
import Appointments from './pages/Appointments.tsx';
import Funds from './pages/Funds.tsx';
import ManageAppointments from './pages/admin/ManageAppointments.tsx';
import ManageFunds from './pages/admin/ManageFunds.tsx';
import Playground from './pages/Playground.tsx';
import Feed from './pages/Feed.tsx';
import Deadlines from './pages/Deadlines.tsx';
import Settings from './pages/Settings.tsx';
import SharedLinks from './pages/SharedLinks.tsx';
import Excuses from './pages/Excuses.tsx';
import AdminLayout from './layouts/AdminLayout.tsx';
import AdminDashboard from './pages/admin/AdminDashboard.tsx';
import AdminDeadlines from './pages/admin/AdminDeadlines.tsx';
import AdminStudents from './pages/admin/AdminStudents.tsx';
import AdminExcuses from './pages/admin/AdminExcuses.tsx';
import AdminPasswords from './pages/admin/AdminPasswords.tsx';
import AdminBullyingReports from './pages/admin/AdminBullyingReports.tsx';
import AreaSelection from './pages/AreaSelection.tsx';
import ReportBullying from './pages/ReportBullying.tsx';
import Announcements from './pages/Announcements.tsx';
import LostAndFound from './pages/LostAndFound.tsx';
import ManageAnnouncements from './pages/admin/ManageAnnouncements.tsx';
import ManageLostAndFound from './pages/admin/ManageLostAndFound.tsx';


const ProtectedRouteBase = ({ children }: { children: React.ReactNode }) => {
  const { user, dbUser, loading, isAdmin } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/home" />;
  if (isAdmin) return <Navigate to="/admin" />;
  
  const savedArea = dbUser?.area || localStorage.getItem('userArea');
  if (savedArea) return <Navigate to={`/${savedArea.toLowerCase()}`} />;
  
  return <>{children}</>;
};

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user || !isAdmin) return <Navigate to="/home" />;
  return <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/home" />;
  if (isAdmin) return <Navigate to="/admin" />;
  
  const savedArea = localStorage.getItem('userArea');
  if (!savedArea) return <Navigate to="/select-area" />;
  
  // Ensure the user is in their saved area
  const currentPath = location.pathname;
  if (currentPath !== '/' && !currentPath.startsWith(`/${savedArea.toLowerCase()}`)) {
    return <Navigate to={`/${savedArea.toLowerCase()}`} />;
  }
  
  return <>{children}</>;
};


const RootRedirect = () => {
  const { user, dbUser, loading, isAdmin } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/home" />;
  if (isAdmin) return <Navigate to="/admin" />;
  
  const area = dbUser?.area || localStorage.getItem('userArea');
  if (!area) return <Navigate to="/select-area" />;
  return <Navigate to={`/${area.toLowerCase()}`} />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/select-area" element={ <ProtectedRouteBase><AreaSelection /></ProtectedRouteBase> } />
          <Route path="/" element={<RootRedirect />} />
          <Route
            path="/:area"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="notes" element={<Notes />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="portfolio" element={<Portfolio />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="funds" element={<Funds />} />
            <Route path="playground" element={<Playground />} />
            <Route path="feed" element={<Feed />} />
            <Route path="deadlines" element={<Deadlines />} />
            <Route path="links" element={<SharedLinks />} />
            <Route path="excuses" element={<Excuses />} />
            <Route path="report-bullying" element={<ReportBullying />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="lost-and-found" element={<LostAndFound />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="manage-deadlines" element={<AdminDeadlines />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="manage-appointments" element={<ManageAppointments />} />
            <Route path="manage-funds" element={<ManageFunds />} />
            <Route path="excuses" element={<AdminExcuses />} />
            <Route path="passwords" element={<AdminPasswords />} />
            <Route path="bullying-reports" element={<AdminBullyingReports />} />
            <Route path="manage-announcements" element={<ManageAnnouncements />} />
            <Route path="manage-lost-and-found" element={<ManageLostAndFound />} />
            
            <Route path="notes" element={<Notes />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="playground" element={<Playground />} />
            <Route path="feed" element={<Feed />} />
            <Route path="user-deadlines" element={<Deadlines />} />
            <Route path="links" element={<SharedLinks />} />
            <Route path="user-excuses" element={<Excuses />} />
            <Route path="report-bullying" element={<ReportBullying />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
