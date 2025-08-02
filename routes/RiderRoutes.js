const express = require("express");
const router = express.Router();

const { signupRider, loginRider ,getRiderProfile} = require("../controllers/riderController");
const { getAllEvents } = require("../controllers/EventController");
const { applyToEvent }=require("../controllers/ApplicationController");
const {protect}=require("..//middlewares/authMiddleware");

// Rider Signup If api is for signup call signup
router.post("/signup", signupRider);
// Rider Login
router.post("/login", loginRider);
//Rider profile
router.get("/profile",protect,getRiderProfile)
//Rider getevent
router.get("/events",getAllEvents);
//Rider apply event
router.post("/apply/:eventId", protect,applyToEvent);

module.exports = router;
