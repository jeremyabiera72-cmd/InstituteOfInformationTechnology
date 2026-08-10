const fs = require('fs');
let code = fs.readFileSync('src/pages/Assignments.tsx', 'utf8');

const displayAttachments = `
                {assignment.linkUrl && (
                  <a href={assignment.linkUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2 text-sm font-medium mb-4 transition-colors w-fit">
                    <Link2 className="w-4 h-4" />
                    View Attached Link
                    <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                  </a>
                )}
                {assignment.imageUrl && (
                  <div className="mb-4 relative group cursor-pointer inline-block" onClick={() => setZoomImage(assignment.imageUrl)}>
                    <img src={assignment.imageUrl} alt="Assignment attachment" className="rounded-lg border border-slate-200 max-h-40 object-cover" />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors rounded-lg flex items-center justify-center">
                      <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 drop-shadow-md transition-opacity" />
                    </div>
                  </div>
                )}
`;

code = code.replace(
  '                  <p className="text-slate-600 text-[15px] mb-4 leading-relaxed line-clamp-2">{assignment.description}</p>\n                )}',
  '                  <p className="text-slate-600 text-[15px] mb-4 leading-relaxed line-clamp-2">{assignment.description}</p>\n                )}\n' + displayAttachments
);

const zoomModal = `
      {zoomImage && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]" onClick={() => setZoomImage(null)}>
          <div className="relative max-w-5xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <button onClick={() => setZoomImage(null)} className="absolute -top-12 right-0 text-white hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 p-2 rounded-full transition-colors backdrop-blur-md">
              <X className="w-6 h-6" />
            </button>
            <img src={zoomImage} alt="Zoomed attachment" className="rounded-xl object-contain max-h-[85vh] shadow-2xl ring-1 ring-white/10" />
          </div>
        </div>
      )}
`;

code = code.replace(
  '    </div>\n  );\n}',
  zoomModal + '\n    </div>\n  );\n}'
);

fs.writeFileSync('src/pages/Assignments.tsx', code);
