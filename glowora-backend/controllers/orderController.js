const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Address = require('../models/Address');
const Product = require('../models/Product');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Shipping cost — exact logic from Checkout.jsx:
//   shipping = delivery === 'priority' ? 799 : cartSubtotal > 15000 ? 0 : 499
// ---------------------------------------------------------------------------
const calcShipping = (deliveryMethod, subtotal) => {
  if (deliveryMethod === 'priority') return 799;
  return subtotal > 15000 ? 0 : 499;
};

const generateOrderNumber = () => `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

// @desc    Place an order from the logged-in user's cart (Checkout.jsx "Place order")
// @route   POST /api/orders
// @access  Private
// @body    { addressId, deliveryMethod, paymentMethod }
//   OR     { address: {...ad-hoc address...}, deliveryMethod, paymentMethod }
const createOrder = asyncHandler(async (req, res) => {
  const { addressId, address: adHocAddress, deliveryMethod, paymentMethod, discount = 0, cartItems } = req.body;
  console.log('Received body:', req.body);
  console.log('cartItems:', cartItems);

  // Since we rely on a stateless frontend Zustand store, the frontend passes cartItems explicitly.
  if (!cartItems || cartItems.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  }

  // Resolve the shipping address — either a saved Address id, or an
  // ad-hoc address object matching Checkout.jsx's Step 1 form fields.
  let shippingAddress;
  if (addressId) {
    const saved = await Address.findOne({ _id: addressId, user: req.user._id });
    if (!saved) {
      res.status(404);
      throw new Error('Address not found');
    }
    shippingAddress = saved.toObject();
  } else if (adHocAddress) {
    const { businessName, addressLine1, city, state, pinCode } = adHocAddress;
    if (!businessName || !addressLine1 || !city || !state || !pinCode) {
      res.status(400);
      throw new Error('businessName, addressLine1, city, state and pinCode are required');
    }
    shippingAddress = adHocAddress;
  } else {
    res.status(400);
    throw new Error('A shipping address is required');
  }

  // Validate stock and build the item snapshot in one pass.
  const items = [];
  const realProductUpdates = [];
  
  for (const line of cartItems) {
    // If it's a dummy product from frontend data.js, bypass DB check
    if (typeof line.product === 'string' && line.product.startsWith('glw-')) {
      items.push({
        product: new mongoose.Types.ObjectId(), // fake ID to pass mongoose validation
        name: line.name || 'Dummy Product',
        sku: line.sku || 'DUMMY',
        img: line.img || '',
        price: line.price || 0,
        qty: line.qty,
      });
    } else {
      const product = await Product.findById(line.product);
      if (!product || !product.active) {
        res.status(400);
        throw new Error(`A product in your cart is no longer available`);
      }
      if (product.stock < line.qty) {
        res.status(400);
        throw new Error(`Only ${product.stock} unit(s) of "${product.name}" left in stock`);
      }
      items.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        img: product.img,
        price: product.price,
        qty: line.qty,
      });
      realProductUpdates.push({ id: product._id, qty: line.qty });
    }
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shippingCost = calcShipping(deliveryMethod, subtotal);
  // Optional: Add backend validation for discount max
  const appliedDiscount = Math.min(Number(discount) || 0, subtotal);
  const totalAmount = subtotal - appliedDiscount + shippingCost;

  // Deduct stock for every real item.
  await Promise.all(realProductUpdates.map((i) => Product.findByIdAndUpdate(i.id, { $inc: { stock: -i.qty } })));

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: req.user._id,
    items,
    shippingAddress,
    deliveryMethod: deliveryMethod || 'standard',
    paymentMethod: paymentMethod || 'card',
    subtotal,
    discount: appliedDiscount,
    shippingCost,
    totalAmount,
  });

  let stripeSessionUrl = null;

  if (paymentMethod === 'card') {
    const line_items = items.map((item) => {
      const validImage = item.img && (item.img.startsWith('http://') || item.img.startsWith('https://')) ? [item.img] : [];
      return {
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.name,
            ...(validImage.length > 0 && { images: validImage }),
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects amount in paise
        },
        quantity: item.qty,
      };
    });

    // Add shipping cost if applicable
    if (shippingCost > 0) {
      line_items.push({
        price_data: {
          currency: 'inr',
          product_data: { name: 'Shipping' },
          unit_amount: shippingCost * 100,
        },
        quantity: 1,
      });
    }

    let stripeDiscounts = [];
    if (appliedDiscount > 0) {
      try {
        const stripeCoupon = await stripe.coupons.create({
          amount_off: appliedDiscount * 100, // Amount in paise
          currency: 'inr',
          duration: 'once',
        });
        stripeDiscounts = [{ coupon: stripeCoupon.id }];
      } catch (couponErr) {
        console.error('Failed to create Stripe coupon:', couponErr.message);
        res.status(500);
        throw new Error('Failed to apply discount in payment gateway');
      }
    }
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        discounts: stripeDiscounts,
        success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/cart`,
        metadata: { orderId: order._id.toString() },
      });

      order.stripeSessionId = session.id;
      await order.save();
      stripeSessionUrl = session.url;
    } catch (stripeErr) {
      console.error('Stripe checkout error:', stripeErr.message);
      res.status(500);
      throw new Error(`Payment gateway error: ${stripeErr.message}`);
    }
  }

  // We don't have a backend cart to clear since the frontend manages it.
  // The frontend clears its own Zustand state upon success.

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: order,
    stripeSessionUrl, // Will be null for non-card payments
  });
});

// @desc    Get the logged-in user's order history (Orders.jsx)
// @route   GET /api/orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.status) filter.orderStatus = req.query.status;

  const orders = await Order.find(filter).sort('-createdAt');

  res.status(200).json({
    success: true,
    message: 'Orders fetched successfully',
    data: orders,
  });
});

// @desc    Get a single order (owner or Admin)
// @route   GET /api/orders/:id
// @access  Private
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.status(200).json({
    success: true,
    message: 'Order fetched successfully',
    data: order,
  });
});

// @desc    Cancel an order (only while still Processing)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to cancel this order');
  }
  if (order.orderStatus !== 'Processing') {
    res.status(400);
    throw new Error('Only orders that have not yet shipped can be cancelled');
  }

  order.orderStatus = 'Cancelled';
  order.cancelReason = req.body.reason || 'Cancelled by customer';

  // Restock cancelled items.
  await Promise.all(order.items.map((i) => Product.findByIdAndUpdate(i.product, { $inc: { stock: i.qty } })));

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    data: order,
  });
});

// @desc    Get all orders across all customers (AdminOrders.jsx)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.orderStatus = req.query.status;

  const orders = await Order.find(filter).populate('user', 'name email').sort('-createdAt');

  res.status(200).json({
    success: true,
    message: 'Orders fetched successfully',
    data: orders,
  });
});

// ---------------------------------------------------------------------------
// Advancing orderStatus also updates `timeline` to match lib/data.js's
// orderTimeline shape: [{ label, done, date }], so Orders.jsx's tracking
// view has real progressive dates instead of static mock data.
// ---------------------------------------------------------------------------
const STATUS_TO_TIMELINE_INDEX = {
  Processing: 1, // "Verified & packed" done
  'In Transit': 3, // "Dispatched" + "Out for delivery" done
  Delivered: 4, // all done
};

// @desc    Update order status (admin fulfillment workflow)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['Processing', 'In Transit', 'Delivered', 'Cancelled'].includes(status)) {
    res.status(400);
    throw new Error('Invalid order status');
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.orderStatus = status;

  if (status === 'Cancelled') {
    await Promise.all(order.items.map((i) => Product.findByIdAndUpdate(i.product, { $inc: { stock: i.qty } })));
  } else {
    const doneUpTo = STATUS_TO_TIMELINE_INDEX[status] ?? 0;
    order.timeline = order.timeline.map((step, i) => ({
      ...step,
      done: i <= doneUpTo,
      date: i <= doneUpTo && step.date === 'Pending' ? new Date().toDateString() : step.date,
    }));
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order status updated',
    data: order,
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};
