const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Order
// ---------------------------------------------------------------------------
// Checkout.jsx contract this must satisfy:
//   - delivery: 'standard' (free if subtotal > 15000, else ₹499) | 'priority' (₹799)
//   - payment: 'card' | 'netbanking' | 'upi'
//   - order summary: subtotal, shipping, total
// Orders.jsx contract:
//   - status one of 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled'
//     (tabs filter on 'In Transit' / 'Delivered' / 'Cancelled';
//      'Processing' = just placed, not yet dispatched)
//   - a tracking timeline: [{ label, done, date }], matching orderTimeline
//     in lib/data.js (Order placed -> Verified & packed -> Dispatched ->
//     Out for delivery -> Delivered)
// Items are snapshotted (name/sku/img/price) at order time so the order
// history stays accurate even if a Product is later edited or deleted.
// ---------------------------------------------------------------------------

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    img: { type: String, default: '' },
    price: { type: Number, required: true }, // unit price at time of order
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const timelineStepSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    done: { type: Boolean, default: false },
    date: { type: String, default: 'Pending' },
  },
  { _id: false },
);

const TIMELINE_LABELS = ['Order placed', 'Verified & packed', 'Dispatched', 'Out for delivery', 'Delivered'];

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(v) => v.length > 0, 'Order must contain at least one item'],
    },
    shippingAddress: {
      businessName: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: String, required: true },
      country: { type: String, default: 'India' },
      gstin: { type: String, default: '' },
    },
    deliveryMethod: {
      type: String,
      enum: ['standard', 'priority'],
      default: 'standard',
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'netbanking', 'upi'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: ['Processing', 'In Transit', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
    timeline: {
      type: [timelineStepSchema],
      default: () => TIMELINE_LABELS.map((label, i) => ({ label, done: i === 0, date: i === 0 ? new Date().toDateString() : 'Pending' })),
    },
    eta: {
      type: Date,
    },
    cancelReason: {
      type: String,
      default: '',
    },
    stripeSessionId: {
      type: String,
    },
    stripePaymentIntentId: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Order', orderSchema);
