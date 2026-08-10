const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Make "Department of Information Technology System" bigger
code = code.replace(
  '<span className="font-bold text-slate-900 text-xl tracking-tight">Department of Information Technology System</span>',
  '<span className="font-bold text-slate-900 text-2xl md:text-3xl tracking-tight">Department of Information Technology System</span>'
);

// Remove "Don't have an account..." and improve "Welcome to your dashboard"
const oldDashboardHeader = `<motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Welcome to your dashboard!</h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              Don't have an account? <Link to="/login" className="text-indigo-600 font-medium hover:underline">Create a new account now</Link>, it's FREE! Explore the tools below.
            </p>
          </motion.div>`;

const newDashboardHeader = `<motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">Access Your Academic Tools</h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              Explore the centralized resources and utilities designed to support your studies.
            </p>
          </motion.div>`;

code = code.replace(oldDashboardHeader, newDashboardHeader);

fs.writeFileSync('src/pages/Home.tsx', code);
