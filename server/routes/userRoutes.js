const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getOneUser,
  register,
  login,
  logout,
  editUser,
  myProfile,
  deleteAccount,
  putRequest,
  acceptRequest,
  rejectRequest,
  removeConnection,
} = require("../controllers/userControllers.js");

const isAuthenticated = require("../utils/isAuthenticated.js");

router.get("/users", getAllUsers);
router.get("/user/:id", getOneUser);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.patch("/update", isAuthenticated, editUser);
router.get("/myprofile", isAuthenticated, myProfile);
router.delete("/deleteaccount", isAuthenticated, deleteAccount);
router.post("/putrequest/:id", isAuthenticated, putRequest);
router.post("/acceptrequest/:id", isAuthenticated, acceptRequest);
router.post("/rejectrequest/:id", isAuthenticated, rejectRequest);
router.patch("/removeconnection/:id", isAuthenticated, removeConnection);

module.exports = router;
