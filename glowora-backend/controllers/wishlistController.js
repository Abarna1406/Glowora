const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) wishlist = await Wishlist.create({ user: userId, products: [] });
  return wishlist;
};

// shapeWishlist mirrors store.jsx's `wishlist` (detailed products) / `wishlistIds`.
const shapeWishlist = (wishlistDoc) => {
  const products = (wishlistDoc.products || []).filter((p) => p && p.active !== false);
  return {
    wishlistIds: products.map((p) => p._id),
    wishlist: products,
  };
};

// @desc    Get the logged-in user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  await wishlist.populate([{ path: 'products', populate: [{ path: 'brand', select: 'name slug' }, { path: 'category', select: 'name slug' }] }]);

  res.status(200).json({
    success: true,
    message: 'Wishlist fetched successfully',
    data: shapeWishlist(wishlist),
  });
});

// @desc    Add a product to the wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findOne({ _id: productId, active: true });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const wishlist = await getOrCreateWishlist(req.user._id);
  if (!wishlist.products.some((p) => p.toString() === productId)) {
    wishlist.products.push(productId);
    await wishlist.save();
  }
  await wishlist.populate([{ path: 'products', populate: [{ path: 'brand', select: 'name slug' }, { path: 'category', select: 'name slug' }] }]);

  res.status(200).json({
    success: true,
    message: 'Product added to wishlist',
    data: shapeWishlist(wishlist),
  });
});

// @desc    Remove a product from the wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const wishlist = await getOrCreateWishlist(req.user._id);
  wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
  await wishlist.save();
  await wishlist.populate([{ path: 'products', populate: [{ path: 'brand', select: 'name slug' }, { path: 'category', select: 'name slug' }] }]);

  res.status(200).json({
    success: true,
    message: 'Product removed from wishlist',
    data: shapeWishlist(wishlist),
  });
});

// @desc    Toggle a product in/out of the wishlist in one call
// @route   POST /api/wishlist/:productId/toggle
// @access  Private
// Mirrors store.jsx's single toggleWishlist(productId) function exactly,
// so the frontend can wire the heart-icon button to one endpoint.
const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findOne({ _id: productId, active: true });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const wishlist = await getOrCreateWishlist(req.user._id);
  const exists = wishlist.products.some((p) => p.toString() === productId);

  if (exists) {
    wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
  } else {
    wishlist.products.push(productId);
  }

  await wishlist.save();
  await wishlist.populate([{ path: 'products', populate: [{ path: 'brand', select: 'name slug' }, { path: 'category', select: 'name slug' }] }]);

  res.status(200).json({
    success: true,
    message: exists ? 'Product removed from wishlist' : 'Product added to wishlist',
    data: shapeWishlist(wishlist),
  });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist, toggleWishlist };
