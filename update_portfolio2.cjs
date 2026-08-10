const fs = require('fs');

let code = fs.readFileSync('src/pages/Portfolio.tsx', 'utf8');

// 1. Add fullName to formData state
code = code.replace(
  `const [formData, setFormData] = useState({
    studentIdStr: '',`,
  `const [formData, setFormData] = useState({
    fullName: '',
    studentIdStr: '',`
);

// 2. Set fullName in fetchData
code = code.replace(
  `setFormData({
          studentIdStr: myPortfolioRes.data.studentIdStr || '',`,
  `const me = studentsRes.data.find(s => s.uid === user?.uid);
        setFormData({
          fullName: me?.fullName || me?.displayName || '',
          studentIdStr: myPortfolioRes.data.studentIdStr || '',`
);

// 3. Update the form to include fullName input
const formInputTarget = `<div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Student ID</label>`;
const formInputReplacement = `<div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Student ID</label>`;
code = code.replace(formInputTarget, formInputReplacement);

const cardTarget = `className={\`bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 cursor-pointer hover:shadow-md hover:border-indigo-200 \${isExpanded ? 'row-span-2 shadow-md border-indigo-200 ring-1 ring-indigo-100' : ''}\`}`;
const cardReplacement = `className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 cursor-pointer hover:shadow-md hover:border-indigo-200"`;
code = code.replace(cardTarget, cardReplacement);

code = code.replace(
  `onClick={() => setExpandedId(isExpanded ? null : student.id)}>`,
  `onClick={() => setExpandedId(student.id)}>`
);

// Remove the inline chevron
const chevronTarget = `<div className={\`p-1.5 rounded-md transition-colors \${isExpanded ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 group-hover:bg-slate-50'}\`}>
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>`;
code = code.replace(chevronTarget, "");

// Replace the inline expanded content with a new modal section at the end
const startIdx = code.indexOf('{isExpanded && (');
const endIdx = code.indexOf(')}', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  // We'll just slice it out
  const beforeContent = code.substring(0, startIdx);
  const afterContent = code.substring(endIdx + 2); // ')}'.length == 2
  code = beforeContent + afterContent;
}

// Add the modal renderer near the Edit Modal
const selectedStudentVar = `const selectedStudent = students.find(s => s.id === expandedId);`;

code = code.replace(`return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">`,
`${selectedStudentVar}
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">`);


const modalTarget = `{/* Edit Modal */}`;
const modalCode = `{/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl border border-slate-100 shadow-sm bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                  {selectedStudent.avatarUrl ? (
                    <img src={selectedStudent.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-indigo-600">
                      {selectedStudent.displayName?.charAt(0) || selectedStudent.fullName?.charAt(0) || selectedStudent.email?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 leading-tight">{selectedStudent.fullName || selectedStudent.displayName || selectedStudent.email?.split('@')[0]}</h2>
                  <p className="text-sm text-slate-500 mt-1">{selectedStudent.email}</p>
                </div>
              </div>
              <button onClick={() => setExpandedId(null)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <BadgeInfo className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-slate-800 text-[13px] uppercase tracking-wider mb-0.5">Student ID</span>
                  {selectedStudent.portfolio?.studentIdStr || <span className="text-slate-400 italic">Not provided</span>}
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <Globe className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-slate-800 text-[13px] uppercase tracking-wider mb-0.5">Social Profile</span>
                  {selectedStudent.portfolio?.facebookUrl ? (
                    <a href={selectedStudent.portfolio.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium break-all">
                      {selectedStudent.portfolio.facebookUrl}
                    </a>
                  ) : <span className="text-slate-400 italic">Not provided</span>}
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <Phone className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-slate-800 text-[13px] uppercase tracking-wider mb-0.5">Contact</span>
                  {selectedStudent.portfolio?.phoneNumber || <span className="text-slate-400 italic">Not provided</span>}
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-slate-800 text-[13px] uppercase tracking-wider mb-0.5">Location</span>
                  {selectedStudent.portfolio?.address || <span className="text-slate-400 italic">Not provided</span>}
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-sm text-slate-600 mt-4 pt-4 border-t border-slate-100">
                <HeartPulse className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-slate-800 text-[13px] uppercase tracking-wider mb-0.5">Emergency Contact (Primary)</span>
                  {selectedStudent.portfolio?.emergencyContact || <span className="text-slate-400 italic">Not provided</span>}
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-slate-800 text-[13px] uppercase tracking-wider mb-0.5">Emergency Contact (Secondary)</span>
                  {selectedStudent.portfolio?.secondaryEmergencyContact || <span className="text-slate-400 italic">Not provided</span>}
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <Users className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-slate-800 text-[13px] uppercase tracking-wider mb-0.5">Name of Parent / Guardian</span>
                  {selectedStudent.portfolio?.parentName || <span className="text-slate-400 italic">Not provided</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}`;
code = code.replace(modalTarget, modalCode);

fs.writeFileSync('src/pages/Portfolio.tsx', code);
