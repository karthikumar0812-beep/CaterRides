// install dependencies first:
// npm install mongoose @faker-js/faker

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

// ✅ MongoDB connection
mongoose.connect("mongodb://localhost:27017/caterrides", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
  await Event.deleteMany({}); // <-- deletes all existing events

  console.log("🌱 Seeding 10,000 events...");

  let events = [];

  for (let i = 0; i < 10000; i++) {
    events.push({
      title: faker.lorem.words(2),
      location: faker.location.city(),
      date: faker.date.future(),
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

  await Event.insertMany(events);
  console.log("✅ Inserted 10,000 fresh events!");
  mongoose.connection.close();
}

seedEvents().catch((err) => console.error(err));
