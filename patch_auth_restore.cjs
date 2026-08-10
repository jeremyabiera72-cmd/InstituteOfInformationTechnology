const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

code = code.replace(
  /if \(res\.data\.user\?\.area\) \{\s*localStorage\.setItem\('userArea', res\.data\.user\.area\);\s*\}/,
  `if (res.data.user?.area) {
            localStorage.setItem('userArea', res.data.user.area);
          } else {
            const localArea = localStorage.getItem('userArea');
            if (localArea) {
              try {
                const updateRes = await axios.put('/api/users/area', { area: localArea });
                setDbUser(updateRes.data.user);
              } catch (e) {
                console.error('Failed to restore area to backend', e);
              }
            }
          }`
);

fs.writeFileSync('src/contexts/AuthContext.tsx', code);
