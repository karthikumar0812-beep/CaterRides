const User = require("../models/User"); // your user schema
const sendOtpMail = require("../utils/sendMail");

// In-memory OTP store (no schema change required)
const otpStore = new Map();

/**
 * Step 1: Forgot Password - Send OTP
 */
const forgotPasswordVerify = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in memory with expiry (5 minutes)
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    // Send OTP mail
    await sendOtpMail.forgotPasswordOTP(email, otp);

    res.json({ msg: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

/**
 * Step 2: Reset Password - Verify OTP & Update Password
 */
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const record = otpStore.get(email);
    if (!record) return res.status(400).json({ msg: "No OTP requested" });

    if (record.otp !== otp) return res.status(400).json({ msg: "Invalid OTP" });

    if (Date.now() > record.expiresAt)
      return res.status(400).json({ msg: "OTP expired" });
    
  // ✅ assign plain password (hook will hash it)
    user.password = newPassword;
    await user.save();

    // Clear OTP
    otpStore.delete(email);

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports={forgotPasswordVerify,resetPassword}
