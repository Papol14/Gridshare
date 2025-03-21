import mongoose from 'mongoose';

if (!process.env.MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env');
}

const MONGODB_URI = process.env.MONGO_URI;

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: Cached;
}

let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  try {
    if (cached.conn) {
      console.log('Using cached MongoDB connection');
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        dbName: 'gridshare',
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        family: 4 // Force IPv4
      };

      console.log('Connecting to MongoDB...');
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('Connected to MongoDB successfully');
        return mongoose;
      });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
}

// Handle connection events
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
  cached.conn = null;
  cached.promise = null;
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  cached.conn = null;
  cached.promise = null;
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

export default connectDB; 