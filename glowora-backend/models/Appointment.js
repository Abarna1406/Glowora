const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Appointment
// ---------------------------------------------------------------------------
// BookAppointment.jsx contract: a booking = offering (service or spa
// package) + date + time + staff member + payment method, for one venue.
// Appointments.jsx contract: status tabs are 'Upcoming' | 'Completed' |
// 'Cancelled', and each row shows { id, service, salonName, date, time,
// professional, status, total }.
//
// `service` and `staff` are snapshotted (name/role/price) rather than
// live-populated only, so a booking's historical record stays correct even
// if the venue later edits/removes that service or staff member.
// ---------------------------------------------------------------------------

const appointmentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    salon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Salon',
      required: true,
    },
    salonName: {
      type: String,
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      default: null,
    },
    offeringName: {
      type: String,
      required: [true, 'Service/package name is required'],
      trim: true,
    },
    staff: {
      name: { type: String, required: true },
      role: { type: String, default: '' },
    },
    bookingDate: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    bookingTime: {
      type: String,
      required: [true, 'Booking time is required'],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'netbanking', 'upi', 'cod'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    stripeSessionId: {
      type: String,
    },
    stripePaymentIntentId: {
      type: String,
    },
    bookingStatus: {
      type: String,
      enum: ['Upcoming', 'Completed', 'Cancelled'],
      default: 'Upcoming',
    },
    cancelReason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

appointmentSchema.index({ salon: 1, bookingDate: 1, bookingTime: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
