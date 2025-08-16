// controllers/riderController.js
const Event = require("../models/Events");
const Organizer = require("../models/Organizer");

const Eventinfo = async (req, res) => {
  try {
    const { eventId } = req.params;

    // 1. Find event
    const event = await Event.findById(eventId).lean();
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 2. Organizer is in event.createdBy
    const organizer = await Organizer.findById(event.createdBy)
      .select("_id name email organizationName phone") // never send password
      .lean();

    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    // 3. Return clean JSON
    return res.json({
      event: {
        id: event._id,
        title: event.title,
        location: event.location,
        date: event.date,
        vacancies: event.vacancies,
        negotiatePrice: event.negotiatePrice,
        description: event.description,
      },
      organizer: {
        id: organizer._id,
        name: organizer.name,
        email: organizer.email,
        organizationName: organizer.organizationName,
        phone: organizer.phone,
      },
    });
  } catch (error) {
    console.error("Error fetching event info:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { Eventinfo };
