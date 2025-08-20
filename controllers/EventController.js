const Event = require("../models/Events");

const getAllEvents = async (req, res) => {
  try {
    console.log("🔍 Fetching all events in ascending order...");

    // ✅ Calculate "tomorrow" (today + 1 day, time reset to 00:00) ..Ensures one day gap
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const events = await Event.find({
      date: { $gte: tomorrow }  // only fetch events at least 1 day ahead
    })
      .populate("createdBy", "name email")
      .sort({ date: 1 }); // ascending order

    res.status(200).json(events);
  } catch (error) {
    console.error("🔥 Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

module.exports = { getAllEvents };
