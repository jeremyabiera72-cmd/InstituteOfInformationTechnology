const fs = require('fs');

let code = fs.readFileSync('src/pages/LostAndFound.tsx', 'utf8');

// Fix buttons
code = code.replace(
  /className=\{`py-2 rounded-xl font-medium text-sm transition-colors border \$\{[\s\S]*?\}`\}/g,
  (match) => {
    // Already fixed by fix_strings.cjs probably, but let's make sure
    return match;
  }
);

// Add preview
const oldPhotoSection = `              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Photo (Optional)</label>
                <label className="flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                  <div className="flex flex-col items-center gap-1">
                    <Upload className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-500 font-medium">
                      {file ? file.name : "Click to upload image"}
                    </span>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>`;

const newPhotoSection = `              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Photo (Optional)</label>
                <label className="flex items-center justify-center w-full min-h-[8rem] px-4 py-4 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors relative overflow-hidden group">
                  {file ? (
                    <div className="flex flex-col items-center gap-2">
                      <img src={URL.createObjectURL(file)} alt="Preview" className="max-h-32 object-contain rounded-lg shadow-sm" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                        <Upload className="w-6 h-6 mb-1" />
                        <span className="text-sm font-medium">Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      <span className="text-sm text-slate-500 font-medium group-hover:text-indigo-600 transition-colors">
                        Click to upload image
                      </span>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>`;

code = code.replace(oldPhotoSection, newPhotoSection);
fs.writeFileSync('src/pages/LostAndFound.tsx', code);
