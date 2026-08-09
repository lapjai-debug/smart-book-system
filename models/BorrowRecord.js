const mongoose = require('mongoose');

/**
 * BorrowRecord Schema
 * - userId: reference to the User who owns this record
 * - bookId: reference to the Book being borrowed
 * - status: lifecycle state machine
 *     'interested' -> 'pending' -> 'borrowed' -> 'returned'
 * - borrowDate: when the book was actually borrowed
 * - returnDate: when the book was returned
 */
const borrowRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book reference is required'],
    },
    status: {
      type: String,
      enum: ['interested', 'pending', 'borrowed', 'returned'],
      default: 'interested',
    },
    borrowDate: {
      type: Date,
    },
    returnDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate active records for the same user + book
borrowRecordSchema.index({ userId: 1, bookId: 1, status: 1 });

module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);