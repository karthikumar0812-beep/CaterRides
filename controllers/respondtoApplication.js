const Event = require("../models/Events");
const User = require("../models/User");
const { sendOrganizerResponseMail } = require("../utils/sendMail");

const respondToApplication = async (req, res) => {
  const { eventId, riderId } = req.params;
  const { action } = req.body;

  try {
    // Validate action
    if (!["accepted", "rejected"].includes(action)) {
      return res.status(400).json({ message: "Invalid action type" });
    }

    // Fetch Event and User
    const event = await Event.findById(eventId);
    const user = await User.findById(riderId);

    if (!event || !user) {
      return res.status(404).json({ message: "Event or rider not found" });
    }

    // Update applicant status in Event
    const applicant = event.applicants.find(
      (app) => app.rider.toString() === riderId
    );
    if (!applicant) {
      return res
        .status(404)
        .json({ message: "Rider did not apply for this event" });
    }
    applicant.status = action;

    // Update applied event status in User
    const appliedEvent = user.appliedEvents.find(
      (e) => e.eventId.toString() === eventId
    );
    if (!appliedEvent) {
      return res
        .status(404)
        .json({ message: "Event not found in user's applied list" });
    }
    appliedEvent.status = action;

    // If accepted, update earnings and servesCompleted
    if (action === "accepted") {
      const price = Number(event.negotiatePrice);
      const earnings = Number(user.earnings);

      if (isNaN(price) || isNaN(earnings)) {
        return res
          .status(400)
          .json({ message: "Invalid negotiatePrice or earnings" });
      }

      user.earnings = earnings + price;
      user.servesCompleted += 1;
      // Decrement event vacancy
      if (typeof event.vacancies === "number") {
        if (event.vacancies> 0) {
          event.vacancies -= 1;
        } else {
          return res
            .status(400)
            .json({ message: "No vacancies left for this event" });
        }
      }
    }

    await event.save();
    await user.save();

    //Email send function
    await sendOrganizerResponseMail(
      user.email,
      user.name,
      event.title,
      action,
      event.date,
      event.time,
      event.location
    );

    res.status(200).json({ message: `Application ${action} successfully` });
  } catch (error) {
    console.error("Error responding to application:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { respondToApplication };
