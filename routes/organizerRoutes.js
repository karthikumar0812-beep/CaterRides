const express = require("express");
const router = express.Router();
const { signupOrganizer, loginOrganizer,getOrganizerProfile } = require("../controllers/OrganizerController");
const protectOrganizer = require("../middlewares/OrganizerAuthMidware");
const { postEvent }=require("../controllers/postEvent");
const { respondToApplication }=require("../controllers/respondtoApplication");
const { getFilteredApplications }=require("../controllers/FilterApplicants");
router.post("/signup", signupOrganizer);
router.post("/login", loginOrganizer);
router.post("/post-event", protectOrganizer, postEvent);
router.put("/event/:eventId/respond/:riderId", protectOrganizer, respondToApplication); //accept or reject application
router.get("/applications",protectOrganizer,getFilteredApplications);
router.get("/profile", protectOrganizer, getOrganizerProfile);
module.exports = router;
