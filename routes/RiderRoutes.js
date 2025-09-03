const express = require("express");
const router = express.Router();

const { createOTP,signupRider, loginRider ,getRiderProfile} = require("../controllers/riderController");
const { getAllEvents } = require("../controllers/EventController");
const { applyToEvent }=require("../controllers/ApplicationController");
const { Eventinfo }=require("../controllers/Eventinfo");
const {forgotPasswordVerify,resetPassword}=require("../controllers/Forgot-password");
const {protect}=require("..//middlewares/authMiddleware");

//this function will generate a otp
router.post("/send-otp",createOTP);
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
//Event info for confirmed events
router.get("/eventinfo/:eventId",protect,Eventinfo);
//forgot password-verify
router.post("/forgot-password", forgotPasswordVerify);
router.post("/reset-password", resetPassword);

module.exports = router;

