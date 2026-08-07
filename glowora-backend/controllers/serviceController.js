const asyncHandler = require('express-async-handler');
const Service = require('../models/Service');
const { TIME_SLOTS } = require('../utils/timeSlots');

// @desc    Get all services (Services.jsx)
// @route   GET /api/services
// @access  Public
const getServices = asyncHandler(async (req, res) => {
  const filter = req.query.includeInactive === 'true' ? {} : { active: true };
  if (req.query.category) filter.category = req.query.category;

  const services = await Service.find(filter).sort('category name');

  res.status(200).json({
    success: true,
    message: 'Services fetched successfully',
    data: services,
  });
});

// @desc    Get the fixed booking time-slot grid (BookAppointment.jsx)
// @route   GET /api/services/time-slots
// @access  Public
const getTimeSlots = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Time slots fetched successfully',
    data: TIME_SLOTS,
  });
});

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Admin
const createService = asyncHandler(async (req, res) => {
  const { name, category, duration, priceFrom } = req.body;

  const exists = await Service.findOne({ name: new RegExp(`^${name}$`, 'i') });
  if (exists) {
    res.status(400);
    throw new Error('A service with this name already exists');
  }

  const service = await Service.create({ name, category, duration, priceFrom });

  res.status(201).json({
    success: true,
    message: 'Service created successfully',
    data: service,
  });
});

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  const fields = ['name', 'category', 'duration', 'priceFrom', 'active'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) service[f] = req.body[f];
  });

  const updated = await service.save();

  res.status(200).json({
    success: true,
    message: 'Service updated successfully',
    data: updated,
  });
});

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  await service.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Service deleted successfully',
    data: null,
  });
});

module.exports = { getServices, getTimeSlots, createService, updateService, deleteService };
