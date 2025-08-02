const Event = require("../models/Events");
const User = require("../models/User");
const { confirmationMail } = require("../utils/sendMail");
const applyToEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if user already applied in event applicants array
    const alreadyApplied = event.applicants.some(
      (app) => app?.rider?.toString() === userId.toString()
    );
    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied to this event" });
    }

    // Push to event's applicants array
    event.applicants.push({ rider: userId, status: "pending" });
    await event.save();

    // Update user's appliedEvents with full object
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if already applied in user object (optional double-check)
    const alreadyInUser = user.appliedEvents.some(
      (e) => e.eventId?.toString() === eventId
    );
    if (alreadyInUser) {
      return res.status(400).json({ message: "Already applied (user record)" });
    }

    user.appliedEvents.push({
      eventId: event._id,
      status: "pending",
      appliedAt: new Date()
    });
    await user.save();
    
    // Send confirmation email
    await confirmationMail(user.email, user.name);

    res.status(200).json({ message: "Successfully applied to event" });
  } catch (error) {
    console.error("Apply error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { applyToEvent };
