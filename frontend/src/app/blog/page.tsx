'use client';

import React, { useState } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { BookOpen, Calendar, User, ArrowRight, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Blog() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'AI Engineering', 'Ecosystem Updates', 'Career Strategies', 'Technical Tutorials'];

  const posts = [
    {
      id: 1,
      title: 'Building Multi-Agent AI Systems with Next.js & Gemini',
      excerpt: 'Explore how to leverage LLM APIs and background execution tools to coordinate multiple AI agent workflows on the client side.',
      category: 'AI Engineering',
      date: 'June 01, 2026',
      author: 'Dr. Sarah Carter',
      image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a'
    },
    {
      id: 2,
      title: 'How Flight 3.0 Combines Gamification and Technical Placements',
      excerpt: 'Read about our hybrid learning design, our custom XP systems, and how achievements translate directly into corporate matches.',
      category: 'Ecosystem Updates',
      date: 'May 28, 2026',
      author: 'Sanjay Kumaar',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'
    },
    {
      id: 3,
      title: 'How to Beat the ATS: Optimization Techniques for Dev Resumes',
      excerpt: 'Discover the exact keyword densities and format checks required by recruiter screening algorithms for junior developers.',
      category: 'Career Strategies',
      date: 'May 15, 2026',
      author: 'Alex Rivers',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173'
    },
    {
      id: 4,
      title: 'Introduction to MongoDB Schema Validation and Index Audits',
      excerpt: 'A comprehensive technical tutorial demonstrating mongoose model construction, index locks, and validation safeguards.',
      category: 'Technical Tutorials',
      date: 'May 02, 2026',
      author: 'Admin Team',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c'
    }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Platform Resource Hub</span>
          </motion.div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl">Digimation Blog</h1>
          <p className="text-muted-foreground">
            Stay up to date with the latest technological developments in generative AI, software engineering tutorials, and career progression guides.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10 pb-6 border-b border-border">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search resource articles..."
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
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${selectedCategory === cat ? 'bg-primary text-primary-foreground font-bold' : 'bg-muted/10 text-muted-foreground hover:bg-muted/20'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No resources found matching the criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredPosts.map((post) => (
              <motion.article
                key={post.id}
                whileHover={{ y: -4 }}
                className="rounded-2xl glass-card border border-border/40 overflow-hidden flex flex-col justify-between h-[420px] group cursor-pointer"
                onClick={() => alert(`Full article content for "${post.title}" will load here.`)}
              >
                <div className="relative h-40 bg-muted overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-3 left-3 bg-card/85 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold text-primary border border-border">
                    {post.category}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
                      <span className="flex items-center"><Calendar className="w-3 h-3 text-primary mr-1" /> {post.date}</span>
                      <span>•</span>
                      <span className="flex items-center"><User className="w-3 h-3 text-primary mr-1" /> {post.author}</span>
                    </div>

                    <h3 className="font-display font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <span className="text-[10px] text-primary font-bold flex items-center space-x-1 hover:underline mt-4 group">
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        )}

      </div>
    </PageWrapper>
  );
}
