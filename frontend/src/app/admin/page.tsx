'use client';

import React, { useState } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { useStore } from '@/store/useStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Users, BookOpen, Briefcase, DollarSign, TrendingUp, Plus, FileText, BarChart3, Save, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const { user, token, apiUrl } = useStore();
  const [activeTab, setActiveTab] = useState<'metrics' | 'create-course' | 'create-internship'>('metrics');
  
  // Forms states
  const [courseSuccess, setCourseSuccess] = useState(false);
  const [internshipSuccess, setInternshipSuccess] = useState(false);

  // Course Form
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState('Artificial Intelligence');
  const [coursePrice, setCoursePrice] = useState(99);
  const [courseDifficulty, setCourseDifficulty] = useState('Beginner');
  const [courseDuration, setCourseDuration] = useState('6 weeks');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseInstructor, setCourseInstructor] = useState('Admin Staff');

  // Internship Form
  const [internTitle, setInternTitle] = useState('');
  const [internCompany, setInternCompany] = useState('');
  const [internStipend, setInternStipend] = useState('$1,000/mo');
  const [internDuration, setInternDuration] = useState('3 months');
  const [internDomain, setInternDomain] = useState('AI');
  const [internType, setInternType] = useState('Remote');
  const [internDesc, setInternDesc] = useState('');

  // Check role
  const isAdmin = user?.role === 'admin';

  // Fetch admin metrics
  const { data: adminData = null } = useQuery({
    queryKey: ['adminDashboard', token],
    queryFn: async () => {
      if (!token) return getMockAdminData();
      const res = await fetch(`${apiUrl}/dashboard/admin`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Admin fetch failed');
      return res.json();
    },
    initialData: getMockAdminData(),
    enabled: true
  });

  function getMockAdminData() {
    return {
      stats: {
        totalUsers: 48,
        totalCourses: 3,
        totalInternships: 3,
        totalApplications: 12,
        activeSaaSRevenue: 2840,
        placementSuccessRate: 94
      },
      charts: {
        revenueByMonth: [
          { month: 'Jan', revenue: 1500 },
          { month: 'Feb', revenue: 2300 },
          { month: 'Mar', revenue: 3200 },
          { month: 'Apr', revenue: 4500 },
          { month: 'May', revenue: 5800 }
        ],
        enrollmentByCategory: [
          { category: 'AI Tools', count: 480 },
          { category: 'Full Stack', count: 320 },
          { category: 'ML Models', count: 210 },
          { category: 'Data Sci', count: 120 }
        ]
      }
    };
  }

  // Course Mutation
  const createCourseMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: courseTitle,
        description: courseDesc,
        category: courseCategory,
        price: coursePrice,
        difficulty: courseDifficulty,
        duration: courseDuration,
        instructor: { name: courseInstructor, bio: 'Ecosystem Staff' },
        skillsCovered: [courseCategory, 'Frameworks'],
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'
      };

      if (!token) {
        alert("Guest Mode simulated course creation.");
        return payload;
      }

      const res = await fetch(`${apiUrl}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Create course failed');
      return res.json();
    },
    onSuccess: () => {
      setCourseSuccess(true);
      setCourseTitle('');
      setCourseDesc('');
      setTimeout(() => setCourseSuccess(false), 2000);
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    }
  });

  // Internship Mutation
  const createInternshipMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: internTitle,
        company: internCompany,
        stipend: internStipend,
        duration: internDuration,
        domain: internDomain,
        type: internType,
        description: internDesc,
        skillsRequired: [internDomain, 'Core Tools']
      };

      if (!token) {
        alert("Guest Mode simulated internship creation.");
        return payload;
      }

      const res = await fetch(`${apiUrl}/internships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Create internship failed');
      return res.json();
    },
    onSuccess: () => {
      setInternshipSuccess(true);
      setInternTitle('');
      setInternCompany('');
      setInternDesc('');
      setTimeout(() => setInternshipSuccess(false), 2000);
      queryClient.invalidateQueries({ queryKey: ['internships'] });
    }
  });

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle || !courseDesc) return;
    createCourseMutation.mutate();
  };

  const handleInternshipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!internTitle || !internCompany) return;
    createInternshipMutation.mutate();
  };

  if (!isAdmin && token) {
    return (
      <PageWrapper>
        <div className="max-w-md mx-auto py-24 text-center space-y-4">
          <Shield className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="font-display font-extrabold text-xl">Access Denied</h2>
          <p className="text-sm text-muted-foreground">Admin credentials are required to view this dashboard page. Sign in to your admin demo account.</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-border">
          <div className="space-y-1">
            <h1 className="font-display font-extrabold text-3xl flex items-center space-x-2">
              <Shield className="w-8 h-8 text-primary" />
              <span>Admin Ecosystem Command</span>
            </h1>
            <p className="text-xs text-muted-foreground">Monitor platform statistics, update courses catalogue, and list internship options.</p>
          </div>

          {/* Tab buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold ${activeTab === 'metrics' ? 'bg-primary text-primary-foreground font-bold' : 'bg-muted/10 text-muted-foreground'}`}
            >
              Metrics & Graphs
            </button>
            <button
              onClick={() => setActiveTab('create-course')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold ${activeTab === 'create-course' ? 'bg-primary text-primary-foreground font-bold' : 'bg-muted/10 text-muted-foreground'}`}
            >
              Create Course
            </button>
            <button
              onClick={() => setActiveTab('create-internship')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold ${activeTab === 'create-internship' ? 'bg-primary text-primary-foreground font-bold' : 'bg-muted/10 text-muted-foreground'}`}
            >
              Add Internship
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        {activeTab === 'metrics' && (
          <div className="space-y-8">
            
            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 rounded-2xl glass-card border border-border/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold block uppercase tracking-wider">Total Users</span>
                  <span className="font-display font-extrabold text-3xl">{adminData?.stats?.totalUsers}</span>
                </div>
                <Users className="w-8 h-8 text-primary/30" />
              </div>

              <div className="p-6 rounded-2xl glass-card border border-border/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold block uppercase tracking-wider">Academy Tracks</span>
                  <span className="font-display font-extrabold text-3xl">{adminData?.stats?.totalCourses}</span>
                </div>
                <BookOpen className="w-8 h-8 text-primary/30" />
              </div>

              <div className="p-6 rounded-2xl glass-card border border-border/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold block uppercase tracking-wider">Placement Roles</span>
                  <span className="font-display font-extrabold text-3xl">{adminData?.stats?.totalInternships}</span>
                </div>
                <Briefcase className="w-8 h-8 text-primary/30" />
              </div>

              <div className="p-6 rounded-2xl glass-card border border-border/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold block uppercase tracking-wider">Active Revenue</span>
                  <span className="font-display font-extrabold text-3xl text-primary">${adminData?.stats?.activeSaaSRevenue}</span>
                </div>
                <DollarSign className="w-8 h-8 text-primary/30" />
              </div>

            </div>

            {/* Custom Bar Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Revenue Monthly Growth */}
              <div className="p-6 rounded-2xl glass-card border border-border/40 space-y-4">
                <h4 className="font-display font-bold text-sm text-foreground/80 flex items-center space-x-1">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span>SaaS Monthly Revenue Growth</span>
                </h4>
                
                {/* Visual Chart divs */}
                <div className="h-48 flex items-end gap-5 pt-8 pl-4">
                  {adminData?.charts?.revenueByMonth?.map((item: any) => (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className="w-full bg-primary/20 hover:bg-primary border border-primary/40 rounded-t-lg transition-all text-glow"
                        style={{ height: `${(item.revenue / 6000) * 120}px` }}
                        title={`$${item.revenue}`}
                      />
                      <span className="text-[10px] text-muted-foreground font-semibold">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categorized Enrollments */}
              <div className="p-6 rounded-2xl glass-card border border-border/40 space-y-4">
                <h4 className="font-display font-bold text-sm text-foreground/80 flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span>Topic Enrolment Distributions</span>
                </h4>

                <div className="space-y-4 pt-4">
                  {adminData?.charts?.enrollmentByCategory?.map((item: any) => (
                    <div key={item.category} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>{item.category}</span>
                        <span>{item.count} Students</span>
                      </div>
                      <div className="w-full h-2 rounded bg-muted/20 border border-border overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${(item.count / 500) * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {activeTab === 'create-course' && (
          <div className="max-w-2xl mx-auto p-6 rounded-2xl glass-card border border-border/40 space-y-6">
            <h3 className="font-display font-bold text-lg flex items-center space-x-2">
              <Plus className="w-5 h-5 text-primary" />
              <span>Publish Academy Course</span>
            </h3>

            {courseSuccess && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-xs flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Course published successfully in academy database.</span>
              </div>
            )}

            <form onSubmit={handleCourseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced PyTorch Neural Modeling"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Category</label>
                  <select
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-card border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                  >
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Full Stack Development">Full Stack Development</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Difficulty</label>
                  <select
                    value={courseDifficulty}
                    onChange={(e) => setCourseDifficulty(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-card border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Tuition Price ($)</label>
                  <input
                    type="number"
                    required
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 8 weeks"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Instructor</label>
                  <input
                    type="text"
                    required
                    placeholder="Instructor Name"
                    value={courseInstructor}
                    onChange={(e) => setCourseInstructor(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Outline lectures, syllabus, and project goals..."
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={createCourseMutation.isPending}
                className="py-2.5 px-5 bg-primary text-primary-foreground font-bold rounded-xl text-xs flex items-center space-x-1.5 hover:bg-amber-400 transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Publish Course</span>
              </button>
            </form>
          </div>
        )}

        {activeTab === 'create-internship' && (
          <div className="max-w-2xl mx-auto p-6 rounded-2xl glass-card border border-border/40 space-y-6">
            <h3 className="font-display font-bold text-lg flex items-center space-x-2">
              <Plus className="w-5 h-5 text-primary" />
              <span>Post Internship Role</span>
            </h3>

            {internshipSuccess && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-xs flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Internship position successfully pushed to placement board.</span>
              </div>
            )}

            <form onSubmit={handleInternshipSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI Prompt Designer"
                    value={internTitle}
                    onChange={(e) => setInternTitle(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Hiring Company</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Digimation Labs"
                    value={internCompany}
                    onChange={(e) => setInternCompany(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Stipend Amount</label>
                  <input
                    type="text"
                    required
                    value={internStipend}
                    onChange={(e) => setInternStipend(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={internDuration}
                    onChange={(e) => setInternDuration(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Domain</label>
                  <select
                    value={internDomain}
                    onChange={(e) => setInternDomain(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-card border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                  >
                    <option value="AI">AI</option>
                    <option value="Full Stack Development">Full Stack Development</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Work Type</label>
                <select
                  value={internType}
                  onChange={(e) => setInternType(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-card border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Position Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Outline skill requirements, tools, daily tasks..."
                  value={internDesc}
                  onChange={(e) => setInternDesc(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={createInternshipMutation.isPending}
                className="py-2.5 px-5 bg-primary text-primary-foreground font-bold rounded-xl text-xs flex items-center space-x-1.5 hover:bg-amber-400 transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Post Internship</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </PageWrapper>
  );
}
