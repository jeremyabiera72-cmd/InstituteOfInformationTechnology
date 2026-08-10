const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

code = code.replace(
  "} catch (error) {\\n          console.error(\\"Failed to sync user:\\", error);\\n        }\\n      } else {",
  "} catch (error) {\\n          console.error(\\"Failed to sync user:\\", error);\\n        } finally {\\n          setLoading(false);\\n        }\\n      } else {"
);

code = code.replace(
  "      } else {\\n        setToken(null);\\n        setDbUser(null);\\n        delete axios.defaults.headers.common['Authorization'];\\n      }\\n      setLoading(false);",
  "      } else {\\n        setToken(null);\\n        setDbUser(null);\\n        delete axios.defaults.headers.common['Authorization'];\\n        setLoading(false);\\n      }"
);

fs.writeFileSync('src/contexts/AuthContext.tsx', code);
