const fs = require('fs');
let code = fs.readFileSync('src/pages/Playground.tsx', 'utf8');

// 1. Move Editor & Console to the top
const fullReturnBlockRegex = /return \([\s\S]+?  \);\n}/;
let returnBlockMatch = code.match(fullReturnBlockRegex);
if (returnBlockMatch) {
  let returnBlock = returnBlockMatch[0];

  // We want to extract the Controls and put it at the top, then Editor & Console, then the rest of Header Section as Challenges.
  // Actually, separating controls from the header section.

  const controlsRegex = /\{\/\* Controls \*\/\}\s*<div className="flex items-center justify-end gap-3 mt-2">[\s\S]*?<\/div>\s*<\/div>/;
  let controlsBlock = '';
  returnBlock = returnBlock.replace(controlsRegex, (match) => {
    // The match includes the closing </div> for the Header section!
    // Let's be careful.
    return match; // Revert, we will do it manually to be safe.
  });
}
