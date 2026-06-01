'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PageWrapper from '@/components/PageWrapper';
import { useStore } from '@/store/useStore';
import { Mail, Lock, User, UserPlus, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const router = useRouter();
  const { login, apiUrl } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (res.ok) {
        const data = await res.json();
        login(data.user, data.token);
        alert(`Registered successfully as ${data.user.name}! Welcome to Flight 3.0.`);
        router.push('/dashboard');
      } else {
        const errData = await res.json();
        throw new Error(errData.message || 'Registration failed');
      }
    } catch (err: any) {
      console.warn('Backend API Offline. Generating local demo profile registration...', err.message);
      
      // Fallback local session registration
      const mockUser = {
        id: `mock-${Date.now()}`,
        name,
        email,
        role: 'student',
        xp: 100,
        level: 1,
        badges: ['New Scholar'],
        profileInfo: { skills: [], education: '', experience: '', careerGoal: '' }
      };
      
      login(mockUser, 'mock_token_registered_123');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
        <div className="p-8 rounded-2xl glass border border-border/40 shadow-2xl relative space-y-6">
          
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 rounded-full filter blur-xl"></div>
          
          <div className="text-center space-y-2">
            <Link href="/" className="inline-block">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xl mx-auto rotate-3">
                DF
              </div>
            </Link>
            <h2 className="font-display font-extrabold text-2xl tracking-tight">Create Account</h2>
            <p className="text-xs text-muted-foreground">Start building your AI and engineering career paths.</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs text-center font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Your Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm pl-10 pr-4 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm pl-10 pr-4 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm pl-10 pr-4 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm flex items-center justify-center space-x-2 hover:bg-amber-400 transition-colors cursor-pointer"
            >
              {loading ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Start Your Journey</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-xs text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="text-xs text-primary font-bold hover:underline">
              Sign In Here
            </Link>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
