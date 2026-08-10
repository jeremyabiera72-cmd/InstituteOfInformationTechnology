const fs = require('fs');
let code = fs.readFileSync('src/pages/Feed.tsx', 'utf8');

// Replace all img tags with just the initials text
code = code.replace(/\{user\?\.photoURL \? <img src=\{user\.photoURL\} alt="Profile" className="w-full h-full object-cover" \/> : user\?\.displayName\?\.charAt\(0\) \|\| 'U'\}/g, "{user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}");
code = code.replace(/\{post\.author\?\.avatarUrl \? <img src=\{post\.author\.avatarUrl\} alt="Profile" className="w-full h-full object-cover" \/> : post\.author\?\.fullName\?\.charAt\(0\) \|\| post\.author\?\.email\?\.charAt\(0\) \|\| 'U'\}/g, "{post.author?.fullName?.charAt(0) || post.author?.email?.charAt(0) || 'U'}");
code = code.replace(/\{comment\.author\?\.avatarUrl \? <img src=\{comment\.author\.avatarUrl\} alt="Profile" className="w-full h-full object-cover" \/> : comment\.author\?\.fullName\?\.charAt\(0\) \|\| comment\.author\?\.email\?\.charAt\(0\) \|\| 'U'\}/g, "{comment.author?.fullName?.charAt(0) || comment.author?.email?.charAt(0) || 'U'}");

const hashBtnRegex = /<button type="button" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Add Topic Tag">\s*<Hash className="w-5 h-5" \/>\s*<\/button>/;
const newHashBtn = `<button type="button" onClick={() => setContent(prev => prev + ' #')} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Add Topic Tag">
                  <Hash className="w-5 h-5" />
                </button>`;
code = code.replace(hashBtnRegex, newHashBtn);

fs.writeFileSync('src/pages/Feed.tsx', code);
