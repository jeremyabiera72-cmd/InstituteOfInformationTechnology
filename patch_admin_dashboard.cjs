const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf8');

code = code.replace(
  "import { collection, getDocs } from 'firebase/firestore';",
  "import axios from 'axios';"
);
code = code.replace(
  "import { db } from '../../lib/firebase.ts';",
  ""
);
code = code.replace(
  /const fetchStats = async \(\) => \{[\s\S]*?fetchStats\(\);\n  \}, \[\]\);/,
  `const fetchStats = async () => {
      try {
        const res = await axios.get('/api/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);`
);

fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', code);
