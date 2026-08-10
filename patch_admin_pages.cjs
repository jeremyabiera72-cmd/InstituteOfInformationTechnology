const fs = require('fs');

// Patch AdminDeadlines
let code = fs.readFileSync('src/pages/admin/AdminDeadlines.tsx', 'utf8');
code = code.replace("import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';", "import axios from 'axios';");
code = code.replace("import { db } from '../../lib/firebase.ts';", "");
code = code.replace(/const fetchDeadlines = async \(\) => \{[\s\S]*?fetchDeadlines\(\);\n  \}, \[\]\);/, `const fetchDeadlines = async () => {
    try {
      const res = await axios.get('/api/admin/deadlines');
      setDeadlines(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDeadlines();
  }, []);`);
code = code.replace(/const deleteDeadline = async \(id: string\) => \{[\s\S]*?fetchDeadlines\(\);\n    \} catch \(err\) \{\n      console\.error\(err\);\n    \}\n  \};/, `const deleteDeadline = async (id: string) => {
    try {
      await axios.delete(\`/api/admin/deadlines/\${id}\`);
      fetchDeadlines();
    } catch (err) {
      console.error(err);
    }
  };`);
fs.writeFileSync('src/pages/admin/AdminDeadlines.tsx', code);

// Patch AdminExcuses
let code2 = fs.readFileSync('src/pages/admin/AdminExcuses.tsx', 'utf8');
code2 = code2.replace("import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';", "import axios from 'axios';");
code2 = code2.replace("import { db } from '../../lib/firebase.ts';", "");
code2 = code2.replace(/const fetchExcuses = async \(\) => \{[\s\S]*?fetchExcuses\(\);\n  \}, \[\]\);/, `const fetchExcuses = async () => {
    try {
      const res = await axios.get('/api/admin/excuses');
      setExcuses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchExcuses();
  }, []);`);
code2 = code2.replace(/const updateStatus = async \(id: string, newStatus: string\) => \{[\s\S]*?fetchExcuses\(\);\n    \} catch \(err\) \{\n      console\.error\(err\);\n    \}\n  \};/, `const updateStatus = async (id: string, newStatus: string) => {
    try {
      await axios.patch(\`/api/admin/excuses/\${id}/status\`, { status: newStatus });
      fetchExcuses();
    } catch (err) {
      console.error(err);
    }
  };`);
fs.writeFileSync('src/pages/admin/AdminExcuses.tsx', code2);

// Patch AdminStudents
let code3 = fs.readFileSync('src/pages/admin/AdminStudents.tsx', 'utf8');
code3 = code3.replace("import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';", "import axios from 'axios';");
code3 = code3.replace("import { db } from '../../lib/firebase.ts';", "");
code3 = code3.replace(/const fetchStudents = async \(\) => \{[\s\S]*?fetchStudents\(\);\n  \}, \[\]\);/, `const fetchStudents = async () => {
    try {
      const res = await axios.get('/api/admin/students');
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStudents();
  }, []);`);
code3 = code3.replace(/const toggleStatus = async \(id: string, currentStatus: string \| undefined\) => \{[\s\S]*?fetchStudents\(\);\n    \} catch \(err\) \{\n      console\.error\(err\);\n    \}\n  \};/, `const toggleStatus = async (id: string, currentStatus: string | undefined) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      await axios.patch(\`/api/users/\${id}/status\`, { status: newStatus });
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };`);
fs.writeFileSync('src/pages/admin/AdminStudents.tsx', code3);
