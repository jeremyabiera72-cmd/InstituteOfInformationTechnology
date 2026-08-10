const fs = require('fs');
let code = fs.readFileSync('src/pages/Login.tsx', 'utf8');

const targetReturnStart = `  return (
    <div className="min-h-screen bg-slate-950 font-sans flex items-center justify-center p-4 relative">`;

const targetReturnEnd = `    </div>
  );
}`;

const splitIndexStart = code.indexOf(targetReturnStart);
const splitIndexEnd = code.lastIndexOf(targetReturnEnd) + targetReturnEnd.length;

if (splitIndexStart !== -1 && splitIndexEnd !== -1) {
  const newReturn = `  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans overflow-hidden bg-white">
      {/* LEFT SIDE - BRANDING */}
      <div className="hidden md:flex md:w-[45%] lg:w-[50%] md:fixed md:h-screen bg-[#3435E5] p-10 md:p-12 lg:p-20 flex-col justify-between relative overflow-hidden">
        {/* Background decorative lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 100 Q 200 300 400 900" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M-50 100 Q 250 300 450 900" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M0 100 Q 300 300 500 900" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M50 100 Q 350 300 550 900" stroke="white" strokeWidth="0.5" fill="none" />
        </svg>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          <div className="mb-12">
            <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white/20 shadow-2xl mx-auto">
               <img src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=512&q=80" alt="DIT Logo" className="w-full h-full object-cover" />
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
            <div>
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
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
}`;

  code = code.substring(0, splitIndexStart) + newReturn;
  fs.writeFileSync('src/pages/Login.tsx', code);
} else {
  console.log("Could not find return statement in Login.tsx");
}
