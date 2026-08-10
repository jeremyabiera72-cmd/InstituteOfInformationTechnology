const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const targetStart = `<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">`;
const targetEnd = `</div>\n    </div>\n  );\n}`;

const startIndex = code.indexOf(targetStart);
if (startIndex !== -1) {
  const codeBefore = code.substring(0, startIndex);
  
  const replacement = `<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h3 className="font-semibold text-slate-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/notes" className="flex flex-col items-center justify-center p-6 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors">
              <BookOpen className="w-8 h-8 mb-2" />
              <span className="font-medium text-sm">Class Notes</span>
            </Link>
            <Link to="/assignments" className="flex flex-col items-center justify-center p-6 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors">
              <CheckSquare className="w-8 h-8 mb-2" />
              <span className="font-medium text-sm">Assignments</span>
            </Link>
            <Link to="/excuses" className="flex flex-col items-center justify-center p-6 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-colors">
              <FileText className="w-8 h-8 mb-2" />
              <span className="font-medium text-sm">Submit Excuse</span>
            </Link>
            <Link to="/bullying-report" className="flex flex-col items-center justify-center p-6 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors">
              <ShieldAlert className="w-8 h-8 mb-2" />
              <span className="font-medium text-sm">Report Issue</span>
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h3 className="font-semibold text-slate-800 mb-6">Student Resources</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-slate-800">Library Access</h4>
                <p className="text-sm text-slate-500 mt-1">Browse digital books and online research materials available for students.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-slate-800">Student Counseling</h4>
                <p className="text-sm text-slate-500 mt-1">Schedule a session with the guidance counselor for academic or personal support.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50">
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                <CalendarClock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-slate-800">Academic Calendar</h4>
                <p className="text-sm text-slate-500 mt-1">Check out important dates for exams, holidays, and school events.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;

  fs.writeFileSync('src/pages/Dashboard.tsx', codeBefore + replacement);
}
