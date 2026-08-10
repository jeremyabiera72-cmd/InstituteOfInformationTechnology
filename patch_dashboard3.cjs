const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// Ensure stats have no border and soft colors
// Already have `border border-transparent`

// Let's also adjust the "Community Feed" and "Upcoming Deadlines" boxes.
// Currently: `bg-white rounded-2xl shadow-sm border border-slate-100 p-6`
// Let's add a light shadow and maybe remove the border or make it very subtle.
const oldFeed = `className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col lg:col-span-2"`;
const newFeed = `className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col lg:col-span-2"`;
code = code.replace(oldFeed, newFeed);

const oldDeadline = `className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col"`;
const newDeadline = `className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col"`;
code = code.replace(oldDeadline, newDeadline);

// To match the mock closely, let's put a "Performance" card somewhere or a chart?
// The user asked "take an idea here, dont copy just take a ideas here".
// I've incorporated the light minimal sidebar, active state with the bar, clean layout, large unbordered stat cards with pastel colors.

fs.writeFileSync('src/pages/Dashboard.tsx', code);
