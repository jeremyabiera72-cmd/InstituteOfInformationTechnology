const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

code = code.replace(
  /} catch \(error\) \{\s*console\.error\("Failed to sync user:", error\);\s*\}/g,
  `} catch (error) {
          console.error("Failed to sync user:", error);
        } finally {
          setLoading(false);
        }`
);

code = code.replace(
  /delete axios\.defaults\.headers\.common\['Authorization'\];\s*\}\s*setLoading\(false\);/g,
  `delete axios.defaults.headers.common['Authorization'];
        setLoading(false);
      }`
);

fs.writeFileSync('src/contexts/AuthContext.tsx', code);
