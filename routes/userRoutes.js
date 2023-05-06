const express = require("express");
const User = require("../models/Users");
const router = express.Router();
const bcrypt = require("bcrypt");
const verifyToken = require("../middlewares/verifytoken");

router.post("/", async (req, res) => {

  const { password, confirmPassword } = req.body;
  if (confirmPassword === password) {
    // hashing the password with a salt of 10 rounds
    const encrpytedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      imageUrl: req.body.imageUrl,
      ssn: req.body.ssn,
      phoneNumber: req.body.phoneNumber,
      password: encrpytedPassword,
      confirmPassword: encrpytedPassword,
      userRole: req.body.userRole,
    });
    try {
      const resp = await newUser.save();
      res.status(200).json({ data: resp });
    } catch (err) {
      console.log(err);
      res.status(404).json({ message: err.message });
    }
  } else {
    res.status(401).json({ message: "Password not matches" });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const resp = await User.find({});
    res.status(200).json({ data: resp });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// getting single user

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const resp = await User.findById(id);
    res.status(200).json({ data: resp });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// update call

router.put("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const includesUser = await User.findById(id);
  if (includesUser) {
    const data = {
      fname: req.body.fname,
      lname: req.body.lname,
      imageUrl: req.body.imageUrl,
      ssn: req.body.ssn,
      phoneNumber: req.body.phoneNumber,
    };
    try {
      const resp = await User.findByIdAndUpdate(id, data, { new: true });
      res.status(200).json({ data: resp });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// delete call
router.delete("/:id", verifyToken, async (req, res) => {
  const includesUser = await User.findById(req.params.id);
  if (includesUser) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ data: "User has been removed" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

module.exports = router;
