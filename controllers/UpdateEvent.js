const Event = require("../models/Events");

const UpdateEvent = async (req, res) => {
  try {
    const { eventId } = req.params; // take id from URL param
    const updates = req.body;

    // find and update event only if organizer matches
    const event = await Event.findOneAndUpdate(
      { _id: eventId, createdBy: req.organizer.id },  // ✅ corrected field
      updates,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({
      message: "Event updated successfully",
      event,
    });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { UpdateEvent };
