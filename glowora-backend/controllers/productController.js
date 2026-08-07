const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const ApiFeatures = require('../utils/apiFeatures');

const PAGE_SIZE = 12; // matches ProductListing.jsx's PAGE_SIZE constant

const POPULATE = [
  { path: 'brand', select: 'name slug logo tier' },
  { path: 'category', select: 'name slug code' },
];

// ---------------------------------------------------------------------------
// @desc    List products with the full filter/sort/search/pagination set
//          ProductListing.jsx's FiltersPanel exposes.
// @route   GET /api/products
// @access  Public
//
// Query params (all optional):
//   category   comma-separated Category ids   -> selectedCats
//   brand      comma-separated Brand ids       -> selectedBrands
//   maxPrice   number                          -> priceRange
//   minPrice   number
//   rating     number (min rating)             -> minRating
//   professionalOnly / inStock / featured / bestseller / newArrival  'true'|'false'
//   discount   number (min % off)              -> discountOnly (>=10 in UI)
//   search     text                            -> Search.jsx
//   sort       relevance|price-asc|price-desc|rating|discount
//   page, limit
// ---------------------------------------------------------------------------
const getProducts = asyncHandler(async (req, res) => {
  const baseFilter = { active: true };
  if (req.query.inStock === 'true') baseFilter.stock = { $gt: 0 };

  let query = Product.find(baseFilter);

  const features = new ApiFeatures(query, req.query)
    .search(['name', 'description', 'tags'])
    .filter({
      category: { field: 'category', type: 'in' },
      brand: { field: 'brand', type: 'in' },
      minPrice: { field: 'price', type: 'gte' },
      maxPrice: { field: 'price', type: 'lte' },
      rating: { field: 'rating', type: 'gte' },
      professionalOnly: { field: 'professionalOnly', type: 'bool' },
      featured: { field: 'featured', type: 'bool' },
      bestseller: { field: 'bestseller', type: 'bool' },
      newArrival: { field: 'newArrival', type: 'bool' },
    })
    .sort(
      {
        'price-asc': 'price',
        'price-desc': '-price',
        rating: '-rating',
        discount: '-discount',
      },
      '-createdAt',
    )
    .paginate(PAGE_SIZE);

  // discount is a computed-on-save field, not part of the generic filter map
  // because it needs a $gte on a field the UI describes as "10%+ off".
  if (req.query.discount) {
    features.query = features.query.where('discount').gte(Number(req.query.discount));
  }

  const [products, total] = await Promise.all([
    features.query.populate(POPULATE),
    Product.countDocuments(features.query.getFilter()),
  ]);

  res.status(200).json({
    success: true,
    message: 'Products fetched successfully',
    data: products,
    pagination: {
      page: features.pagination.page,
      limit: features.pagination.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / features.pagination.limit)),
    },
  });
});

// @desc    Get a single product by id or slug
// @route   GET /api/products/:idOrSlug
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const filter = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { _id: idOrSlug } : { slug: idOrSlug };

  const product = await Product.findOne({ ...filter, active: true }).populate(POPULATE);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(200).json({
    success: true,
    message: 'Product fetched successfully',
    data: product,
  });
});

// @desc    Related products — same category, excluding itself (ProductDetails.jsx)
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    active: true,
  })
    .limit(4)
    .populate(POPULATE);

  res.status(200).json({
    success: true,
    message: 'Related products fetched successfully',
    data: related,
  });
});

// @desc    Featured products (homepage rail)
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ active: true, featured: true }).limit(8).populate(POPULATE);
  res.status(200).json({ success: true, message: 'Featured products fetched successfully', data: products });
});

// @desc    Newest arrivals (homepage rail)
// @route   GET /api/products/latest
// @access  Public
const getLatestProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ active: true, newArrival: true })
    .sort('-createdAt')
    .limit(8)
    .populate(POPULATE);
  res.status(200).json({ success: true, message: 'Latest products fetched successfully', data: products });
});

// @desc    Bestsellers (homepage rail)
// @route   GET /api/products/bestsellers
// @access  Public
const getBestsellerProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ active: true, bestseller: true }).limit(8).populate(POPULATE);
  res.status(200).json({ success: true, message: 'Bestseller products fetched successfully', data: products });
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { category, brand, sku, name } = req.body;

  const [categoryExists, brandExists, skuTaken] = await Promise.all([
    Category.findById(category),
    Brand.findById(brand),
    Product.findOne({ sku: sku?.toUpperCase() }),
  ]);

  if (!categoryExists) {
    res.status(400);
    throw new Error('Category does not exist');
  }
  if (!brandExists) {
    res.status(400);
    throw new Error('Brand does not exist');
  }
  if (skuTaken) {
    res.status(400);
    throw new Error('A product with this SKU already exists');
  }
  if (!name) {
    res.status(400);
    throw new Error('Product name is required');
  }

  const product = await Product.create({ ...req.body, createdBy: req.user._id });
  await product.populate(POPULATE);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product,
  });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const updatableFields = [
    'name', 'description', 'brand', 'category', 'price', 'mrp', 'professionalOnly',
    'unit', 'stock', 'moq', 'featured', 'bestseller', 'newArrival', 'tags',
    'specifications', 'img', 'gallery', 'benefits', 'ingredients', 'usage', 'active', 'sku', 'videoUrl', 'isAnimated'
  ];
  updatableFields.forEach((f) => {
    if (req.body[f] !== undefined) product[f] = req.body[f];
  });

  const updated = await product.save();
  await updated.populate(POPULATE);

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: updated,
  });
});

// @desc    Adjust stock directly (AdminInventory.jsx reorder workflow)
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
const updateStock = asyncHandler(async (req, res) => {
  const { stock } = req.body;
  if (stock === undefined || Number(stock) < 0) {
    res.status(400);
    throw new Error('A non-negative stock value is required');
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.stock = Number(stock);
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Stock updated successfully',
    data: { _id: product._id, stock: product.stock, inStock: product.stock > 0 },
  });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
    data: null,
  });
});

module.exports = {
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
};
