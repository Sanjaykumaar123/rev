'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Menu, X, Sun, Moon, Sparkles, User as UserIcon, LogOut, LayoutDashboard, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, theme, toggleTheme } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'AI Services', href: '/ai-services' },
    { name: 'IT Services', href: '/it-services' },
    { name: 'Academy', href: '/academy' },
    { name: 'Careers', href: '/careers' },
    { name: 'AI Assistant', href: '/assistant' },
    { name: 'AI Resume', href: '/resume' },
    { name: 'Community', href: '/community' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3 shadow-lg' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-xl shadow-md rotate-3 group-hover:rotate-12 transition-transform duration-200">
              DF
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              FLIGHT <span className="text-foreground font-medium text-sm align-super ml-1">3.0</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-muted/10'}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/10 transition-colors"
              aria-label="Toggle Theme"
            >
              {mounted && theme === 'dark' ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5" />}
            </button>

            {mounted && user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-muted/20 border border-border text-foreground hover:bg-muted/40 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-primary" />
                  <span>Dashboard</span>
                </Link>

                <div className="flex items-center space-x-2 pl-2 border-l border-border">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-semibold">{user.name}</span>
                    <span className="text-[10px] text-primary font-bold">LVL {user.level} | {user.xp} XP</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
                  Sign In
                </Link>
                <Link href="/register" className="glow-btn bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-lg text-sm flex items-center space-x-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Start Journey</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground"
            >
              {mounted && theme === 'dark' ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/10"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-border bg-background/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-base font-medium ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-muted/10'}`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              
              {mounted && user ? (
                <div className="pt-4 border-t border-border mt-4 space-y-2">
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-semibold">{user.name}</span>
                    <span className="text-xs text-primary font-bold">LVL {user.level} | {user.xp} XP</span>
                  </div>
                  <Link
                    href={user.role === 'admin' ? '/admin' : '/dashboard'}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-base font-medium bg-muted/20 text-foreground"
                  >
                    <LayoutDashboard className="w-5 h-5 text-primary" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => { setIsOpen(false); handleLogout(); }}
                    className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-base font-medium text-red-500 hover:bg-red-500/10"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-border mt-4 flex flex-col space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center px-3 py-2 rounded-lg text-base font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center px-3 py-2.5 rounded-lg text-base font-semibold bg-primary text-primary-foreground shadow"
                  >
                    Start Journey
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
