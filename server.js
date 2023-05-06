const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const connectDB = require("./connection/db.js");
require("dotenv").config();
const {
  login,
  verifyUser,
  forgotPassword,
  resetPassword,
} = require("./controllers/authController.js");
const userRoutes = require("./routes/userRoutes.js");
const studentDetailRoutes = require("./routes/studentDetailRoute.js");
const imageUploadRoute = require("./routes/imageUploadRoute.js");
const sendMailRoute = require("./routes/sendMailRoute.js");
const verifyToken = require("./middlewares/verifytoken.js");

// handling post + images request + cors
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// by adding below middleware we are able to load assets in browser http://localhost:5000/public/images/[imageName]
app.use("/public", express.static("public"));
app.set("view engine", "ejs");

// connection
connectDB();
// multer
// res.render('pages/index');

// routes
app.get("/", (req, res) => {
  // res.send("Hello World!");
  // res.render('pages/index');
  var mascots = [
    { name: "Sammy", organization: "DigitalOcean", birth_year: 2012 },
    { name: "Tux", organization: "Linux", birth_year: 1996 },
    { name: "Moby Dock", organization: "Docker", birth_year: 2013 },
  ];
  var tagline =
    "No programming concept is complete without a cute animal mascot.";

  res.render("pages/index", {
    mascots: mascots,
    tagline: tagline,
  });
});
app.use("/users", userRoutes);
app.use("/student-detail", studentDetailRoutes);
app.use("/upload-image", imageUploadRoute);
app.use("/send-mail", verifyToken, sendMailRoute);
app.get("/verify-user/:id/:token", verifyToken, verifyUser);
app.post("/forgot-password", forgotPassword);
// app.get("/reset-password/:id/:token", (req, res) => {
//   res.render("pages/form")
// });
app.post("/reset-password", resetPassword);
// auth
app.post("/login", login);

// console.log(new Date(Date.now()));
// Global error handling middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});