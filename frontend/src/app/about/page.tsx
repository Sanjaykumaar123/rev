'use client';

import React from 'react';
import PageWrapper from '@/components/PageWrapper';
import { ShieldCheck, Eye, Target, Users, Sparkles, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  const coreValues = [
    {
      title: 'Our Mission',
      description: 'Democratize engineering education and accelerate startup adoption of next-generation intelligence structures.',
      icon: Target
    },
    {
      title: 'Our Vision',
      description: 'Establish a unified technical career pipeline where verified student progression matches direct corporate hiring Needs.',
      icon: Eye
    },
    {
      title: 'Core Credibility',
      description: 'Deliver peerless IT development services and security auditing with a zero-exploit guarantee.',
      icon: ShieldCheck
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
            <Sparkles className="w-3.5 h-3.5" />
            <span>Corporate Profiles</span>
          </motion.div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl">About Flight 3.0</h1>
          <p className="text-muted-foreground">
            Digimation Flight 3.0 is a leading full-stack career development, academic certification, and generative AI workflow consulting corporation.
          </p>
        </div>

        {/* Company Overview Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {coreValues.map((value, idx) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-6 rounded-2xl glass-card border border-border/40 space-y-4"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary mb-2">
                <value.icon className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg">{value.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Story details */}
        <div className="p-8 rounded-2xl glass border border-border/40 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h3 className="font-display font-extrabold text-2xl">The Innovation Pipeline</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Founded as an industrial training provider, Digimation has evolved into a global full-stack solution provider. We bridge the gap between classroom theory and enterprise software challenges.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our unique system gamifies learning by awarding XP and leveling up credentials. Completed modules generate verified blockchain-grade certificates that corporate partners instantly trust.
            </p>
          </div>

          <div className="relative h-60 rounded-xl bg-card border border-border overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 neural-grid opacity-30 pointer-events-none"></div>
            <div className="text-center space-y-2 relative z-10 p-6">
              <Award className="w-12 h-12 text-primary mx-auto animate-pulse" />
              <span className="font-display font-bold text-sm block">ISO 9001 Certified System</span>
              <span className="text-[10px] text-muted-foreground block">Audited compliance for educational curricula and technical integrations.</span>
            </div>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
