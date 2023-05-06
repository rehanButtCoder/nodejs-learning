const mongoose = require("mongoose");
// always define id in type: mongoose.Schema.ObjectId becoz it will helpful for aggregation lookups
const studentSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.ObjectId, required: true },
    // user_id: { type: String, required: true },
    address: { type: String, required: true },
    post_Code: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const StudentDetail = mongoose.model("StudentDetail", studentSchema);

module.exports = StudentDetail;
