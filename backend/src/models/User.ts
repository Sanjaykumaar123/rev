import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: { type: [String], default: [] },
  profileInfo: {
    skills: { type: [String], default: [] },
    education: { type: String, default: '' },
    experience: { type: String, default: '' },
    careerGoal: { type: String, default: '' }
  },
  enrolledCourses: [{
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    progress: { type: Number, default: 0 }, // percentage 0-100
    wishlist: { type: Boolean, default: false }
  }],
  appliedInternships: [{
    internshipId: { type: Schema.Types.ObjectId, ref: 'Internship' },
    status: { type: String, enum: ['applied', 'under-review', 'shortlisted', 'accepted', 'rejected'], default: 'applied' },
    appliedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
