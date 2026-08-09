const express = require('express');
const router = express.Router();
const {
  addInterest,
  checkout,
  updateStatus,
  getMyRecords,
  getAllRecords,
} = require('../controllers/borrowController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

// All borrow routes require authentication
router.use(protect);

// User routes
router.post('/interest', addInterest);
router.post('/checkout', checkout);
router.get('/my-records', getMyRecords);

// Status update (admin or record owner)
router.put('/status/:id', updateStatus);

// Admin-only route
router.get('/all', adminOnly, getAllRecords);

module.exports = router;