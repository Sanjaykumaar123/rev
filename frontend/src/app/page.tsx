'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';
import { Sparkles, ArrowRight, Brain, Briefcase, GraduationCap, ShieldCheck, Star, Users, Award, Database, TrendingUp, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setGlowPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const stats = [
    { number: '1200+', label: 'Students Empowered', icon: Users },
    { number: '150+', label: 'Courses & Workshops', icon: GraduationCap },
    { number: '200+', label: 'Internships Available', icon: Briefcase },
    { number: '95%', label: 'Success Placement Rate', icon: TrendingUp }
  ];

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section 
        onMouseMove={handleMouseMove}
        className="relative min-h-[90vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 neural-grid overflow-hidden group"
      >
        {/* Interactive Mouse Glow */}
        <div 
          className="absolute w-[600px] h-[600px] bg-primary/10 rounded-full filter blur-[80px] pointer-events-none -z-10 transition-transform duration-300 ease-out"
          style={{
            left: `${glowPos.x - 300}px`,
            top: `${glowPos.y - 300}px`,
          }}
        />

        {/* Ambient Gradient Lighting */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full filter blur-[100px] -z-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full filter blur-[100px] -z-20"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass border border-primary/20 text-xs font-semibold text-primary"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
              <span>Digimation Flight 3.0 Platform Live</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight"
            >
              Building Future-Ready Careers &{' '}
              <span className="bg-gradient-to-r from-primary via-amber-400 to-yellow-500 bg-clip-text text-transparent text-glow">
                AI-Powered Businesses
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              AI Services, Education, Internships and Career Opportunities in one intelligent platform. Empowering students and corporate structures under a unified ecosystem.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link 
                href="/register" 
                className="w-full sm:w-auto text-center px-8 py-4 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-amber-400 glow-btn transition-all flex items-center justify-center space-x-2"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/ai-services" 
                className="w-full sm:w-auto text-center px-8 py-4 rounded-xl font-semibold bg-muted/10 border border-border text-foreground hover:bg-muted/20 transition-all flex items-center justify-center"
              >
                Explore Services
              </Link>
            </motion.div>
          </div>

          {/* Right CSS 3D Animated AI Cube Column */}
          <div className="lg:col-span-5 flex justify-center relative min-h-[300px]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="w-[260px] h-[260px] flex items-center justify-center"
            >
              {/* 3D Cube Wrapper */}
              <div className="relative w-40 h-40 transform-style-3d animate-spin" style={{ animationDuration: '15s', transformStyle: 'preserve-3d' }}>
                
                {/* Cube Faces */}
                {/* Front */}
                <div className="absolute inset-0 bg-primary/10 border-2 border-primary/60 rounded-xl flex items-center justify-center transform translate-z-20 backdrop-blur-sm">
                  <Brain className="w-16 h-16 text-primary text-glow" />
                </div>
                {/* Back */}
                <div className="absolute inset-0 bg-amber-500/10 border-2 border-amber-500/60 rounded-xl flex items-center justify-center transform rotate-y-180 -translate-z-20 backdrop-blur-sm">
                  <Cpu className="w-16 h-16 text-amber-500 text-glow" />
                </div>
                {/* Right */}
                <div className="absolute inset-0 bg-yellow-400/10 border-2 border-yellow-400/60 rounded-xl flex items-center justify-center transform rotate-y-90 translate-x-20 backdrop-blur-sm">
                  <Database className="w-16 h-16 text-yellow-400 text-glow" />
                </div>
                {/* Left */}
                <div className="absolute inset-0 bg-primary/10 border-2 border-primary/60 rounded-xl flex items-center justify-center transform -rotate-y-90 -translate-x-20 backdrop-blur-sm">
                  <GraduationCap className="w-16 h-16 text-primary text-glow" />
                </div>
                {/* Top */}
                <div className="absolute inset-0 bg-amber-500/10 border-2 border-amber-500/60 rounded-xl flex items-center justify-center transform rotate-x-90 -translate-y-20 backdrop-blur-sm">
                  <Briefcase className="w-16 h-16 text-amber-500 text-glow" />
                </div>
                {/* Bottom */}
                <div className="absolute inset-0 bg-yellow-400/10 border-2 border-yellow-400/60 rounded-xl flex items-center justify-center transform -rotate-x-90 translate-y-20 backdrop-blur-sm">
                  <Award className="w-16 h-16 text-yellow-400 text-glow" />
                </div>

              </div>

              {/* Decorative Pulsing Spheres */}
              <div className="absolute top-0 right-10 w-4 h-4 rounded-full bg-primary animate-ping"></div>
              <div className="absolute bottom-10 left-10 w-3.5 h-3.5 rounded-full bg-amber-500 animate-pulse"></div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 border-y border-border bg-card/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex flex-col items-center justify-center text-center p-6 rounded-2xl glass-card"
              >
                <div className="p-3.5 rounded-xl bg-primary/10 text-primary mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="font-display font-extrabold text-3xl sm:text-4xl text-glow bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
                  {stat.number}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Ecosystem Core Values / Intro Bento Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight">
            An Intelligent Career Ecosystem
          </h2>
          <p className="text-muted-foreground">
            Flight 3.0 provides complete integration from skill discovery and certification to direct corporate placements and AI consulting solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-2xl glass-card flex flex-col justify-between h-[300px]">
            <div>
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary mb-6">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">AI Career Advisor</h3>
              <p className="text-sm text-muted-foreground">
                Get an automated, interactive, step-by-step career path advisor mapping courses, certs, and projects to your dream job.
              </p>
            </div>
            <Link href="/assistant" className="text-xs text-primary font-bold flex items-center space-x-1 hover:underline mt-4">
              <span>Try Advisor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-2xl glass-card flex flex-col justify-between h-[300px]">
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500 mb-6">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">AI Resume Scorer</h3>
              <p className="text-sm text-muted-foreground">
                Analyze your resume against ATS tracking algorithms and identify gaps in skills, format problems, and text keyword densities.
              </p>
            </div>
            <Link href="/resume" className="text-xs text-primary font-bold flex items-center space-x-1 hover:underline mt-4">
              <span>Scan Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-2xl glass-card flex flex-col justify-between h-[300px]">
            <div>
              <div className="w-10 h-10 rounded-lg bg-yellow-400/20 flex items-center justify-center text-yellow-500 mb-6">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">Academy & Placements</h3>
              <p className="text-sm text-muted-foreground">
                Enroll in university-grade modules, gain real XP as you learn, verify accomplishments, and apply directly to matching internships.
              </p>
            </div>
            <Link href="/academy" className="text-xs text-primary font-bold flex items-center space-x-1 hover:underline mt-4">
              <span>Explore Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
