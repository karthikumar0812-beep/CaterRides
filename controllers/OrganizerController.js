const Organizer = require("../models/Organizer");
const Events = require("../models/Events");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id, role: "organizer" }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Signup
const signupOrganizer = async (req, res) => {
  const { name, email, password, phone, organizationName } = req.body;

  try {
    const existing = await Organizer.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const organizer = await Organizer.create({ name, email, password, phone, organizationName });

    res.status(201).json({
      _id: organizer._id,
      name: organizer.name,
      email: organizer.email,
      token: generateToken(organizer._id)
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// Login
const loginOrganizer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const organizer = await Organizer.findOne({ email });
    if (!organizer) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await organizer.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({
      _id: organizer._id,
      name: organizer.name,
      email: organizer.email,
      token: generateToken(organizer._id)
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

//profile


const getOrganizerProfile = async (req, res) => {
  try {
    // Find organizer details excluding password
    const organizer = await Organizer.findById(req.organizer).select("-password");

    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    // Fetch all events posted by this organizer
    const eventsPosted = await Events.find({ createdBy: req.organizer}).select("title date location");

    res.status(200).json({
      _id: organizer._id,
      name: organizer.name,
      phone: organizer.phone,
      email: organizer.email,
      organizationName: organizer.organizationName,
      eventsPosted,
    });
  } catch (error) {
    console.error("Error fetching organizer profile:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




module.exports = { signupOrganizer, loginOrganizer ,getOrganizerProfile};
