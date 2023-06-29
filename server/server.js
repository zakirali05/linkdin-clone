const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1", userRoutes);
app.use("/api/v1", postRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () =>
  console.log(`Server started on localhost:${process.env.PORT}`)
);

// Register(DONE)
// Edit profile(DONE)
// Login(DONE)
// logout(DONE)
// get all users (DONE)
// get one user  (DONE)
// request connection(DONE)
// accept connection(DONE)
// reject connection(DONE)
// remove connection
// get my  profile(DONE)
// add post(DONE)
// delete post(DONE)
// like/dislike post(DONE)
// comment on post(DONE)
// delete comment(DONE)
// get all posts(DONE)
// get one post(DONE)
// get users all posts(DONE)
// delete acount(DONE)
// {chatting functionality later }
// {video call functionality later}
