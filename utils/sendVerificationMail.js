const nodemailer = require("nodemailer");

//     try {
//         // debugger
//         // sending bearer token for account verification
//         // also body1 is sent in because it is mandatory from backend to sent a structure for verification of email fact:body1 is undfined here
//         const config = {
//             headers: { Authorization: `Bearer ${body}` }
//         };
//         const response = await axios.post("/email/verification-notification",body1, config);
//         return response;
//     } catch (err) {
//         return err.response
//     }
// }
// create a function to send the verification email
function sendVerificationEmail(
  subject,
  receiverEmail,
  id,
  verificationToken,
  html
) {
  // create a nodemailer transporter with your email service provider settings
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
      to: receiverEmail,
      // to: "rehan.butt@jinnbyte.com",
      subject: subject,
      html:
        html ||
        `<p>Please click <a href="http://${process.env.DOMAIN_URL}/verification/${id}/${verificationToken}">here</a> to verify your email address.</p>`,
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
}

module.exports = sendVerificationEmail;
