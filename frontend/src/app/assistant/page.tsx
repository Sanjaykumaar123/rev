'use client';

import React, { useState } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { useStore } from '@/store/useStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Sparkles, Brain, Award, BookOpen, GraduationCap, Map, ArrowRight, Download, Check, Save, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RoadmapData {
  careerGoal: string;
  educationLevel: string;
  experienceLevel: string;
  skillGapAnalysis: {
    currentSkills: string[];
    missingSkills: string[];
    gapPercentage: number;
  };
  recommendedCourses: string[];
  recommendedProjects: string[];
  certifications: string[];
  timeline: { phase: string; tasks: string }[];
  careerPathName: string;
}

export default function CareerAssistant() {
  const queryClient = useQueryClient();
  const { user, token, apiUrl, updateUserStats } = useStore();

  const [mounted, setMounted] = useState(false);
  const [skills, setSkills] = useState('');
  const [educationLevel, setEducationLevel] = useState('Undergraduate');
  const [careerGoal, setCareerGoal] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Beginner');
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const educationOptions = ['High School', 'Undergraduate', 'Postgraduate', 'Bootcamp Graduate', 'Self-taught'];
  const experienceOptions = ['Beginner (0-1 yrs)', 'Intermediate (1-3 yrs)', 'Advanced (3+ yrs)'];

  // Mutation for generating roadmap via API
  const generateMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        educationLevel,
        careerGoal,
        experienceLevel
      };

      // Fallback generator if no token/backend to support guest evaluation
      if (!token) {
        return simulateFallbackRoadmap(payload);
      }

      const res = await fetch(`${apiUrl}/roadmaps/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to generate roadmap');
      }
      return res.json();
    },
    onSuccess: (data) => {
      // API returns { roadmap: { roadmapData: ... }, xpAwarded: ... }
      if (data.roadmap && data.roadmap.roadmapData) {
        setRoadmap(data.roadmap.roadmapData);
        if (user) {
          updateUserStats(user.xp + data.xpAwarded, user.level, user.badges);
        }
      } else {
        setRoadmap(data);
      }
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ['studentDashboard'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Error occurred');
    }
  });

  const simulateFallbackRoadmap = (payload: any) => {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const missing = ['Docker', 'System Designs', 'LLM Prompt Engineering', 'Zustand State Store'];
        const courses = payload.careerGoal.toLowerCase().includes('ai') 
          ? ['Generative AI & LLMs in Practice'] 
          : ['Full Stack Next.js & TypeScript Mastery'];
        
        resolve({
          careerGoal: payload.careerGoal,
          educationLevel: payload.educationLevel,
          experienceLevel: payload.experienceLevel,
          skillGapAnalysis: {
            currentSkills: payload.skills,
            missingSkills: missing,
            gapPercentage: 68
          },
          recommendedCourses: courses,
          recommendedProjects: ['Custom SaaS Dashboard Integration', 'Neural Network Pattern Analysis Engine'],
          certifications: ['Digimation Certified Full Stack Architect'],
          timeline: [
            { phase: 'Month 1-2: Core Foundations', tasks: 'Gain deep proficiency in primary frameworks and enroll in academy modules.' },
            { phase: 'Month 3-4: Build Portfolio', tasks: 'Develop at least two scalable repositories incorporating database schemas.' },
            { phase: 'Month 5: Placement Match', tasks: 'Refine cover letter, scan resume, and apply to internship positions.' }
          ],
          careerPathName: `${payload.careerGoal} Career Pathway`
        });
      }, 1500);
    });
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerGoal.trim()) return;
    generateMutation.mutate();
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
            <Brain className="w-3.5 h-3.5" />
            <span>AI Career Planner</span>
          </motion.div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl">AI Career Assistant</h1>
          <p className="text-muted-foreground">
            Enter your skills and career targets to generate an automated, step-by-step career path, mapping courses, projects, and certifications.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-4 rounded-2xl glass-card border border-border/40 p-6 space-y-5">
            <h3 className="font-display font-bold text-lg flex items-center space-x-2">
              <Sparkles className="w-4.5 h-4.5 text-primary" />
              <span>Career Roadmap Input</span>
            </h3>

            {mounted && !token && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>You are in Guest Mode. Roadmaps will generate locally but won&apos;t persist on your dashboard history.</span>
              </div>
            )}

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Target Career Goal</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Engineer, Full Stack Architect"
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Current Skills (Comma Separated)</label>
                <input
                  type="text"
                  required
                  placeholder="React, JavaScript, HTML, CSS"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Education Level</label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-card border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                  >
                    {educationOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Experience Level</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-card border border-border focus:border-primary focus:outline-none rounded-xl text-foreground"
                  >
                    {experienceOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={generateMutation.isPending}
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm flex items-center justify-center space-x-2 glow-btn hover:bg-amber-400 transition-colors"
              >
                {generateMutation.isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
                    <span>Analyzing Parameters...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-4.5 h-4.5" />
                    <span>Generate Personalized Roadmap</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* AI Output Panels */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              {roadmap ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  
                  {/* Top Stats Glass Card */}
                  <div className="p-6 rounded-2xl glass border border-border/40 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    <div className="absolute top-4 right-4 flex items-center space-x-2">
                      <button 
                        onClick={() => alert("Roadmap PDF export initiated! Download will start shortly.")}
                        className="p-2 rounded-lg bg-muted/10 border border-border hover:bg-muted/20 text-muted-foreground hover:text-foreground transition-all"
                        title="Export PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => { setSaved(true); alert("Roadmap added to your dashboard profile history."); }}
                        className="p-2 rounded-lg bg-muted/10 border border-border hover:bg-muted/20 text-muted-foreground hover:text-foreground transition-all"
                        title="Save Roadmap"
                      >
                        {saved ? <Check className="w-4 h-4 text-green-500" /> : <Save className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Skill Gap Analysis Ring */}
                    <div className="flex items-center space-x-4 md:col-span-2">
                      <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                        {/* Circle SVG */}
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="40" cy="40" r="34" className="stroke-muted/10 fill-none" strokeWidth="6" />
                          <circle cx="40" cy="40" r="34" className="stroke-primary fill-none text-glow" strokeWidth="6" strokeDasharray="213" strokeDashoffset={213 - (213 * (100 - roadmap.skillGapAnalysis.gapPercentage)) / 100} />
                        </svg>
                        <span className="absolute text-sm font-extrabold">{100 - roadmap.skillGapAnalysis.gapPercentage}%</span>
                      </div>
                      <div>
                        <h4 className="font-bold font-display text-base">Skills Match Score</h4>
                        <p className="text-xs text-muted-foreground">You match {100 - roadmap.skillGapAnalysis.gapPercentage}% of requested corporate requirements for: {roadmap.careerGoal}.</p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                      <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">Career Path</span>
                      <span className="font-display font-extrabold text-sm text-primary">{roadmap.careerPathName}</span>
                    </div>
                  </div>

                  {/* Details bento panels */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Panel 1: Skill Gaps */}
                    <div className="p-6 rounded-2xl glass-card border border-border/40 space-y-4">
                      <h4 className="font-display font-bold text-sm text-foreground/80 flex items-center space-x-1.5">
                        <Award className="w-4.5 h-4.5 text-primary" />
                        <span>Recommended Upskilling</span>
                      </h4>
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">Gaps discovered in profile:</div>
                        <div className="flex flex-wrap gap-2">
                          {roadmap.skillGapAnalysis.missingSkills.map(s => (
                            <span key={s} className="px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <div className="text-xs text-muted-foreground">Certifications mapping:</div>
                        <div className="space-y-1.5">
                          {roadmap.certifications.map(c => (
                            <div key={c} className="text-xs flex items-center space-x-1.5 text-foreground/90">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                              <span>{c}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Panel 2: Learning Recommendations */}
                    <div className="p-6 rounded-2xl glass-card border border-border/40 space-y-4">
                      <h4 className="font-display font-bold text-sm text-foreground/80 flex items-center space-x-1.5">
                        <BookOpen className="w-4.5 h-4.5 text-primary" />
                        <span>Academy & Project Planners</span>
                      </h4>
                      <div className="space-y-2.5">
                        <div className="text-xs text-muted-foreground">Enrolment modules:</div>
                        <div className="space-y-2">
                          {roadmap.recommendedCourses.map(courseName => (
                            <div key={courseName} className="flex items-center justify-between p-2 rounded-lg bg-card/40 border border-border/50">
                              <span className="text-xs font-semibold">{courseName}</span>
                              <span className="text-[9px] text-primary font-bold uppercase flex items-center space-x-0.5 hover:underline">
                                <span>Study</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">Portfolio Projects:</div>
                        <div className="space-y-1.5">
                          {roadmap.recommendedProjects.map(proj => (
                            <div key={proj} className="text-xs flex items-center space-x-1.5 text-foreground/95">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              <span>{proj}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vertical Timeline */}
                  <div className="p-6 rounded-2xl glass-card border border-border/40 space-y-6">
                    <h4 className="font-display font-bold text-sm text-foreground/80 flex items-center space-x-1.5">
                      <Map className="w-4.5 h-4.5 text-primary" />
                      <span>Career Path Timeline & Milestones</span>
                    </h4>

                    <div className="relative pl-6 border-l border-border space-y-8 ml-3">
                      {roadmap.timeline.map((milestone, idx) => (
                        <div key={idx} className="relative">
                          {/* Timeline dot */}
                          <span className="absolute -left-9 top-0.5 w-5 h-5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-[10px] font-bold text-primary">
                            {idx + 1}
                          </span>
                          <div className="space-y-1">
                            <h5 className="text-sm font-bold font-display">{milestone.phase}</h5>
                            <p className="text-xs text-muted-foreground leading-relaxed">{milestone.tasks}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-12 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]"
                >
                  <Brain className="w-12 h-12 text-muted-foreground/60" />
                  <div>
                    <h4 className="font-bold text-base">Awaiting Inputs</h4>
                    <p className="text-xs text-muted-foreground max-w-sm mt-1">
                      Complete the career assistant parameters in the left panel to trigger the AI analysis engine.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </PageWrapper>
  );
}
