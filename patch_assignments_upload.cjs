const fs = require('fs');
let code = fs.readFileSync('src/pages/Assignments.tsx', 'utf8');

// 1. Clear the file input value after upload so they can re-upload the same file if needed.
code = code.replace(
  "      setUploadingImage(false);\n    }\n  };",
  "      setUploadingImage(false);\n      if (e.target) e.target.value = '';\n    }\n  };"
);

// 2. Clear state when canceling adding
code = code.replace(
  "onClick={() => setIsAdding(!isAdding)}",
  "onClick={() => {\n            if (isAdding) {\n              setNewAssignment({ title: '', description: '', dueDate: '', priority: 'medium', imageUrl: '', linkUrl: '' });\n            }\n            setIsAdding(!isAdding);\n          }}"
);

// 3. Hide the 'Choose Image' button if an image is already uploaded
const oldUploadArea = `
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
`;

const newUploadArea = `
                  {!newAssignment.imageUrl ? (
                    <label className="flex items-center justify-center px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors text-sm font-medium shadow-sm">
                      {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                      {uploadingImage ? 'Uploading...' : 'Choose Image'}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                    </label>
                  ) : (
                    <div className="relative inline-block mt-2">
                      <img src={newAssignment.imageUrl} alt="Preview" className="h-24 w-24 object-cover rounded-lg border border-slate-200 shadow-sm" />
                      <button type="button" onClick={() => setNewAssignment(prev => ({...prev, imageUrl: ''}))} className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1 shadow-md hover:bg-slate-900 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
`;

code = code.replace(oldUploadArea, newUploadArea);

fs.writeFileSync('src/pages/Assignments.tsx', code);
