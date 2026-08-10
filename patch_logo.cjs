const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const targetBlock = `<motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-16 md:mb-24"
          >
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white/20 shadow-xl">
               <img src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80" alt="DIT Logo" className="w-full h-full object-cover" />
            </div>
          </motion.div>`;

const replacementBlock = `<motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-16 md:mb-24 flex justify-center"
          >
            <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white/20 shadow-2xl">
               <img src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=512&q=80" alt="DIT Logo" className="w-full h-full object-cover" />
            </div>
          </motion.div>`;

code = code.replace(targetBlock, replacementBlock);

// Also maybe center the text in that section to match? 
// The user said "the image logo is center and big"
// Let's just center the logo first, wait, if the text is left aligned it might look okay. Let's center the whole relative z-10 content block if it's better.
const textTargetBlock = `<motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
              Welcome to the <br /> DIT System
            </h1>
            <p className="text-white/90 text-lg leading-relaxed max-w-md font-normal">
              Your unified platform for Information Technology studies. Access class notes, submit assignments, collaborate with peers, and sharpen your coding skills.
            </p>
          </motion.div>`;
          
const textReplacementBlock = `<motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center flex flex-col items-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
              Welcome to the <br /> DIT System
            </h1>
            <p className="text-white/90 text-lg leading-relaxed max-w-md font-normal">
              Your unified platform for Information Technology studies. Access class notes, submit assignments, collaborate with peers, and sharpen your coding skills.
            </p>
          </motion.div>`;

code = code.replace(textTargetBlock, textReplacementBlock);

fs.writeFileSync('src/pages/Home.tsx', code);
