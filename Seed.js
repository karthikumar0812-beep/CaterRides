// npm install mongoose @faker-js/faker

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

// ✅ Replace <username>, <password>, <cluster-url> with your Atlas credentials
const MONGO_URI = "mongodb+srv://karthikumar0812:karthi%402005@cluster0.qbad6xz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(MONGO_URI, {
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

  console.log("🌱 Seeding 1,000 events for tomorrow...");

  // UTC midnight tomorrow
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);

  const events = [];

  for (let i = 0; i < 1000; i++) {
    events.push({
      title: faker.lorem.words(2),
      location: faker.location.city(),
      date: tomorrow,
      vacancies: faker.number.int({ min: 1, max: 20 }),
      negotiatePrice: faker.number.int({ min: 100, max: 1000 }),
      description: faker.lorem.sentence(),
      createdBy: new mongoose.Types.ObjectId(),
      applicants: [
        {
          rider: new mongoose.Types.ObjectId(),
          status: faker.helpers.arrayElement(["pending", "accepted", "rejected"]),
        },
      ],
    });
  }

  await Event.insertMany(events);
  console.log("✅ Inserted 1,000 events into Atlas!");
  mongoose.connection.close();
}

seedEvents().catch((err) => console.error(err));
