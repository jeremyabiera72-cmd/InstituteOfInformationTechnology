const fs = require('fs');

let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');
code = code.replace("import {\nimport ditLogo from '../assets/images/regenerated_image_1783588651815.png';\n  BookOpen", "import {\n  BookOpen");
code = code.replace("import { import ditLogo from '../assets/images/regenerated_image_1783588651815.png';\n  BookOpen", "import {\n  BookOpen");

fs.writeFileSync('src/pages/Home.tsx', code);
