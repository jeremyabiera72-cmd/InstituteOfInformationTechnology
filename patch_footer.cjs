const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const footerTargetBlock = `<motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative z-10 mt-16 md:mt-0"
        >
          <p className="text-white/60 text-sm font-medium">
            © {new Date().getFullYear()} SystemHub. All rights reserved.
          </p>
        </motion.div>`;

const footerReplacementBlock = `<motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative z-10 mt-16 md:mt-0 text-center"
        >
          <p className="text-white/60 text-sm font-medium">
            © {new Date().getFullYear()} DIT System. All rights reserved.
          </p>
        </motion.div>`;

code = code.replace(footerTargetBlock, footerReplacementBlock);
fs.writeFileSync('src/pages/Home.tsx', code);
