'use client';

import React from 'react';
import PageWrapper from '@/components/PageWrapper';
import { Terminal, Laptop, Globe, Shield, Activity, Layers, Palette, Cpu, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ItServices() {
  const bentoServices = [
    {
      title: 'Full-Stack Web Development',
      description: 'Design and build high-performance responsive web applications using Next.js, React, Node.js, Express, and modern databases. Crafted for speed, scalability, and premium presentation.',
      icon: Globe,
      span: 'md:col-span-2',
      gradient: 'from-amber-500/20 via-primary/5 to-transparent',
      borderColor: 'hover:border-primary/45'
    },
    {
      title: 'Mobile Applications',
      description: 'Native iOS and Android app development using React Native or Flutter, styled with fluid transitions.',
      icon: Laptop,
      span: 'md:col-span-1',
      gradient: 'from-blue-500/10 to-transparent',
      borderColor: 'hover:border-blue-500/40'
    },
    {
      title: 'Cloud Architectures & Migration',
      description: 'Establish and scale serverless infrastructure, load balancing, and file storage pipelines using AWS, GCP, or Azure.',
      icon: Layers,
      span: 'md:col-span-1',
      gradient: 'from-purple-500/10 to-transparent',
      borderColor: 'hover:border-purple-500/40'
    },
    {
      title: 'Custom Enterprise Software',
      description: 'Develop custom ERP, inventory tracking, client dashboards, and system synchronization software tailored specifically to solve complex organizational bottlenecks.',
      icon: Terminal,
      span: 'md:col-span-2',
      gradient: 'from-green-500/10 via-primary/5 to-transparent',
      borderColor: 'hover:border-green-500/40'
    },
    {
      title: 'UI/UX Design Systems',
      description: 'Build state-of-the-art interactive layouts, wireframes, and standardized brand guidelines matching the design aesthetics of linear, stripe, and vercel.',
      icon: Palette,
      span: 'md:col-span-1',
      gradient: 'from-pink-500/10 to-transparent',
      borderColor: 'hover:border-pink-500/40'
    },
    {
      title: 'DevOps & CI/CD Pipelines',
      description: 'Automate build testing, Docker image generation, Kubernetes orchestration, and deploy code in seconds with zero downtime.',
      icon: Activity,
      span: 'md:col-span-1',
      gradient: 'from-indigo-500/10 to-transparent',
      borderColor: 'hover:border-indigo-500/40'
    },
    {
      title: 'Advanced Cyber Security Audits',
      description: 'Protect organizational data against exploits. Implement penetration testing, SSL certificates, encryption pipelines, and identity auth guards.',
      icon: Shield,
      span: 'md:col-span-1',
      gradient: 'from-red-500/10 to-transparent',
      borderColor: 'hover:border-red-500/40'
    },
    {
      title: 'API Orchestration & Security',
      description: 'Write robust, clean REST and GraphQL API endpoints, complete with JWT validation, rate limiting, and comprehensive developer documentation.',
      icon: Cpu,
      span: 'md:col-span-2',
      gradient: 'from-teal-500/10 via-primary/5 to-transparent',
      borderColor: 'hover:border-teal-500/40'
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
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span>Industrial Tech Solutions</span>
          </motion.div>
          
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
            IT & Software Services
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Accelerate your business with cutting-edge full-stack apps, cloud structures, devops automation, and premium UI designs.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bentoServices.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className={`p-8 rounded-2xl glass border border-border/40 hover:shadow-2xl relative overflow-hidden transition-all duration-300 ${service.span} ${service.borderColor} group`}
            >
              {/* Corner Glowing Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity duration-300`}></div>
              
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="p-3 w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center mb-6">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-foreground/90 mb-3">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </div>

                <button 
                  onClick={() => alert(`IT Service inquiry for "${service.title}" is ready. Send details through the Contact page or schedule a consult!`)}
                  className="text-xs text-primary font-bold flex items-center space-x-1 hover:underline mt-6 group w-fit"
                >
                  <span>Request Quote</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </PageWrapper>
  );
}
