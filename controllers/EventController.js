const Event= require("../models/Events");


const getAllEvents = async (req, res) => {
  try {
    console.log("🔍 Fetching all events...");
    const events = await Event.find().populate("createdBy", "name email");
    res.status(200).json(events);
  } catch (error) {
    console.error("🔥 Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};


module.exports = { getAllEvents };
