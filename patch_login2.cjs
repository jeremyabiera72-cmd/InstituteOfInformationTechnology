const fs = require('fs');
let code = fs.readFileSync('src/pages/Login.tsx', 'utf8');

const targetState = `  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');`;

const replacementState = `  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentName, setStudentName] = useState('');`;

code = code.replace(targetState, replacementState);

const targetDestruct = `const { login, loginWithEmail } = useAuth();`;
const replacementDestruct = `const { login, loginWithEmail, signupWithEmail } = useAuth();`;
code = code.replace(targetDestruct, replacementDestruct);

fs.writeFileSync('src/pages/Login.tsx', code);
