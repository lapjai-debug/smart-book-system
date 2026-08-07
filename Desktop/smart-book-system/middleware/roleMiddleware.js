/**
 * Role-based access control middleware.
 * Restricts routes to admin users only.
 * Must be used AFTER the protect (auth) middleware.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied: Admin only' });
  }
};

module.exports = { adminOnly };