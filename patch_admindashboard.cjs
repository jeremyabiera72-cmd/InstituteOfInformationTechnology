const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf8');

if (!code.includes("bullyingReports")) {
  code = code.replace(
    "import axios from 'axios';",
    "import axios from 'axios';\nimport { collection, query, where, getDocs } from 'firebase/firestore';\nimport { db } from '../../lib/firebase.ts';\nimport { ShieldAlert } from 'lucide-react';"
  );

  code = code.replace(
    "excuses: 0\n  });",
    "excuses: 0,\n    bullyingReports: 0\n  });"
  );

  const fetchStatsReplace = `
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/admin/stats');
        
        let bullyingCount = 0;
        try {
          const q = query(collection(db, 'bullying_reports'), where('status', '==', 'pending'));
          const snapshot = await getDocs(q);
          bullyingCount = snapshot.size;
        } catch(e) {
          console.error("Firebase error", e);
        }

        setStats({...res.data, bullyingReports: bullyingCount});
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
`;

  code = code.replace(/const fetchStats = async \(\) => \{[\s\S]*?\};\n    fetchStats\(\);/m, fetchStatsReplace.trim() + "\n    fetchStats();");

  const newStat = `
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Reports</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.bullyingReports}</h3>
            </div>
          </div>
        </div>
`;

  code = code.replace(
    '      </div>\n            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">',
    newStat + '      </div>\n            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">'
  );
  
  code = code.replace('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5');

  fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', code);
}
