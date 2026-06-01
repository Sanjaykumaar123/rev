import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/digimation_flight';

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error: any) {
    console.error('⚠️  MongoDB connection error:', error.message);
    console.log('ℹ️  Backend running with in-memory fallback data. Set MONGODB_URI env var on Render to persist data.');
  }
};
