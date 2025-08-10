//This controller is used for getting the evnts posted by organizer from organizer side
// controllers/organizerEventsController.js
const Event = require("../models/Events");

const OrganizerEvents = async (req, res) => {
  try {
    // Organizer ID comes from protectOrganizer middleware
    const organizerId = req.organizer.id;

    // Find events created by this organizer
    const events = await Event.find({ createdBy: organizerId }).sort({ createdAt: -1 });

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching organizer events:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { OrganizerEvents };
