const Event = require("../models/Events");

const Eventdetails = async (req, res) => {
  try {
    const { eventId } = req.params; // ✅ req.params, not req.params()

    const event = await Event.findById(eventId).lean();

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.json({
      id: event._id,
      title: event.title,
      location: event.location,
      date: event.date,
      vacancies: event.vacancies,
      negotiatePrice: event.negotiatePrice,
      description: event.description,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {Eventdetails};
