const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(
  "import { Link } from 'react-router-dom';",
  "import { Link, useParams } from 'react-router-dom';"
);

code = code.replace(
  "export default function Dashboard() {",
  "export default function Dashboard() {\n  const { area } = useParams<{ area: string }>();"
);

code = code.replace(
  /<Link to="\/notes"/g,
  '<Link to={`/${area}/notes`}'
);
code = code.replace(
  /<Link to="\/assignments"/g,
  '<Link to={`/${area}/assignments`}'
);
code = code.replace(
  /<Link to="\/excuses"/g,
  '<Link to={`/${area}/excuses`}'
);
code = code.replace(
  /<Link to="\/report-bullying"/g,
  '<Link to={`/${area}/report-bullying`}'
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
