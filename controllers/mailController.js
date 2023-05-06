const sendVerificationEmail = require("../utils/sendVerificationMail");
const jwt = require("jsonwebtoken");

exports.sendMail = async (req, res) => {
  // first token will be verified and then we will get in this code
  // we will generate a new toekn and send it to frontend for verification by generating a link like app/:id/:token
  // req.user is the user token that is sent from frontend,its contain info about current user and its coming from verifyToken function

  const token = jwt.sign(
    {
      id: req.user.id,
    },
    process.env.Token,
    {
      expiresIn: "1d",
    }
  );
  
  sendVerificationEmail(
    "Welcome To Our Website",
    req.user.email,
    req.user.id,
    token,
    "We Welcome you for signing up here.Hope It will baneficial for us"
  );
  sendVerificationEmail(
    "Verify your email address",
    req.user.email,
    req.user.id,
    token
  );
  res.send("success");
};
