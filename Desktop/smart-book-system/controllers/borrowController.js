const BorrowRecord = require('../models/BorrowRecord');
const Book = require('../models/Book');

/**
 * @desc    Add a book to the user's wishlist (status: interested)
 * @route   POST /api/borrow/interest
 * @access  Private
 */
const addInterest = async (req, res, next) => {
  try {
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: 'bookId is required' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already has an active record for this book
    const existing = await BorrowRecord.findOne({
      userId: req.user._id,
      bookId,
      status: { $in: ['interested', 'pending', 'borrowed'] },
    });

    if (existing) {
      return res.status(400).json({
        message: `You already have this book in status: ${existing.status}`,
      });
    }

    const record = await BorrowRecord.create({
      userId: req.user._id,
      bookId,
      status: 'interested',
    });

    res.status(201).json({ success: true, record });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit a checkout request (status: pending)
 * @route   POST /api/borrow/checkout
 * @access  Private
 */
const checkout = async (req, res, next) => {
  try {
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: 'bookId is required' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Stock validation: must have at least 1 available copy
    if (book.stock <= 0) {
      return res.status(400).json({ message: 'Book is currently out of stock' });
    }

    // Find existing record (interested or pending) to upgrade
    let record = await BorrowRecord.findOne({
      userId: req.user._id,
      bookId,
      status: { $in: ['interested', 'pending'] },
    });

    if (record) {
      // Upgrade existing record to pending
      record.status = 'pending';
      await record.save();
    } else {
      // Create a new pending record
      record = await BorrowRecord.create({
        userId: req.user._id,
        bookId,
        status: 'pending',
      });
    }

    res.json({ success: true, record });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update borrow status (pending -> borrowed -> returned)
 * @route   PUT /api/borrow/status/:id
 * @access  Private (admin or record owner)
 */
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const record = await BorrowRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }

    // Permission check: admin can update any record; users can only update their own
    const isAdmin = req.user.role === 'admin';
    const isOwner = record.userId.toString() === req.user._id.toString();
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Not authorized to update this record' });
    }

    const validTransitions = {
      interested: ['pending'],
      pending: ['borrowed', 'returned'],
      borrowed: ['returned'],
      returned: [],
    };

    if (!validTransitions[record.status].includes(status)) {
      return res.status(400).json({
        message: `Invalid transition from '${record.status}' to '${status}'`,
      });
    }

    const book = await Book.findById(record.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Associated book not found' });
    }

    // Stock management
    if (status === 'borrowed') {
      // Decrement stock when borrowing
      if (book.stock <= 0) {
        return res.status(400).json({ message: 'Book is currently out of stock' });
      }
      book.stock -= 1;
      record.borrowDate = new Date();
    }

    if (status === 'returned') {
      // Increment stock when returning
      book.stock += 1;
      record.returnDate = new Date();
    }

    record.status = status;
    await book.save();
    await record.save();

    res.json({ success: true, record });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get the logged-in user's borrow history
 * @route   GET /api/borrow/my-records
 * @access  Private
 */
const getMyRecords = async (req, res, next) => {
  try {
    const records = await BorrowRecord.find({ userId: req.user._id })
      .populate('bookId', 'title author isbn totalQty stock')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all borrow records (admin)
 * @route   GET /api/borrow/all
 * @access  Admin only
 */
const getAllRecords = async (req, res, next) => {
  try {
    const records = await BorrowRecord.find()
      .populate('userId', 'name email')
      .populate('bookId', 'title author isbn')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addInterest,
  checkout,
  updateStatus,
  getMyRecords,
  getAllRecords,
};