const Event = require("../models/Events");
const { sendDeleteEventMail } = require("../utils/sendMail");

const DeleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // ✅ Correct populate path
    const event = await Event.findById(eventId).populate("applicants.rider");

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // ✅ Collect rider emails safely
    const applicantEmails = event.applicants
      .map(app => app.rider && app.rider.email)  // ensure rider exists
      .filter(Boolean);  // remove null/undefined

    // Delete event
    await Event.findByIdAndDelete(eventId);

    // ✅ Send mail if emails exist
    if (applicantEmails.length > 0) {
      await sendDeleteEventMail(applicantEmails, event);
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully, applicants notified.",
    });

  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ success: false, message: "Server error while deleting event" });
  }
};

module.exports = { DeleteEvent };
