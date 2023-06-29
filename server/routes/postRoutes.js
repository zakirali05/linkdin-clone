const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getOnePost,
  getUserPosts,
  addPost,
  deletePost,
  likeDislikePost,
  commentPost,
  deleteComment,
} = require("../controllers/postControllers.js");
const isAuthenticated = require("../utils/isAuthenticated.js");

router.get("/posts", getAllPosts);
router.get("/post/:id", getOnePost);
router.get("/user/:userID/posts", getUserPosts);
router.post("/addpost", isAuthenticated, addPost);
router.delete("/deletepost/:id", isAuthenticated, deletePost);
router.patch("/likepost/:id", isAuthenticated, likeDislikePost);
router.post("/comment/:id", isAuthenticated, commentPost);
router.delete(
  "/post/:postid/comment/:commentid",
  isAuthenticated,
  deleteComment
);

module.exports = router;
