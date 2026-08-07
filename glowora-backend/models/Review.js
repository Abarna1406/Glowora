const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Review
// ---------------------------------------------------------------------------
// pages/admin/AdminReviews.jsx shows a moderation queue (Check = approve,
// X = reject), so reviews carry a status rather than going live immediately.
// Only 'approved' reviews are shown on ProductDetails.jsx's Reviews tab.
// ---------------------------------------------------------------------------

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

// One review per user per product.
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
