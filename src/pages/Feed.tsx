import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.tsx';
import { MessageSquare, Loader2, Heart, MessageCircle, MoreVertical, Link, Hash, ChevronDown, CheckCircle2, Trash2, Code, CornerDownRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Feed() {
  const { user } = useAuth();
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{type: 'delete', id: number} | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [filter, setFilter] = useState<'recent' | 'my-posts'>('recent');
  const [commentingOn, setCommentingOn] = useState<number | null>(null);
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const userArea = localStorage.getItem('userArea') || 'BSCS';
      const res = await axios.get(`/api/feed?area=${userArea}`);
      setFeed(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const userArea = localStorage.getItem('userArea') || 'BSCS';
      const res = await axios.post('/api/feed', { content, area: userArea });
      setFeed([res.data, ...feed]);
      setContent('');
      setIsFocused(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReaction = async (postId: number) => {
    try {
      const res = await axios.post(`/api/feed/${postId}/reactions`);
      setFeed((Array.isArray(feed) ? feed : []).map(p => {
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
      const res = await axios.post(`/api/feed/${postId}/comments`, { content: commentContent });
      setFeed((Array.isArray(feed) ? feed : []).map(p => {
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

  const handleDelete = async (postId: number) => {
    try {
      await axios.delete(`/api/feed/${postId}`);
      setFeed((Array.isArray(feed) ? feed : []).filter(p => p.id !== postId));
      setConfirmAction(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'delete') {
      handleDelete(confirmAction.id);
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  const filteredFeed = (Array.isArray(feed) ? feed : []).filter(post => {
    if (filter === 'my-posts') {
      return post.author?.email === user?.email || post.author?.id === user?.uid; // Fallback check
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg shadow-sm border border-indigo-200">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Community Feed</h1>
            <p className="text-slate-500">Discuss topics, ask questions, and connect with peers.</p>
          </div>
        </div>
      </div>

      {/* Composer */}
      <div className={`bg-white rounded-xl shadow-sm border transition-all duration-300 ${isFocused ? 'border-indigo-400 ring-4 ring-indigo-50' : 'border-slate-200'}`}>
        <form onSubmit={handleSubmit} className="p-4 sm:p-5">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center font-bold text-slate-500 overflow-hidden border border-slate-200">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <textarea
                value={content}
                onFocus={() => setIsFocused(true)}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start a discussion or share an update..."
                className="w-full min-h-[60px] p-2 bg-transparent focus:outline-none resize-none text-slate-800 placeholder:text-slate-400 text-lg leading-relaxed"
              />
            </div>
          </div>
          
          {(isFocused || content.trim()) && (
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                
                <button type="button" onClick={() => setContent(prev => prev + ' #')} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Add Topic Tag">
                  <Hash className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsFocused(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Feed Filters */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex gap-6 text-sm font-medium">
          <button 
            onClick={() => setFilter('recent')}
            className={`pb-2 transition-colors ${filter === 'recent' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>Recent</button>
          <button 
            onClick={() => setFilter('my-posts')}
            className={`pb-2 transition-colors ${filter === 'my-posts' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>My Posts</button>
        </div>
      </div>

      {/* Feed Stream */}
      <div className="space-y-5">
        {filteredFeed.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <MessageSquare className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-600 font-medium text-lg">It's quiet here...</p>
            <p className="text-slate-400 mt-1">Be the first to start a conversation!</p>
          </div>
        ) : (
          filteredFeed.map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300">
              <div className="p-5 sm:p-6">
                
                {/* Author Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center font-bold text-slate-500 overflow-hidden border border-slate-200">
                      {post.author?.fullName?.charAt(0) || post.author?.email?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-slate-900 leading-tight hover:text-indigo-600 cursor-pointer transition-colors">
                          {post.author?.fullName || post.author?.email?.split('@')[0]}
                        </h3>
                        <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  
                  {post.author?.email === user?.email && (
                    <button onClick={() => setConfirmAction({ type: 'delete', id: post.id })} className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors" title="Delete Post">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="mb-5">
                  <p className="text-slate-800 text-[15px] leading-relaxed whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Tags (Mock) */}
                <div className="flex gap-2 mb-5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer transition-colors">
                    General
                  </span>
                </div>

                {/* Interactions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-6">
                    {/* Programmers Reaction (Code) */}
                    <button onClick={() => handleReaction(post.id)} className={`flex items-center gap-2 ${post.reactions?.some((r: any) => r.user?.email === user?.email || r.userId === user?.uid) ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'} transition-colors group`}>
                      <div className={`p-1.5 rounded-full transition-colors ${post.reactions?.some((r: any) => r.user?.email === user?.email || r.userId === user?.uid) ? 'bg-indigo-50' : 'group-hover:bg-indigo-50'}`}>
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
                    </button>
                  </div>
                  

                </div>
              </div>
              
              {/* Comments Section */}
              {(post.comments?.length > 0 || commentingOn === post.id) && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-5 sm:p-6 space-y-4">
                  {post.comments?.map((comment: any) => (
                    <div key={comment.id} className="flex items-start gap-3">
                      <CornerDownRight className="w-4 h-4 text-slate-300 mt-2 shrink-0" />
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-600 text-xs overflow-hidden">
                        {comment.author?.fullName?.charAt(0) || comment.author?.email?.charAt(0) || 'U'}
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
                        {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
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
          ))
        )}
      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl relative overflow-hidden">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Post?</h3>
            <p className="text-slate-600 mb-6 text-sm">
              This action cannot be undone. Are you sure you want to permanently delete this post?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirm}
                className="px-4 py-2 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}