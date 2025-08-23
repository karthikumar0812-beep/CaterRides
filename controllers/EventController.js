const Event = require("../models/Events");

const getAllEvents = async (req, res) => {
  try {
    console.log("🔍 Fetching all events with filters...");

    // ✅ Calculate "tomorrow" (today + 1 day, reset to 00:00)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // --- Build filters dynamically ---
    const filter = {
      date: { $gte: tomorrow }, // only upcoming events
    };

    // ✅ 1. Search by place (location)
    if (req.query.place) {
      filter.location = { $regex: req.query.place, $options: "i" }; 
      // case-insensitive search
    }

    // --- Sorting options ---
    let sortOption = { date: 1 }; // default: ascending by date

    // ✅ 2. Sort by price or date
    if (req.query.sortBy === "price") {
      sortOption = { price: req.query.order === "desc" ? -1 : 1 };
    } else if (req.query.sortBy === "date") {
      sortOption = { date: req.query.order === "desc" ? -1 : 1 };
    }

    // --- Fetch events ---
    const events = await Event.find(filter)
      .populate("createdBy", "name email")
      .sort(sortOption);

    res.status(200).json(events);
  } catch (error) {
    console.error("🔥 Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

module.exports = { getAllEvents };
