const fs = require('fs');
let code = fs.readFileSync('src/pages/Assignments.tsx', 'utf8');

if (!code.includes("firebase/storage")) {
  code = code.replace("import { useAuth }", "import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';\nimport { v4 as uuidv4 } from 'uuid';\nimport { Image as ImageIcon, X, ExternalLink, Maximize2 } from 'lucide-react';\nimport { useAuth }");
}

code = code.replace("const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', priority: 'medium' });", 
  "const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', priority: 'medium', imageUrl: '', linkUrl: '' });\n  const [uploadingImage, setUploadingImage] = useState(false);\n  const [zoomImage, setZoomImage] = useState<string | null>(null);");

const uploadFunction = `
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const storage = getStorage();
      const fileRef = ref(storage, \`assignments/\${uuidv4()}_\${file.name}\`);
      const snapshot = await uploadBytesResumable(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setNewAssignment(prev => ({ ...prev, imageUrl: downloadURL }));
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploadingImage(false);
    }
  };
`;

code = code.replace("const handleAdd = async (e: React.FormEvent) => {", uploadFunction + "\n  const handleAdd = async (e: React.FormEvent) => {");

code = code.replace("setNewAssignment({ title: '', description: '', dueDate: '', priority: 'medium' });", "setNewAssignment({ title: '', description: '', dueDate: '', priority: 'medium', imageUrl: '', linkUrl: '' });");

const extraInputs = `
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Attach Link (Optional)</label>
                <div className="flex bg-slate-50 border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-colors">
                  <div className="px-3 py-2.5 bg-slate-100 border-r border-slate-200 flex items-center justify-center">
                    <Link2 className="w-4 h-4 text-slate-500" />
                  </div>
                  <input type="url" value={newAssignment.linkUrl || ''} onChange={e => setNewAssignment({...newAssignment, linkUrl: e.target.value})} placeholder="https://..." className="w-full px-3 py-2.5 bg-transparent focus:outline-none text-sm text-slate-800" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Attach Image (Optional)</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center justify-center px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors text-sm font-medium shadow-sm">
                    {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                    {uploadingImage ? 'Uploading...' : 'Choose Image'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                  </label>
                  {newAssignment.imageUrl && (
                    <div className="relative">
                      <img src={newAssignment.imageUrl} alt="Preview" className="h-10 w-10 object-cover rounded border border-slate-200" />
                      <button type="button" onClick={() => setNewAssignment(prev => ({...prev, imageUrl: ''}))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm hover:bg-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
`;

code = code.replace(
  '            <div className="flex justify-end pt-4 border-t border-slate-100">',
  extraInputs + '\n            <div className="flex justify-end pt-4 border-t border-slate-100">'
);

if (!code.includes("import { Link2 }")) {
    code = code.replace("import { Calendar, Plus,", "import { Calendar, Plus, Link2,");
}

fs.writeFileSync('src/pages/Assignments.tsx', code);
