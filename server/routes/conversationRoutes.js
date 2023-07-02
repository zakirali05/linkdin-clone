const express = require("express");
const isAuthenticated = require("../utils/isAuthenticated");
const router = express.Router();
const Conversation = require("../models/conversation.js");
const createConversation = async (req, res) => {
  try {
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });
    const savedConversation = await newConversation.save();
    res.status(200).json({ savedConversation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getInConversation = async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userid] },
    });
    res.status(200).json({ conversation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

router.post("/", isAuthenticated, createConversation);
router.get("/:userid", isAuthenticated, getInConversation);
module.exports = router;
