const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Event = require("./models/Events"); // adjust path if needed

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Connection error:", err));

const seedEvents = async () => {
  try {
    // Remove old events
    await Event.deleteMany({});
    console.log("🗑️ Old events deleted");

    // dummy userId (replace with a real User _id from your DB if you want)
    const dummyUserId = new mongoose.Types.ObjectId();

    // Generate 1000 dummy events first (test)
    const events = [];
    const today = new Date();
for (let i = 1; i <= 10000; i++) {
  const eventDate = new Date();
  eventDate.setDate(today.getDate() + Math.floor(Math.random() * 30)); // next 30 days

  events.push({
    title: `Event ${i}`,
    description: `This is description for event ${i}`,
    location: `Location ${i}`,
    date: eventDate,
    vacancies: Math.floor(Math.random() * 20) + 1,
    negotiatePrice: Math.floor(Math.random() * 500) + 100,
    createdBy: dummyUserId,
    applicants: [],
  });
}


    await Event.insertMany(events, { ordered: false });
    console.log(`✅ Inserted ${events.length} events!`);
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedEvents();
