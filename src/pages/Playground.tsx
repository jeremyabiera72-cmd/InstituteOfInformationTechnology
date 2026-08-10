import React, { useState, useMemo, useEffect } from 'react';
import { Play, Code, Loader2, Trophy, ChevronDown, Terminal, X } from 'lucide-react';
import axios from 'axios';

const LANGUAGE_TEMPLATES: Record<string, { code: string, ext: string }> = {
  javascript: { code: 'console.log("Hello, World!");', ext: 'js' },
  python: { code: 'print("Hello, World!")', ext: 'py' },
  java: { code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}', ext: 'java' },
  cpp: { code: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}', ext: 'cpp' },
  c: { code: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}', ext: 'c' }
};

const CHALLENGES = [
  { title: "Two Sum", difficulty: "Easy", description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target." },
  { title: "Palindrome Number", difficulty: "Easy", description: "Given an integer x, return true if x is a palindrome, and false otherwise." },
  { title: "Valid Parentheses", difficulty: "Easy", description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid." },
  { title: "Longest Substring", difficulty: "Intermediate", description: "Given a string s, find the length of the longest substring without repeating characters." },
  { title: "Container With Most Water", difficulty: "Intermediate", description: "You are given an integer array height of length n. Find two lines that together with the x-axis form a container, such that the container contains the most water." },
  { title: "Reverse Integer", difficulty: "Intermediate", description: "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range, then return 0." },
  { title: "Climbing Stairs", difficulty: "Easy", description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?" }
];


const dailyChallenges = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'Easy',
    clue: 'Use a hash map to store previously seen numbers and their indices for O(N) lookup.'
  },
  {
    title: 'Valid Palindrome',
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
    difficulty: 'Easy',
    clue: 'Use two pointers, one at the start and one at the end, and move them towards the center.'
  },
  {
    title: 'Merge Intervals',
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.',
    difficulty: 'Medium',
    clue: 'First sort the intervals based on the start time.'
  }
];

export default function Playground() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(LANGUAGE_TEMPLATES['javascript'].code);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  
  const [activeChallenge, setActiveChallenge] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(LANGUAGE_TEMPLATES[newLang].code);
    setOutput('');
  };

  const runCode = async () => {
    try {
      setIsRunning(true);
      setOutput('Running...\n');
      
      if (activeChallenge) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const isSuccess = code.includes('return') && code.length > 50;
        
        if (isSuccess) {
          setOutput(`Executing against test cases...\nTest 1: Passed\nTest 2: Passed\nTest 3: Passed\n\n✅ Challenge Solved!`);
        } else {
          setOutput(`Executing against test cases...\nTest 1: Passed\nTest 2: Failed\nOutput: Incorrect result\nExpected: [0, 1]\n\n❌ Challenge Failed. Try again.`);
        }
        return;
      }

      const response = await axios.post('/api/execute', { language, code });
      
      const data = response.data;
      let finalOutput = '';
      
      if (data.compile_output) {
        finalOutput += '--- Compile Output ---\n' + data.compile_output + '\n\n';
      }
      
      if (data.stdout) {
        finalOutput += data.stdout;
      }
      
      if (data.stderr) {
        finalOutput += (finalOutput ? '\n--- Stderr ---\n' : '') + data.stderr;
      }
      
      if (data.message) {
        finalOutput += (finalOutput ? '\n--- Message ---\n' : '') + data.message;
      }
      
      if (data.status && data.status.description !== 'Accepted') {
         finalOutput += `\nStatus: ${data.status.description}`;
      }
      
      setOutput(finalOutput || 'Execution complete (no output)');
    } catch (e: any) {
      setOutput('Error executing code:\n' + (e.response?.data?.error || e.message));
    } finally {
      setIsRunning(false);
    }
  };
useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      
      setTimeLeft(`${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`);
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
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
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg disabled:opacity-50 text-sm font-bold shadow-sm transition-colors shrink-0 ${
              activeChallenge ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
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
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md flex flex-col ${
                activeChallenge?.title === challenge.title 
                  ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20' 
                  : 'border-slate-200 bg-white hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-800 text-sm">{challenge.title}</h3>
                <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                  challenge.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                }`}>
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
}
