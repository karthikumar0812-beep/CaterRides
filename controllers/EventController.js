const Event = require("../models/Events");

const getAllEvents = async (req, res) => {
  try {
    console.log("🔍 Fetching events with filters...");

    // --- Pagination ---
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20; // default 20 per page
    const skip = (page - 1) * limit;

    // --- Date filter for upcoming events ---
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const filter = {
      date: { $gte: tomorrow },
    };

    // --- Search by location ---
    if (req.query.place) {
      filter.location = { $regex: req.query.place, $options: "i" };
    }

    // --- Sorting ---
    let sortOption = { date: 1 }; // default ascending
    if (req.query.sortBy === "price") {
      sortOption = { price: req.query.order === "desc" ? -1 : 1 };
    } else if (req.query.sortBy === "date") {
      sortOption = { date: req.query.order === "desc" ? -1 : 1 };
    }

    // --- Fetch events with pagination & lean() ---
    const events = await Event.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(); // lean() returns plain JS objects, faster than Mongoose docs

    // Optional: populate createdBy only if needed
    // const populatedEvents = await Event.populate(events, { path: "createdBy", select: "name email" });

    // --- Total count for frontend pagination ---
    const total = await Event.countDocuments(filter);

    res.status(200).json({
      events,
      page,
      totalPages: Math.ceil(total / limit),
      totalEvents: total,
    });
  } catch (error) {
    console.error("🔥 Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

module.exports = { getAllEvents };
