const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const Product = require('../models/Product');

// ---------------------------------------------------------------------------
// `count` on each category (src/lib/data.js: `c.count = products.filter(...)`)
// is computed here via aggregation instead of stored, so it can never drift
// from the real Product collection.
// ---------------------------------------------------------------------------
const withCounts = async (categories) => {
  const counts = await Product.aggregate([
    { $match: { active: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c) => [String(c._id), c.count]));
  return categories.map((c) => ({ ...c.toObject(), count: countMap.get(String(c._id)) || 0 }));
};

// @desc    Get all categories (with derived product counts)
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const filter = req.query.includeInactive === 'true' ? {} : { active: true };
  const categories = await Category.find(filter).sort('name');
  const withCount = await withCounts(categories);

  res.status(200).json({
    success: true,
    message: 'Categories fetched successfully',
    data: withCount,
  });
});

// @desc    Get a single category by id or slug
// @route   GET /api/categories/:idOrSlug
// @access  Public
const getCategory = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const category = idOrSlug.match(/^[0-9a-fA-F]{24}$/)
    ? await Category.findById(idOrSlug)
    : await Category.findOne({ slug: idOrSlug });

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const [withCount] = await withCounts([category]);

  res.status(200).json({
    success: true,
    message: 'Category fetched successfully',
    data: withCount,
  });
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, code, blurb, image } = req.body;

  const exists = await Category.findOne({ name: new RegExp(`^${name}$`, 'i') });
  if (exists) {
    res.status(400);
    throw new Error('A category with this name already exists');
  }

  const category = await Category.create({ name, code, blurb, image });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category,
  });
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const { name, code, blurb, image, active } = req.body;
  if (name !== undefined) category.name = name;
  if (code !== undefined) category.code = code;
  if (blurb !== undefined) category.blurb = blurb;
  if (image !== undefined) category.image = image;
  if (active !== undefined) category.active = active;

  const updated = await category.save();

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: updated,
  });
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const inUse = await Product.countDocuments({ category: category._id });
  if (inUse > 0) {
    res.status(400);
    throw new Error(`Cannot delete: ${inUse} product(s) still use this category`);
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
    data: null,
  });
});

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
