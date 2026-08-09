const express = require('express');
const router = express.Router();
const {
  getBooks,
  searchBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBookContent,
} = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

// Public routes
router.get('/', getBooks);
router.get('/search', searchBooks);
router.get('/:id', getBookById);

// Protected route - read book content (must have borrowed the book)
router.get('/:id/read', protect, getBookContent);

// Admin-only routes
router.post('/', protect, adminOnly, createBook);
router.put('/:id', protect, adminOnly, updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);

module.exports = router;