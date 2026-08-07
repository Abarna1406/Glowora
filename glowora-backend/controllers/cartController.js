const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const POPULATE = [
  { path: 'items.product', populate: [{ path: 'brand', select: 'name slug' }, { path: 'category', select: 'name slug' }] },
];

// ---------------------------------------------------------------------------
// shapeCart — turns a populated Cart document into the exact shape
// store.jsx's `value` exposes to the rest of the app:
//   cart: [{ productId, qty, product }], cartCount, cartSubtotal
// Items whose product was deleted/deactivated are dropped, mirroring
// store.jsx's `.filter((c) => c.product)`.
// ---------------------------------------------------------------------------
const shapeCart = (cartDoc) => {
  const items = (cartDoc?.items || [])
    .filter((i) => i.product && i.product.active !== false)
    .map((i) => ({ productId: i.product._id, qty: i.qty, product: i.product }));

  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);
  const cartSubtotal = items.reduce((sum, i) => sum + i.qty * i.product.price, 0);

  return { items, cartCount, cartSubtotal };
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

// @desc    Get the logged-in user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  await cart.populate(POPULATE);

  res.status(200).json({
    success: true,
    message: 'Cart fetched successfully',
    data: shapeCart(cart),
  });
});

// @desc    Add a product to cart (or increment qty if already present)
// @route   POST /api/cart
// @access  Private
// @body    { productId, qty }  — mirrors store.jsx's addToCart(productId, qty = 1)
const addToCart = asyncHandler(async (req, res) => {
  const { productId, qty } = req.body;
  const quantity = Number(qty) || 1;

  if (quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  const product = await Product.findOne({ _id: productId, active: true });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const cart = await getOrCreateCart(req.user._id);
  const existing = cart.items.find((i) => i.product.toString() === productId);

  if (existing) {
    existing.qty += quantity;
  } else {
    cart.items.push({ product: productId, qty: quantity });
  }

  await cart.save();
  await cart.populate(POPULATE);

  res.status(200).json({
    success: true,
    message: 'Product added to cart',
    data: shapeCart(cart),
  });
});

// @desc    Update the quantity of a cart item
// @route   PUT /api/cart/:productId
// @access  Private
// @body    { qty }  — mirrors store.jsx's updateQty(productId, qty)
const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const qty = Math.max(1, Number(req.body.qty) || 1); // store.jsx floors qty at 1

  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) {
    res.status(404);
    throw new Error('This product is not in your cart');
  }

  item.qty = qty;
  await cart.save();
  await cart.populate(POPULATE);

  res.status(200).json({
    success: true,
    message: 'Cart updated',
    data: shapeCart(cart),
  });
});

// @desc    Remove a single product from the cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter((i) => i.product.toString() !== productId);

  await cart.save();
  await cart.populate(POPULATE);

  res.status(200).json({
    success: true,
    message: 'Product removed from cart',
    data: shapeCart(cart),
  });
});

// @desc    Clear the entire cart (post-checkout)
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Cart cleared',
    data: shapeCart(cart),
  });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
