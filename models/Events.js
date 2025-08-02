const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  vacancies: {
    type: Number,
    required: true
  },
  negotiatePrice: {
    type: Number,
    required: true
  },
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organizer", 
    required: true
  },
  applicants: [
    {
      rider: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Events", eventSchema);
