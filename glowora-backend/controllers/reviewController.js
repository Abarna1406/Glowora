const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');

// Recomputes Product.rating (average) and Product.numReviews from all
// *approved* reviews — kept in sync any time a review is added/moderated.
const recalcProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId, status: 'approved' } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  await Product.findByIdAndUpdate(productId, {
    rating: stats.length ? Math.round(stats[0].avgRating * 10) / 10 : 0,
    numReviews: stats.length ? stats[0].count : 0,
  });
};

// @desc    Get approved reviews for a product (ProductDetails.jsx Reviews tab)
// @route   GET /api/products/:productId/reviews
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId, status: 'approved' })
    .populate('user', 'name role profileImage')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    message: 'Reviews fetched successfully',
    data: reviews,
  });
});

// @desc    Submit a review for a product (goes to pending moderation)
// @route   POST /api/products/:productId/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const existing = await Review.findOne({ user: req.user._id, product: productId });
  if (existing) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    comment,
  });

  res.status(201).json({
    success: true,
    message: 'Review submitted and pending moderation',
    data: review,
  });
});

// @desc    Get all reviews for moderation (AdminReviews.jsx)
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAllReviews = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const reviews = await Review.find(filter)
    .populate('user', 'name role')
    .populate('product', 'name sku')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    message: 'Reviews fetched successfully',
    data: reviews,
  });
});

// @desc    Approve or reject a review (Check/X buttons in AdminReviews.jsx)
// @route   PATCH /api/admin/reviews/:id
// @access  Private/Admin
const moderateReview = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error("Status must be 'approved' or 'rejected'");
  }

  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  review.status = status;
  await review.save();
  await recalcProductRating(review.product);

  res.status(200).json({
    success: true,
    message: `Review ${status}`,
    data: review,
  });
});

// @desc    Delete a review
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  const productId = review.product;
  await review.deleteOne();
  await recalcProductRating(productId);

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
    data: null,
  });
});

module.exports = { getProductReviews, createReview, getAllReviews, moderateReview, deleteReview };
