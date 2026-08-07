const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// connectDB — opens the single shared Mongoose connection for the whole app.
// Called once from server.js on boot. Exits the process on failure so the
// app never runs in a half-connected state (fail fast, fail loud).
// ---------------------------------------------------------------------------
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
