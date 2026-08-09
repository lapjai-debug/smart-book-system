/**
 * Vercel serverless entry point.
 * Vercel uses this file instead of app.listen() to wrap the Express app
 * in a serverless function that can be called on-demand.
 *
 * To use this:
 * 1. Configure vercel.json (see project root)
 * 2. Set environment variables in Vercel dashboard
 * 3. Deploy: `vercel --prod`
 *
 * IMPORTANT: Vercel's IPs are NOT whitelisted in MongoDB Atlas by default.
 * You MUST add `0.0.0.0/0` (Allow from anywhere) in Atlas Network Access,
 * OR add Vercel's IP ranges:
 *   https://vercel.com/docs/security/encryption#ip-restriction
 */
const app = require('../app');
const connectDB = require('../config/db');

// Connect to MongoDB on every invocation (cached by config/db.js)
const handler = async (req, res) => {
  try {
    await connectDB();
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    return res.status(503).json({
      success: false,
      message: 'Database connection failed. Check Atlas IP whitelist.',
    });
  }

  // Forward to Express
  app(req, res);
};

// Export the handler as a serverless function
module.exports = handler;
