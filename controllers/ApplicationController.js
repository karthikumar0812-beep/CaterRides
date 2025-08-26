const Event = require("../models/Events");
const User = require("../models/User");
const { confirmationMail } = require("../utils/sendMail");

const applyToEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Get event date (only day, ignoring time)
    const eventDate = new Date(event.date);
    const eventDay = eventDate.toISOString().split("T")[0]; // YYYY-MM-DD

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1️⃣ Check if already applied for this same event
    const alreadyAppliedToThisEvent = event.applicants.some(
      (app) => app?.rider?.toString() === userId.toString()
    );
    if (alreadyAppliedToThisEvent) {
      return res.status(400).json({ message: "Already applied to this event" });
    }

    // 2️⃣ Check if already applied to another event on the same day
    const appliedSameDay = await Event.findOne({
      _id: { $in: user.appliedEvents.map((e) => e.eventId) },
      date: {
        $gte: new Date(eventDay + "T00:00:00.000Z"),
        $lte: new Date(eventDay + "T23:59:59.999Z")
      }
    });

    if (appliedSameDay) {
      return res.status(400).json({
        message: "You can only apply to one event per day"
      });
    }

    // ✅ Add to event applicants
    event.applicants.push({ rider: userId, status: "pending" });
    await event.save();

    // ✅ Add to user’s appliedEvents
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
