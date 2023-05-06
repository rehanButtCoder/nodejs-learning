const express = require("express");
const router = express.Router();
const path = require('path');
const multer = require("multer");
const uploadImage = require("../models/imageUpload");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const File = uploadImage;

router.post("/", upload.single("image"), async function (req, res) {
  // Save the file data to MongoDB
  // console.log("reqest " + req.body);
  const file = new File({
    filename: req.file.originalname
  });
  // path: req.file.path,
  // size: req.file.size,

  try {
    await file.save();
    res.json({ message: "File uploaded successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error uploading file" });
  }
  // await file.save(function (err) {
  //   if (err) {
  //   } else {
  //     res.json({ message: "File uploaded successfully" });
  //   }
  // });
  // res.json({ message: "File uploaded successfully" });
});

module.exports = router;
