const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importsToAdd = `
import Announcements from './pages/Announcements.tsx';
import LostAndFound from './pages/LostAndFound.tsx';
import ManageAnnouncements from './pages/admin/ManageAnnouncements.tsx';
import ManageLostAndFound from './pages/admin/ManageLostAndFound.tsx';
`;

code = code.replace(
  "import ReportBullying from './pages/ReportBullying.tsx';",
  "import ReportBullying from './pages/ReportBullying.tsx';" + importsToAdd
);

code = code.replace(
  `<Route path="report-bullying" element={<ReportBullying />} />`,
  `<Route path="report-bullying" element={<ReportBullying />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="lost-and-found" element={<LostAndFound />} />`
);

code = code.replace(
  `<Route path="bullying-reports" element={<AdminBullyingReports />} />`,
  `<Route path="bullying-reports" element={<AdminBullyingReports />} />
            <Route path="manage-announcements" element={<ManageAnnouncements />} />
            <Route path="manage-lost-and-found" element={<ManageLostAndFound />} />`
);

fs.writeFileSync('src/App.tsx', code);
