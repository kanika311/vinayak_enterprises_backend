import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/scientific_instruments';
  await mongoose.connect(uri);
  console.log('MongoDB connected successfully');
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});
