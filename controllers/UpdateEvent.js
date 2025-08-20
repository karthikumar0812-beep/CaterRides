const Event = require("../models/Events");
const { updateNotification } = require("../utils/sendMail");

const UpdateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const updates = req.body;

    const event = await Event.findOneAndUpdate(
      { _id: eventId, createdBy: req.organizer.id },
      updates,
      { new: true, runValidators: true }
    ).populate("applicants.rider");  // to access emails

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    
    await updateNotification(event);

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
