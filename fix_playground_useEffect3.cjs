const fs = require('fs');
let code = fs.readFileSync('src/pages/Playground.tsx', 'utf8');

const s = code.indexOf('const interval = setInterval(updateCountdown, 1000);');
const e = code.indexOf('return (', s);
if (s !== -1 && e !== -1) {
  code = code.substring(0, s) + "const interval = setInterval(updateCountdown, 1000);\n    return () => clearInterval(interval);\n  }, []);\n\n  return (" + code.substring(e + 8);
  fs.writeFileSync('src/pages/Playground.tsx', code);
}
