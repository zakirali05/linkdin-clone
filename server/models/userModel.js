const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  avatar: {
    public_id: {
      type: String,
      requierd: true,
    },
    url: {
      type: String,
      requierd: true,
    },
  },
  emailaddress: {
    required: true,
    type: String,
    unique: [true, "email already exists"],
  },
  password: {
    required: true,
    type: String,
    min: 8,
    max: 20,
  },
  username: {
    required: true,
    type: String,
    unique: [true, "username already exists"],
  },
  bio: {
    type: String,
    max: 100,
  },
  occupation: {
    type: String,
    max: 50,
  },

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],

  connections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  about: {
    type: String,
    max: [500, "write a bio smaller than 500"],
  },
  requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
