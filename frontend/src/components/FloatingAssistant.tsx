'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { MessageSquare, X, Send, Bot, User, Mic, Sparkles, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

export default function FloatingAssistant() {
  const { assistantOpen, setAssistantOpen } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'ai',
      text: 'Hello! I am Flight AI, your personal career and innovation assistant. How can I help you level up today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat history
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const quickPrompts = [
    { label: 'Recommend courses', text: 'Which courses do you recommend for AI engineering?' },
    { label: 'Analyze resume', text: 'How does the AI Resume Analyzer grade my ATS score?' },
    { label: 'Find internships', text: 'What internships are currently matching for web development?' },
    { label: 'Generate roadmap', text: 'Can you help me generate a career roadmap?' }
  ];

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      let aiText = "That's an interesting query! To get started, I highly recommend checking out our dynamic AI Career Assistant where you can input your skills and generate a comprehensive milestone-based roadmap.";
      const query = textToSend.toLowerCase();

      if (query.includes('course') || query.includes('academy') || query.includes('learn')) {
        aiText = "Our Learning Academy features premium courses in Artificial Intelligence, Next.js Full Stack, and Deep Learning. You can earn XP and professional certificates to display on your dashboard!";
      } else if (query.includes('resume') || query.includes('ats') || query.includes('score')) {
        aiText = "The AI Resume Analyzer allows you to paste your resume text to instantly calculate your ATS score, discover missing keywords, strengths, weaknesses, and improvement steps. Give it a try in the AI Resume tab!";
      } else if (query.includes('intern') || query.includes('job') || query.includes('careers')) {
        aiText = "We have startup-style internship portals showing active roles in AI Development, Full Stack Web, and Mobile Apps. Complete courses to unlock smart internship matches with 1-click apply!";
      } else if (query.includes('roadmap') || query.includes('career assistant') || query.includes('skills')) {
        aiText = "Yes, I can generate step-by-step paths! Navigate to the 'AI Assistant' section, enter your skills and career targets, and press 'Generate Personalized Roadmap' to get immediate learning milestones.";
      } else if (query.includes('hello') || query.includes('hi ')) {
        aiText = "Hi there! I can help you with course selection, resume feedback, and match you with remote developer internships. What are you currently studying?";
      }

      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Expanded Chat Window */}
      <AnimatePresence>
        {assistantOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-[360px] sm:w-[400px] h-[520px] rounded-2xl glass border border-border shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-primary/10 px-4 py-3 flex items-center justify-between border-b border-border">
              <div className="flex items-center space-x-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm flex items-center">
                    Flight AI Assistant
                    <Sparkles className="w-3.5 h-3.5 text-primary ml-1.5 animate-pulse" />
                  </h3>
                  <span className="text-[10px] text-muted-foreground">Always active to guide you</span>
                </div>
              </div>
              <button
                onClick={() => setAssistantOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted/20 hover:text-foreground transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div
              ref={scrollRef}
              className="flex-1 p-4 space-y-4 overflow-y-auto bg-card/10 scrollbar-thin"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded bg-primary/20 border border-primary/20 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm ${msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-none'
                      : 'bg-muted/15 border border-border text-foreground rounded-tl-none'}`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <span className="block text-[9px] mt-1 text-right opacity-60">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded bg-muted/20 border border-border flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded bg-primary/20 border border-primary/20 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted/15 border border-border rounded-2xl rounded-tl-none px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 bg-card/5 border-t border-border flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(qp.text)}
                  className="px-2.5 py-1.5 rounded-lg border border-border bg-muted/5 hover:border-primary/40 hover:bg-primary/5 text-xs text-muted-foreground hover:text-foreground transition-all flex items-center space-x-1"
                >
                  <HelpCircle className="w-3 h-3 text-primary" />
                  <span>{qp.label}</span>
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-border bg-card/20 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask about roadmaps, resume score, internships..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                className="flex-1 text-sm bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl px-3 py-2 text-foreground"
              />
              
              <button
                className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-muted/10 transition-all"
                title="Voice Input (Placeholder)"
                onClick={() => alert("Voice typing is a feature template. Grant microphone access during deployment.")}
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleSend(input)}
                className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-amber-400 transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button / Glow Orb */}
      <motion.button
        onClick={() => setAssistantOpen(!assistantOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center transition-all relative overflow-hidden group cursor-pointer"
        style={{
          boxShadow: '0 0 25px rgba(252, 197, 9, 0.45)',
        }}
      >
        <AnimatePresence mode="wait">
          {assistantOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative flex items-center justify-center"
            >
              <Bot className="w-6 h-6" />
              {/* Outer pulsing ring */}
              <span className="absolute inset-0 w-full h-full rounded-full border border-primary animate-ping opacity-30"></span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

    </div>
  );
}
