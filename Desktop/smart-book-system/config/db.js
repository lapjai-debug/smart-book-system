const mongoose = require('mongoose');

/**
 * Establish a connection to MongoDB using the MONGO_URI environment variable.
 * Exits the process with a non-zero code if the connection fails.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;