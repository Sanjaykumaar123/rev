import mongoose, { Schema } from 'mongoose';

// Application Schema
const ApplicationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  internshipId: { type: Schema.Types.ObjectId, ref: 'Internship', required: true },
  status: { type: String, enum: ['applied', 'under-review', 'shortlisted', 'accepted', 'rejected'], default: 'applied' },
  resumeUrl: { type: String, default: '' },
  notes: { type: String, default: '' },
  appliedAt: { type: Date, default: Date.now }
});

export const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

// Certificate Schema
const CertificateSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  certificateId: { type: String, required: true, unique: true },
  issueDate: { type: Date, default: Date.now },
  grade: { type: String, default: 'A+' },
  verificationUrl: { type: String, default: '' }
});

export const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);

// Roadmap Schema
const RoadmapSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  skills: { type: [String], default: [] },
  careerGoal: { type: String, required: true },
  roadmapData: { type: Schema.Types.Mixed, required: true },
  generatedAt: { type: Date, default: Date.now }
});

export const Roadmap = mongoose.models.Roadmap || mongoose.model('Roadmap', RoadmapSchema);

// ResumeAnalysis Schema
const ResumeAnalysisSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  strengths: { type: [String], default: [] },
  weaknesses: { type: [String], default: [] },
  missingSkills: { type: [String], default: [] },
  suggestions: { type: [String], default: [] },
  analyzedAt: { type: Date, default: Date.now }
});

export const ResumeAnalysis = mongoose.models.ResumeAnalysis || mongoose.model('ResumeAnalysis', ResumeAnalysisSchema);

// Event Schema
const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['Webinar', 'Hackathon', 'Workshop'], default: 'Webinar' },
  registeredUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  link: { type: String, default: '' },
  spotsLeft: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now }
});

export const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);

// Post Schema (for Community Forum)
const PostSchema = new Schema({
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: 'General' },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

export const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
