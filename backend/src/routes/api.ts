import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken, AuthRequest, requireAdmin } from '../middleware/auth';
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import nodemailer from 'nodemailer';
import { Contact } from '../models/Contact';
import multer from 'multer';
const pdfParse: any = require('pdf-parse');

const upload = multer({ storage: multer.memoryStorage() });

// Models
import User from '../models/User';
import Course from '../models/Course';
import Internship from '../models/Internship';
import { Application, Certificate, Roadmap, ResumeAnalysis, Event, Post } from '../models/supporting';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'digimation_secret_key_12345';
let genAIInstance: GoogleGenerativeAI | null = null;
const getGenAI = () => {
  if (!genAIInstance) {
    genAIInstance = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }
  return genAIInstance;
};

// ==========================================
// IN-MEMORY FALLBACK DATABASE
// Used if MongoDB is not connected (readyState !== 1)
// ==========================================
const isDbConnected = () => mongoose.connection.readyState === 1;

let inMemoryUsers: any[] = [];
let inMemoryCourses: any[] = [];
let inMemoryInternships: any[] = [];
let inMemoryApplications: any[] = [];
let inMemoryCertificates: any[] = [];
let inMemoryRoadmaps: any[] = [];
let inMemoryResumeAnalyses: any[] = [];
let inMemoryEvents: any[] = [];
let inMemoryPosts: any[] = [];
let inMemoryContacts: any[] = [];

// Helper to generate IDs
const generateId = () => new mongoose.Types.ObjectId().toString();

// Initialize Mock / In-Memory Seed Data
const initInMemoryData = () => {
  if (inMemoryCourses.length > 0) return;

  console.log('Initializing in-memory seed data...');
  
  // Hash a default password 'password123'
  const hashedPassword = bcrypt.hashSync('password123', 10);
  
  // Seed Users
  const adminId = generateId();
  const studentId = generateId();
  inMemoryUsers = [
    {
      _id: adminId,
      name: 'Admin User',
      email: 'admin@digimation.com',
      password: hashedPassword,
      role: 'admin',
      xp: 2500,
      level: 12,
      badges: ['Innovator', 'Creator', 'Leader'],
      profileInfo: { skills: ['Next.js', 'Express', 'AI Development'], education: 'M.S. in CS', experience: '5 years', careerGoal: 'AI Lead' },
      enrolledCourses: [],
      appliedInternships: [],
      createdAt: new Date()
    },
    {
      _id: studentId,
      name: 'John Doe',
      email: 'student@digimation.com',
      password: hashedPassword,
      role: 'student',
      xp: 450,
      level: 3,
      badges: ['Quick Learner', 'Problem Solver'],
      profileInfo: { skills: ['React', 'JavaScript', 'HTML/CSS'], education: 'Undergrad BS CS', experience: 'Fresher', careerGoal: 'Full Stack Engineer' },
      enrolledCourses: [],
      appliedInternships: [],
      createdAt: new Date()
    }
  ];

  // Seed Courses
  const c1 = generateId();
  const c2 = generateId();
  const c3 = generateId();
  inMemoryCourses = [
    {
      _id: c1,
      title: 'Generative AI & LLMs in Practice',
      description: 'Master prompt engineering, fine-tuning, and integrating OpenAI & Gemini APIs into your production web applications.',
      category: 'Artificial Intelligence',
      rating: 4.9,
      price: 199,
      instructor: { name: 'Dr. Sarah Carter', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', bio: 'AI researcher and educator' },
      difficulty: 'Intermediate',
      duration: '6 weeks',
      lectures: ['Introduction to LLMs', 'Prompt Engineering Best Practices', 'Gemini & OpenAI API Integrations', 'Fine-tuning models', 'Building AI Chatbots', 'Ethical AI Deployment'],
      projects: ['Personal AI Writing Assistant', 'Enterprise Support Chatbot'],
      skillsCovered: ['Generative AI', 'LLMs', 'OpenAI API', 'Gemini API', 'Node.js'],
      image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a',
      createdAt: new Date()
    },
    {
      _id: c2,
      title: 'Full Stack Next.js & TypeScript Mastery',
      description: 'Build premium responsive SaaS platforms with Next.js 15, App Router, Tailwind CSS, Framer Motion, and Node/Express backend.',
      category: 'Full Stack Development',
      rating: 4.8,
      price: 149,
      instructor: { name: 'Alex Rivers', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', bio: 'Senior SaaS Architect' },
      difficulty: 'Advanced',
      duration: '8 weeks',
      lectures: ['React Essentials & TypeScript', 'Next.js 15 App Router & Layouts', 'State Management with Zustand', 'Database integration with Mongoose', 'Framer Motion & Premium UI/UX', 'CI/CD & Vercel Deployment'],
      projects: ['SaaS Dashboard Platform', 'E-Commerce Marketplace'],
      skillsCovered: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'MongoDB'],
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      createdAt: new Date()
    },
    {
      _id: c3,
      title: 'Deep Learning & Neural Networks',
      description: 'Go from the math of neural networks to building computer vision and natural language processing models with PyTorch.',
      category: 'Machine Learning',
      rating: 4.7,
      price: 249,
      instructor: { name: 'Dr. Alan Turing', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', bio: 'Deep Learning Pioneer' },
      difficulty: 'Advanced',
      duration: '10 weeks',
      lectures: ['Neural Network Foundations', 'Backpropagation & Math', 'Convolutional Networks (CNN)', 'Recurrent Networks & Transformers', 'Computer Vision with PyTorch', 'Deployment at Scale'],
      projects: ['Object Detection Engine', 'Sentiment Classifier Model'],
      skillsCovered: ['Machine Learning', 'Deep Learning', 'PyTorch', 'Computer Vision', 'Python'],
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',
      createdAt: new Date()
    }
  ];

  // Seed Internships
  const i1 = generateId();
  const i2 = generateId();
  inMemoryInternships = [
    {
      _id: i1,
      title: 'AI Development Intern',
      company: 'Digimation Labs',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
      stipend: '$2,000/mo',
      duration: '3 months',
      type: 'Remote',
      location: 'San Francisco, CA',
      domain: 'AI',
      experienceLevel: 'Beginner',
      skillsRequired: ['Python', 'OpenAI SDK', 'FastAPI', 'Machine Learning Basics'],
      description: 'Work directly with our AI Architects to prototype, test, and integrate generative AI agents and workflows into customer products.',
      appliedCount: 15,
      createdAt: new Date()
    },
    {
      _id: i2,
      title: 'Full Stack Developer Intern',
      company: 'SaaSify Inc.',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
      stipend: '$1,500/mo',
      duration: '6 months',
      type: 'Hybrid',
      location: 'New York, NY',
      domain: 'Full Stack Development',
      experienceLevel: 'Intermediate',
      skillsRequired: ['React', 'Next.js', 'Node.js', 'MongoDB', 'Tailwind CSS'],
      description: 'Join our product team to build user-facing dashboards, write clean API endpoints, and design responsive components.',
      appliedCount: 22,
      createdAt: new Date()
    }
  ];

  // Seed Events
  inMemoryEvents = [
    {
      _id: generateId(),
      title: 'Digimation Hackathon: AI Career Boost 2026',
      description: 'Build a next-generation AI tool that helps students upgrade their careers. Win up to $5,000 and internship placements!',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      type: 'Hackathon',
      registeredUsers: [studentId],
      link: 'https://hackathon.digimation.com',
      spotsLeft: 48,
      createdAt: new Date()
    },
    {
      _id: generateId(),
      title: 'Webinar: The Future of LLMs & Generative Web Apps',
      description: 'Join our panel of experts as they discuss the upcoming trends in Next.js 15, Vercel, and OpenAI.',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      type: 'Webinar',
      registeredUsers: [],
      link: 'https://zoom.us/webinar/digimation',
      spotsLeft: 120,
      createdAt: new Date()
    }
  ];

  // Seed Forum Posts
  inMemoryPosts = [
    {
      _id: generateId(),
      authorId: studentId,
      authorName: 'John Doe',
      title: 'How should I start learning LLMs in 2026?',
      content: 'I have some basic Python knowledge and want to transition to AI engineering. Should I learn PyTorch first or dive straight into prompt engineering and API integrations? Thanks!',
      category: 'Artificial Intelligence',
      likes: [],
      comments: [
        {
          _id: generateId(),
          userId: adminId,
          userName: 'Admin User',
          content: 'Hi John! I recommend starting with API integrations (OpenAI/Gemini) to build interactive apps quickly. Once you understand the application layer, dive deeper into models via PyTorch/Hugging Face!',
          createdAt: new Date()
        }
      ],
      createdAt: new Date()
    }
  ];

  // Enroll student in Course 1 for dashboard display
  inMemoryUsers[1].enrolledCourses.push({
    courseId: c1,
    progress: 35,
    wishlist: false
  });
  
  // Make student apply to internship 1
  inMemoryUsers[1].appliedInternships.push({
    internshipId: i1,
    status: 'under-review',
    appliedAt: new Date()
  });

  inMemoryApplications = [{
    _id: generateId(),
    userId: studentId,
    internshipId: i1,
    status: 'under-review',
    resumeUrl: '/uploads/mock_resume.pdf',
    notes: 'Excited about the role!',
    appliedAt: new Date()
  }];

  console.log('In-memory seed data loaded successfully!');
};

initInMemoryData();

// ==========================================
// SEEDING ROUTE (HTTP trigger)
// ==========================================
router.post('/seed', async (req, res) => {
  try {
    if (isDbConnected()) {
      // Clear existing Mongoose database
      await User.deleteMany({});
      await Course.deleteMany({});
      await Internship.deleteMany({});
      await Application.deleteMany({});
      await Certificate.deleteMany({});
      await Roadmap.deleteMany({});
      await ResumeAnalysis.deleteMany({});
      await Event.deleteMany({});
      await Post.deleteMany({});

      // Seed courses
      const createdCourses = await Course.insertMany(inMemoryCourses);
      const createdInternships = await Internship.insertMany(inMemoryInternships);
      
      const hashedPassword = await bcrypt.hashSync('password123', 10);
      
      const admin = await User.create({
        name: 'Admin User',
        email: 'admin@digimation.com',
        password: hashedPassword,
        role: 'admin',
        xp: 2500,
        level: 12,
        badges: ['Innovator', 'Creator', 'Leader'],
        profileInfo: { skills: ['Next.js', 'Express', 'AI Development'], education: 'M.S. in CS', experience: '5 years', careerGoal: 'AI Lead' }
      });

      const student = await User.create({
        name: 'John Doe',
        email: 'student@digimation.com',
        password: hashedPassword,
        role: 'student',
        xp: 450,
        level: 3,
        badges: ['Quick Learner', 'Problem Solver'],
        profileInfo: { skills: ['React', 'JavaScript', 'HTML/CSS'], education: 'Undergrad BS CS', experience: 'Fresher', careerGoal: 'Full Stack Engineer' },
        enrolledCourses: [{
          courseId: createdCourses[0]._id,
          progress: 35
        }],
        appliedInternships: [{
          internshipId: createdInternships[0]._id,
          status: 'under-review'
        }]
      });

      await Application.create({
        userId: student._id,
        internshipId: createdInternships[0]._id,
        status: 'under-review',
        resumeUrl: '/uploads/mock_resume.pdf',
        notes: 'Excited about the role!'
      });

      // Seed events
      const eventList = inMemoryEvents.map(e => ({
        ...e,
        registeredUsers: e.registeredUsers.includes(inMemoryUsers[1]._id) ? [student._id] : []
      }));
      await Event.insertMany(eventList);

      // Seed posts
      const postList = inMemoryPosts.map(p => ({
        ...p,
        authorId: student._id,
        comments: p.comments.map((c: any) => ({
          ...c,
          userId: c.userId === inMemoryUsers[0]._id ? admin._id : student._id
        }))
      }));
      await Post.insertMany(postList);

      return res.status(200).json({ message: 'MongoDB seeded successfully!' });
    } else {
      // Re-init in-memory arrays
      initInMemoryData();
      return res.status(200).json({ message: 'In-Memory fallback database seeded/reset successfully!' });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================
router.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all details' });
  }

  try {
    const hashedPassword = await bcrypt.hashSync(password, 10);
    
    if (isDbConnected()) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'student'
      });

      const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, xp: user.xp, level: user.level }
      });
    } else {
      const existingUser = inMemoryUsers.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const newUser = {
        _id: generateId(),
        name,
        email,
        password: hashedPassword,
        role: 'student',
        xp: 0,
        level: 1,
        badges: [],
        profileInfo: { skills: [], education: '', experience: '', careerGoal: '' },
        enrolledCourses: [],
        appliedInternships: [],
        createdAt: new Date()
      };
      inMemoryUsers.push(newUser);

      const token = jwt.sign({ id: newUser._id, role: newUser.role, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({
        token,
        user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, xp: newUser.xp, level: newUser.level }
      });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    if (isDbConnected()) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, xp: user.xp, level: user.level }
      });
    } else {
      const user = inMemoryUsers.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, xp: user.xp, level: user.level }
      });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/auth/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (isDbConnected()) {
      const user = await User.findById(userId).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json(user);
    } else {
      const user = inMemoryUsers.find(u => u._id === userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const { password, ...safeUser } = user;
      return res.status(200).json(safeUser);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Update Profile
router.put('/auth/profile', authenticateToken, async (req: AuthRequest, res) => {
  const { skills, education, experience, careerGoal } = req.body;
  const userId = req.user?.id;

  try {
    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      
      user.profileInfo = {
        skills: skills || user.profileInfo.skills,
        education: education || user.profileInfo.education,
        experience: experience || user.profileInfo.experience,
        careerGoal: careerGoal || user.profileInfo.careerGoal
      };
      
      await user.save();
      return res.status(200).json(user);
    } else {
      const idx = inMemoryUsers.findIndex(u => u._id === userId);
      if (idx === -1) return res.status(404).json({ message: 'User not found' });
      
      inMemoryUsers[idx].profileInfo = {
        skills: skills || inMemoryUsers[idx].profileInfo.skills,
        education: education || inMemoryUsers[idx].profileInfo.education,
        experience: experience || inMemoryUsers[idx].profileInfo.experience,
        careerGoal: careerGoal || inMemoryUsers[idx].profileInfo.careerGoal
      };
      
      return res.status(200).json(inMemoryUsers[idx]);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// COURSE MARKETPLACE ROUTES
// ==========================================
router.get('/courses', async (req, res) => {
  const { category, search, difficulty } = req.query;
  
  try {
    let coursesList = [];
    if (isDbConnected()) {
      let query: any = {};
      if (category) query.category = category;
      if (difficulty) query.difficulty = difficulty;
      if (search) query.title = { $regex: search as string, $options: 'i' };
      coursesList = await Course.find(query);
    } else {
      coursesList = inMemoryCourses;
      if (category) {
        coursesList = coursesList.filter(c => c.category === category);
      }
      if (difficulty) {
        coursesList = coursesList.filter(c => c.difficulty === difficulty);
      }
      if (search) {
        coursesList = coursesList.filter(c => c.title.toLowerCase().includes((search as string).toLowerCase()));
      }
    }
    return res.status(200).json(coursesList);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/courses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (isDbConnected()) {
      const course = await Course.findById(id);
      if (!course) return res.status(404).json({ message: 'Course not found' });
      return res.status(200).json(course);
    } else {
      const course = inMemoryCourses.find(c => c._id === id);
      if (!course) return res.status(404).json({ message: 'Course not found' });
      return res.status(200).json(course);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Create Course (Admin only)
router.post('/courses', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  const courseData = req.body;
  try {
    if (isDbConnected()) {
      const course = await Course.create(courseData);
      return res.status(201).json(course);
    } else {
      const course = {
        _id: generateId(),
        ...courseData,
        createdAt: new Date()
      };
      inMemoryCourses.push(course);
      return res.status(201).json(course);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Enroll in Course
router.post('/courses/:id/enroll', authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Check if already enrolled
      const isEnrolled = user.enrolledCourses.some((c: any) => c.courseId.toString() === id);
      if (isEnrolled) {
        return res.status(400).json({ message: 'Already enrolled in this course' });
      }

      const course = await Course.findById(id);
      if (!course) return res.status(404).json({ message: 'Course not found' });

      user.enrolledCourses.push({ courseId: new mongoose.Types.ObjectId(id), progress: 0 });
      user.xp += 100; // Reward 100 XP for enrolling!
      
      // Level Up calculation
      user.level = Math.floor(user.xp / 500) + 1;
      if (!user.badges.includes('New Scholar')) {
        user.badges.push('New Scholar');
      }

      await user.save();

      // Send email if SMTP is configured
      if (process.env.SMTP_USER && process.env.SMTP_PASS && req.user?.email) {
        try {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.resend.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          await transporter.sendMail({
            from: process.env.SMTP_FROM || `"Digimation Academy" <no-reply@digimation.com>`,
            to: req.user.email,
            subject: `Enrollment Confirmed: ${course.title}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #0b0f19; color: #f8fafc;">
                <h2 style="color: #fbbf24;">Congratulations, ${user.name}!</h2>
                <p>Your payment was securely verified and your enrollment is confirmed for:</p>
                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border-left: 4px solid #fbbf24; margin: 15px 0;">
                  <strong style="font-size: 16px; color: #ffffff;">${course.title}</strong><br/>
                  <span style="font-size: 13px; color: #94a3b8;">Tuition: $${course.price} • Duration: ${course.duration}</span>
                </div>
                <p>🏆 You have earned <strong>100 XP</strong> for enrolling. This has been added to your profile stats.</p>
                <p>You can start accessing lectures and tracking your learning progress right now on the dashboard:</p>
                <a href="http://localhost:3000/dashboard" style="display: inline-block; background: #fbbf24; color: #0b0f19; font-weight: bold; text-decoration: none; padding: 10px 20px; border-radius: 8px; margin: 10px 0;">Go to Student Dashboard</a>
                <hr style="border: 0; border-top: 1px solid #1e293b; margin: 20px 0;" />
                <p style="font-size: 12px; color: #64748b; text-align: center;">Digimation Flight 3.0 Learning & Innovation Academy</p>
              </div>
            `,
          });
          console.log(`Enrollment email sent to ${req.user.email}`);
        } catch (emailErr: any) {
          console.error('Nodemailer enrollment email error:', emailErr.message);
        }
      }

      return res.status(200).json({ message: 'Enrolled successfully!', xpAwarded: 100, xp: user.xp, level: user.level, badges: user.badges });
    } else {
      const userIdx = inMemoryUsers.findIndex(u => u._id === userId);
      if (userIdx === -1) return res.status(404).json({ message: 'User not found' });

      const user = inMemoryUsers[userIdx];
      const isEnrolled = user.enrolledCourses.some((c: any) => c.courseId === id);
      if (isEnrolled) {
        return res.status(400).json({ message: 'Already enrolled in this course' });
      }

      const course = inMemoryCourses.find(c => c._id === id);
      if (!course) return res.status(404).json({ message: 'Course not found' });

      user.enrolledCourses.push({ courseId: id, progress: 0 });
      user.xp += 100;
      user.level = Math.floor(user.xp / 500) + 1;
      if (!user.badges.includes('New Scholar')) {
        user.badges.push('New Scholar');
      }

      // Send email if SMTP is configured
      if (process.env.SMTP_USER && process.env.SMTP_PASS && req.user?.email) {
        try {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.resend.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          await transporter.sendMail({
            from: process.env.SMTP_FROM || `"Digimation Academy" <no-reply@digimation.com>`,
            to: req.user.email,
            subject: `Enrollment Confirmed: ${course.title}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #0b0f19; color: #f8fafc;">
                <h2 style="color: #fbbf24;">Congratulations, ${user.name}!</h2>
                <p>Your payment was securely verified and your enrollment is confirmed for:</p>
                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border-left: 4px solid #fbbf24; margin: 15px 0;">
                  <strong style="font-size: 16px; color: #ffffff;">${course.title}</strong><br/>
                  <span style="font-size: 13px; color: #94a3b8;">Tuition: $${course.price} • Duration: ${course.duration}</span>
                </div>
                <p>🏆 You have earned <strong>100 XP</strong> for enrolling. This has been added to your profile stats.</p>
                <p>You can start accessing lectures and tracking your learning progress right now on the dashboard:</p>
                <a href="http://localhost:3000/dashboard" style="display: inline-block; background: #fbbf24; color: #0b0f19; font-weight: bold; text-decoration: none; padding: 10px 20px; border-radius: 8px; margin: 10px 0;">Go to Student Dashboard</a>
                <hr style="border: 0; border-top: 1px solid #1e293b; margin: 20px 0;" />
                <p style="font-size: 12px; color: #64748b; text-align: center;">Digimation Flight 3.0 Learning & Innovation Academy</p>
              </div>
            `,
          });
          console.log(`Enrollment email sent to ${req.user.email}`);
        } catch (emailErr: any) {
          console.error('Nodemailer enrollment email error in fallback:', emailErr.message);
        }
      }

      return res.status(200).json({ message: 'Enrolled successfully!', xpAwarded: 100, xp: user.xp, level: user.level, badges: user.badges });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Update Course Progress
router.post('/courses/:id/progress', authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { progress } = req.body; // e.g. 50 or 100
  const userId = req.user?.id;

  try {
    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const courseIndex = user.enrolledCourses.findIndex((c: any) => c.courseId.toString() === id);
      if (courseIndex === -1) {
        return res.status(400).json({ message: 'Not enrolled in this course' });
      }

      const prevProgress = user.enrolledCourses[courseIndex].progress;
      user.enrolledCourses[courseIndex].progress = progress;

      let xpEarned = 0;
      let certificateGenerated = null;

      if (progress >= 100 && prevProgress < 100) {
        xpEarned += 500; // Complete bonus!
        user.xp += xpEarned;
        
        // Generate Certificate
        const certId = 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        const cert = await Certificate.create({
          userId: user._id,
          courseId: new mongoose.Types.ObjectId(id),
          certificateId: certId,
          grade: 'A+',
          verificationUrl: `/verify/${certId}`
        });
        certificateGenerated = cert;

        if (!user.badges.includes('Course Graduate')) {
          user.badges.push('Course Graduate');
        }
      } else {
        xpEarned += (progress - prevProgress) * 2; // Earn 2 XP per percentage increase
        user.xp += Math.max(0, xpEarned);
      }

      user.level = Math.floor(user.xp / 500) + 1;
      await user.save();

      return res.status(200).json({
        message: 'Progress updated',
        progress,
        xpAwarded: Math.max(0, xpEarned),
        certificate: certificateGenerated,
        user: { xp: user.xp, level: user.level, badges: user.badges }
      });
    } else {
      const userIdx = inMemoryUsers.findIndex(u => u._id === userId);
      if (userIdx === -1) return res.status(404).json({ message: 'User not found' });

      const user = inMemoryUsers[userIdx];
      const courseIndex = user.enrolledCourses.findIndex((c: any) => c.courseId === id);
      if (courseIndex === -1) {
        return res.status(400).json({ message: 'Not enrolled in this course' });
      }

      const prevProgress = user.enrolledCourses[courseIndex].progress;
      user.enrolledCourses[courseIndex].progress = progress;

      let xpEarned = 0;
      let certificateGenerated = null;

      if (progress >= 100 && prevProgress < 100) {
        xpEarned += 500;
        user.xp += xpEarned;

        const certId = 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        certificateGenerated = {
          _id: generateId(),
          userId: user._id,
          courseId: id,
          certificateId: certId,
          issueDate: new Date(),
          grade: 'A+',
          verificationUrl: `/verify/${certId}`
        };
        inMemoryCertificates.push(certificateGenerated);

        if (!user.badges.includes('Course Graduate')) {
          user.badges.push('Course Graduate');
        }
      } else {
        xpEarned += (progress - prevProgress) * 2;
        user.xp += Math.max(0, xpEarned);
      }

      user.level = Math.floor(user.xp / 500) + 1;
      return res.status(200).json({
        message: 'Progress updated',
        progress,
        xpAwarded: Math.max(0, xpEarned),
        certificate: certificateGenerated,
        user: { xp: user.xp, level: user.level, badges: user.badges }
      });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// INTERNSHIP & CAREER HUB ROUTES
// ==========================================
router.get('/internships', async (req, res) => {
  const { domain, type, experienceLevel, location } = req.query;
  try {
    let list = [];
    if (isDbConnected()) {
      let query: any = {};
      if (domain) query.domain = domain;
      if (type) query.type = type;
      if (experienceLevel) query.experienceLevel = experienceLevel;
      if (location) query.location = { $regex: location as string, $options: 'i' };
      list = await Internship.find(query);
    } else {
      list = inMemoryInternships;
      if (domain) list = list.filter(i => i.domain === domain);
      if (type) list = list.filter(i => i.type === type);
      if (experienceLevel) list = list.filter(i => i.experienceLevel === experienceLevel);
      if (location) {
        list = list.filter(i => i.location.toLowerCase().includes((location as string).toLowerCase()));
      }
    }
    return res.status(200).json(list);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/internships/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const internship = await Internship.findById(req.params.id);
      if (!internship) return res.status(404).json({ message: 'Internship not found' });
      return res.status(200).json(internship);
    } else {
      const internship = inMemoryInternships.find(i => i._id === req.params.id);
      if (!internship) return res.status(404).json({ message: 'Internship not found' });
      return res.status(200).json(internship);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Create Internship (Admin only)
router.post('/internships', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  const internshipData = req.body;
  try {
    if (isDbConnected()) {
      const internship = await Internship.create(internshipData);
      return res.status(201).json(internship);
    } else {
      const internship = {
        _id: generateId(),
        ...internshipData,
        appliedCount: 0,
        createdAt: new Date()
      };
      inMemoryInternships.push(internship);
      return res.status(201).json(internship);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Apply for Internship
router.post('/internships/:id/apply', authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { notes, resumeUrl } = req.body;
  const userId = req.user?.id;

  try {
    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Check if already applied
      const isApplied = user.appliedInternships.some((a: any) => a.internshipId.toString() === id);
      if (isApplied) {
        return res.status(400).json({ message: 'Already applied for this internship' });
      }

      // Increment applied count
      await Internship.findByIdAndUpdate(id, { $inc: { appliedCount: 1 } });

      const application = await Application.create({
        userId: user._id,
        internshipId: new mongoose.Types.ObjectId(id),
        resumeUrl: resumeUrl || '',
        notes: notes || '',
        status: 'applied'
      });

      user.appliedInternships.push({ internshipId: new mongoose.Types.ObjectId(id), status: 'applied' });
      
      // Award 200 XP for applying!
      user.xp += 200;
      user.level = Math.floor(user.xp / 500) + 1;
      if (!user.badges.includes('Go-Getter')) {
        user.badges.push('Go-Getter');
      }

      await user.save();
      return res.status(201).json({ message: 'Applied successfully!', application, xpAwarded: 200, user: { xp: user.xp, level: user.level, badges: user.badges } });
    } else {
      const userIdx = inMemoryUsers.findIndex(u => u._id === userId);
      if (userIdx === -1) return res.status(404).json({ message: 'User not found' });

      const user = inMemoryUsers[userIdx];
      const isApplied = user.appliedInternships.some((a: any) => a.internshipId === id);
      if (isApplied) {
        return res.status(400).json({ message: 'Already applied for this internship' });
      }

      // Increment appliedCount
      const internshipIdx = inMemoryInternships.findIndex(i => i._id === id);
      if (internshipIdx !== -1) {
        inMemoryInternships[internshipIdx].appliedCount = (inMemoryInternships[internshipIdx].appliedCount || 0) + 1;
      }

      const application = {
        _id: generateId(),
        userId: user._id,
        internshipId: id,
        resumeUrl: resumeUrl || '',
        notes: notes || '',
        status: 'applied',
        appliedAt: new Date()
      };
      inMemoryApplications.push(application);

      user.appliedInternships.push({ internshipId: id, status: 'applied', appliedAt: new Date() });
      user.xp += 200;
      user.level = Math.floor(user.xp / 500) + 1;
      if (!user.badges.includes('Go-Getter')) {
        user.badges.push('Go-Getter');
      }

      return res.status(201).json({ message: 'Applied successfully!', application, xpAwarded: 200, user: { xp: user.xp, level: user.level, badges: user.badges } });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// AI CAREER ASSISTANT (ROADMAP GENERATOR)
// ==========================================
router.post('/roadmaps/generate', authenticateToken, async (req: AuthRequest, res) => {
  const { skills, educationLevel, careerGoal, experienceLevel } = req.body;
  const userId = req.user?.id;

  if (!careerGoal) {
    return res.status(400).json({ message: 'Career goal is required' });
  }

  try {
    const skillsList = Array.isArray(skills) ? skills : (skills ? skills.split(',').map((s: string) => s.trim()) : []);
    let roadmapData: any = null;

    if (process.env.GEMINI_API_KEY) {
      try {
        const model = getGenAI().getGenerativeModel({ model: 'gemini-2.0-flash' });
        const prompt = `You are a professional career advisor and technical recruiter. Generate a structured career learning roadmap and skills gap analysis for a candidate with:
- Career Goal: ${careerGoal}
- Current Skills: ${skillsList.join(', ') || 'None listed'}
- Education Level: ${educationLevel || 'Not specified'}
- Experience Level: ${experienceLevel || 'Not specified'}

You MUST return ONLY a valid JSON object matching the following structure:
{
  "careerGoal": "${careerGoal}",
  "educationLevel": "${educationLevel || 'Not specified'}",
  "experienceLevel": "${experienceLevel || 'Not specified'}",
  "skillGapAnalysis": {
    "currentSkills": ["skill1", "skill2"],
    "missingSkills": ["skill3", "skill4"],
    "gapPercentage": 60
  },
  "recommendedCourses": ["course1", "course2"],
  "recommendedProjects": ["project1", "project2"],
  "certifications": ["cert1", "cert2"],
  "timeline": [
    { "phase": "Phase 1: Foundation (Month 1-2)", "tasks": "detailed tasks description" },
    { "phase": "Phase 2: Project Building (Month 3-4)", "tasks": "detailed tasks description" },
    { "phase": "Phase 3: Certification & Prep (Month 5)", "tasks": "detailed tasks description" },
    { "phase": "Phase 4: Apply & Interview (Month 6)", "tasks": "detailed tasks description" }
  ],
  "careerPathName": "${careerGoal} Professional Pathway"
}`;

        const response = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        });
        const responseText = response.response.text();
        roadmapData = JSON.parse(responseText);
      } catch (err: any) {
        console.error('Gemini API Error in roadmaps/generate, falling back to mock:', err.message);
      }
    }

    if (!roadmapData) {
      // Mock Fallback Code
      const missingSkills: string[] = [];
      const recommendedCourses: string[] = [];
      const recommendedProjects: string[] = [];
      const certifications: string[] = [];
      
      if (careerGoal.toLowerCase().includes('ai') || careerGoal.toLowerCase().includes('machine learning')) {
        missingSkills.push('PyTorch', 'Large Language Models (LLMs)', 'Data Wrangling', 'Transformers');
        recommendedCourses.push('Generative AI & LLMs in Practice', 'Deep Learning & Neural Networks');
        recommendedProjects.push('Enterprise AI Agent Chatbot', 'Image Detection Engine with CNNs');
        certifications.push('Digimation Certified AI Architect', 'Google Cloud Professional ML Engineer');
      } else if (careerGoal.toLowerCase().includes('full stack') || careerGoal.toLowerCase().includes('web')) {
        missingSkills.push('Next.js App Router', 'State Management (Zustand/Redux)', 'NoSQL Databases (MongoDB)', 'REST APIs & Security');
        recommendedCourses.push('Full Stack Next.js & TypeScript Mastery');
        recommendedProjects.push('SaaS Analytics Dashboard', 'Realtime Collaboration Board');
        certifications.push('Digimation Professional Web Architect', 'AWS Certified Developer');
      } else {
        missingSkills.push('System Architecture', 'Modern frameworks', 'Cloud Orchestration');
        recommendedCourses.push('Full Stack Next.js & TypeScript Mastery', 'Generative AI & LLMs in Practice');
        recommendedProjects.push('Custom End-to-End Enterprise SaaS Platform');
        certifications.push('Digimation Professional Certificate');
      }

      const actualGaps = missingSkills.filter(s => !skillsList.some((hasS: string) => hasS.toLowerCase() === s.toLowerCase()));

      roadmapData = {
        careerGoal,
        educationLevel,
        experienceLevel,
        skillGapAnalysis: {
          currentSkills: skillsList,
          missingSkills: actualGaps,
          gapPercentage: Math.max(20, Math.floor(100 - (skillsList.length / (skillsList.length + actualGaps.length)) * 100))
        },
        recommendedCourses,
        recommendedProjects,
        certifications,
        timeline: [
          { phase: 'Phase 1: Foundation (Month 1-2)', tasks: `Master foundational technologies and enroll in: ${recommendedCourses.join(', ')}.` },
          { phase: 'Phase 2: Project Building (Month 3-4)', tasks: `Build portfolio projects: ${recommendedProjects.join(', ')}. Begin smart internship matching.` },
          { phase: 'Phase 3: Certification & Prep (Month 5)', tasks: `Obtain professional certificate: ${certifications.join(', ')}. Practice technical interviews.` },
          { phase: 'Phase 4: Apply & Interview (Month 6)', tasks: 'Apply to matching partner roles via the Internship Hub with optimized AI Resume.' }
        ],
        careerPathName: `${careerGoal} Professional Pathway`
      };
    }

    let savedRoadmap;
    if (isDbConnected()) {
      savedRoadmap = await Roadmap.create({
        userId,
        skills: skillsList,
        careerGoal,
        roadmapData
      });
      // Award XP
      await User.findByIdAndUpdate(userId, { $inc: { xp: 150 } });
    } else {
      savedRoadmap = {
        _id: generateId(),
        userId,
        skills: skillsList,
        careerGoal,
        roadmapData,
        generatedAt: new Date()
      };
      inMemoryRoadmaps.push(savedRoadmap);
      const userIdx = inMemoryUsers.findIndex(u => u._id === userId);
      if (userIdx !== -1) {
        inMemoryUsers[userIdx].xp += 150;
        inMemoryUsers[userIdx].level = Math.floor(inMemoryUsers[userIdx].xp / 500) + 1;
      }
    }

    return res.status(200).json({
      message: 'Roadmap generated successfully!',
      roadmap: savedRoadmap,
      xpAwarded: 150
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/roadmaps/history', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  try {
    if (isDbConnected()) {
      const list = await Roadmap.find({ userId }).sort({ generatedAt: -1 });
      return res.status(200).json(list);
    } else {
      const list = inMemoryRoadmaps.filter(r => r.userId === userId).sort((a,b) => b.generatedAt.getTime() - a.generatedAt.getTime());
      return res.status(200).json(list);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// RESUME FILE UPLOAD & TEXT EXTRACTION
// ==========================================
router.post('/resumes/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    let extractedText = '';
    const fileName = req.file.originalname;

    if (req.file.mimetype === 'application/pdf') {
      const data = await pdfParse(req.file.buffer);
      extractedText = data.text;
    } else {
      // Fallback for plain text files
      extractedText = req.file.buffer.toString('utf-8');
    }

    if (!extractedText.trim()) {
      return res.status(400).json({ message: 'Could not extract text from the file. Ensure it is not empty or a scanned image.' });
    }

    return res.status(200).json({
      text: extractedText,
      fileName
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// AI RESUME ANALYZER
// ==========================================
router.post('/resumes/analyze', authenticateToken, async (req: AuthRequest, res) => {
  const { resumeText, fileName } = req.body;
  const userId = req.user?.id;

  try {
    let analysisResult: any = null;

    if (process.env.GEMINI_API_KEY) {
      try {
        const model = getGenAI().getGenerativeModel({ model: 'gemini-2.0-flash' });
        const prompt = `You are a professional ATS (Applicant Tracking System) recruiter. Review this candidate's resume text:
"${resumeText || ''}"

Perform a deep ATS scorecard assessment. You MUST return ONLY a valid JSON object matching the following structure:
{
  "score": 75, 
  "strengths": ["string1", "string2"],
  "weaknesses": ["string1", "string2"],
  "missingSkills": ["skill1", "skill2"],
  "suggestions": ["suggestion1", "suggestion2"]
}`;

        const response = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        });
        const responseText = response.response.text();
        const parsed = JSON.parse(responseText);
        analysisResult = {
          score: parsed.score,
          strengths: parsed.strengths,
          weaknesses: parsed.weaknesses,
          missingSkills: parsed.missingSkills,
          suggestions: parsed.suggestions,
          careerReadinessScore: Math.floor(parsed.score * 0.95),
          fileName: fileName || 'UploadedResume.pdf'
        };
      } catch (err: any) {
        console.error('Gemini API Error in resumes/analyze, falling back to mock:', err.message);
      }
    }

    if (!analysisResult) {
      // Mock Fallback Code
      const text = (resumeText || '').toLowerCase();
      
      let score = 55; // default base score
      const strengths: string[] = [];
      const weaknesses: string[] = [];
      const missingSkills: string[] = [];
      const suggestions: string[] = [];

      // Analyze text content for skills and structure
      if (text.includes('skills') || text.includes('technologies')) {
        score += 10;
        strengths.push('Has a dedicated Skills section.');
      } else {
        weaknesses.push('Missing explicit Skills or Technologies header.');
        suggestions.push('Add a clean technologies list divided by category (e.g. Languages, Libraries, Tools).');
      }

      if (text.includes('education') || text.includes('degree') || text.includes('university') || text.includes('college')) {
        score += 10;
        strengths.push('Contains educational qualifications.');
      } else {
        weaknesses.push('Education details are vague or missing.');
        suggestions.push('Provide your degree, major, university, and graduation year near the top or bottom.');
      }

      if (text.includes('experience') || text.includes('projects') || text.includes('employment')) {
        score += 15;
        strengths.push('Work experience or personal projects are listed.');
      } else {
        weaknesses.push('No professional experience or project details.');
        suggestions.push('Outline at least 2 key projects or roles using action verbs and quantifiable results.');
      }

      // Check modern technology matching
      const testTech = ['react', 'next.js', 'typescript', 'tailwind', 'python', 'node', 'mongodb', 'aws', 'docker', 'machine learning'];
      let count = 0;
      testTech.forEach(tech => {
        if (text.includes(tech)) {
          count++;
        } else {
          missingSkills.push(tech.charAt(0).toUpperCase() + tech.slice(1));
        }
      });

      score += Math.min(15, count * 2);
      
      if (count > 4) {
        strengths.push(`Excellent keyword density. Matches key industry skills: ${testTech.filter(tech => text.includes(tech)).join(', ')}.`);
      } else {
        weaknesses.push('Low keyword optimization for modern AI and Web development roles.');
        suggestions.push('Incorporate standard keywords like React, Next.js, Node, TypeScript, and MongoDB in your project descriptions.');
      }

      score = Math.min(98, score); // cap at 98

      analysisResult = {
        score,
        strengths,
        weaknesses,
        missingSkills: missingSkills.slice(0, 5),
        suggestions,
        careerReadinessScore: Math.floor(score * 0.95),
        fileName: fileName || 'UploadedResume.pdf'
      };
    }

    let savedAnalysis;
    if (isDbConnected()) {
      savedAnalysis = await ResumeAnalysis.create({
        userId,
        score: analysisResult.score,
        strengths: analysisResult.strengths,
        weaknesses: analysisResult.weaknesses,
        missingSkills: analysisResult.missingSkills,
        suggestions: analysisResult.suggestions
      });
      // Award XP
      await User.findByIdAndUpdate(userId, { $inc: { xp: 100 } });
    } else {
      savedAnalysis = {
        _id: generateId(),
        userId,
        score: analysisResult.score,
        strengths: analysisResult.strengths,
        weaknesses: analysisResult.weaknesses,
        missingSkills: analysisResult.missingSkills,
        suggestions: analysisResult.suggestions,
        analyzedAt: new Date()
      };
      inMemoryResumeAnalyses.push(savedAnalysis);
      const userIdx = inMemoryUsers.findIndex(u => u._id === userId);
      if (userIdx !== -1) {
        inMemoryUsers[userIdx].xp += 100;
        inMemoryUsers[userIdx].level = Math.floor(inMemoryUsers[userIdx].xp / 500) + 1;
      }
    }

    return res.status(200).json({
      message: 'Resume analyzed successfully!',
      analysis: analysisResult,
      xpAwarded: 100
    });

  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/resumes/history', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  try {
    if (isDbConnected()) {
      const list = await ResumeAnalysis.find({ userId }).sort({ analyzedAt: -1 });
      return res.status(200).json(list);
    } else {
      const list = inMemoryResumeAnalyses.filter(r => r.userId === userId).sort((a,b) => b.analyzedAt.getTime() - a.analyzedAt.getTime());
      return res.status(200).json(list);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// EVENT MANAGEMENT SYSTEM
// ==========================================
router.get('/events', async (req, res) => {
  try {
    if (isDbConnected()) {
      const list = await Event.find().sort({ date: 1 });
      return res.status(200).json(list);
    } else {
      return res.status(200).json(inMemoryEvents);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/events', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  const eventData = req.body;
  try {
    if (isDbConnected()) {
      const event = await Event.create(eventData);
      return res.status(201).json(event);
    } else {
      const event = {
        _id: generateId(),
        ...eventData,
        registeredUsers: [],
        createdAt: new Date()
      };
      inMemoryEvents.push(event);
      return res.status(201).json(event);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/events/:id/register', authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    if (isDbConnected()) {
      const event = await Event.findById(id);
      if (!event) return res.status(404).json({ message: 'Event not found' });

      if (event.registeredUsers.includes(userId)) {
        return res.status(400).json({ message: 'Already registered for this event' });
      }

      if (event.spotsLeft <= 0) {
        return res.status(400).json({ message: 'No spots remaining' });
      }

      event.registeredUsers.push(userId);
      event.spotsLeft -= 1;
      await event.save();

      // Award XP
      const user = await User.findByIdAndUpdate(userId, { $inc: { xp: 50 } }, { new: true });
      return res.status(200).json({ message: 'Registered successfully!', spotsLeft: event.spotsLeft, xpAwarded: 50 });
    } else {
      const eventIdx = inMemoryEvents.findIndex(e => e._id === id);
      if (eventIdx === -1) return res.status(404).json({ message: 'Event not found' });

      const event = inMemoryEvents[eventIdx];
      if (event.registeredUsers.includes(userId)) {
        return res.status(400).json({ message: 'Already registered for this event' });
      }

      if (event.spotsLeft <= 0) {
        return res.status(400).json({ message: 'No spots remaining' });
      }

      event.registeredUsers.push(userId);
      event.spotsLeft -= 1;

      // Award XP
      const userIdx = inMemoryUsers.findIndex(u => u._id === userId);
      if (userIdx !== -1) {
        inMemoryUsers[userIdx].xp += 50;
        inMemoryUsers[userIdx].level = Math.floor(inMemoryUsers[userIdx].xp / 500) + 1;
      }
      return res.status(200).json({ message: 'Registered successfully!', spotsLeft: event.spotsLeft, xpAwarded: 50 });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// COMMUNITY FORUM ROUTES
// ==========================================
router.get('/community/posts', async (req, res) => {
  try {
    if (isDbConnected()) {
      const posts = await Post.find().sort({ createdAt: -1 });
      return res.status(200).json(posts);
    } else {
      const posts = [...inMemoryPosts].sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
      return res.status(200).json(posts);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/community/posts', authenticateToken, async (req: AuthRequest, res) => {
  const { title, content, category } = req.body;
  const userId = req.user?.id;
  const userEmail = req.user?.email;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    let authorName = 'Anonymous';
    
    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (user) authorName = user.name;

      const post = await Post.create({
        authorId: userId,
        authorName,
        title,
        content,
        category: category || 'General'
      });

      // Award 30 XP
      await User.findByIdAndUpdate(userId, { $inc: { xp: 30 } });
      return res.status(201).json(post);
    } else {
      const user = inMemoryUsers.find(u => u._id === userId);
      if (user) authorName = user.name;

      const post = {
        _id: generateId(),
        authorId: userId,
        authorName,
        title,
        content,
        category: category || 'General',
        likes: [],
        comments: [],
        createdAt: new Date()
      };
      inMemoryPosts.push(post);

      const userIdx = inMemoryUsers.findIndex(u => u._id === userId);
      if (userIdx !== -1) {
        inMemoryUsers[userIdx].xp += 30;
        inMemoryUsers[userIdx].level = Math.floor(inMemoryUsers[userIdx].xp / 500) + 1;
      }
      return res.status(201).json(post);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/community/posts/:id/comment', authenticateToken, async (req: AuthRequest, res) => {
  const { content } = req.body;
  const userId = req.user?.id;

  if (!content) {
    return res.status(400).json({ message: 'Comment content is required' });
  }

  try {
    let userName = 'Anonymous';

    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (user) userName = user.name;

      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });

      const newComment = {
        userId,
        userName,
        content,
        createdAt: new Date()
      };

      post.comments.push(newComment);
      await post.save();

      // Award 15 XP
      await User.findByIdAndUpdate(userId, { $inc: { xp: 15 } });
      return res.status(200).json(post);
    } else {
      const userIdx = inMemoryUsers.findIndex(u => u._id === userId);
      if (userIdx !== -1) userName = inMemoryUsers[userIdx].name;

      const postIdx = inMemoryPosts.findIndex(p => p._id === req.params.id);
      if (postIdx === -1) return res.status(404).json({ message: 'Post not found' });

      const newComment = {
        _id: generateId(),
        userId,
        userName,
        content,
        createdAt: new Date()
      };

      inMemoryPosts[postIdx].comments.push(newComment);

      if (userIdx !== -1) {
        inMemoryUsers[userIdx].xp += 15;
        inMemoryUsers[userIdx].level = Math.floor(inMemoryUsers[userIdx].xp / 500) + 1;
      }
      return res.status(200).json(inMemoryPosts[postIdx]);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/community/posts/:id/like', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id;

  try {
    if (isDbConnected()) {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });

      const likeIdx = post.likes.indexOf(userId);
      if (likeIdx > -1) {
        post.likes.splice(likeIdx, 1); // Unlike
      } else {
        post.likes.push(userId); // Like
      }

      await post.save();
      return res.status(200).json(post);
    } else {
      const postIdx = inMemoryPosts.findIndex(p => p._id === req.params.id);
      if (postIdx === -1) return res.status(404).json({ message: 'Post not found' });

      const likes = inMemoryPosts[postIdx].likes;
      const likeIdx = likes.indexOf(userId);
      if (likeIdx > -1) {
        likes.splice(likeIdx, 1);
      } else {
        likes.push(userId);
      }
      return res.status(200).json(inMemoryPosts[postIdx]);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// DASHBOARD ENDPOINTS
// ==========================================
router.get('/dashboard/student', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  try {
    let enrolledCoursesInfo = [];
    let appliedInternshipsInfo = [];
    let certificatesInfo = [];
    let latestRoadmap = null;
    let latestResumeAnalysis = null;
    let xp = 0;
    let level = 1;
    let badges: string[] = [];

    if (isDbConnected()) {
      const user = await User.findById(userId)
        .populate('enrolledCourses.courseId')
        .populate('appliedInternships.internshipId');

      if (!user) return res.status(404).json({ message: 'User not found' });
      
      xp = user.xp;
      level = user.level;
      badges = user.badges;
      enrolledCoursesInfo = user.enrolledCourses;
      appliedInternshipsInfo = user.appliedInternships;

      certificatesInfo = await Certificate.find({ userId }).populate('courseId');
      latestRoadmap = await Roadmap.findOne({ userId }).sort({ generatedAt: -1 });
      latestResumeAnalysis = await ResumeAnalysis.findOne({ userId }).sort({ analyzedAt: -1 });
    } else {
      const user = inMemoryUsers.find(u => u._id === userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      
      xp = user.xp;
      level = user.level;
      badges = user.badges;

      // Map courses
      enrolledCoursesInfo = user.enrolledCourses.map((ec: any) => {
        const cDetails = inMemoryCourses.find(c => c._id === ec.courseId);
        return { ...ec, courseId: cDetails };
      });

      // Map internships
      appliedInternshipsInfo = user.appliedInternships.map((ai: any) => {
        const iDetails = inMemoryInternships.find(i => i._id === ai.internshipId);
        return { ...ai, internshipId: iDetails };
      });

      // Map certificates
      certificatesInfo = inMemoryCertificates
        .filter(cert => cert.userId === userId)
        .map(cert => {
          const cDetails = inMemoryCourses.find(c => c._id === cert.courseId);
          return { ...cert, courseId: cDetails };
        });

      // Roadmap
      const userRoadmaps = inMemoryRoadmaps.filter(r => r.userId === userId);
      if (userRoadmaps.length > 0) {
        latestRoadmap = userRoadmaps[userRoadmaps.length - 1];
      }

      // Resume
      const userResumes = inMemoryResumeAnalyses.filter(r => r.userId === userId);
      if (userResumes.length > 0) {
        latestResumeAnalysis = userResumes[userResumes.length - 1];
      }
    }

    return res.status(200).json({
      xp,
      level,
      badges,
      enrolledCourses: enrolledCoursesInfo,
      appliedInternships: appliedInternshipsInfo,
      certificates: certificatesInfo,
      latestRoadmap,
      latestResumeAnalysis,
      notifications: [
        { id: 'n1', title: 'Welcome to Flight 3.0!', message: 'Explore the learning academy and setup your career goals.', date: new Date(Date.now() - 3600000) },
        { id: 'n2', title: 'Roadmap Generator Unlocked', message: 'Use AI Career Assistant to receive a step-by-step roadmap!', date: new Date(Date.now() - 7200000) }
      ]
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin Dashboard Stats
router.get('/dashboard/admin', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    let totalUsers = 0;
    let totalCourses = 0;
    let totalInternships = 0;
    let totalApplications = 0;
    
    if (isDbConnected()) {
      totalUsers = await User.countDocuments();
      totalCourses = await Course.countDocuments();
      totalInternships = await Internship.countDocuments();
      totalApplications = await Application.countDocuments();
    } else {
      totalUsers = inMemoryUsers.length;
      totalCourses = inMemoryCourses.length;
      totalInternships = inMemoryInternships.length;
      totalApplications = inMemoryApplications.length;
    }

    // Return dashboard stats and chart datasets
    return res.status(200).json({
      stats: {
        totalUsers,
        totalCourses,
        totalInternships,
        totalApplications,
        activeSaaSRevenue: totalCourses * 99 + 450, // mock revenue
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
          { category: 'Artificial Intelligence', count: 480 },
          { category: 'Full Stack Development', count: 320 },
          { category: 'Machine Learning', count: 210 },
          { category: 'Data Science', count: 120 }
        ]
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// CONTACT / LEAD SUBMISSION ROUTE
// ==========================================
router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    let savedContact;
    if (isDbConnected()) {
      savedContact = await Contact.create({ name, email, subject, message });
    } else {
      savedContact = { _id: generateId(), name, email, subject, message, submittedAt: new Date() };
      inMemoryContacts.push(savedContact);
    }

    // Try sending email if SMTP is configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.resend.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        // Email to admin
        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"Digimation Platform" <no-reply@digimation.com>`,
          to: process.env.SMTP_TO || 'admin@digimation.com',
          subject: `[Lead Submission] New Inquiry: ${subject}`,
          html: `
            <h2>New Inquiry Received</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Category:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-line; background: #f5f5f5; padding: 10px; border-radius: 5px;">${message}</p>
          `,
        });

        // Confirmation email to user
        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"Digimation Platform" <no-reply@digimation.com>`,
          to: email,
          subject: `Thank you for contacting Digimation Flight 3.0`,
          html: `
            <h3>Hello ${name},</h3>
            <p>Thank you for reaching out to us. We have received your inquiry regarding <strong>${subject}</strong>.</p>
            <p>Our solutions team is reviewing your message and will get back to you within 24 hours.</p>
            <p>Best regards,<br/>The Digimation Solutions Team</p>
          `,
        });
        console.log(`Transactional email successfully dispatched for lead: ${email}`);
      } catch (emailErr: any) {
        console.error('Nodemailer Error sending contact email:', emailErr.message);
      }
    } else {
      console.log('SMTP configuration missing, skipping mail dispatch. Lead saved to database.');
    }

    return res.status(201).json({
      message: 'Inquiry submitted successfully!',
      contact: savedContact,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
