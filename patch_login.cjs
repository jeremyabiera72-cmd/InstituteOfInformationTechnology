const fs = require('fs');
let code = fs.readFileSync('src/pages/Login.tsx', 'utf8');

// We need to add state for the new mode: login vs signup, plus states for the new inputs.
// Find:
const targetState = `  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);`;

const replacementState = `  const [password, setPassword] = useState('');
  
  // Student email/pass state
  const [isSignUp, setIsSignUp] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentName, setStudentName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);`;

code = code.replace(targetState, replacementState);

// Replace hook destruction
const targetDestruct = `const { login, loginWithEmail } = useAuth();`;
const replacementDestruct = `const { login, loginWithEmail, signupWithEmail } = useAuth();`;
code = code.replace(targetDestruct, replacementDestruct);

// Add handler for student auth
const targetHandlers = `  const handleAdminLogin = async (e: React.FormEvent) => {`;
const replacementHandlers = `  const handleStudentEmailAuth = async (e: React.FormEvent) => {
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

  const handleAdminLogin = async (e: React.FormEvent) => {`;
code = code.replace(targetHandlers, replacementHandlers);

// Replace the UI inside <div className="space-y-6">
const targetUI = `          <div className="space-y-6">
            <div>
              <button
                onClick={handleGoogleLogin}`;

const replacementUI = `          <div className="space-y-6">
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
                onClick={handleGoogleLogin}`;

code = code.replace(targetUI, replacementUI);

fs.writeFileSync('src/pages/Login.tsx', code);
