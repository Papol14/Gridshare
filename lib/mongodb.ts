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
        dbName: 'gridshare', // Explicitly set database name
      };

      console.log('Connecting to MongoDB...');
      // Log URI without credentials for security
      const sanitizedUri = MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//****:****@');
      console.log('MongoDB URI:', sanitizedUri);
      console.log('Database name:', opts.dbName);
      
      // Connect to MongoDB with the provided URI
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('Connected to MongoDB successfully');
        console.log('Database collections:', Object.keys(mongoose.connection.collections));
        
        // Log connection state
        const state = mongoose.connection.readyState;
        const stateMap: Record<number, string> = {
          0: 'disconnected',
          1: 'connected',
          2: 'connecting',
          3: 'disconnecting'
        };
        console.log('MongoDB connection state:', stateMap[state] || 'unknown');

        return mongoose;
      });
    }

    try {
      cached.conn = await cached.promise;
      console.log('MongoDB connection established');
      return cached.conn;
    } catch (error) {
      cached.promise = null;
      throw error;
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    // Reset cached connection on error
    cached.conn = null;
    cached.promise = null;
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