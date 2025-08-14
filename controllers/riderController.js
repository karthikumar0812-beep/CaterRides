const User = require("../models/User");
const Events= require("../models/Events"); 
const jwt = require("jsonwebtoken");
const {sendWelcomeEmail,sendOtpEmail} = require("../utils/sendMail");
const otpStore = {};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Rider Signup
// @route   POST /api/rider/signup

//-------------------------------------SIGNUP-----------------------------------------------
//This is a signuprider function
// @desc    Send OTP to Rider Email
// @route   POST /api/rider/send-otp-email

//This function will create OTP
const createOTP = async (req, res) => {
  const { email, name, phone, age, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ message: "Name, Email, and Password are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000;

    otpStore[email] = { otp, expires, name, phone, age, password };

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP sent to your email!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

//This function verify otp and create rider
const signupRider = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const record = otpStore[email];
  if (!record) return res.status(400).json({ message: "OTP not sent or expired" });

  if (Date.now() > record.expires) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP expired" });
  }

  if (otp !== record.otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  try {
    // Create Rider
    const rider = await User.create({
      name: record.name,
      email,
      phone: record.phone,
      age: record.age,
      role: "rider",
      password: record.password, // temporary random password
    });

    delete otpStore[email];

    await sendWelcomeEmail(email, record.name);

    res.status(201).json({
      _id: rider._id,
      name: rider.name,
      email: rider.email,
      token: generateToken(rider._id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create rider" });
  }
};



// @desc    Rider Login
// @route   POST /api/rider/login

//--------------------------------------LOGIN------------------------------------------------
//This is a loginrider function
const loginRider = async (req, res) => {
  const { email, password } = req.body;

  try {
    const rider = await User.findOne({ email });

    if (!rider || rider.role !== "rider") {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await rider.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      _id: rider._id,
      name: rider.name,
      email: rider.email,
      token: generateToken(rider._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//profile view
const getRiderProfile = async (req, res) => {
  try {
    const rider = await User.findById(req.user._id)
      .select("-password")
      .populate("appliedEvents.eventId", "title date", "Events"); // 👈 third argument is model name

    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }

    res.status(200).json(rider);
  } catch (error) {
    console.error("Error fetching rider profile:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  createOTP,
  signupRider,
  loginRider,
  getRiderProfile
};
