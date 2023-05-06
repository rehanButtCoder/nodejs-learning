const User = require("../models/Users");
// const Use1r = require("../views/pages/");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendVerificationEmail = require("../utils/sendVerificationMail");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  // validating
  if (!user) {
    return res.json("Invalid username or password");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.json("Invalid username or password");
  }
  // generating jsonwebtoken || json web token takes 3 values [data,key,expirytimeF]
  const token = jwt.sign(
    {
      id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
    },
    process.env.Token,
    {
      expiresIn: "30d",
    }
  );

  res.status(200).json({ data: user, token: token });
  //   else {
  //     res.send("not not working");
  //   }
};

// here I am joining studentDetail collection with Users

// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   // const user = await User.findOne({ email: email });
//   const user = await User.aggregate([
//     {
//       $match: { email: email },
//     },
//     {
//       $lookup: {
//         from: "studentdetails",
//         localField: "_id",
//         foreignField: "user_id",
//         as: "studentDetail",
//       },
//     },
//   ]);
//   console.log(user[0].password);
//   // validating
//   if (!user) {
//     return res.json("Invalid username or password");
//   }
//   const isPasswordValid = await bcrypt.compare(password, user[0].password);
//   // till up
//   if (!isPasswordValid) {
//     return res.json("Invalid username or password");
//   }
//   // generating jsonwebtoken || json web token takes 3 values [data,key,expirytimeF]
//   const token = jwt.sign(
//     {
//       id: user._id,
//       fname: user.fname,
//       lname: user.lname,
//       email: user.email,
//     },
//     process.env.Token,
//     {
//       expiresIn: "30d",
//     }
//   );

//   res.status(200).json({ data: user, token: token });
//   //   else {
//   //     res.send("not not working");
//   //   }
// };

// user verification
exports.verifyUser = async (req, res) => {
  // here we are verifying 2 times ,first we are checking token in that is sent in header and then we are checking token here which is send in url
  const { id, token } = req.params;
  if (!token) return res.status(401).json({ message: "Unauthenticated" });

  jwt.verify(token, process.env.Token, (err, user) => {
    if (err) return res.status(403).json({ message: "Token Expires" });
    console.log("sai token ha");
    // checking user
  });
  try {
    const userFound = await User.findById(id);
    if (!userFound) return res.status(401).json({ message: "User Not Found" });
    if (userFound.isVerified === true)
      return res.status(200).json({ message: "User's Already Verified" }); //means user is already verified
    // updateOne :first we find user then we update some fields then we set upsert to true so that in case if field is not found it should be added automaticaly
    const user = await User.updateOne(
      { _id: id },
      { isVerified: true },
      // { isVerified: new Date(Date.now()) },
      { upsert: true }
    );
    console.log(user);
    res.status(200).json({ message: "User's Verified", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  // finding user
  if (!user) {
    return res.json("Invalid Email");
  }
  // generating jsonwebtoken || json web token takes 3 values [data,key,expirytimeF]
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.Token,
    {
      expiresIn: "30d",
    }
  );
  // now sending email from which a user can render to reset password page
  // we will sending page link in which we will send id and token after which we will hit reset password api i.e {url}/reset-password/:id/:token 
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      // port: 487,
      // secure: false,
      auth: {
        user: "rehannbutt7@gmail.com",
        pass: "unnsajjlafbfxjmf",
      },
    });

    // create the email message
    let message = {
      from: "rehannbutt7@gmail.com",
      // to: receiverEmail,
      to: email,
      subject: "Forgot Password email",
      html: `<p>Please click <a href="http://${process.env.DOMAIN_URL}/reset-password/${user._id}/${token}">here</a> to reset your password</p>`,
    };

    // send the email
    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  } catch (err) {
    console.log(err);
  }

  // here as i m using backend thats why i m using postman only for forgot password
  // res.render("../");


  res.status(200).json({ message: "Reset password email sent successfully" });
};

exports.resetPassword = async (req, res) => {
  const { token, email, password, password_confirmation } = req.body
  // used tokenStatus variable so that on its basis we can add check becoz we know function k ander res.send ni use krnaa krwana 
  let tokenStatus = null;

  // function k ander res.send ni use krnaa krwana 
  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.json({ message: "We can't find a user with that email address." });
    // checking token exists
    if (!token) return res.status(401).json({ message: "Unauthenticated" });
    jwt.verify(token, process.env.Token, (err, user) => {
      // if (err) {
      //    res.status(403).json({ message: "Token Expires" });
      // }
      if (err) {
        tokenStatus = "expired";
      } else {
        tokenStatus = "valid";
      }
    });

    if (tokenStatus === "expired") {
      return res.status(403).json({ message: "Token Expires" });
    }
    // 
    if (password_confirmation !== password) return res.status(403).json({ message: "password and confirm_password fields not matches" });
    // hashing the password with a salt of 10 rounds
    const encrpytedPassword = bcrypt.hashSync(password, 10);
    // updateOne :first we find user then we update some fields then we can set upsert to true so that in case if field is not found it should be added automaticaly
    await User.updateOne(
      { email: email },
      { password: encrpytedPassword, confirmPassword: encrpytedPassword }
      // { isVerified: new Date(Date.now()) },
      // { upsert: true }
    );
    // console.log(resp);
    res.status(200).json({ message: "User's password is updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
}