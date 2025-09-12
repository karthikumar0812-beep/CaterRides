const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  riderIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
