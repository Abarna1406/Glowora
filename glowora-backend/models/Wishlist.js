const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Wishlist
// ---------------------------------------------------------------------------
// Server-side mirror of src/lib/store.jsx's `wishlist` state: a flat array
// of product ids per user. One Wishlist document per user (upserted on
// first add).
// ---------------------------------------------------------------------------

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    products: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Wishlist', wishlistSchema);
