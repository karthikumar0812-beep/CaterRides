// npm install mongoose @faker-js/faker

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const MONGO_URI =
  "mongodb+srv://karthikumar0812:karthi%402005@cluster0.qbad6xz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const eventSchema = new mongoose.Schema(
  {
    title: String,
    location: String,
    date: Date,
    vacancies: Number,
    negotiatePrice: Number,
    description: String,
    createdBy: mongoose.Schema.Types.ObjectId,
    applicants: [
      {
        rider: mongoose.Schema.Types.ObjectId,
        status: String,
      },
    ],
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

async function seedEvents() {
  console.log("🗑️ Deleting old events...");
  await Event.deleteMany({}); // delete all existing events

  const events = [];

  // Generate events for the next 7 days
  for (let d = 1; d <= 7; d++) {
    const eventDate = new Date();
    eventDate.setUTCDate(eventDate.getUTCDate() + d); // future day
    eventDate.setUTCHours(0, 0, 0, 0);

    for (let i = 0; i < 100; i++) {
      events.push({
        title: faker.lorem.words(2),
        location: faker.location.city(),
        date: eventDate,
        vacancies: faker.number.int({ min: 1, max: 20 }),
        negotiatePrice: faker.number.int({ min: 100, max: 1000 }),
        description: faker.lorem.sentence(),
        createdBy: new mongoose.Types.ObjectId(),
        applicants: [
          {
            rider: new mongoose.Types.ObjectId(),
            status: faker.helpers.arrayElement([
              "pending",
              "accepted",
              "rejected",
            ]),
          },
        ],
      });
    }
  }

  console.log(`🌱 Seeding ${events.length} events for upcoming days...`);
  await Event.insertMany(events);
  console.log("✅ Done! Inserted events into Atlas.");
  mongoose.connection.close();
}

seedEvents().catch((err) => console.error(err));
