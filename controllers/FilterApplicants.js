const Event = require("../models/Events");

const FilterApplicants = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    // Find event and populate rider details inside applicants
   const event = await Event.findById(eventId).populate({
  path: "applicants.rider",
  select: "name email phone servesCompleted rating"
});

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Send applicants with populated rider info
    res.status(200).json({ applicants: event.applicants });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { FilterApplicants };
