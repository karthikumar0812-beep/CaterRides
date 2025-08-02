const Event = require("../models/Events");

const postEvent = async (req, res) => {
  try {
    const {
      title,
      location,
      date,
      vacancies,
      negotiatePrice,
      description
    } = req.body;

    // Create new Event and assign organizer ID from middleware
    const newEvent = new Event({
      title,
      location,
      date,
      vacancies,
      negotiatePrice,
      description,
      createdBy: req.organizer._id, // Comes from organizerAuthMiddleware
      applicants: [] // initially empty
    });

    const savedEvent = await newEvent.save();

    res.status(201).json({
      message: "Event created successfully",
      event: savedEvent
    });
  } catch (error) {
    console.error("Error while posting event:", error);
    res.status(500).json({ message: "Failed to create event" });
  }
};

module.exports = { postEvent };
