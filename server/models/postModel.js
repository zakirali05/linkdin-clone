const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  media: {
    public_id: {
      type: String,
      requierd: true,
    },
    url: {
      type: String,
      requierd: true,
    },
  },
  text: {
    type: String,
    required: true,
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  comments: [
    {
      commenter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      commentMessage: {
        type: String,
        required: true,
      },
    },
  ],
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
