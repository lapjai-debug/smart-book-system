const mongoose = require('mongoose');

/**
 * Establish a connection to MongoDB using the MONGO_URI environment variable.
 * Serverless-friendly:
 *  - Caches the connection globally (avoids reconnecting on every Vercel invocation)
 *  - Uses short timeouts so serverless functions fail fast instead of hanging
 *  - Does NOT call process.exit() (which would kill serverless function instances)
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Reuse cached connection
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB Connected');
  } catch (error) {
    cached.promise = null; // Allow retry on the next invocation
    console.error(`Error connecting to MongoDB: ${error.message}`);
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;
