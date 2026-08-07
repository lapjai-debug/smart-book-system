const Book = require('../models/Book');
const BorrowRecord = require('../models/BorrowRecord');

/**
 * @desc    Get all books
 * @route   GET /api/books
 * @access  Public
 */
const getBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single book by id
 * @route   GET /api/books/:id
 * @access  Public
 */
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ success: true, book });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new book
 * @route   POST /api/books
 * @access  Admin only
 */
const createBook = async (req, res, next) => {
  try {
    const { title, author, isbn, totalQty } = req.body;

    if (!title || !author || !isbn || !totalQty) {
      return res.status(400).json({
        message: 'Please provide title, author, isbn and totalQty',
      });
    }

    // Check for duplicate ISBN
    const existing = await Book.findOne({ isbn });
    if (existing) {
      return res.status(400).json({ message: 'A book with this ISBN already exists' });
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      totalQty,
      stock: totalQty, // stock defaults to totalQty
    });

    res.status(201).json({ success: true, book });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a book (details and/or stock)
 * @route   PUT /api/books/:id
 * @access  Admin only
 */
const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const { title, author, isbn, totalQty, stock } = req.body;

    // Update fields if provided
    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (isbn !== undefined) {
      // Check ISBN uniqueness (excluding self)
      const duplicate = await Book.findOne({ isbn, _id: { $ne: book._id } });
      if (duplicate) {
        return res.status(400).json({ message: 'A book with this ISBN already exists' });
      }
      book.isbn = isbn;
    }

    // If totalQty is updated, adjust stock by the difference
    if (totalQty !== undefined) {
      const diff = totalQty - book.totalQty;
      book.totalQty = totalQty;
      book.stock = Math.max(0, book.stock + diff);
    }

    // Explicit stock override (must not exceed totalQty)
    if (stock !== undefined) {
      if (stock < 0 || stock > book.totalQty) {
        return res.status(400).json({
          message: `Stock must be between 0 and totalQty (${book.totalQty})`,
        });
      }
      book.stock = stock;
    }

    const updatedBook = await book.save();
    res.json({ success: true, book: updatedBook });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get book content (only for users who have borrowed the book)
 * @route   GET /api/books/:id/read
 * @access  Private (must have borrowed the book)
 */
const getBookContent = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Admin can read any book
    if (req.user.role === 'admin') {
      return res.json({
        success: true,
        book: {
          _id: book._id,
          title: book.title,
          author: book.author,
          content: book.content,
        },
      });
    }

    // Regular users must have an active 'borrowed' record for this book
    const record = await BorrowRecord.findOne({
      userId: req.user._id,
      bookId: book._id,
      status: 'borrowed',
    });

    if (!record) {
      return res.status(403).json({
        message: 'You must borrow this book before you can read it',
      });
    }

    res.json({
      success: true,
      book: {
        _id: book._id,
        title: book.title,
        author: book.author,
        content: book.content,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a book
 * @route   DELETE /api/books/:id
 * @access  Admin only
 */
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.deleteOne();
    res.json({ success: true, message: 'Book removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBookContent,
};
