const fs = require('fs');

let code = fs.readFileSync('src/pages/admin/AdminDeadlines.tsx', 'utf8');
code = code.replace(/await addDoc\(collection\(db, 'deadlines'\), newDeadline\);/, "await axios.post('/api/admin/deadlines', newDeadline);");
code = code.replace(/await deleteDoc\(doc\(db, 'deadlines', id\)\);/, "await axios.delete(`/api/admin/deadlines/${id}`);");
fs.writeFileSync('src/pages/admin/AdminDeadlines.tsx', code);

let code2 = fs.readFileSync('src/pages/admin/AdminExcuses.tsx', 'utf8');
code2 = code2.replace(/await updateDoc\(doc\(db, 'excuses', id\), \{ status: newStatus \}\);/, "await axios.patch(`/api/admin/excuses/${id}/status`, { status: newStatus });");
fs.writeFileSync('src/pages/admin/AdminExcuses.tsx', code2);

