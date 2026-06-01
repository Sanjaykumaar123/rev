import mongoose, { Schema } from 'mongoose';

const CourseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  price: { type: Number, required: true },
  instructor: {
    name: { type: String, required: true },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' }
  },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  duration: { type: String, required: true }, // e.g. "8 weeks"
  lectures: { type: [String], default: [] },
  projects: { type: [String], default: [] },
  skillsCovered: { type: [String], default: [] },
  image: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
export default Course;
