const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProduct,
  getRelatedProducts,
  getFeaturedProducts,
  getLatestProducts,
  getBestsellerProducts,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct,
} = require('../controllers/productController');
const { getProductReviews, createReview } = require('../controllers/reviewController');

const { protect, authorize } = require('../middleware/authMiddleware');
const { createProductRules } = require('../middleware/validators/productValidators');
const { createReviewRules } = require('../middleware/validators/reviewValidators');

// ---------------------------------------------------------------------------
// Base path: /api/products (see server.js)
//
// Fixed/rail routes MUST be declared before the generic '/:idOrSlug' route,
// otherwise Express will try to resolve "featured"/"latest"/etc. as a
// product id/slug.
// ---------------------------------------------------------------------------

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/latest', getLatestProducts);
router.get('/bestsellers', getBestsellerProducts);

router.post('/', protect, authorize('Admin'), createProductRules, createProduct);

router.get('/:idOrSlug', getProduct);
router.get('/:id/related', getRelatedProducts);
router.put('/:id', protect, authorize('Admin'), updateProduct);
router.patch('/:id/stock', protect, authorize('Admin'), updateStock);
router.delete('/:id', protect, authorize('Admin'), deleteProduct);

// Nested reviews — ProductDetails.jsx "Reviews" tab
router.get('/:productId/reviews', getProductReviews);
router.post('/:productId/reviews', protect, createReviewRules, createReview);

module.exports = router;
