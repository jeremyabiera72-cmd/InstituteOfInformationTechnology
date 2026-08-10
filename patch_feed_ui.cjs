const fs = require('fs');
let code = fs.readFileSync('src/pages/Feed.tsx', 'utf8');

// Add Code to imports
code = code.replace("MessageCircle, Share2, MoreVertical, Link, Hash, ChevronDown, CheckCircle2, Trash2 } from 'lucide-react';", "MessageCircle, Share2, MoreVertical, Link, Hash, ChevronDown, CheckCircle2, Trash2, Code, CornerDownRight } from 'lucide-react';");

// State for comments
code = code.replace("const [filter, setFilter] = useState<'recent' | 'my-posts'>('recent');", `const [filter, setFilter] = useState<'recent' | 'my-posts'>('recent');
  const [commentingOn, setCommentingOn] = useState<number | null>(null);
  const [commentContent, setCommentContent] = useState('');`);

// Add handle reaction and comment methods
code = code.replace("const handleDelete = async", `const handleReaction = async (postId: number) => {
    try {
      const res = await axios.post(\`/api/feed/\${postId}/reactions\`);
      setFeed(feed.map(p => {
        if (p.id === postId) {
          const reactions = p.reactions || [];
          if (res.data.action === 'added') {
            return { ...p, reactions: [...reactions, res.data.reaction] };
          } else {
            return { ...p, reactions: reactions.filter((r: any) => r.userId !== res.data.userId) };
          }
        }
        return p;
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleComment = async (e: React.FormEvent, postId: number) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    try {
      const res = await axios.post(\`/api/feed/\${postId}/comments\`, { content: commentContent });
      setFeed(feed.map(p => {
        if (p.id === postId) {
          return { ...p, comments: [...(p.comments || []), res.data] };
        }
        return p;
      }));
      setCommentContent('');
      setCommentingOn(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async`);

// Replace Heart with Code, update reaction and comment count
code = code.replace(`<button className="flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-colors group">
                      <div className="p-1.5 rounded-full group-hover:bg-rose-50 transition-colors">
                        <Heart className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-semibold">0</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors group">
                      <div className="p-1.5 rounded-full group-hover:bg-indigo-50 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-semibold">0</span>
                    </button>`, `{/* Programmers Reaction (Code) */}
                    <button onClick={() => handleReaction(post.id)} className={\`flex items-center gap-2 \${post.reactions?.some((r: any) => r.user?.email === user?.email || r.userId === user?.uid) ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'} transition-colors group\`}>
                      <div className={\`p-1.5 rounded-full transition-colors \${post.reactions?.some((r: any) => r.user?.email === user?.email || r.userId === user?.uid) ? 'bg-indigo-50' : 'group-hover:bg-indigo-50'}\`}>
                        <Code className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-semibold">{post.reactions?.length || 0}</span>
                    </button>
                    {/* Comments Toggle */}
                    <button onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors group">
                      <div className="p-1.5 rounded-full group-hover:bg-indigo-50 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-semibold">{post.comments?.length || 0}</span>
                    </button>`);

// Render comments
code = code.replace(`</article>
          ))`, `  
              {/* Comments Section */}
              {(post.comments?.length > 0 || commentingOn === post.id) && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-5 sm:p-6 space-y-4">
                  {post.comments?.map((comment: any) => (
                    <div key={comment.id} className="flex items-start gap-3">
                      <CornerDownRight className="w-4 h-4 text-slate-300 mt-2 shrink-0" />
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-600 text-xs overflow-hidden">
                        {comment.author?.avatarUrl ? <img src={comment.author.avatarUrl} alt="Profile" className="w-full h-full object-cover" /> : comment.author?.fullName?.charAt(0) || comment.author?.email?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800 text-sm">{comment.author?.fullName || comment.author?.email?.split('@')[0]}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                        </div>
                        <p className="text-slate-700 text-sm whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {commentingOn === post.id && (
                    <form onSubmit={(e) => handleComment(e, post.id)} className="flex items-start gap-3 mt-4 animate-in fade-in slide-in-from-top-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-600 text-xs overflow-hidden border border-slate-300">
                        {user?.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" /> : user?.displayName?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          placeholder="Write a comment..."
                          className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-sm"
                          autoFocus
                        />
                        <button
                          type="submit"
                          disabled={!commentContent.trim()}
                          className="px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                        >
                          Post
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </article>
          ))`);

fs.writeFileSync('src/pages/Feed.tsx', code);
console.log("Patched Feed");
