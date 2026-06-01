'use client';

import React, { useState } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { useStore } from '@/store/useStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Sparkles, Award, ShieldAlert, AlertTriangle, ArrowRight, Download, Brain, FileCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalysisData {
  score: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  suggestions: string[];
  careerReadinessScore: number;
  fileName: string;
}

export default function ResumeAnalyzer() {
  const queryClient = useQueryClient();
  const { user, token, apiUrl, updateUserStats } = useStore();

  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [uploading, setUploading] = useState(false);

  // Resume Analysis Mutation
  const analyzeMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        resumeText,
        fileName: fileName || 'DeveloperResume.pdf'
      };

      // Fallback local analyzer if guest mode
      if (!token) {
        return simulateLocalAnalysis(payload);
      }

      const res = await fetch(`${apiUrl}/resumes/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Analysis failed');
      }
      return res.json();
    },
    onSuccess: (data) => {
      // API returns { analysis: ..., xpAwarded: ... }
      if (data.analysis) {
        setAnalysis(data.analysis);
        if (user) {
          updateUserStats(user.xp + data.xpAwarded, user.level, user.badges);
        }
      } else {
        setAnalysis(data);
      }
      queryClient.invalidateQueries({ queryKey: ['studentDashboard'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Error running analysis');
    }
  });

  const simulateLocalAnalysis = (payload: any) => {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const text = payload.resumeText.toLowerCase();
        let score = 60;
        const strengths = ['Good structure layout.'];
        const weaknesses = [];
        const missing = ['Docker', 'Next.js', 'PyTorch'];

        if (text.includes('skills')) score += 10;
        if (text.includes('experience')) score += 15;
        if (text.includes('education')) score += 10;

        if (score > 80) {
          strengths.push('Excellent keyword density across full-stack applications.');
        } else {
          weaknesses.push('Low technology keywords matching modern framework demands.');
        }

        resolve({
          score: Math.min(98, score),
          strengths,
          weaknesses: weaknesses.length > 0 ? weaknesses : ['Formatting could use direct action verbs.'],
          missingSkills: missing,
          suggestions: ['Add a dedicated section for infrastructure components (Docker, AWS).', 'Quantify project accomplishments using numerical values.'],
          careerReadinessScore: Math.floor(score * 0.92),
          fileName: payload.fileName
        });
      }, 1500);
    });
  };

  const handleTextAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;
    analyzeMutation.mutate();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploading(true);
    setResumeText('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${apiUrl}/resumes/upload`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'File upload parsing failed');
      }

      setResumeText(data.text);
    } catch (err: any) {
      alert(err.message || 'Error uploading and parsing file.');
      setFileName('');
      setResumeText('');
    } finally {
      setUploading(false);
    }
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
            <FileText className="w-3.5 h-3.5" />
            <span>AI ATS Score Auditing</span>
          </motion.div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl">AI Resume Analyzer</h1>
          <p className="text-muted-foreground">
            Paste your resume or drag in a template PDF to evaluate keyword density, formatting bugs, missing skills, and calculate your career ATS compatibility.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Area */}
          <div className="lg:col-span-5 rounded-2xl glass-card border border-border/40 p-6 space-y-6">
            <h3 className="font-display font-bold text-lg flex items-center space-x-2">
              <Sparkles className="w-4.5 h-4.5 text-primary animate-pulse" />
              <span>Resume Input Port</span>
            </h3>

            {/* Real Drag Drop Upload */}
            <div className="border-2 border-dashed border-border rounded-xl p-5 text-center bg-card/10 hover:border-primary/50 hover:bg-primary/5 transition-all relative">
              <input
                type="file"
                accept=".pdf,.txt"
                disabled={uploading}
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              {uploading ? (
                <>
                  <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2 block"></span>
                  <div className="text-xs font-semibold text-primary">Extracting plain text...</div>
                  <div className="text-[10px] text-muted-foreground mt-1">Parsing document structure</div>
                </>
              ) : (
                <>
                  <FileCheck className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-xs font-semibold">Click or drag PDF/TXT to upload</div>
                  <div className="text-[10px] text-muted-foreground mt-1">Accepts PDF or plain text files</div>
                </>
              )}
            </div>

            {fileName && (
              <div className="p-3 bg-primary/10 border border-primary/20 text-primary rounded-xl text-xs flex justify-between items-center">
                <span className="font-semibold truncate max-w-[80%]">Uploaded: {fileName}</span>
                <button onClick={() => { setFileName(''); setResumeText(''); }} className="hover:underline font-bold text-[10px] text-muted-foreground hover:text-red-400">Clear</button>
              </div>
            )}

            <form onSubmit={handleTextAnalyze} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Paste Resume Content (Text)</label>
                <textarea
                  rows={8}
                  required
                  placeholder="Paste work histories, skills listings, education, and details..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-muted/10 border border-border focus:border-primary focus:outline-none rounded-xl text-foreground resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={analyzeMutation.isPending}
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm flex items-center justify-center space-x-2 hover:bg-amber-400 transition-colors"
              >
                {analyzeMutation.isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
                    <span>Analyzing Syntax & Gaps...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-4.5 h-4.5" />
                    <span>Run ATS Audit</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Analysis View Panels */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              {analysis ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-6"
                >
                  {/* Top Stats */}
                  <div className="p-6 rounded-2xl glass border border-border/40 grid grid-cols-1 md:grid-cols-2 gap-6 relative items-center">
                    
                    {/* ATS Score Progress */}
                    <div className="flex items-center space-x-4">
                      <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="48" cy="48" r="40" className="stroke-muted/10 fill-none" strokeWidth="8" />
                          <circle cx="48" cy="48" r="40" className="stroke-primary fill-none text-glow" strokeWidth="8" strokeDasharray="251" strokeDashoffset={251 - (251 * analysis.score) / 100} />
                        </svg>
                        <span className="absolute text-xl font-extrabold">{analysis.score}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg font-display">ATS Grading Score</h4>
                        <p className="text-xs text-muted-foreground">Compatibility metric compared to modern recruiting algorithms.</p>
                      </div>
                    </div>

                    {/* Readiness index */}
                    <div className="border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 flex flex-col justify-center">
                      <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">Career Readiness Score</span>
                      <span className="font-display font-extrabold text-2xl text-primary">{analysis.careerReadinessScore}%</span>
                      <span className="text-[10px] text-muted-foreground mt-1">Ready for mid-to-junior engineering submissions.</span>
                    </div>

                  </div>

                  {/* Strengths & Weaknesses Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Strengths */}
                    <div className="p-5 rounded-2xl glass-card border border-border/40 space-y-3">
                      <h4 className="font-display font-bold text-sm text-green-400 flex items-center space-x-1.5">
                        <Award className="w-4 h-4" />
                        <span>ATS Strengths</span>
                      </h4>
                      <ul className="space-y-2">
                        {analysis.strengths.map((str, idx) => (
                          <li key={idx} className="text-xs text-foreground/90 flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0"></span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="p-5 rounded-2xl glass-card border border-border/40 space-y-3">
                      <h4 className="font-display font-bold text-sm text-amber-500 flex items-center space-x-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        <span>ATS Weaknesses</span>
                      </h4>
                      <ul className="space-y-2">
                        {analysis.weaknesses.map((weak, idx) => (
                          <li key={idx} className="text-xs text-foreground/90 flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                            <span>{weak}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Suggestions List */}
                  <div className="p-6 rounded-2xl glass-card border border-border/40 space-y-4">
                    <h4 className="font-display font-bold text-sm text-foreground/80 flex items-center space-x-1.5">
                      <ShieldAlert className="w-4.5 h-4.5 text-primary" />
                      <span>Missing Skills & Improvement Recommendations</span>
                    </h4>

                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <div className="text-xs font-semibold text-muted-foreground">Missing Target Keywords:</div>
                        <div className="flex flex-wrap gap-2">
                          {analysis.missingSkills.map(s => (
                            <span key={s} className="px-2 py-1 rounded bg-muted/20 border border-border text-[10px] font-bold text-foreground">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-border">
                        <div className="text-xs font-semibold text-muted-foreground">Actionable Steps:</div>
                        <div className="space-y-2">
                          {analysis.suggestions.map((sug, idx) => (
                            <div key={idx} className="text-xs text-foreground/90 leading-relaxed flex items-start gap-2">
                              <span className="font-semibold text-primary mt-0.5">{idx + 1}.</span>
                              <span>{sug}</span>
                            </div>
                          ))}
                        </div>
                      </div>
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
                  <FileText className="w-12 h-12 text-muted-foreground/60" />
                  <div>
                    <h4 className="font-bold text-base">Awaiting Resume Document</h4>
                    <p className="text-xs text-muted-foreground max-w-sm mt-1">
                      Paste details or select a PDF model file to initialize compliance scorecard processing.
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
