const mongoose = require('mongoose');

/**
 * Book Schema
 * - title: book title
 * - author: book author
 * - isbn: unique ISBN identifier
 * - totalQty: total number of copies owned by the library
 * - stock: current available copies (defaults to totalQty)
 */
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      maxlength: [100, 'Author cannot exceed 100 characters'],
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      trim: true,
      maxlength: [20, 'ISBN cannot exceed 20 characters'],
    },
    totalQty: {
      type: Number,
      required: [true, 'Total quantity is required'],
      min: [1, 'Total quantity must be at least 1'],
      default: 1,
    },
    stock: {
      type: Number,
      min: [0, 'Stock cannot be negative'],
      default: function () {
        return this.totalQty;
      },
    },
    content: {
      type: String,
      default: '',
      maxlength: [50000, 'Content cannot exceed 50000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Book', bookSchema);