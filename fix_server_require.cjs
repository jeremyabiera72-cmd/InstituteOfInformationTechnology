const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace("import { eq } from 'drizzle-orm';", "import { eq, and } from 'drizzle-orm';");
code = code.replace("sharedLinks } from './src/db/schema.ts';", "sharedLinks, postComments, postReactions } from './src/db/schema.ts';");

code = code.replace(/require\('\.\/src\/db\/schema\.ts'\)\.postComments/g, "postComments");
code = code.replace(/require\('\.\/src\/db\/schema\.ts'\)\.postReactions/g, "postReactions");
code = code.replace(/require\('\.\/src\/db\/schema\.ts'\)\.sharedLinks/g, "sharedLinks");
code = code.replace(/require\('drizzle-orm'\)\.and/g, "and");

// Also remove the destructuring that uses require inside the endpoint
code = code.replace(/const { postReactions } = require\('\.\/src\/db\/schema\.ts'\);/g, "");
code = code.replace(/const { and } = require\('drizzle-orm'\);/g, "");

fs.writeFileSync('server.ts', code);
console.log("Fixed requires in server.ts");
