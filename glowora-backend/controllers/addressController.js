const asyncHandler = require('express-async-handler');
const Address = require('../models/Address');

// @desc    Get all saved addresses for the logged-in user
// @route   GET /api/addresses
// @access  Private
const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort('-isDefault -createdAt');
  res.status(200).json({
    success: true,
    message: 'Addresses fetched successfully',
    data: addresses,
  });
});

// @desc    Add a new address ("Add another address" on Profile.jsx)
// @route   POST /api/addresses
// @access  Private
const addAddress = asyncHandler(async (req, res) => {
  const { businessName, addressLine1, addressLine2, city, state, pinCode, gstin, isDefault } = req.body;

  const isFirst = (await Address.countDocuments({ user: req.user._id })) === 0;

  if (isDefault || isFirst) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }

  const address = await Address.create({
    user: req.user._id,
    businessName,
    addressLine1,
    addressLine2,
    city,
    state,
    pinCode,
    gstin,
    isDefault: isDefault || isFirst,
  });

  res.status(201).json({
    success: true,
    message: 'Address added successfully',
    data: address,
  });
});

// @desc    Update an address
// @route   PUT /api/addresses/:id
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  const fields = ['businessName', 'addressLine1', 'addressLine2', 'city', 'state', 'pinCode', 'gstin'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) address[f] = req.body[f];
  });

  if (req.body.isDefault === true) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
    address.isDefault = true;
  }

  const updated = await address.save();

  res.status(200).json({
    success: true,
    message: 'Address updated successfully',
    data: updated,
  });
});

// @desc    Delete an address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  await address.deleteOne();

  // Promote the most recently added remaining address to default, if any.
  if (address.isDefault) {
    const next = await Address.findOne({ user: req.user._id }).sort('-createdAt');
    if (next) {
      next.isDefault = true;
      await next.save();
    }
  }

  res.status(200).json({
    success: true,
    message: 'Address deleted successfully',
    data: null,
  });
});

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress };
