'use client';

import React, { useState } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { Check, Sparkles, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Student Scholar',
      price: 0,
      description: 'Acquire core skills, generate career roadmaps, and submit internships applications.',
      features: [
        'Access to basic academy modules',
        '3 AI Resume scans per month',
        '2 AI Career roadmaps per month',
        'Submit internship applications',
        'Gamification profile integration (XP)'
      ],
      cta: 'Get Started Free',
      popular: false,
      glow: 'shadow-muted/5'
    },
    {
      name: 'Academy Plus',
      price: billingPeriod === 'monthly' ? 29 : 22,
      description: 'Unlock our complete curriculum library, unlimited AI credits, and prioritized mentor feedback.',
      features: [
        'Access to all premium & custom tracks',
        'Unlimited AI Resume Scans (ATS Audits)',
        'Unlimited AI Career Roadmaps',
        'Priority placement recommendations',
        'Verified certificates on module completions',
        'Direct 1-on-1 Discord channel audits'
      ],
      cta: 'Upgrade to Plus',
      popular: true,
      glow: 'shadow-primary/10 border-primary/60'
    },
    {
      name: 'Enterprise Consulting',
      price: 'Custom',
      description: 'Deploy custom generative models, automate internal operations, and train developer cohorts.',
      features: [
        'Dedicated corporate solution architect',
        'Fine-tuned model integrations',
        'Custom workspace RAG database connectors',
        'Corporate-branded academy portals',
        'Direct access to top 5% student performers',
        'SLA guaranteed response support'
      ],
      cta: 'Contact Sales',
      popular: false,
      glow: 'shadow-amber-500/5'
    }
  ];

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
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Transparent Tier Options</span>
          </motion.div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl">Ecosystem Subscriptions</h1>
          <p className="text-muted-foreground">
            Invest in your engineering skills or accelerate your business workflows. Select the right tier matching your innovation goals.
          </p>
        </div>

        {/* Switch billing period */}
        <div className="flex justify-center items-center gap-3 mb-12">
          <span className={`text-xs font-bold transition-all ${billingPeriod === 'monthly' ? 'text-primary' : 'text-muted-foreground'}`}>Monthly</span>
          <button
            onClick={() => setBillingPeriod(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
            className="w-12 h-6 bg-muted/20 border border-border rounded-full p-0.5 relative transition-all"
          >
            <div className={`w-5 h-5 bg-primary rounded-full transition-transform ${billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
          <span className={`text-xs font-bold transition-all ${billingPeriod === 'yearly' ? 'text-primary' : 'text-muted-foreground'}`}>Yearly (Save 20%)</span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`p-8 rounded-3xl glass-card border border-border/40 flex flex-col justify-between relative overflow-hidden ${plan.glow}`}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-primary px-3 py-1 rounded-full text-[10px] font-bold text-primary-foreground">
                  MOST POPULAR
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-extrabold text-xl">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-display">
                    {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                  </span>
                  {typeof plan.price === 'number' && (
                    <span className="text-xs text-muted-foreground">/ month</span>
                  )}
                </div>

                <ul className="space-y-3 pt-4 border-t border-border/40">
                  {plan.features.map(feat => (
                    <li key={feat} className="text-xs text-foreground/90 flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => alert(`Registration details for tier "${plan.name}" requested. Connect via our Contact portal for checkout links!`)}
                className={`w-full py-3 rounded-xl font-bold text-xs mt-8 transition-colors cursor-pointer text-center ${plan.popular ? 'bg-primary text-primary-foreground hover:bg-amber-400' : 'bg-muted/10 border border-border text-foreground hover:bg-muted/20'}`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </PageWrapper>
  );
}
