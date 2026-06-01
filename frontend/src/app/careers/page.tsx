'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';
import { useStore } from '@/store/useStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Briefcase, Search, MapPin, DollarSign, Calendar, SlidersHorizontal, Sparkles, Send, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Internship {
  _id: string;
  title: string;
  company: string;
  logo: string;
  stipend: string;
  duration: string;
  type: 'Remote' | 'On-site' | 'Hybrid';
  location: string;
  domain: string;
  skillsRequired: string[];
  description: string;
  appliedCount: number;
}

export default function CareerHub() {
  const queryClient = useQueryClient();
  const { user, token, apiUrl, updateUserStats } = useStore();

  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    setMounted(true);
  }, []);
  const [resumeUrl, setResumeUrl] = useState('');
  const [appliedSuccessfully, setAppliedSuccessfully] = useState(false);

  const domains = ['All', 'AI', 'Full Stack Development', 'UI/UX Design', 'Data Science'];
  const types = ['All', 'Remote', 'Hybrid', 'On-site'];

  // Fetch Internships
  const { data: internships = [], isLoading } = useQuery<Internship[]>({
    queryKey: ['internships', selectedDomain, selectedType],
    queryFn: async () => {
      let url = `${apiUrl}/internships`;
      const params = new URLSearchParams();
      if (selectedDomain !== 'All') params.append('domain', selectedDomain);
      if (selectedType !== 'All') params.append('type', selectedType);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch internships');
      return res.json();
    },
    initialData: [
      {
        _id: 'i1',
        title: 'AI Development Intern',
        company: 'Digimation Labs',
        logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
        stipend: '$2,000/mo',
        duration: '3 months',
        type: 'Remote',
        location: 'San Francisco, CA',
        domain: 'AI',
        skillsRequired: ['Python', 'OpenAI SDK', 'FastAPI'],
        description: 'Work directly with our AI Architects to prototype, test, and integrate generative AI agents and workflows into customer products.',
        appliedCount: 15
      },
      {
        _id: 'i2',
        title: 'Full Stack Developer Intern',
        company: 'SaaSify Inc.',
        logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
        stipend: '$1,500/mo',
        duration: '6 months',
        type: 'Hybrid',
        location: 'New York, NY',
        domain: 'Full Stack Development',
        skillsRequired: ['React', 'Next.js', 'Node.js', 'MongoDB'],
        description: 'Join our product team to build user-facing dashboards, write clean API endpoints, and design responsive components.',
        appliedCount: 22
      },
      {
        _id: 'i3',
        title: 'UI/UX Design Intern',
        company: 'FramerTech',
        logo: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa',
        stipend: '$1,800/mo',
        duration: '3 months',
        type: 'Remote',
        location: 'London, UK',
        domain: 'UI/UX Design',
        skillsRequired: ['Figma', 'Prototyping', 'Design Systems'],
        description: 'Collaborate with visual engineers to design premium dark-themed interfaces, refine wireframes, and establish responsive web spacing grids.',
        appliedCount: 9
      }
    ]
  });

  // Apply Mutation
  const applyMutation = useMutation({
    mutationFn: async ({ internshipId, notes, resumeUrl }: { internshipId: string; notes: string; resumeUrl: string }) => {
      if (!token) throw new Error('You must be logged in to apply');
      const res = await fetch(`${apiUrl}/internships/${internshipId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes, resumeUrl })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Application failed');
      }
      return res.json();
    },
    onSuccess: (data) => {
      setAppliedSuccessfully(true);
      // Award XP
      if (user) {
        updateUserStats(data.user.xp, data.user.level, data.user.badges);
      }
      queryClient.invalidateQueries({ queryKey: ['studentDashboard'] });
      setTimeout(() => {
        setSelectedInternship(null);
        setAppliedSuccessfully(false);
        setNotes('');
        setResumeUrl('');
      }, 2000);
    },
    onError: (err: any) => {
      alert(err.message);
    }
  });

  const filteredInternships = internships.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.company.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInternship) return;
    applyMutation.mutate({
      internshipId: selectedInternship._id,
      notes,
      resumeUrl
    });
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
            <Briefcase className="w-3.5 h-3.5" />
            <span>Industrial Placement Hub</span>
          </motion.div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl">Internship & Career Hub</h1>
          <p className="text-muted-foreground">
            Apply directly to curated tech roles at leading startups and innovation laboratories. Complete learning academy tracks to boost match credibility.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-10 pb-6 border-b border-border">
          
          {/* Search */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search companies or positions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card/40 border border-border focus:border-primary focus:outline-none rounded-xl text-sm text-foreground"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {domains.map(dom => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${selectedDomain === dom ? 'bg-primary text-primary-foreground font-bold' : 'bg-muted/10 text-muted-foreground hover:bg-muted/20'}`}
              >
                {dom}
              </button>
            ))}
          </div>

        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2].map(i => (
              <div key={i} className="h-[120px] rounded-2xl bg-card/25 border border-border/40 animate-pulse"></div>
            ))}
          </div>
        ) : filteredInternships.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No active listings found matching your parameters.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredInternships.map((job) => (
              <motion.div
                key={job._id}
                whileHover={{ scale: 1.005 }}
                className="p-6 rounded-2xl glass-card border border-border/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all"
              >
                {/* Logo & Company Info */}
                <div className="flex items-center space-x-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={job.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'}
                    alt={job.company}
                    className="w-12 h-12 rounded-xl object-cover border border-border bg-card shrink-0"
                  />
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-lg leading-snug hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground/80">{job.company}</span>
                      <span>•</span>
                      <span className="flex items-center"><MapPin className="w-3.5 h-3.5 text-primary mr-1" /> {job.location} ({job.type})</span>
                    </div>
                  </div>
                </div>

                {/* Tags & Actions */}
                <div className="flex flex-wrap md:flex-nowrap items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  
                  {/* Mini Stats */}
                  <div className="flex gap-4 text-xs">
                    <div className="flex items-center text-muted-foreground">
                      <DollarSign className="w-4 h-4 text-primary mr-0.5" />
                      <span>{job.stipend}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary mr-0.5" />
                      <span>{job.duration}</span>
                    </div>
                  </div>

                  {/* Apply Trigger */}
                  {mounted && token ? (
                    <button
                      onClick={() => setSelectedInternship(job)}
                      className="px-5 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors cursor-pointer w-full md:w-auto text-center"
                    >
                      Apply Now
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="px-5 py-2.5 bg-muted/20 border border-border text-foreground font-bold text-xs rounded-xl hover:bg-muted/30 transition-colors w-full md:w-auto text-center"
                    >
                      Sign In to Apply
                    </Link>
                  )}

                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Application Modal Dialogue */}
        <AnimatePresence>
          {selectedInternship && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Overlay background */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedInternship(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />

              {/* Dialog Content */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-lg glass border border-border rounded-2xl shadow-2xl p-6 overflow-hidden z-10"
              >
                
                {/* Visual Glow */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full filter blur-xl"></div>

                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center text-primary">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg">Apply for Internship</h3>
                    <p className="text-xs text-muted-foreground">{selectedInternship.title} at {selectedInternship.company}</p>
                  </div>
                </div>

                {appliedSuccessfully ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center text-green-500">
                      <Check className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-lg text-green-500">Application Submitted!</h4>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      Your cover notes have been sent to {selectedInternship.company}. Earned 200 XP for your career profile!
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleApplySubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">Portfolio or Resume Link (Optional)</label>
                      <input
                        type="url"
                        placeholder="https://github.com/username or google-drive-pdf"
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">Application Notes / Cover Letter</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Explain why you are the perfect candidate for this position..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground resize-none"
                      />
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedInternship(null)}
                        className="px-4 py-2 border border-border hover:bg-muted/10 rounded-xl text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={applyMutation.isPending}
                        className="px-5 py-2 bg-primary hover:bg-amber-400 text-primary-foreground font-bold rounded-xl text-xs flex items-center space-x-1.5"
                      >
                        {applyMutation.isPending ? 'Sending...' : 'Submit Application'}
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                )}

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PageWrapper>
  );
}
