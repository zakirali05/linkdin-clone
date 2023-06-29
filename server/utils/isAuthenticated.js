const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      res.status(200).json({ message: "Login First" });
      return;
    }
    const user = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(user);
    if (req.user) {
      next();
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = isAuthenticated;
