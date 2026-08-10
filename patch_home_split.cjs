const fs = require('fs');

const code = `import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  CheckSquare, 
  MessageSquare, 
  FileText, 
  CalendarClock, 
  Terminal,
  Asterisk
} from 'lucide-react';

const FEATURES = [
  { icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50", title: "Class Notes", desc: "Centralized repository for lecture materials." },
  { icon: CheckSquare, color: "text-emerald-600", bg: "bg-emerald-50", title: "Assignments", desc: "Manage coursework and submissions." },
  { icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50", title: "Community Feed", desc: "Social discussion space for students." },
  { icon: Terminal, color: "text-teal-600", bg: "bg-teal-50", title: "Code Playground", desc: "Interactive environment for coding." },
  { icon: CalendarClock, color: "text-rose-600", bg: "bg-rose-50", title: "Deadlines", desc: "Track upcoming academic schedules." },
  { icon: FileText, color: "text-orange-600", bg: "bg-orange-50", title: "Excuse Area", desc: "Submit absence or excuse requests." },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans selection:bg-[#3435E5]/30 overflow-hidden bg-white">
      {/* LEFT SIDE - BRANDING */}
      <div className="w-full md:w-[45%] lg:w-[50%] md:fixed md:h-screen bg-[#3435E5] p-10 md:p-12 lg:p-20 flex flex-col justify-between relative overflow-hidden">
        {/* Background decorative lines - inspired by the image */}
        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 100 Q 200 300 400 900" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M-50 100 Q 250 300 450 900" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M0 100 Q 300 300 500 900" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M50 100 Q 350 300 550 900" stroke="white" strokeWidth="0.5" fill="none" />
        </svg>

        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-16 md:mb-24"
          >
            <Asterisk className="w-16 h-16 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
              Hello <br /> SystemHub! <motion.span 
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 1 }}
                className="inline-block origin-bottom-right"
              >
                👋
              </motion.span>
            </h1>
            <p className="text-white/90 text-lg leading-relaxed max-w-md font-normal">
              Your unified platform for Computer Science studies. Access class notes, submit assignments, collaborate with peers, and sharpen your coding skills.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative z-10 mt-16 md:mt-0"
        >
          <p className="text-white/60 text-sm font-medium">
            © {new Date().getFullYear()} SystemHub. All rights reserved.
          </p>
        </motion.div>
      </div>

      {/* RIGHT SIDE - CONTENT */}
      <div className="w-full md:w-[55%] lg:w-[50%] md:ml-[45%] lg:ml-[50%] min-h-screen bg-white flex flex-col relative overflow-y-auto">
        <div className="p-8 md:p-12 lg:p-20 flex-grow flex flex-col justify-center max-w-2xl mx-auto w-full">
          {/* Top Brand */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between mb-16 md:mb-12"
          >
            <span className="font-bold text-slate-900 text-2xl tracking-tight">SystemHub</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Welcome to your dashboard!</h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              Don't have an account? <Link to="/login" className="text-indigo-600 font-medium hover:underline">Create a new account now</Link>, it's FREE! Explore the tools below.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10"
          >
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  className="p-4 rounded-xl border border-slate-100 hover:border-slate-300 transition-all group bg-white"
                >
                  <div className={\`w-8 h-8 rounded-lg \${feature.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform\`}>
                    <Icon className={\`w-4 h-4 \${feature.color}\`} />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">{feature.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-3 mt-auto md:mt-0 pt-6"
          >
            <Link to="/login" className="w-full flex items-center justify-center py-3.5 rounded-lg bg-[#1A1A1A] hover:bg-black text-white font-medium text-sm transition-all shadow-sm">
              Login Now
            </Link>
            <Link to="/login" className="w-full flex items-center justify-center py-3.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-sm transition-all gap-2 shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Login with Google
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/pages/Home.tsx', code);
