const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatRoomId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "ChatRoom", 
    required: true 
  },
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", messageSchema);
