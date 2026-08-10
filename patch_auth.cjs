const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

const oldInterface = `interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
  isAdmin: boolean;
}`;

const newInterface = `interface AuthContextType {
  user: User | null;
  dbUser: any | null;
  loading: boolean;
  login: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
  isAdmin: boolean;
}`;

code = code.replace(oldInterface, newInterface);

const oldProvider = `  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);`;

const newProvider = `  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);`;

code = code.replace(oldProvider, newProvider);

const oldSync = `        // Sync user to backend
        try {
          await axios.post('/api/users/sync');
        } catch (error) {
          console.error("Failed to sync user:", error);
        }
      } else {
        setToken(null);
        delete axios.defaults.headers.common['Authorization'];
      }`;

const newSync = `        // Sync user to backend
        try {
          const res = await axios.post('/api/users/sync');
          setDbUser(res.data.user);
          if (res.data.user?.area) {
            localStorage.setItem('userArea', res.data.user.area);
          }
        } catch (error) {
          console.error("Failed to sync user:", error);
        }
      } else {
        setToken(null);
        setDbUser(null);
        delete axios.defaults.headers.common['Authorization'];
      }`;

code = code.replace(oldSync, newSync);

const oldReturn = `    <AuthContext.Provider value={{ user, loading, login, loginWithEmail, signupWithEmail, logout, token, isAdmin }}>`;
const newReturn = `    <AuthContext.Provider value={{ user, dbUser, loading, login, loginWithEmail, signupWithEmail, logout, token, isAdmin }}>`;

code = code.replace(oldReturn, newReturn);

fs.writeFileSync('src/contexts/AuthContext.tsx', code);
