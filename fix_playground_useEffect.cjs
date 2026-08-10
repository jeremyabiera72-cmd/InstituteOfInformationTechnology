const fs = require('fs');
let code = fs.readFileSync('src/pages/Playground.tsx', 'utf8');

const target = `    const interval = setInterval(updateCountdown, 1000);  
      return (`;
const replacement = `    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (`;

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/Playground.tsx', code);
