'use client';

import React from 'react';
import PageWrapper from '@/components/PageWrapper';
import { Star, Trophy, Users, Award, ExternalLink, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SuccessStories() {
  const statistics = [
    { number: '94%', label: 'Placed Interns in 2025' },
    { number: '120+', label: 'Hiring Partner Companies' },
    { number: '$85k', label: 'Average Grad Starter Salary' },
    { number: '200k+', label: 'Learning XP Earned' }
  ];

  const stories = [
    {
      studentName: 'Aishwarya Roy',
      role: 'Junior ML Engineer',
      company: 'Digimation Labs',
      quote: 'Digimation Flight changed my career path. I generated an AI roadmap, studied PyTorch modules in the Academy, applied to the internal labs internship, and secured a full-time role within 4 months!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      rating: 5
    },
    {
      studentName: 'Rohan Shah',
      role: 'Full-Stack Developer',
      company: 'SaaSify Inc.',
      quote: 'The AI Resume Analyzer is a game changer. It highlighted missing database keywords in my history and suggested actionable layout steps. My updated resume unlocked interviews immediately.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      rating: 5
    },
    {
      studentName: 'Michael Chen',
      role: 'UI/UX Visual Engineer',
      company: 'FramerTech',
      quote: 'Building projects in the Academy allowed me to curate a premium portfolio that stood out. I was able to showcase real verified certificates, giving me instant credibility during interviews.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      rating: 5
    }
  ];

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Success Indicators</span>
          </motion.div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl">Success Stories & Placements</h1>
          <p className="text-muted-foreground">
            See how our cohort students, junior engineers, and career switchers utilized the Flight ecosystem to secure roles at leading technology groups.
          </p>
        </div>

        {/* Big Placement Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {statistics.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="p-6 rounded-2xl glass-card border border-border/40 text-center space-y-2"
            >
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-primary bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
                {stat.number}
              </span>
              <span className="text-xs text-muted-foreground block font-medium">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stories.map((story, idx) => (
            <motion.div
              key={story.studentName}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-6 rounded-2xl glass-card border border-border/40 flex flex-col justify-between h-[360px]"
            >
              <div className="space-y-4">
                <div className="flex gap-0.5 text-primary">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary text-glow" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  &ldquo;{story.quote}&rdquo;
                </p>
              </div>

              {/* Student Meta */}
              <div className="flex items-center space-x-3 pt-4 border-t border-border/40 mt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={story.avatar}
                  alt={story.studentName}
                  className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
                />
                <div>
                  <h4 className="text-xs font-bold text-foreground">{story.studentName}</h4>
                  <span className="text-[10px] text-primary block font-semibold">{story.role} at {story.company}</span>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Hiring partner logos mockup marquee */}
        <div className="p-8 rounded-2xl glass border border-border/40 text-center space-y-6">
          <h4 className="font-display font-semibold text-xs text-muted-foreground uppercase tracking-widest">Hiring & Placement Network</h4>
          
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-65">
            {['Digimation Labs', 'SaaSify Inc.', 'FramerTech', 'Linear Soft', 'Stripe Payments', 'Vercel Deploy'].map(logo => (
              <span key={logo} className="text-xs font-extrabold font-display border border-border/40 px-3 py-1.5 rounded-lg bg-card/25">
                {logo}
              </span>
            ))}
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
