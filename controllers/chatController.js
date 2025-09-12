const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Messages");

// Create Chat Room (when organizer creates event)
const createChatRoom = async (req, res) => {
  try {
    const { eventId, organizerId } = req.body;

    let existingRoom = await ChatRoom.findOne({ eventId });
    if (existingRoom) {
      return res.status(200).json(existingRoom);
    }

    const newRoom = new ChatRoom({ eventId, organizerId, riderIds: [] });
    await newRoom.save();

    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add Rider to Chat Room (when organizer accepts rider)
const addRiderToRoom = async (req, res) => {
  try {
    const { chatRoomId, riderId } = req.body;

    const room = await ChatRoom.findByIdAndUpdate(
      chatRoomId,
      { $addToSet: { riderIds: riderId } }, // prevents duplicates
      { new: true }
    );

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all messages for a chat room
const getMessages = async (req, res) => {
  try {
    const { chatRoomId } = req.params;

    const messages = await Message.find({ chatRoomId })
      .populate("senderId", "name")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send message
const sendMessage = async (req, res) => {
  try {
    const { chatRoomId, senderId, text } = req.body;

    const newMessage = new Message({ chatRoomId, senderId, text });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createChatRoom,
  addRiderToRoom,
  getMessages,
  sendMessage
};
