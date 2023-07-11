const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cloudinary = require("../utils/cloudinary.js");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length > 0) {
      res.status(200).json({ users });
      return;
    }
    res.status(404).json({ message: "No users found" });
    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOneUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(201).json({ user });
      return;
    }
    res.status(404).json({ message: "User not found" });
    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const register = async (req, res) => {
  try {
    const { avatar, emailaddress, password, username, bio, occupation, about } =
      req.body;
    const result = cloudinary.uploader.upload(avatar, {
      folder: "avatars",
    });
    const newUser = new User({
      avatar: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      emailaddress,
      password: await bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
      username,
      bio,
      occupation,
      about,
    });

    const savedUser = await newUser.save();
    const token = jwt.sign(savedUser.id, process.env.JWT_SECRET);
    res.cookie("token", token);

    res
      .status(201)
      .json({ savedUser, token, message: "User created succesfully" });
    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { emailaddress, password } = req.body;
    const user = await User.findOne({ emailaddress });
    if (user) {
      if (await bcrypt.compareSync(password, user.password)) {
        const token = await jwt.sign(user.id, process.env.JWT_SECRET);
        res.cookie("token", token);
        res.status(200).json({ user, token, message: "Logged in succesfully" });
        return;
      }
      res.status(500).json({ message: "Invalid credentials" });
      return;
    }
    res.status(404).json({ message: "user not found" });
    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const logout = async (req, res) => {
  try {
    if (res.cookie("token")) {
      res.clearCookie("token");
      res.status(200).json({ message: "logged out succesfully" });
      return;
    }
    res.status(200).json({ message: "logged out already" });
    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const editUser = async (req, res) => {
  try {
    const { avatar, emailaddress, password, username, bio, about, occupation } =
      req.body;
    const result = await cloudinary.uploader.upload(avatar, {
      folder: "avatars",
    });
    const user = await User.findByIdAndUpdate(req.user._id, {
      avatar: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      emailaddress,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
      username,
      bio,
      about,
      occupation,
    });
    await user.save();
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      return res.status(200).json({ user: req.user });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      await User.deleteOne(user);
      res.status(200).json({ message: "Your account has been deleted" });
    } else {
      res.status(404).json({ message: "Your account not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const putRequest = async (req, res) => {
  try {
    const sender = await User.findById(req.user._id);
    const receiver = await User.findById(req.params.id);
    if (receiver) {
      receiver.requests.push(sender);
      await receiver.save();
      res.status(200).json({ message: "connection request sent successfully" });
      return;
    }
    res.status(404).json({ message: "user not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const sender = await User.findById(req.params.id);
    const acceptor = await User.findById(req.user._id);

    acceptor.requests.pop(sender);
    sender.connections.push(acceptor);
    acceptor.connections.push(sender);
    await sender.save();
    await acceptor.save();
    res.status(200).json({ message: "Request accepted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const sender = await User.findById(req.params.id);
    const rejecter = await User.findById(req.user._id);

    rejecter.requests.pop(sender);
    await sender.save();
    await acceptor.save();
    res.status(200).json({ message: "Request rejected " });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeConnection = async (req, res) => {
  try {
    const remover = await User.findById(req.user._id);
    const toberemoved = await User.findById(req.params.id);
    remover.connections.pop(toberemoved);
    toberemoved.connections.pop(remover);

    await remover.save();
    await toberemoved.save();
    res.status(200).json({ message: "Connection removed " });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
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
};
