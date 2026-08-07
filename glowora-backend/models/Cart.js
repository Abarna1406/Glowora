const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Cart
// ---------------------------------------------------------------------------
// Server-side mirror of src/lib/store.jsx's `cart` state: an array of
// { productId, qty } per user. One Cart document per user (upserted on
// first add). Item pricing/subtotal is deliberately NOT stored here — it's
// resolved from the live Product price in cartController so cart totals
// never go stale if a price changes, exactly like `cartSubtotal` in
// store.jsx is recomputed from `ALL_PRODUCTS` on every render.
// ---------------------------------------------------------------------------

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Cart', cartSchema);
