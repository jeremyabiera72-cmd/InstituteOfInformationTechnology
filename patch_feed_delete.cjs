const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "await db.delete(communityFeed).where(eq(communityFeed.id, parseInt(req.params.id)));",
  "await db.delete(postComments).where(eq(postComments.postId, parseInt(req.params.id)));\n         await db.delete(postReactions).where(eq(postReactions.postId, parseInt(req.params.id)));\n         await db.delete(communityFeed).where(eq(communityFeed.id, parseInt(req.params.id)));"
);

fs.writeFileSync('server.ts', code);
console.log("Patched feed delete");
