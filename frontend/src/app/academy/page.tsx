'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';
import { useStore } from '@/store/useStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GraduationCap, Search, Star, Clock, Award, CheckCircle, Sparkles, BookOpen, Heart, CreditCard, Lock, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  rating: number;
  price: number;
  instructor: {
    name: string;
    avatar: string;
    bio: string;
  };
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  skillsCovered: string[];
  image: string;
}

export default function Academy() {
  const queryClient = useQueryClient();
  const { user, token, apiUrl, login, updateUserStats } = useStore();
  
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('424');
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutCourse) return;

    setPaymentProcessing(true);
    setTimeout(() => {
      enrollMutation.mutate(checkoutCourse._id, {
        onSuccess: () => {
          setCheckoutCourse(null);
          setPaymentProcessing(false);
        },
        onError: () => {
          setPaymentProcessing(false);
        }
      });
    }, 2000);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = ['All', 'Artificial Intelligence', 'Machine Learning', 'Full Stack Development', 'Data Science', 'UI/UX Design'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Fetch Courses from backend
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['courses', selectedCategory, selectedDifficulty],
    queryFn: async () => {
      let url = `${apiUrl}/courses`;
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedDifficulty !== 'All') params.append('difficulty', selectedDifficulty);
      if (params.toString()) url += `?${params.toString()}`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch courses');
      return res.json();
    },
    // Mock courses fallback
    initialData: [
      {
        _id: 'c1',
        title: 'Generative AI & LLMs in Practice',
        description: 'Master prompt engineering, fine-tuning, and integrating OpenAI & Gemini APIs into your production web applications.',
        category: 'Artificial Intelligence',
        rating: 4.9,
        price: 199,
        instructor: { name: 'Dr. Sarah Carter', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', bio: '' },
        difficulty: 'Intermediate',
        duration: '6 weeks',
        skillsCovered: ['Generative AI', 'LLMs', 'Gemini API'],
        image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a'
      },
      {
        _id: 'c2',
        title: 'Full Stack Next.js & TypeScript Mastery',
        description: 'Build premium responsive SaaS platforms with Next.js 15, App Router, Tailwind CSS, Framer Motion, and Node/Express backend.',
        category: 'Full Stack Development',
        rating: 4.8,
        price: 149,
        instructor: { name: 'Alex Rivers', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', bio: '' },
        difficulty: 'Advanced',
        duration: '8 weeks',
        skillsCovered: ['Next.js', 'React', 'TypeScript', 'Tailwind'],
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c'
      },
      {
        _id: 'c3',
        title: 'Deep Learning & Neural Networks',
        description: 'Go from the math of neural networks to building computer vision and natural language processing models with PyTorch.',
        category: 'Machine Learning',
        rating: 4.7,
        price: 249,
        instructor: { name: 'Dr. Alan Turing', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', bio: '' },
        difficulty: 'Advanced',
        duration: '10 weeks',
        skillsCovered: ['Deep Learning', 'PyTorch', 'Python'],
        image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4'
      }
    ]
  });

  const toggleWishlist = (courseId: string) => {
    if (wishlist.includes(courseId)) {
      setWishlist(prev => prev.filter(id => id !== courseId));
    } else {
      setWishlist(prev => [...prev, courseId]);
    }
  };

  // Enroll Mutation
  const enrollMutation = useMutation({
    mutationFn: async (courseId: string) => {
      if (!token) throw new Error('Please login to enroll in courses');
      const res = await fetch(`${apiUrl}/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Enrollment failed');
      }
      return res.json();
    },
    onSuccess: (data) => {
      alert(`Successfully Enrolled! You earned ${data.xpAwarded} XP!`);
      // Update local storage/Zustand user info
      if (user) {
        updateUserStats(data.xp, data.level, data.badges);
      }
      queryClient.invalidateQueries({ queryKey: ['studentDashboard'] });
    },
    onError: (err: any) => {
      alert(err.message);
    }
  });

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) || 
                          course.description.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  // Helper check to see if enrolled
  const isEnrolled = (courseId: string) => {
    if (!user || !user.profileInfo) return false;
    // We can fetch from local user state, or from a dashboard query
    // Let's assume standard local dashboard state fallback
    return false; 
  };

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
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Industrial Tech Academy</span>
          </motion.div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl">Learning Academy</h1>
          <p className="text-muted-foreground">
            Learn from industry veterans, build production-ready projects, earn XP, and unlock verified completion certificates.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-10 pb-6 border-b border-border">
          
          {/* Search */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search academy courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card/40 border border-border focus:border-primary focus:outline-none rounded-xl text-sm text-foreground"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${selectedCategory === cat ? 'bg-primary text-primary-foreground font-bold' : 'bg-muted/10 text-muted-foreground hover:bg-muted/20'}`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Course Catalog Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[400px] rounded-2xl bg-card/25 border border-border/40 animate-pulse"></div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No courses found matching your query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <motion.div
                key={course._id}
                whileHover={{ y: -4 }}
                className="rounded-2xl glass-card border border-border/40 overflow-hidden flex flex-col justify-between h-[480px] group"
              >
                {/* Course Image */}
                <div className="relative h-48 bg-muted overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-card/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-primary border border-border">
                    {course.category}
                  </div>
                  
                  {/* Wishlist Button */}
                  <button 
                    onClick={() => toggleWishlist(course._id)}
                    className="absolute top-3 right-3 p-2 bg-card/85 backdrop-blur-md rounded-full border border-border hover:bg-red-500/20 hover:text-red-400 text-muted-foreground transition-all cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${wishlist.includes(course._id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                {/* Course Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold">{course.difficulty}</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span>{course.duration}</span>
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Tuition Cost</span>
                      <span className="text-xl font-extrabold text-primary font-display">${course.price}</span>
                    </div>

                    {mounted && token ? (
                      <button
                        onClick={() => setCheckoutCourse(course)}
                        disabled={enrollMutation.isPending}
                        className="px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-lg hover:bg-amber-400 transition-colors"
                      >
                        Enroll Now
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        className="px-4 py-2 bg-muted/20 border border-border text-foreground font-bold text-xs rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        Sign In to Enroll
                      </Link>
                    )}
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Stripe Checkout Simulator Modal */}
      {checkoutCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex justify-between items-center bg-card/50">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <span className="font-display font-bold text-sm tracking-wide text-foreground">Stripe Secure Checkout</span>
              </div>
              <button 
                onClick={() => setCheckoutCourse(null)}
                disabled={paymentProcessing}
                className="p-1 hover:bg-muted/40 rounded-lg text-muted-foreground transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleCheckoutSubmit} className="p-5 space-y-4">
              <div className="bg-muted/10 p-3.5 border border-border/40 rounded-xl space-y-1">
                <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Enrolling in:</span>
                <span className="font-display font-extrabold text-sm block text-foreground">{checkoutCourse.title}</span>
                <div className="flex justify-between items-center pt-2 mt-2 border-t border-border/30">
                  <span className="text-xs text-muted-foreground">Course Tuition:</span>
                  <span className="text-base font-extrabold text-primary font-display">${checkoutCourse.price}</span>
                </div>
              </div>

              {/* Card Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wide">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 pl-10 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                    />
                    <CreditCard className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wide">Expiry Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wide">CVC</label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Secure Info Footer */}
              <div className="flex items-start space-x-1.5 text-[10px] text-muted-foreground bg-green-500/5 p-2 rounded-lg border border-green-500/10">
                <Lock className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                <span>Sandbox Simulator Mode: Use any mock card to test. Payment resolves in real-time.</span>
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={paymentProcessing}
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl text-xs flex items-center justify-center space-x-2 hover:bg-amber-400 transition-colors cursor-pointer"
              >
                {paymentProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
                    <span>Processing Secure Payment via Stripe...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay ${checkoutCourse.price} & Secure Enrollment</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </PageWrapper>
  );
}
