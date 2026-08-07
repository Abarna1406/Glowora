const asyncHandler = require('express-async-handler');
const Brand = require('../models/Brand');
const Product = require('../models/Product');

// `products` (SKU count, see AdminBrands.jsx: `{b.products} SKUs`) is
// derived the same way Category.count is — never stored, always aggregated.
const withCounts = async (brands) => {
  const counts = await Product.aggregate([
    { $match: { active: true } },
    { $group: { _id: '$brand', count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c) => [String(c._id), c.count]));
  return brands.map((b) => ({ ...b.toObject(), products: countMap.get(String(b._id)) || 0 }));
};

// @desc    Get all brands (with derived SKU counts)
// @route   GET /api/brands
// @access  Public
const getBrands = asyncHandler(async (req, res) => {
  const filter = req.query.includeInactive === 'true' ? {} : { active: true };
  const brands = await Brand.find(filter).sort('name');
  const withCount = await withCounts(brands);

  res.status(200).json({
    success: true,
    message: 'Brands fetched successfully',
    data: withCount,
  });
});

// @desc    Get a single brand by id or slug (BrandProfile.jsx)
// @route   GET /api/brands/:idOrSlug
// @access  Public
const getBrand = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const brand = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? await Brand.findById(idOrSlug) : await Brand.findOne({ slug: idOrSlug });

  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }

  const [withCount] = await withCounts([brand]);

  res.status(200).json({
    success: true,
    message: 'Brand fetched successfully',
    data: withCount,
  });
});

// @desc    Create a brand
// @route   POST /api/brands
// @access  Private/Admin
const createBrand = asyncHandler(async (req, res) => {
  const { name, tagline, origin, tier, logo, cover, story } = req.body;

  const exists = await Brand.findOne({ name: new RegExp(`^${name}$`, 'i') });
  if (exists) {
    res.status(400);
    throw new Error('A brand with this name already exists');
  }

  const brand = await Brand.create({ name, tagline, origin, tier, logo, cover, story });

  res.status(201).json({
    success: true,
    message: 'Brand created successfully',
    data: brand,
  });
});

// @desc    Update a brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
const updateBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }

  const fields = ['name', 'tagline', 'origin', 'tier', 'logo', 'cover', 'story', 'active'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) brand[f] = req.body[f];
  });

  const updated = await brand.save();

  res.status(200).json({
    success: true,
    message: 'Brand updated successfully',
    data: updated,
  });
});

// @desc    Delete a brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }

  const inUse = await Product.countDocuments({ brand: brand._id });
  if (inUse > 0) {
    res.status(400);
    throw new Error(`Cannot delete: ${inUse} product(s) still use this brand`);
  }

  await brand.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Brand deleted successfully',
    data: null,
  });
});

module.exports = { getBrands, getBrand, createBrand, updateBrand, deleteBrand };
