const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// ===== Global Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== Static Frontend =====
app.use(express.static(path.join(__dirname, 'public')));

// ===== API Routes =====
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/borrow', require('./routes/borrowRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// ===== Health check =====
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Smart Book System API is running' });
});

// ===== Error Handling =====
app.use(notFound);
app.use(errorHandler);

// ===== Start Server (only when run directly, not as a serverless function) =====
if (require.main === module) {
  // Connect to MongoDB (lazy — serverless functions connect on-demand)
  connectDB();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

// Export the app for Vercel serverless / testing
module.exports = app;
