const fs = require('fs');
let code = fs.readFileSync('src/pages/Playground.tsx', 'utf8');

// Add clue to dailyChallenges
const oldChallenges = `const dailyChallenges = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'Easy',
  },
  {
    title: 'Valid Palindrome',
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
    difficulty: 'Easy',
  },
  {
    title: 'Merge Intervals',
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.',
    difficulty: 'Medium',
  }
];`;

const newChallenges = `const dailyChallenges = [
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
];`;

code = code.replace(oldChallenges, newChallenges);

fs.writeFileSync('src/pages/Playground.tsx', code);
