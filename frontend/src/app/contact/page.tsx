'use client';

import React, { useState } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { Mail, Phone, MapPin, MessageSquare, Send, Sparkles, Calendar, Clock, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';

export default function Contact() {
  const { apiUrl } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('AI Consulting');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);
    
    try {
      const res = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Submission failed');
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

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
            <Mail className="w-3.5 h-3.5" />
            <span>Connect With Us</span>
          </motion.div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl">Contact & Lead Generation</h1>
          <p className="text-muted-foreground">
            Schedule consulting audits, inquire about Learning Academy cohort packages, or integrate custom GenAI services into your enterprise workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Contact Details */}
            <div className="p-6 rounded-2xl glass-card border border-border/40 space-y-6">
              <h3 className="font-display font-bold text-lg">Direct Channels</h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-foreground/90">Email Support</span>
                    <a href="mailto:support@digimation.com" className="text-xs text-muted-foreground hover:text-primary hover:underline">support@digimation.com</a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-foreground/90">Phone Inquiries</span>
                    <span className="text-xs text-muted-foreground">+1 (555) 480-1200</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-foreground/90">HQ Headquarters</span>
                    <span className="text-xs text-muted-foreground">48 Innovation Drive, Suite 300, San Francisco, CA</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp direct CTA */}
              <div className="pt-4 border-t border-border mt-4">
                <a 
                  href="https://wa.me/15554801200" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Start WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Google Map Mockup */}
            <div className="p-4 rounded-2xl glass-card border border-border/40 space-y-3">
              <h4 className="font-display font-bold text-xs">HQ Map Locator</h4>
              <div className="h-40 rounded-xl bg-card border border-border flex items-center justify-center text-center relative overflow-hidden">
                {/* Visual grid representing map grid lines */}
                <div className="absolute inset-0 neural-grid opacity-30 pointer-events-none"></div>
                <div className="space-y-1 relative z-10 p-4">
                  <MapPin className="w-6 h-6 text-red-500 mx-auto animate-bounce" />
                  <span className="text-[10px] font-bold block">San Francisco HQ</span>
                  <span className="text-[9px] text-muted-foreground block">Coordinates: 37.7749° N, 122.4194° W</span>
                </div>
              </div>
            </div>

          </div>

          {/* Form and Schedule */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Contact Form */}
            <div className="p-6 rounded-2xl glass-card border border-border/40 space-y-6">
              <h3 className="font-display font-bold text-lg flex items-center space-x-2">
                <Sparkles className="w-4.5 h-4.5 text-primary" />
                <span>Submit Lead Inquiry</span>
              </h3>

              {success && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-xs">
                  Thank you! Your inquiry was sent successfully. Our team will contact you within 24 hours.
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Inquiry Category</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-card border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                  >
                    <option value="AI Consulting">AI Consulting Services</option>
                    <option value="IT Integration">IT & Custom Software Development</option>
                    <option value="Academy Bootcamp">Learning Academy Group Cohorts</option>
                    <option value="Placement Partnerships">Corporate Internship Placements</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Message Detail</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Outline your requirements, technology constraints, or cohort goals..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="py-2.5 px-5 bg-primary text-primary-foreground font-bold rounded-xl text-xs flex items-center space-x-1.5 hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Sending Request...' : 'Send Message'}</span>
                </button>
              </form>
            </div>

            {/* Calendly Meeting Widget Mockup */}
            <div className="p-6 rounded-2xl glass-card border border-border/40 space-y-4">
              <h4 className="font-display font-bold text-sm text-foreground/80 flex items-center space-x-1.5">
                <Calendar className="w-4.5 h-4.5 text-primary" />
                <span>Calendly Meeting Scheduler</span>
              </h4>
              <p className="text-xs text-muted-foreground">Book a direct 15-minute discovery consultation call with our Solutions Architect.</p>
              
              <div className="p-5 bg-card/25 border border-border/40 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="space-y-1">
                  <span className="text-xs font-bold font-display block">Discovery Auditing Session</span>
                  <span className="text-[10px] text-muted-foreground block flex items-center"><Clock className="w-3.5 h-3.5 text-primary mr-1" /> 15 Min Call</span>
                  <span className="text-[10px] text-muted-foreground block flex items-center"><Globe className="w-3.5 h-3.5 text-primary mr-1" /> Online Meeting</span>
                </div>
                
                <div className="text-xs text-muted-foreground leading-normal md:col-span-2 flex justify-between items-center border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                  <span>Standard Availability: Mon-Fri, 9:00 AM - 5:00 PM EST</span>
                  <button 
                    onClick={() => alert("Calendly window integration requested during deployment. Scheduling tool initialized.")}
                    className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-amber-400 transition-all text-[10px]"
                  >
                    Book Slot
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </PageWrapper>
  );
}
