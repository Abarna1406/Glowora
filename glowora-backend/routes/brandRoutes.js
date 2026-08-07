const express = require('express');
const router = express.Router();

const { getBrands, getBrand, createBrand, updateBrand, deleteBrand } = require('../controllers/brandController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { brandRules } = require('../middleware/validators/catalogValidators');

// Base path: /api/brands (see server.js)
// Powers Brands.jsx, BrandProfile.jsx (public) and AdminBrands.jsx (admin CRUD).

router.get('/', getBrands);
router.get('/:idOrSlug', getBrand);
router.post('/', protect, authorize('Admin'), brandRules, createBrand);
router.put('/:id', protect, authorize('Admin'), updateBrand);
router.delete('/:id', protect, authorize('Admin'), deleteBrand);

module.exports = router;
