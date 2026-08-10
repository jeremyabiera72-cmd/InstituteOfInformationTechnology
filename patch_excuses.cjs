const fs = require('fs');
let code = fs.readFileSync('src/pages/Excuses.tsx', 'utf8');

if (!code.includes('import { getStorage')) {
  code = code.replace("import { FileSignature, Plus, Loader2, Trash2, Printer, X, Download } from 'lucide-react';", 
    "import { FileSignature, Plus, Loader2, Trash2, Printer, X, Download, Paperclip } from 'lucide-react';\nimport { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';\nimport { v4 as uuidv4 } from 'uuid';");
}

code = code.replace("parentName: ''\n  });", "parentName: '',\n    proofUrl: ''\n  });");

if (!code.includes('uploadingProof')) {
  code = code.replace("const [submitting, setSubmitting] = useState(false);", 
    "const [submitting, setSubmitting] = useState(false);\n  const [uploadingProof, setUploadingProof] = useState(false);");
}

// add handleFileUpload
if (!code.includes('handleProofUpload')) {
  code = code.replace("const fetchExcuses = async () => {", `const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProof(true);
    try {
      const storage = getStorage();
      const fileRef = ref(storage, \`excuses/\${uuidv4()}_\${file.name}\`);
      const snapshot = await uploadBytesResumable(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setFormData({ ...formData, proofUrl: downloadURL });
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Note: The app may use default Firebase storage which requires permissions.');
    } finally {
      setUploadingProof(false);
    }
  };

  const fetchExcuses = async () => {`);
}

// clear proofUrl
code = code.replace("setFormData({ name: '', course: '', reason: 'Sickness', details: '', studentName: '', parentName: '' });", 
  "setFormData({ name: '', course: '', reason: 'Sickness', details: '', studentName: '', parentName: '', proofUrl: '' });");

// UI changes:
// Add file input field before signatures
code = code.replace("{/* Signatures Area */}", `<div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Attach Proof (Medical Certificate, etc.)</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors shadow-sm font-medium text-sm">
                    {uploadingProof ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                    {uploadingProof ? 'Uploading...' : 'Choose File (Image)'}
                    <input type="file" className="hidden" accept="image/*" onChange={handleProofUpload} />
                  </label>
                  {formData.proofUrl && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                      <Download className="w-4 h-4" /> Proof attached successfully
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Signatures Area */}`);

// Remove the one closing div before {/* Signatures Area */} since it's already included in my string
code = code.replace(`            </div>

            {/* Signatures Area */}`, `{/* Signatures Area */}`);

// Display the proof URL in the printed letter
code = code.replace(`                <div className="grid grid-cols-2 gap-8 mt-16 pt-8">`, `                {excuse.proofUrl && (
                  <div className="mt-8">
                    <p className="font-bold mb-2">Attached Proof:</p>
                    <img src={excuse.proofUrl} alt="Proof" className="max-w-full h-auto rounded-lg border border-slate-200 shadow-sm max-h-64 object-contain" />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-8 mt-16 pt-8">`);


fs.writeFileSync('src/pages/Excuses.tsx', code);
console.log("Patched excuses UI");
