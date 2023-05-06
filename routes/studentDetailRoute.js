const express = require("express");
const {
  createStudentDetail,
  getAllStudentDetails,
  getSingleStudentDetail,
} = require("../controllers/studentDetailsController");
const router = express.Router();

router.post("/", createStudentDetail);
// get all routes
router.get("/", getAllStudentDetails);
// getting single user
router.get("/:id", getSingleStudentDetail);

module.exports = router;
