const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------
// Frontend contract (src/pages/Register.jsx):
//   roleOptions = [Salon, Spa, Beautician]  — chosen at signup
//   Admin accounts are provisioned directly in the database / by another
//   admin, never through the public /register form.
//
// src/context/AuthContext.jsx persists whatever `user` object this model
// serializes to localStorage and reads `user.name` / `user.role` back out
// (see Dashboard.jsx) — keep those two fields present on every response.
// ---------------------------------------------------------------------------

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: function () {
        // Not required for Google-authenticated accounts.
        return !this.googleId;
      },
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['Admin', 'Salon', 'Spa', 'Beautician', 'Customer'],
      default: 'Beautician',
    },
    profileImage: {
      type: String,
      default: '',
    },
    googleId: {
      type: String,
      default: null,
    },
    otp: {
      type: String,
      select: false,
      default: null,
    },
    otpExpire: {
      type: Date,
      select: false,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Hash password whenever it is newly set/changed.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method — compare plaintext login password against the stored hash.
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

// Instance method — strips internal-only fields before sending a user object
// back to the frontend (used by AuthContext / Dashboard / ProfileDropdown).
userSchema.methods.toSafeObject = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    profileImage: this.profileImage,
    isVerified: this.isVerified,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
