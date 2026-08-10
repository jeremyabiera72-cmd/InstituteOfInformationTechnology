const fs = require('fs');

function replaceInFile(file, imgImportPath) {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Add import
    if (!code.includes('import ditLogo')) {
       // Insert import after the last import statement
       const lines = code.split('\n');
       const lastImportIndex = lines.findLastIndex(l => l.startsWith('import '));
       if (lastImportIndex !== -1) {
          lines.splice(lastImportIndex + 1, 0, `import ditLogo from '${imgImportPath}';`);
       } else {
          lines.unshift(`import ditLogo from '${imgImportPath}';`);
       }
       code = lines.join('\n');
    }

    // Replace image src
    code = code.replace(
      /src="https:\/\/images\.unsplash\.com\/photo-1562774053-701939374585\?ixlib=rb-4\.0\.3&auto=format&fit=crop&w=512&q=80"/g,
      'src={ditLogo}'
    );

    fs.writeFileSync(file, code);
  }
}

replaceInFile('src/pages/Login.tsx', '../assets/images/regenerated_image_1783588651815.png');
replaceInFile('src/pages/Home.tsx', '../assets/images/regenerated_image_1783588651815.png');

