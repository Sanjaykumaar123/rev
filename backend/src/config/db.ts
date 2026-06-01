import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/digimation_flight';
  
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully to:', mongoURI);
  } catch (error: any) {
    console.error('MongoDB connection error:', error.message);
    console.log('Backend will run, but database persistence will fall back to local mock data where appropriate.');
  }
};
