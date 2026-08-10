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

// 4. Extract the expanded block and use it as a modal
const gridRenderTarget = `onClick={() => setExpandedId(isExpanded ? null : student.id)}>
              
              <div className="h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative">`;
const gridRenderReplacement = `onClick={() => setExpandedId(student.id)}>
              
              <div className="h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative">`;
code = code.replace(gridRenderTarget, gridRenderReplacement);

const theCardClasses = `className={\`bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 cursor-pointer hover:shadow-md hover:border-indigo-200 \${isExpanded ? 'row-span-2 shadow-md border-indigo-200 ring-1 ring-indigo-100' : ''}\`}`;
const theCardClassesReplacement = `className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 cursor-pointer hover:shadow-md hover:border-indigo-200"`;
code = code.replace(theCardClasses, theCardClassesReplacement);

const expandChevron = `<div className={\`p-1.5 rounded-md transition-colors \${isExpanded ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 group-hover:bg-slate-50'}\`}>
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>`;
const expandChevronReplacement = ``;
code = code.replace(expandChevron, expandChevronReplacement);

// Remove the inline expanded block
const inlineExpandedTargetStart = `{isExpanded && (`;
const inlineExpandedTargetEnd = `)}
              </div>
            </div>`;
// Actually, let's use regex to remove the block
// We can just find "{isExpanded && (" up to the closing tags
let lines = code.split('\n');
let newLines = [];
let skip = false;
let braceCount = 0;
for(let i=0; i<lines.length; i++) {
  if (lines[i].includes('{isExpanded && (')) {
    skip = true;
    braceCount = 1; // we assume we will just skip until the matching ")}"
    // wait, it's easier to just match manually by index
  }
}
// since string replacement is tricky here, let's write a targeted function
