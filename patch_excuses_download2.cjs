const fs = require('fs');
let code = fs.readFileSync('src/pages/Excuses.tsx', 'utf8');

// Add import
code = code.replace("import SignatureCanvas from 'react-signature-canvas';", "import SignatureCanvas from 'react-signature-canvas';\nimport html2canvas from 'html2canvas';");

// Add download function
const fetchExcusesIndex = code.indexOf("const fetchExcuses = async () => {");
const dlFunction = `
  const handleDownloadImage = async (id: number, studentName: string) => {
    const element = document.getElementById(\`excuse-letter-\${id}\`);
    if (element) {
      try {
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = \`Excuse_Letter_\${studentName.replace(/\\s+/g, '_')}.png\`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error generating image', error);
      }
    }
  };
`;
code = code.substring(0, fetchExcusesIndex) + dlFunction + code.substring(fetchExcusesIndex);

// Add id to the content we want to download
// Find the div with the letter content and add ID.
// `<div className="p-8 pb-10 flex-1 font-serif text-slate-800" style={{ backgroundImage:`
const targetDiv = `<div className="p-8 pb-10 flex-1 font-serif text-slate-800" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e2e8f0 31px, #e2e8f0 32px)', lineHeight: '32px' }}>`;
const newDiv = `<div id={\`excuse-letter-\${excuse.id}\`} className="p-8 pb-10 flex-1 font-serif text-slate-800 bg-white" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e2e8f0 31px, #e2e8f0 32px)', lineHeight: '32px' }}>`;
code = code.replace(targetDiv, newDiv);

// update the download button
const oldBtn = `<button onClick={() => { window.print(); }} className="flex items-center gap-2 p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors font-medium text-sm" title="Download Letter as PDF">
                    <Download className="w-4 h-4" /> Download
                  </button>`;
const newBtn = `<button onClick={() => handleDownloadImage(excuse.id, excuse.name)} className="flex items-center gap-2 p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors font-medium text-sm" title="Download Letter as Image">
                    <Download className="w-4 h-4" /> Download
                  </button>`;
code = code.replace(oldBtn, newBtn);

fs.writeFileSync('src/pages/Excuses.tsx', code);
