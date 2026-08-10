const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

const oldEffect = `      if (user) {
        const idToken = await user.getIdToken();
        setToken(idToken);
        axios.defaults.headers.common['Authorization'] = \`Bearer \${idToken}\`;
        
        // Sync user to backend
        try {
          const res = await axios.post('/api/users/sync');
          setDbUser(res.data.user);
          if (res.data.user?.area) {
            localStorage.setItem('userArea', res.data.user.area);
          }
        } catch (error) {
          console.error("Failed to sync user:", error);
        }
      } else {
        setToken(null);
        setDbUser(null);
        delete axios.defaults.headers.common['Authorization'];
      }
      
      setLoading(false);`;

const newEffect = `      if (user) {
        const idToken = await user.getIdToken();
        setToken(idToken);
        axios.defaults.headers.common['Authorization'] = \`Bearer \${idToken}\`;
        
        // Sync user to backend
        try {
          const res = await axios.post('/api/users/sync');
          setDbUser(res.data.user);
          if (res.data.user?.area) {
            localStorage.setItem('userArea', res.data.user.area);
          }
        } catch (error) {
          console.error("Failed to sync user:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setToken(null);
        setDbUser(null);
        delete axios.defaults.headers.common['Authorization'];
        setLoading(false);
      }`;

code = code.replace(oldEffect, newEffect);
fs.writeFileSync('src/contexts/AuthContext.tsx', code);
