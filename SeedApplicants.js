// seedApplicants.js
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const Event = require("./models/Events"); // adjust path
const User = require("./models/User");   // adjust path

const MONGO_URI =   "mongodb+srv://karthikumar0812:karthi%402005@cluster0.qbad6xz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const EVENT_ID = "68b96ab3c88018fd60351c45"; // your event id

async function seedApplicants() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to DB");

    const event = await Event.findById(EVENT_ID);
    if (!event) {
      console.log("❌ Event not found");
      return;
    }

    let fakeUsers = [];

    // 1️⃣ Create 50 fake users
    for (let i = 0; i < 50; i++) {
      const user = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        role:"rider",
        password: "hashedpassword", // or anything dummy
      });
      await user.save();
      fakeUsers.push(user);

      // 2️⃣ Push applicant into event
      event.applicants.push({ rider: user._id, status: "pending" });

      // 3️⃣ Push appliedEvents into user
      user.appliedEvents.push({
        eventId: event._id,
        status: "pending",
        appliedAt: new Date(),
      });
      await user.save();
    }

    // Save event after all applicants added
    await event.save();

    console.log("🎉 Successfully added 50 fake applicants!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding applicants:", error);
    process.exit(1);
  }
}

seedApplicants();
