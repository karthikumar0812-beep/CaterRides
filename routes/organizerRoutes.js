const express = require("express");
const router = express.Router();
const { signupOrganizer, loginOrganizer,getOrganizerProfile } = require("../controllers/OrganizerController");
const protectOrganizer = require("../middlewares/OrganizerAuthMidware");
const { postEvent }=require("../controllers/postEvent");
const { respondToApplication }=require("../controllers/respondtoApplication");
const { FilterApplicants }=require("../controllers/FilterApplicants");
const {OrganizerEvents }=require("../controllers/OrganizerEvents")
router.post("/signup", signupOrganizer);
router.post("/login", loginOrganizer);
router.post("/post-event", protectOrganizer, postEvent);
router.put("/event/:eventId/respond/:riderId", protectOrganizer, respondToApplication); //accept or reject application
router.get("/profile", protectOrganizer, getOrganizerProfile);
router.get("/myevents",protectOrganizer,OrganizerEvents);
router.get("/myapplicants/:eventId", protectOrganizer, FilterApplicants);
module.exports = router;
