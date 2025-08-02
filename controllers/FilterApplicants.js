const Event = require("../models/Events");

const getFilteredApplications = async (req, res) => {
  const organizerId = req.organizer;
  const { status } = req.query;

  if (!["pending", "accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status type" });
  }

  try {
    const events = await Event.find({ createdBy: organizerId })
      .populate({
        path: "applicants.rider",
        select: "name email phone age"
      })
      .select("title applicants");

    // Filter only applicants with matching status
    const filteredEvents = events.map(event => {
      const filteredApplicants = event.applicants.filter(
        applicant => applicant.status === status
      );
      return {
        _id: event._id,
        title: event.title,
        applicants: filteredApplicants
      };
    }).filter(event => event.applicants.length > 0); // Remove events with no matching applicants

    res.status(200).json({ filteredEvents });
  } catch (error) {
    console.error("Error filtering applications:", error);
    res.status(500).json({ message: "Server error while filtering applications" });
  }
};
module.exports = {getFilteredApplications};
