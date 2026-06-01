'use client';

import React, { useState } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { useStore } from '@/store/useStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Heart, Plus, Search, Sparkles, Send, User, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  _id: string;
  userName: string;
  content: string;
  createdAt: string;
}

interface Post {
  _id: string;
  authorName: string;
  title: string;
  content: string;
  category: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export default function Community() {
  const queryClient = useQueryClient();
  const { user, token, apiUrl } = useStore();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newContent, setNewContent] = useState('');
  
  // Comment typing box trackers
  const [commentInput, setCommentInput] = useState<{ [postId: string]: string }>({});

  const categories = ['All', 'Artificial Intelligence', 'Full Stack Development', 'UI/UX Design', 'General'];

  // Fetch Posts
  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/community/posts`);
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    },
    initialData: [
      {
        _id: 'p1',
        authorName: 'John Doe',
        title: 'How should I start learning LLMs in 2026?',
        content: 'I have some basic Python knowledge and want to transition to AI engineering. Should I learn PyTorch first or dive straight into prompt engineering and API integrations? Thanks!',
        category: 'Artificial Intelligence',
        likes: [],
        comments: [
          {
            _id: 'c-mock-1',
            userName: 'Admin User',
            content: 'Hi John! I recommend starting with API integrations (OpenAI/Gemini) to build interactive apps quickly. Once you understand the application layer, dive deeper into models via PyTorch/Hugging Face!',
            createdAt: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString()
      }
    ]
  });

  // Create Post Mutation
  const createPostMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error('Sign in to publish posts');
      const res = await fetch(`${apiUrl}/community/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTitle, content: newContent, category: newCategory })
      });
      if (!res.ok) throw new Error('Failed to create post');
      return res.json();
    },
    onSuccess: () => {
      setShowCreateModal(false);
      setNewTitle('');
      setNewContent('');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (err: any) => alert(err.message)
  });

  // Like Mutation
  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      if (!token) throw new Error('Please login to like posts');
      const res = await fetch(`${apiUrl}/community/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to like');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (err: any) => alert(err.message)
  });

  // Comment Mutation
  const commentMutation = useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      if (!token) throw new Error('Please sign in to comment');
      const res = await fetch(`${apiUrl}/community/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });
      if (!res.ok) throw new Error('Failed to post comment');
      return res.json();
    },
    onSuccess: (_, variables) => {
      setCommentInput(prev => ({ ...prev, [variables.postId]: '' }));
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (err: any) => alert(err.message)
  });

  const handlePostCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createPostMutation.mutate();
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInput[postId];
    if (!text?.trim()) return;
    commentMutation.mutate({ postId, content: text });
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                          post.content.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-border">
          <div className="space-y-1">
            <h1 className="font-display font-extrabold text-3xl flex items-center space-x-2">
              <MessageSquare className="w-8 h-8 text-primary" />
              <span>Community Forum</span>
            </h1>
            <p className="text-xs text-muted-foreground">Collaborate, debug, and learn alongside developers and AI architects.</p>
          </div>
          
          <button
            onClick={() => token ? setShowCreateModal(true) : alert("Please sign in to make a new post.")}
            className="px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Discussion</span>
          </button>
        </div>

        {/* Search & Categories */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search discussion threads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card/40 border border-border focus:border-primary focus:outline-none rounded-xl text-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${selectedCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted/10 text-muted-foreground hover:bg-muted/20'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Posts List */}
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-32 bg-card/25 border border-border/40 rounded-2xl animate-pulse"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No threads found in this category.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="p-6 rounded-2xl glass-card border border-border/40 space-y-4 shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[9px] font-bold text-primary">
                      {post.category}
                    </span>
                    <h3 className="font-display font-bold text-lg hover:text-primary transition-colors cursor-pointer">{post.title}</h3>
                    <span className="text-[10px] text-muted-foreground block flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>Posted by {post.authorName}</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line">{post.content}</p>

                {/* Like & Comment counters */}
                <div className="flex items-center space-x-4 pt-2 border-t border-border/40 text-xs">
                  <button
                    onClick={() => likeMutation.mutate(post._id)}
                    className="flex items-center space-x-1 hover:text-red-400 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${user && post.likes?.includes(user.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{post.likes?.length || 0} Likes</span>
                  </button>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span>{post.comments?.length || 0} Comments</span>
                  </div>
                </div>

                {/* Comments box */}
                <div className="space-y-3 pl-4 border-l border-border mt-3">
                  {post.comments?.map((comment) => (
                    <div key={comment._id} className="text-[11px] p-2.5 bg-muted/5 border border-border/40 rounded-xl space-y-1">
                      <div className="flex justify-between font-bold text-foreground/80">
                        <span>{comment.userName}</span>
                        <span className="text-[8px] font-medium text-muted-foreground">{mounted ? new Date(comment.createdAt).toLocaleDateString() : ''}</span>
                      </div>
                      <p className="text-muted-foreground leading-normal">{comment.content}</p>
                    </div>
                  ))}

                  {/* Comment Input */}
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="text"
                      placeholder="Write your response..."
                      value={commentInput[post._id] || ''}
                      onChange={(e) => setCommentInput(prev => ({ ...prev, [post._id]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post._id)}
                      className="flex-1 text-[11px] bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-lg px-2.5 py-1.5 text-foreground"
                    />
                    <button
                      onClick={() => handleCommentSubmit(post._id)}
                      className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-amber-400"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Create Post Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCreateModal(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-lg glass border border-border rounded-2xl shadow-2xl p-6 z-10"
              >
                <div className="flex items-center space-x-2.5 mb-5">
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                  <h3 className="font-display font-bold text-lg">Start a New Discussion</h3>
                </div>

                <form onSubmit={handlePostCreate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Topic Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Setting up Mongoose local configurations"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-card border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                    >
                      <option value="General">General</option>
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Full Stack Development">Full Stack Development</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Discussion Description</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Describe what you want to talk about, paste bugs codes..."
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground resize-none"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 border border-border hover:bg-muted/10 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createPostMutation.isPending}
                      className="px-4 py-2 bg-primary hover:bg-amber-400 text-primary-foreground font-bold rounded-xl text-xs"
                    >
                      {createPostMutation.isPending ? 'Publishing...' : 'Publish Thread'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PageWrapper>
  );
}
