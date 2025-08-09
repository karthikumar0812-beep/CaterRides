// controllers/organizerEventsController.js
const jwt = require("jsonwebtoken");
const Event = require("../models/Events");

const OrganizerEvents = async (req, res) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const organizerId = decoded.id;

    // Fetch events created by this organizer
    const events = await Event.find({ createdBy: organizerId }).sort({ createdAt: -1 });

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching organizer events:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { OrganizerEvents };
