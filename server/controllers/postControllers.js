const Post = require("../models/postModel.js");
const User = require("../models/userModel.js");

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    if (posts.length > 0) {
      res.status(200).json({ posts });
      return;
    }
    res.status(404).json({ message: "No posts found" });
    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOnePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      res.status(200).json({ post });
      return;
    }
    res.status(404).json({ message: "post not found" });
    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.userID);
    if (user) {
      res.status(200).json({ posts: user.posts });
      return;
    }
    res.status(404).json({ message: "User not found" });
    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const addPost = async (req, res) => {
  try {
    const { media, text } = req.body;
    const newPost = new Post({ media, text });
    const savedpost = await newPost.save();
    req.user.posts.push(savedpost);
    await req.user.save();
    res.status(201).json({ savedpost });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(req.user._id);
    const post = await Post.findById(id);
    if (user.posts.includes(id)) {
      await Post.findByIdAndDelete(id);

      res.status(200).json({ message: "deleted succesfully" });
      user.posts.pop(id);
      await user.save();
      await user.save();
      return;
    }
    res.status(404).json({ message: "This is not your post" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const likeDislikePost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);
    const user = await User.findById(req.user._id);
    if (post.likes.includes(user._id)) {
      post.likes.pop(user);
      await post.save();
      res.status(200).json({ message: "post disliked" });
      return;
    }
    post.likes.push(user);
    await post.save();
    res.status(200).json({ message: "post liked" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const commentPost = async (req, res) => {
  try {
    const id = req.params.id;
    const commentMessage = req.body.commentMessage;
    const user = await User.findById(req.user._id);
    const post = await Post.findById(id);
    const obj = { commenter: user, commentMessage };
    post.comments.push({ commenter: user, commentMessage });
    await post.save();
    res.status(200).json({ message: "comment added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentid = req.params.commentid;
    const postid = req.params.postid;
    const post = await Post.findById(postid);
    if (req.user.posts.includes(post)) {
      let check = 0;
      post.comments.map(async (comment) => {
        if (comment._id == commentid) {
          post.comments.pop(comment);
          check = 1;
          await post.save();
        }
      });

      if (check == 1) {
        res.status(200).json({ message: "comment deleted successfully" });
      } else {
        res.status(200).json({ message: "comment not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllPosts,
  getOnePost,
  getUserPosts,
  addPost,
  deletePost,
  likeDislikePost,
  commentPost,
  deleteComment,
};
