import mongoose from 'mongoose';

// Define the cache interface
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare the global type
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Initialize the cache with proper typing
let cached: MongooseCache = (global.mongoose = {
  conn: null,
  promise: null,
});

export async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const MONGODB_URI = process.env.MONGODB_URI;
    console.log('Attempting to connect to MongoDB...');

    if (cached.conn) {
      console.log('Using cached MongoDB connection');
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      console.log('Creating new MongoDB connection...');
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      });
    }

    try {
      cached.conn = await cached.promise;
    } catch (e) {
      console.error('MongoDB connection error:', e);
      cached.promise = null;
      throw e;
    }

    return cached.conn;
  } catch (error) {
    console.error('Error in connectDB:', error);
    throw error;
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
}); 