import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase.ts';
import { Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { AlertCircle, Terminal, BookOpen, LayoutDashboard, CheckSquare, Link as LinkIcon, FileText, CalendarClock, Contact, MessageSquare } from 'lucide-react';
import ditLogo from '../assets/images/regenerated_image_1783588651815.png';
import schoolBg from '../assets/images/southern-baptist-college.jpg';

const FEATURES = [
  {
    icon: LayoutDashboard,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    title: "Overview",
    desc: "Displays the main dashboard containing important information and statistics. Used as the homepage after login, allowing students to quickly view XP earned, assignments due, uploaded notes, shared links, community posts, and upcoming deadlines."
  },
  {
    icon: BookOpen,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    title: "Class Notes",
    desc: "A centralized repository for lecture notes, study materials, and learning resources. Used by students to upload, organize, download, and review course notes for different subjects."
  },
  {
    icon: CheckSquare,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    title: "Assignments",
    desc: "Manages coursework, projects, quizzes, and homework submissions. Used to create, submit, track, and monitor assignment deadlines and completion status."
  },
  {
    icon: MessageSquare,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    title: "Community Feed",
    desc: "A social discussion space where students can post updates and interact. Used for announcements, asking programming questions, sharing ideas, and collaborating with classmates."
  },
  {
    icon: LinkIcon,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    title: "Shared Links",
    desc: "Stores useful educational links and online resources. Used to share websites, GitHub repositories, YouTube tutorials, documentation, research papers, and other learning resources."
  },
  {
    icon: FileText,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    title: "Excuse Area",
    desc: "A section where students can submit absence or excuse requests. Used for sending excuse letters or notifying instructors regarding missed classes, assignments, or examinations."
  },
  {
    icon: CalendarClock,
    color: "text-red-400",
    bg: "bg-red-500/10",
    title: "Upcoming Deadlines",
    desc: "Displays upcoming academic schedules and important due dates. Used to help students stay organized by listing assignment deadlines, project due dates, examinations, and events."
  },
  {
    icon: Terminal,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    title: "Code Playground",
    desc: "An interactive programming environment for writing and testing code. Used by students to practice programming, experiment with algorithms, and execute code directly within the system without installing software locally."
  },
  {
    icon: Contact,
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    title: "Student Directory",
    desc: "A searchable list of registered students. Used to find classmates, view basic student profiles, and facilitate communication or collaboration on academic activities."
  }
];

export default function Login() {
  const { login, loginWithEmail, signupWithEmail, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, isAdmin, navigate]);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentName, setStudentName] = useState('');
  const [areaVerified, setAreaVerified] = useState(!!localStorage.getItem('userArea'));
  const [selectedArea, setSelectedArea] = useState<'BSIS' | 'BSCS' | null>(null);
  const [areaPassword, setAreaPassword] = useState('');
  const [verifyingArea, setVerifyingArea] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleVerifyArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArea || !areaPassword) return;

    setVerifyingArea(true);
    setError(null);

    try {
      const docRef = doc(db, 'settings', 'passwords');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data[selectedArea] === areaPassword) {
          localStorage.setItem('userArea', selectedArea);
          setAreaVerified(true);
        } else {
          setError('Incorrect password for ' + selectedArea);
        }
      } else {
        // If not configured, allow access for now or use default
        if (areaPassword === 'admin') {
          localStorage.setItem('userArea', selectedArea);
          setAreaVerified(true);
        } else {
          setError('System not configured by admin yet (Hint: use password admin)');
        }
      }
    } catch (err: any) {
      console.error(err);
      setError('Error verifying password. ' + err.message);
    } finally {
      setVerifyingArea(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await login();
    } catch (err: any) {
      if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completing.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Sign-in popup was blocked by your browser. Please open the app in a new tab using the button in the top right, or allow popups.');
      } else {
        setError(err.message || 'An error occurred during sign in.');
      }
    }
  };

  const handleStudentEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!studentEmail || !studentPassword) {
      setError("Please enter email and password.");
      return;
    }
    if (isSignUp && !studentName) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signupWithEmail(studentEmail, studentPassword, studentName);
      } else {
        await loginWithEmail(studentEmail, studentPassword);
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already in use.");
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError("Invalid email or password.");
      } else {
        setError(err.message || 'An error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      setError(null);
      await loginWithEmail(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans overflow-hidden bg-white">
      {/* LEFT SIDE - BRANDING */}
      <div
        className="hidden md:flex md:w-[45%] lg:w-[50%] md:fixed md:h-screen p-10 md:p-12 lg:p-20 flex-col justify-between relative overflow-hidden"
        style={{
          backgroundImage: `url(${schoolBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Semi-transparent blue overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(52, 53, 229, 0.55) 0%, rgba(20, 20, 120, 0.65) 100%)' }} />
        {/* Subtle decorative lines on top of overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 100 Q 200 300 400 900" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M-50 100 Q 250 300 450 900" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M0 100 Q 300 300 500 900" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M50 100 Q 350 300 550 900" stroke="white" strokeWidth="0.5" fill="none" />
        </svg>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          <div className="mb-12">
            <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white/20 shadow-2xl mx-auto">
              <img src={ditLogo} alt="DIT Logo" className="w-full h-full object-cover" />
            </div>
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
              Welcome to the <br /> DIT System
            </h1>
            <p className="text-white/90 text-lg leading-relaxed max-w-md font-normal mx-auto">
              Your unified platform for Information Technology studies. Access class notes, submit assignments, collaborate with peers, and sharpen your coding skills.
            </p>
          </div>
        </div>

        <div className="relative z-10 text-center">
          <p className="text-white/60 text-sm font-medium">
            © {new Date().getFullYear()} DIT System. All rights reserved.
          </p>
          <p className="text-white/60 text-sm font-medium">
            Developed by Jeremy Abiera(BSCS).
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - CONTENT */}
      <div className="w-full md:w-[55%] lg:w-[50%] md:ml-[45%] lg:ml-[50%] min-h-screen bg-white flex items-center justify-center p-6 md:p-12 relative overflow-y-auto">
        <Link to="/" className="absolute top-8 left-6 md:left-12 text-slate-500 hover:text-slate-900 flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </Link>

        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Welcome Back!</h2>
            <p className="text-slate-500 text-sm md:text-base">Sign in to your account to continue.</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3 text-red-600 text-sm">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <form onSubmit={handleStudentEmailAuth} className="space-y-4">
              {isSignUp && (
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3435E5] focus:border-transparent transition-all"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              )}
              <div>
                <input
                  type="email"
                  placeholder="Student Email"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3435E5] focus:border-transparent transition-all"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3435E5] focus:border-transparent transition-all"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-medium text-white bg-[#3435E5] hover:bg-[#2b2bc2] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3435E5] disabled:opacity-50 mt-2"
              >
                {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-[#3435E5] hover:underline font-medium"
                >
                  {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
                </button>
              </div>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-slate-400 font-medium uppercase tracking-wider">Or continue with</span>
              </div>
            </div>

            <div>
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Login with Google
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-slate-400 font-medium uppercase tracking-wider">Admin Portal</span>
              </div>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Admin Email"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3435E5] focus:border-transparent transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3435E5] focus:border-transparent transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-medium text-white bg-[#1A1A1A] hover:bg-black transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A1A1A] disabled:opacity-50 mt-2"
              >
                {loading ? 'Authenticating...' : 'Login Now'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}