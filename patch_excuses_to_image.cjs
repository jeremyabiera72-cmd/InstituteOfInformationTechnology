const fs = require('fs');
let code = fs.readFileSync('src/pages/Excuses.tsx', 'utf8');

code = code.replace("import html2canvas from 'html2canvas';", "import * as htmlToImage from 'html-to-image';");

const oldDownload = `const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
        const dataUrl = canvas.toDataURL('image/png');`;

const newDownload = `const dataUrl = await htmlToImage.toPng(element, { backgroundColor: '#ffffff', pixelRatio: 2 });`;

code = code.replace(oldDownload, newDownload);

fs.writeFileSync('src/pages/Excuses.tsx', code);
