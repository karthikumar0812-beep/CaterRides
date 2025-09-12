const express = require("express");
const {
  createChatRoom,
  addRiderToRoom,
  getMessages,
  sendMessage
} = require("../controllers/chatController");

const router = express.Router();

// Create chat room
router.post("/create-room", createChatRoom);

// Add rider to room
router.post("/add-rider", addRiderToRoom);

// Get messages of a room
router.get("/:chatRoomId/messages", getMessages);

// Send message
router.post("/send-message", sendMessage);

module.exports = router;
