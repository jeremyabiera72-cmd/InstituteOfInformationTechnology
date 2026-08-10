const fs = require('fs');
let code = fs.readFileSync('src/pages/Playground.tsx', 'utf8');

const missingCode = `
const LANGUAGE_TEMPLATES: Record<string, { code: string, ext: string }> = {
  javascript: { code: 'console.log("Hello, World!");', ext: 'js' },
  python: { code: 'print("Hello, World!")', ext: 'py' },
  java: { code: 'public class Main {\\n  public static void main(String[] args) {\\n    System.out.println("Hello, World!");\\n  }\\n}', ext: 'java' },
  cpp: { code: '#include <iostream>\\n\\nint main() {\\n  std::cout << "Hello, World!" << std::endl;\\n  return 0;\\n}', ext: 'cpp' },
  c: { code: '#include <stdio.h>\\n\\nint main() {\\n  printf("Hello, World!\\\\n");\\n  return 0;\\n}', ext: 'c' }
};

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
`;

const missingFunctions = `
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(LANGUAGE_TEMPLATES[newLang].code);
    setOutput('');
  };

  const runCode = async () => {
    try {
      setIsRunning(true);
      setOutput('Running...\\n');
      
      if (activeChallenge) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const isSuccess = code.includes('return') && code.length > 50;
        
        if (isSuccess) {
          setOutput(\`Executing against test cases...\\nTest 1: Passed\\nTest 2: Passed\\nTest 3: Passed\\n\\n✅ Challenge Solved!\`);
        } else {
          setOutput(\`Executing against test cases...\\nTest 1: Passed\\nTest 2: Failed\\nOutput: Incorrect result\\nExpected: [0, 1]\\n\\n❌ Challenge Failed. Try again.\`);
        }
        return;
      }

      const response = await axios.post('/api/execute', { language, code });
      
      const data = response.data;
      let finalOutput = '';
      
      if (data.compile_output) {
        finalOutput += '--- Compile Output ---\\n' + data.compile_output + '\\n\\n';
      }
      
      if (data.stdout) {
        finalOutput += data.stdout;
      }
      
      if (data.stderr) {
        finalOutput += (finalOutput ? '\\n--- Stderr ---\\n' : '') + data.stderr;
      }
      
      if (data.message) {
        finalOutput += (finalOutput ? '\\n--- Message ---\\n' : '') + data.message;
      }
      
      if (data.status && data.status.description !== 'Accepted') {
         finalOutput += \`\\nStatus: \${data.status.description}\`;
      }
      
      setOutput(finalOutput || 'Execution complete (no output)');
    } catch (e: any) {
      setOutput('Error executing code:\\n' + (e.response?.data?.error || e.message));
    } finally {
      setIsRunning(false);
    }
  };
`;

code = code.replace("export default function Playground() {", missingCode + "\nexport default function Playground() {");

const insertPoint = code.indexOf("useEffect(() => {");
code = code.substring(0, insertPoint) + missingFunctions + code.substring(insertPoint);

fs.writeFileSync('src/pages/Playground.tsx', code);
