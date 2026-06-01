'use client';

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingAssistant from './FloatingAssistant';
import { motion } from 'framer-motion';

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-background">
      <Navbar />
      
      {/* Background glowing gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full filter blur-[120px] -z-20 pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[45%] h-[45%] bg-amber-500/5 rounded-full filter blur-[120px] -z-20 pointer-events-none"></div>

      <motion.main 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 pt-20"
      >
        {children}
      </motion.main>
      
      <FloatingAssistant />
      <Footer />
    </div>
  );
}
