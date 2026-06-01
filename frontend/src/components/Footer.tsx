'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, Github, Linkedin, Globe, Sparkles, MessageCircle } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const footerLinks = [
    {
      title: 'Ecosystem',
      links: [
        { name: 'AI Services', href: '/ai-services' },
        { name: 'IT Services', href: '/it-services' },
        { name: 'Learning Academy', href: '/academy' },
        { name: 'Internship Hub', href: '/careers' },
      ],
    },
    {
      title: 'AI Platform',
      links: [
        { name: 'Career Assistant', href: '/assistant' },
        { name: 'Resume Analyzer', href: '/resume' },
        { name: 'AI Career Quiz', href: '/assistant?quiz=true' },
        { name: 'Smart Matching', href: '/careers?match=true' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Success Stories', href: '/success' },
        { name: 'Latest Blog', href: '/blog' },
        { name: 'Pricing Plans', href: '/pricing' },
      ],
    },
    {
      title: 'Legal & Info',
      links: [
        { name: 'Terms of Service', href: '#' },
        { name: 'Privacy Policy', href: '#' },
        { name: 'Events Calendar', href: '/events' },
        { name: 'Contact Support', href: '/contact' },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-card/25 neural-grid pt-16 pb-8 relative overflow-hidden">
      {/* Radial Gradient overlay */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-border">
          
          {/* Logo & Description */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-lg rotate-3">
                DF
              </div>
              <span className="font-display font-extrabold text-lg tracking-tight bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
                FLIGHT 3.0
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Empowering students and businesses with state-of-the-art AI services, industrial certifications, interactive learning roadmaps, and career-accelerating internships.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="p-2 rounded-lg bg-muted/10 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-muted/10 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-muted/10 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {footerLinks.map((col) => (
            <div key={col.title} className="space-y-4">
              <h3 className="font-display font-semibold text-sm tracking-wider text-foreground/90 uppercase">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary hover:underline transition-all">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Newsletter & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col space-y-2 w-full md:w-auto">
            <h4 className="font-semibold text-sm">Stay Updated</h4>
            <p className="text-xs text-muted-foreground">Subscribe to get learning paths and career opportunities updates.</p>
            <form onSubmit={handleSubscribe} className="flex max-w-sm items-center space-x-2 pt-1">
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-muted/10 border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-amber-400 transition-colors"
                title="Subscribe"
              >
                {subscribed ? <Sparkles className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
            {subscribed && <span className="text-[11px] text-primary">Subscribed successfully!</span>}
          </div>

          <div className="text-center md:text-right w-full md:w-auto">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Digimation Flight 3.0. Built for Hackathons & Future Leaders.
            </p>
            <div className="flex justify-center md:justify-end space-x-4 pt-2 text-[11px] text-muted-foreground">
              <a href="https://wa.me/mock" target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:text-green-500 transition-all">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp CTA</span>
              </a>
              <span className="text-border">|</span>
              <Link href="/contact" className="hover:text-primary">Schedule Consult</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
