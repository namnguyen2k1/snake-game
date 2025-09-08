import mongoose, { connect } from 'mongoose';

export const connectDB = async () => {
  try {
    const dbName = 'snake-game';
    const uri = `mongodb://localhost:27017/${dbName}`;

    await connect(uri).then(() => {
      mongoose.set('debug', true);
      console.log(`MongoDB connected: ${dbName}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};
