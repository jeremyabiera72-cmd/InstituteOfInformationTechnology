const fs = require('fs');
let code = fs.readFileSync('src/pages/Playground.tsx', 'utf8');

// The second LANGUAGE_TEMPLATES declaration was inserted by my script:
// const LANGUAGE_TEMPLATES: Record<string, { code: string, ext: string }> = {

const start1 = code.indexOf('const LANGUAGE_TEMPLATES');
const start2 = code.indexOf('const LANGUAGE_TEMPLATES', start1 + 10);

if (start2 !== -1) {
  // It's duplicated. Let's find the end of the second declaration
  // which is `};` followed by `const dailyChallenges`
  const dailyIdx = code.indexOf('const dailyChallenges');
  code = code.substring(0, start2) + code.substring(dailyIdx);
  fs.writeFileSync('src/pages/Playground.tsx', code);
}

