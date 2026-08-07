const otpGenerator = require("otp-generator");
const User = require("../models/User");
const { sendEmail } = require("../utils/sendEmail");

// ================= SEND OTP =================

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Store OTP as plain text (field has select:false, so we must explicitly
    // save it here without hashing — we then fetch it back with +otp in verify)
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await user.save({ validateBeforeSave: false });

    await sendEmail({
      to: user.email,
      subject: "Glowora Password Reset OTP",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto">
          <h2 style="color:#EC4899">Glowora Password Reset</h2>
          <p>Your OTP to reset your password is:</p>
          <h1 style="font-size:42px;letter-spacing:12px;color:#1F2937">${otp}</h1>
          <p style="color:#6B7280">This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
    });
  } catch (error) {
    console.error("OTP ERROR =>", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= VERIFY OTP =================

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // IMPORTANT: Must use +otp +otpExpire to fetch these select:false fields
    const user = await User.findOne({ email: email.toLowerCase() }).select("+otp +otpExpire");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.otp || user.otp.trim() !== otp.trim()) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (!user.otpExpire || user.otpExpire < new Date()) {
      return res.status(400).json({ success: false, message: "OTP Expired. Please request a new one." });
    }

    return res.status(200).json({ success: true, message: "OTP Verified" });
  } catch (error) {
    console.error("VERIFY OTP ERROR =>", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= RESET PASSWORD =================

const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    // IMPORTANT: Must use +otp +otpExpire +password to fetch these select:false fields
    const user = await User.findOne({ email: email.toLowerCase() }).select("+otp +otpExpire +password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.otp || user.otp.trim() !== otp.trim()) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (!user.otpExpire || user.otpExpire < new Date()) {
      return res.status(400).json({ success: false, message: "OTP Expired. Please request a new one." });
    }

    // Let User model's pre-save hook hash the password
    user.password = password;
    user.otp = null;
    user.otpExpire = null;

    await user.save();

    return res.status(200).json({ success: true, message: "Password Reset Successful" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR =>", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { sendOTP, verifyOTP, resetPassword };