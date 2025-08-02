const User = require("../models/User");
const Events= require("../models/Events"); 
const jwt = require("jsonwebtoken");
const {sendWelcomeEmail} = require("../utils/sendMail");



// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Rider Signup
// @route   POST /api/rider/signup

//-------------------------------------SIGNUP-----------------------------------------------
//This is a signuprider function
const signupRider = async (req, res) => {
  const { name, email, password, phone, age } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new rider
    const rider = await User.create({
      name,
      email,
      password,
      phone,
      age,
      role: "rider"
    });
    await sendWelcomeEmail(email, name);
    res.status(201).json({
      _id: rider._id,
      name: rider.name,
      email: rider.email,
      token: generateToken(rider._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
  signupRider,
  loginRider,
  getRiderProfile
};
