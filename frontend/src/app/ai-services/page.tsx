'use client';

import React from 'react';
import PageWrapper from '@/components/PageWrapper';
import { Sparkles, Brain, Bot, Cpu, Database, Eye, Merge, MessageSquare, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AiServices() {
  const services = [
    {
      title: 'AI Consulting & Strategy',
      description: 'Design custom AI adoption roadmaps, select the right LLMs, evaluate security profiles, and build custom integration plans.',
      icon: MessageSquare,
      color: 'text-primary',
      glow: 'shadow-primary/10'
    },
    {
      title: 'Workflow Automation',
      description: 'Streamline repetitive processes by integrating agentic AI models to automate emails, invoice parsing, and data Entry.',
      icon: Cpu,
      color: 'text-amber-500',
      glow: 'shadow-amber-500/10'
    },
    {
      title: 'Conversational Chatbot Solutions',
      description: 'Build enterprise-grade client support chat agents integrated with custom vector DBs (RAG) and customer profiles.',
      icon: Bot,
      color: 'text-yellow-400',
      glow: 'shadow-yellow-400/10'
    },
    {
      title: 'Custom AI Model Development',
      description: 'Design and train custom neural networks, fine-tune open-source LLMs (Llama, Mistral) on proprietary enterprise data.',
      icon: Brain,
      color: 'text-primary',
      glow: 'shadow-primary/10'
    },
    {
      title: 'Big Data & AI Analytics',
      description: 'Uncover hidden patterns in corporate structures and user actions using advanced statistical models and predictive analytics.',
      icon: Database,
      color: 'text-amber-500',
      glow: 'shadow-amber-500/10'
    },
    {
      title: 'Computer Vision Systems',
      description: 'Implement real-time object detection, face verification, visual inspection algorithms, and semantic segmentation.',
      icon: Eye,
      color: 'text-yellow-400',
      glow: 'shadow-yellow-400/10'
    },
    {
      title: 'Corporate AI Integration',
      description: 'Seamlessly stitch external AI API models (OpenAI, Anthropic, Gemini) with legacy database architectures and ERP systems.',
      icon: Merge,
      color: 'text-primary',
      glow: 'shadow-primary/10'
    },
    {
      title: 'Generative AI Applications',
      description: 'Build custom text, image, audio generation software enabling marketing, design, and content departments to scale.',
      icon: Sparkles,
      color: 'text-amber-500',
      glow: 'shadow-amber-500/10'
    }
  ];

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>AI Consulting & Dev Hub</span>
          </motion.div>
          
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
            AI & Generative AI Services
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Scale operations, elevate employee efficiency, and automate workflows with our state-of-the-art AI design and implementation solutions.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className={`p-6 rounded-2xl glass-card flex flex-col justify-between h-[280px] shadow-lg border border-border/40 hover:shadow-2xl ${service.glow}`}
            >
              <div>
                <div className="p-3 w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center mb-5">
                  <service.icon className={`w-6 h-6 ${service.color}`} />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground/90 mb-2">{service.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
              
              <button 
                onClick={() => alert(`Consulting for "${service.title}" is available. Schedule a meeting via our Contact page!`)}
                className="text-xs text-primary font-bold flex items-center space-x-1 hover:underline mt-4 group w-fit"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </PageWrapper>
  );
}
