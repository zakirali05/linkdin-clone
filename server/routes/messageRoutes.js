const express = require("express");
const router = express.Router();
const Message = require("../models/messages.js");
const createMessage = async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    res.status(201).json({ savedMessage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
router.post("/", createMessage);
router.get(":conversationId", getMessages);

module.exports = router;
