const User = require("../models/Users");
const StudentDetail = require("../models/studentDetail");
const mongoose = require("mongoose");

exports.createStudentDetail = async (req, res) => {
  try {
    await User.findById(req.body.user_id);
    // if User.findById then ok otherwise it will automatically catches error
    const userFound = await StudentDetail.findOne({
      user_id: req.body.user_id,
    });
    if (userFound) {
      return res.status(400).send({ message: "User already exits" });
    }
    const newStudentDetail = new StudentDetail(req.body);
    const resp = await newStudentDetail.save();
    res.status(200).json({ data: resp });
  } catch (err) {
    res.status(403).json({ message: "User not found" });
  }
};

exports.getAllStudentDetails = async (req, res) => {
  try {
    // const resp = await StudentDetail.find({});
    // localField is from StudentDetail collection || foreignField is from users collection
    const resp = await StudentDetail.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userData",
        },
      },
    ]);
    res.status(200).json({ data: resp });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// get single Student detail
exports.getSingleStudentDetail = async (req, res) => {
  try {
    const id = req.params.id;
    // const resp = await StudentDetail.findById(id);
    // localField is from StudentDetail collection || foreignField is from users collection
    const resp = await StudentDetail.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userData",
        },
      },
    ]);
    res.status(200).json({ data: resp });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
};
