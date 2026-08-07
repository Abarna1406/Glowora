const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Address
// ---------------------------------------------------------------------------
// Field-for-field match against Checkout.jsx's Step 1 form inputs:
//   Business/salon name, Address line 1, City, PIN code, State, GSTIN
// Profile.jsx's "Add another address" button implies multiple saved
// addresses per user, hence a separate collection rather than embedding a
// single address on User.
// ---------------------------------------------------------------------------

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    businessName: {
      type: String,
      required: [true, 'Business / salon name is required'],
      trim: true,
    },
    addressLine1: {
      type: String,
      required: [true, 'Address line 1 is required'],
      trim: true,
    },
    addressLine2: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    pinCode: {
      type: String,
      required: [true, 'PIN code is required'],
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: 'India',
    },
    gstin: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Address', addressSchema);
