'use client';

import React, { useState, useEffect } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { useStore } from '@/store/useStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LayoutDashboard, Award, BookOpen, Briefcase, Map, FileText, Bell, Settings, Plus, Sparkles, User, Save, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface CourseProgress {
  courseId: {
    _id: string;
    title: string;
    category: string;
    duration: string;
  };
  progress: number;
}

interface ApplicationStatus {
  internshipId: {
    _id: string;
    title: string;
    company: string;
    stipend: string;
  };
  status: string;
  appliedAt: string;
}

export default function StudentDashboard() {
  const queryClient = useQueryClient();
  const { user, token, apiUrl, updateProfileInfo } = useStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'internships' | 'roadmaps' | 'settings'>('overview');

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Profile form state
  const [skillsStr, setSkillsStr] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync profile details when user loads
  useEffect(() => {
    if (user && user.profileInfo) {
      setSkillsStr(user.profileInfo.skills?.join(', ') || '');
      setEducation(user.profileInfo.education || '');
      setExperience(user.profileInfo.experience || '');
      setCareerGoal(user.profileInfo.careerGoal || '');
    }
  }, [user]);

  // Fetch Student Dashboard statistics
  const { data: dashboardData = null, isLoading } = useQuery({
    queryKey: ['studentDashboard', token],
    queryFn: async () => {
      if (!token) return getMockDashboardData();
      
      const res = await fetch(`${apiUrl}/dashboard/student`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch dashboard data');
      return res.json();
    },
    initialData: getMockDashboardData(),
    enabled: true
  });

  // Profile Update Mutation
  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        skills: skillsStr.split(',').map(s => s.trim()).filter(Boolean),
        education,
        experience,
        careerGoal
      };

      if (!token) {
        updateProfileInfo(payload);
        return payload;
      }

      const res = await fetch(`${apiUrl}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const data = await res.json();
      updateProfileInfo(data.profileInfo);
      return data;
    },
    onSuccess: () => {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      queryClient.invalidateQueries({ queryKey: ['studentDashboard'] });
    }
  });

  function getMockDashboardData() {
    return {
      xp: user?.xp || 450,
      level: user?.level || 3,
      badges: user?.badges || ['Quick Learner', 'Problem Solver'],
      enrolledCourses: [
        {
          courseId: {
            _id: 'c1',
            title: 'Generative AI & LLMs in Practice',
            category: 'Artificial Intelligence',
            duration: '6 weeks'
          },
          progress: 35
        }
      ],
      appliedInternships: [
        {
          internshipId: {
            _id: 'i1',
            title: 'AI Development Intern',
            company: 'Digimation Labs',
            stipend: '$2,000/mo'
          },
          status: 'under-review',
          appliedAt: new Date().toISOString()
        }
      ],
      certificates: [],
      latestRoadmap: null,
      latestResumeAnalysis: null,
      notifications: [
        { id: 'n1', title: 'Welcome to Flight 3.0!', message: 'Explore the learning academy and setup your career goals.', date: new Date(Date.now() - 3600000).toISOString() },
        { id: 'n2', title: 'Roadmap Generator Unlocked', message: 'Use AI Career Assistant to receive a step-by-step roadmap!', date: new Date(Date.now() - 7200000).toISOString() }
      ]
    };
  }

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate();
  };

  const handleStudyProgressMock = (courseId: string, currentProgress: number) => {
    const nextProgress = Math.min(100, currentProgress + 15);
    // Submit progress to backend
    if (token) {
      fetch(`${apiUrl}/courses/${courseId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ progress: nextProgress })
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ['studentDashboard'] });
        alert(`Studied! Progress is now ${nextProgress}%.`);
      });
    } else {
      alert("In guest mode. Log in to save module progression parameters.");
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Menu */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Gamified Profile Summary */}
            <div className="p-6 rounded-2xl glass border border-border/40 shadow-xl text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mx-auto border-2 border-primary">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg">{mounted && user ? user.name : 'Guest Student'}</h3>
                <span className="text-xs text-muted-foreground">{mounted && user ? user.email : 'guest@digimation.com'}</span>
              </div>

              {/* Progress Level Bar */}
              <div className="space-y-1 text-left">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span>Level {mounted ? (dashboardData?.level || 1) : 1}</span>
                  <span>{mounted ? (dashboardData?.xp || 0) : 0} / {mounted ? ((dashboardData?.level || 1) * 500) : 500} XP</span>
                </div>
                <div className="w-full h-2 rounded bg-muted/20 border border-border overflow-hidden">
                  <div 
                    className="h-full bg-primary text-glow" 
                    style={{ width: `${mounted ? Math.min(100, ((dashboardData?.xp || 0) / ((dashboardData?.level || 1) * 500)) * 100) : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Badges Box */}
              <div className="pt-2 border-t border-border/40">
                <span className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider text-left mb-2">Unlocked Achievements</span>
                <div className="flex flex-wrap gap-1.5 justify-start">
                  {mounted && dashboardData?.badges?.map((badge: string) => (
                    <span key={badge} className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[9px] font-bold text-primary flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      <span>{badge}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Nav Tabs */}
            <div className="rounded-xl glass border border-border/40 overflow-hidden flex flex-col">
              {[
                { id: 'overview', label: 'Ecosystem Overview', icon: LayoutDashboard },
                { id: 'courses', label: 'Enrolled Courses', icon: BookOpen },
                { id: 'internships', label: 'My Applications', icon: Briefcase },
                { id: 'roadmaps', label: 'Career Planner Logs', icon: Map },
                { id: 'settings', label: 'Edit Profile', icon: Settings },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left px-5 py-3 text-sm font-semibold flex items-center space-x-3 transition-colors ${activeTab === tab.id ? 'bg-primary/15 text-primary border-l-2 border-primary' : 'text-muted-foreground hover:bg-muted/10'}`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

          </div>

          {/* Core Content Area */}
          <div className="lg:col-span-9 space-y-6">
            
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Visual Widgets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Widget 1 */}
                  <div className="p-6 rounded-2xl glass-card border border-border/40 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">Courses Enrolled</span>
                      <span className="font-display font-extrabold text-3xl">{dashboardData?.enrolledCourses?.length || 0}</span>
                    </div>
                    <BookOpen className="w-8 h-8 text-primary/30" />
                  </div>

                  {/* Widget 2 */}
                  <div className="p-6 rounded-2xl glass-card border border-border/40 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">Applications Submitted</span>
                      <span className="font-display font-extrabold text-3xl">{dashboardData?.appliedInternships?.length || 0}</span>
                    </div>
                    <Briefcase className="w-8 h-8 text-primary/30" />
                  </div>

                  {/* Widget 3 */}
                  <div className="p-6 rounded-2xl glass-card border border-border/40 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">Certificates Earned</span>
                      <span className="font-display font-extrabold text-3xl">{dashboardData?.certificates?.length || 0}</span>
                    </div>
                    <Award className="w-8 h-8 text-primary/30" />
                  </div>

                </div>

                {/* Notifications Panel */}
                <div className="p-6 rounded-2xl glass-card border border-border/40 space-y-4">
                  <h4 className="font-display font-bold text-sm text-foreground/80 flex items-center space-x-1.5">
                    <Bell className="w-4.5 h-4.5 text-primary animate-bounce" />
                    <span>Notification Broadcast Center</span>
                  </h4>
                  <div className="space-y-3">
                    {dashboardData?.notifications?.map((note: any) => (
                      <div key={note.id} className="p-3 bg-muted/5 border border-border/40 rounded-xl space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-foreground/90">{note.title}</span>
                          <span className="text-[9px] text-muted-foreground">{mounted ? new Date(note.date).toLocaleDateString() : ''}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{note.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'courses' && (
              <div className="p-6 rounded-2xl glass-card border border-border/40 space-y-6">
                <h4 className="font-display font-bold text-lg">Your Learning Track</h4>
                
                {dashboardData?.enrolledCourses?.length === 0 ? (
                  <p className="text-xs text-muted-foreground">You are not enrolled in any academy tracks yet. Visit the catalog to begin.</p>
                ) : (
                  <div className="space-y-4">
                    {dashboardData?.enrolledCourses?.map((ec: any) => (
                      <div key={ec.courseId?._id} className="p-4 bg-muted/5 border border-border/40 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[9px] font-bold text-primary">{ec.courseId?.category}</span>
                          <h5 className="font-bold text-sm font-display pt-1">{ec.courseId?.title}</h5>
                          <span className="text-[10px] text-muted-foreground block">Length: {ec.courseId?.duration}</span>
                        </div>

                        <div className="flex items-center space-x-6 w-full md:w-auto">
                          <div className="flex-1 md:w-32 space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span>Module Progress</span>
                              <span className="font-bold">{ec.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted/20 border border-border rounded overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${ec.progress}%` }}></div>
                            </div>
                          </div>

                          <button 
                            onClick={() => handleStudyProgressMock(ec.courseId?._id, ec.progress)}
                            className="px-4 py-2 bg-primary hover:bg-amber-400 text-primary-foreground font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
                          >
                            Study Module
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'internships' && (
              <div className="p-6 rounded-2xl glass-card border border-border/40 space-y-6">
                <h4 className="font-display font-bold text-lg">Applied Opportunities</h4>

                {dashboardData?.appliedInternships?.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No submitted applications found. Visit the Internship Hub to check roles.</p>
                ) : (
                  <div className="space-y-4">
                    {dashboardData?.appliedInternships?.map((app: any) => (
                      <div key={app.internshipId?._id} className="p-4 bg-muted/5 border border-border/40 rounded-2xl flex justify-between items-center">
                        <div className="space-y-1">
                          <h5 className="font-bold text-sm font-display">{app.internshipId?.title}</h5>
                          <span className="text-xs text-muted-foreground">{app.internshipId?.company} • {app.internshipId?.stipend}</span>
                          <span className="block text-[9px] text-muted-foreground">Applied: {mounted ? new Date(app.appliedAt).toLocaleDateString() : ''}</span>
                        </div>
                        
                        <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold uppercase ${app.status === 'accepted' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : app.status === 'rejected' ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-amber-500/10 border border-amber-500/20 text-amber-500'}`}>
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'roadmaps' && (
              <div className="p-6 rounded-2xl glass-card border border-border/40 space-y-6">
                <h4 className="font-display font-bold text-lg">Career Planning Logs</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Latest Roadmap Card */}
                  <div className="p-5 bg-card/40 border border-border/40 rounded-2xl space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded bg-primary/10 text-primary">
                        <Map className="w-4.5 h-4.5" />
                      </div>
                      <h5 className="font-bold text-sm font-display">Generated Roadmap</h5>
                    </div>
                    <p className="text-xs text-muted-foreground">Latest generated roadmap matches career parameters.</p>
                    <div className="pt-2">
                      <span className="text-[10px] text-muted-foreground block font-bold">Goal</span>
                      <span className="text-xs text-primary font-semibold">{mounted && user?.profileInfo?.careerGoal ? user.profileInfo.careerGoal : 'Not Set'}</span>
                    </div>
                  </div>

                  {/* Latest Resume Scorecard */}
                  <div className="p-5 bg-card/40 border border-border/40 rounded-2xl space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded bg-primary/10 text-primary">
                        <FileText className="w-4.5 h-4.5" />
                      </div>
                      <h5 className="font-bold text-sm font-display">ATS Resume Analysis</h5>
                    </div>
                    <p className="text-xs text-muted-foreground">Pasted template analyzer calculations logs.</p>
                    <div className="pt-2">
                      <span className="text-[10px] text-muted-foreground block font-bold">Latest Score</span>
                      <span className="text-xs text-primary font-semibold">Ready for review (Scan in Resume Tab)</span>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="p-6 rounded-2xl glass-card border border-border/40 space-y-6">
                <h4 className="font-display font-bold text-lg">Configure Profile Information</h4>

                {saveSuccess && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-xs flex items-center space-x-2">
                    <Check className="w-4 h-4" />
                    <span>Profile saved and synced successfully!</span>
                  </div>
                )}

                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Your Skills (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Next.js, Python, Figma"
                      value={skillsStr}
                      onChange={(e) => setSkillsStr(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">Highest Degree / Education</label>
                      <input
                        type="text"
                        placeholder="e.g. B.S. in Computer Science"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">Experience Level</label>
                      <input
                        type="text"
                        placeholder="e.g. Fresher, 2 Years Experience"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Career Goal Target</label>
                    <input
                      type="text"
                      placeholder="e.g. Lead Machine Learning Engineer"
                      value={careerGoal}
                      onChange={(e) => setCareerGoal(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="py-2.5 px-5 bg-primary text-primary-foreground font-bold rounded-xl text-xs flex items-center space-x-1.5 hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{updateProfileMutation.isPending ? 'Saving Details...' : 'Save Profile'}</span>
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
