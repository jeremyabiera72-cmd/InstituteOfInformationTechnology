const fs = require('fs');
let code = fs.readFileSync('src/pages/Playground.tsx', 'utf8');

const newReturnBlock = `  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto h-[calc(100vh-8rem)]">
      
      {/* Controls & Toolbar */}
      <div className="flex items-center justify-between shrink-0 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2 pl-2">
          <Code className="w-5 h-5 text-indigo-500" />
          Code Editor
        </h2>
        <div className="flex items-center justify-end gap-3">
          <div className="relative w-48">
            <select 
              value={language}
              onChange={handleLanguageChange}
              className="w-full appearance-none bg-slate-50 border border-slate-300 rounded-lg pl-4 pr-10 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors hover:bg-slate-100"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button 
            onClick={runCode} 
            disabled={isRunning}
            className={\`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg disabled:opacity-50 text-sm font-bold shadow-sm transition-colors shrink-0 \${
              activeChallenge ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }\`}
          >
            {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : (activeChallenge ? <Trophy className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />)}
            {isRunning ? 'Running' : (activeChallenge ? 'Submit Solution' : 'Run Code')}
          </button>
        </div>
      </div>

      {/* Editor & Console */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5 min-h-0">
        {/* Editor */}
        <div className="bg-[#1e1e1e] rounded-xl overflow-hidden flex flex-col shadow-lg border border-slate-800">
          <div className="bg-[#2d2d2d] text-slate-300 text-xs px-4 py-3 font-mono border-b border-black flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-400" />
              <span>{language === 'java' ? 'Main' : 'main'}.{LANGUAGE_TEMPLATES[language].ext}</span>
            </div>
            <span className="text-slate-500 font-sans font-medium uppercase tracking-wider text-[10px]">Editor</span>
          </div>
          <textarea
            className="flex-1 w-full bg-transparent text-slate-300 p-5 font-mono text-[13px] focus:outline-none resize-none leading-loose"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Console */}
        <div className="bg-[#0d0d0d] rounded-xl overflow-hidden flex flex-col shadow-lg border border-slate-800">
          <div className="bg-[#1a1a1a] text-slate-300 text-xs px-4 py-3 font-mono border-b border-black flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-green-400" />
              <span>Output</span>
            </div>
            <span className="text-slate-500 font-sans font-medium uppercase tracking-wider text-[10px]">Terminal</span>
          </div>
          <div className="flex-1 p-5 font-mono text-[13px] text-green-400 whitespace-pre-wrap overflow-y-auto leading-relaxed">
            {output || (
              <span className="text-slate-600">Ready to run code. Output will appear here.</span>
            )}
          </div>
        </div>
      </div>

      {/* Challenges Section (Moved to Bottom) */}
      <div className="flex flex-col gap-4 shrink-0 bg-white p-5 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-none">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" /> 
            Daily Challenges
          </h2>
          <div className="text-sm font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
            Refreshes in: <span className="text-indigo-600 font-mono">{timeLeft}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto max-h-48 custom-scrollbar pr-2">
          {(Array.isArray(dailyChallenges) ? dailyChallenges : []).map((challenge, idx) => (
            <div 
              key={idx}
              onClick={() => {
                setActiveChallenge(challenge);
                setOutput('');
              }}
              className={\`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md flex flex-col \${
                activeChallenge?.title === challenge.title 
                  ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20' 
                  : 'border-slate-200 bg-white hover:border-indigo-300'
              }\`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-800 text-sm">{challenge.title}</h3>
                <span className={\`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider \${
                  challenge.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                }\`}>
                  {challenge.difficulty}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 flex-1">{challenge.description}</p>
              {challenge.clue && (
                <p className="text-[10px] text-indigo-500 mt-2 font-medium italic border-t border-indigo-100 pt-2">💡 Clue: {challenge.clue}</p>
              )}
            </div>
          ))}
        </div>
        
        {activeChallenge && (
          <div className="mt-2 bg-indigo-600 text-white p-4 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 shadow-sm">
            <div>
              <h3 className="font-bold mb-1">Challenge Mode: {activeChallenge.title}</h3>
              <p className="text-indigo-100 text-sm opacity-90 max-w-2xl">{activeChallenge.description}</p>
              {activeChallenge.clue && (
                <p className="text-amber-200 text-xs mt-2 italic font-medium">💡 Clue: {activeChallenge.clue}</p>
              )}
            </div>
            <button 
              onClick={() => {
                setActiveChallenge(null);
                setOutput('');
              }}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
              title="Cancel Challenge Mode"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}`;

let oldCode = fs.readFileSync('src/pages/Playground.tsx', 'utf8');
const fullReturnBlockRegex = /return \([\s\S]+?\);\n}/;
let resultCode = oldCode.replace(fullReturnBlockRegex, newReturnBlock + '\n}');

fs.writeFileSync('src/pages/Playground.tsx', resultCode);
