const fs = require('fs');

// Patch ReportBullying.tsx
let reportCode = fs.readFileSync('src/pages/ReportBullying.tsx', 'utf8');

const targetState = `  const [incidentType, setIncidentType] = useState('Verbal');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);`;

const replacementState = `  const [incidentType, setIncidentType] = useState('Verbal');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const [victimName, setVictimName] = useState('');
  const [course, setCourse] = useState('');
  const [section, setSection] = useState('');`;

reportCode = reportCode.replace(targetState, replacementState);

const targetAddDoc = `      await addDoc(reportsRef, {
        incidentType,
        description,
        date,
        isAnonymous,
        userId: isAnonymous ? null : user?.uid,
        userName: isAnonymous ? 'Anonymous' : user?.displayName || 'Unknown Student',
        userEmail: isAnonymous ? null : user?.email,
        createdAt: serverTimestamp(),
        status: 'pending' // pending, investigating, resolved
      });`;

const replacementAddDoc = `      await addDoc(reportsRef, {
        incidentType,
        description,
        date,
        isAnonymous,
        victimName,
        course,
        section,
        userId: isAnonymous ? null : user?.uid,
        userName: isAnonymous ? 'Anonymous' : user?.displayName || 'Unknown Student',
        userEmail: isAnonymous ? null : user?.email,
        createdAt: serverTimestamp(),
        status: 'pending' // pending, investigating, resolved
      });`;

reportCode = reportCode.replace(targetAddDoc, replacementAddDoc);

const targetReset = `      setIncidentType('Verbal');
      setDescription('');
      setDate('');
      setIsAnonymous(false);`;

const replacementReset = `      setIncidentType('Verbal');
      setDescription('');
      setDate('');
      setIsAnonymous(false);
      setVictimName('');
      setCourse('');
      setSection('');`;

reportCode = reportCode.replace(targetReset, replacementReset);

const targetForm = `          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Type of Incident</label>`;

const replacementForm = `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Victim's Name (Optional)</label>
              <input
                type="text"
                value={victimName}
                onChange={(e) => setVictimName(e.target.value)}
                placeholder="Name of the person bullied"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Course</label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. BSIT"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Section</label>
                <input
                  type="text"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="e.g. 3A"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Type of Incident</label>`;

reportCode = reportCode.replace(targetForm, replacementForm);
fs.writeFileSync('src/pages/ReportBullying.tsx', reportCode);

// Patch AdminBullyingReports.tsx
let adminCode = fs.readFileSync('src/pages/admin/AdminBullyingReports.tsx', 'utf8');

const targetAdminUI = `                    <p className="text-sm text-slate-500 mt-1">
                      Reported by: <span className="font-semibold text-slate-700">{report.userName}</span> 
                      {report.userEmail && <span className="text-slate-400 ml-1">({report.userEmail})</span>}
                    </p>
                  </div>`;

const replacementAdminUI = `                    <p className="text-sm text-slate-500 mt-1">
                      Reported by: <span className="font-semibold text-slate-700">{report.userName}</span> 
                      {report.userEmail && <span className="text-slate-400 ml-1">({report.userEmail})</span>}
                    </p>
                  </div>
                  
                  {(report.victimName || report.course || report.section) && (
                    <div className="mt-4 md:mt-0 bg-red-50 px-4 py-3 rounded-xl border border-red-100 flex flex-col gap-1 text-sm">
                      {report.victimName && (
                        <p className="text-red-900"><span className="font-semibold">Victim:</span> {report.victimName}</p>
                      )}
                      {(report.course || report.section) && (
                        <p className="text-red-800"><span className="font-semibold">Class:</span> {report.course} {report.section}</p>
                      )}
                    </div>
                  )}
                  `;

adminCode = adminCode.replace(targetAdminUI, replacementAdminUI);
fs.writeFileSync('src/pages/admin/AdminBullyingReports.tsx', adminCode);

