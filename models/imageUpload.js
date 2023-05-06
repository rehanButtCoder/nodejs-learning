const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
  }
);

const uploadImage = mongoose.model("uploadImage", imageSchema);

module.exports = uploadImage;
