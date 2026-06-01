import mongoose, { Schema } from 'mongoose';

const InternshipSchema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  logo: { type: String, default: '' },
  stipend: { type: String, required: true }, // e.g. "$1,500/mo" or "Unpaid"
  duration: { type: String, required: true }, // e.g. "3 months"
  type: { type: String, enum: ['Remote', 'On-site', 'Hybrid'], default: 'Remote' },
  location: { type: String, default: 'Worldwide' },
  domain: { type: String, required: true }, // e.g. "Full Stack", "Data Science", "AI"
  experienceLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  skillsRequired: { type: [String], default: [] },
  description: { type: String, required: true },
  appliedCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const Internship = mongoose.models.Internship || mongoose.model('Internship', InternshipSchema);
export default Internship;
