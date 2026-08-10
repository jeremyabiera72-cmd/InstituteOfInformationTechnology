const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// The bottom section is:
// <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

const oldGrid = `<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">`;
const newGrid = `<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">`;
code = code.replace(oldGrid, newGrid);

// Update feed box
const oldFeedBox = `<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">`;
const newFeedBox = `<div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col lg:col-span-2">`;
code = code.replace(oldFeedBox, newFeedBox);

// Update upcoming deadlines box
const oldDeadlineBox = `<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">`;
const newDeadlineBox = `<div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">`;
code = code.replace(oldDeadlineBox, newDeadlineBox);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
