import mongoose from 'mongoose';
import { env } from './env.js';

const MAX_RETRIES = 5;
let retries = 0;

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      dbName: 'house-of-virasat',
    });
    console.log('✅ MongoDB connected');
    retries = 0;
  } catch (err) {
    retries += 1;
    console.error(`❌ MongoDB connection failed (attempt ${retries}/${MAX_RETRIES}):`, err.message);

    if (retries >= MAX_RETRIES) {
      console.error('MongoDB connection failed after max retries. Exiting.');
      process.exit(1);
    }

    const delay = Math.min(1000 * 2 ** retries, 30000);
    console.log(`Retrying in ${delay / 1000}s...`);
    setTimeout(connectDB, delay);
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting reconnect...');
  connectDB();
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err.message);
});
