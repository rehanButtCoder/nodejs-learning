const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: [true,"Value not found"] },
    email: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    ssn: { type: Number, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    userRole: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
