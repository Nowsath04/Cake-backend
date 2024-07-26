const EmailVerificationModel = require("../models/EmailVerificationModel");
const userModel = require("../models/userModel");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_GMAIL, // Your Gmail address
    pass: process.env.NODEMAILER_PASSWORD, // Your Gmail password or app password
  },
});
exports.RegisterUser = async (req, res) => {
  const { name, email, DOB, password } = req.body;
  try {
    const existUser = await userModel.findOne({ email: email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = await userModel.create({
      name: name,
      email: email,
      password: password,
      DOB: DOB,
    });
    createotp(newUser, res);
  } catch (error) {
    console.log(error);
  }
};

/// create otp
const createotp = async ({ _id, email }, res) => {
  try {
    const otp = `${Math.round(1000 + Math.random() * 9000)}`;
    const mailOptions = {
      from: process.env.NODEMAILER_GMAIL,
      to: email,
      html: `<p>Enter <b>${otp}</b> in the app to verify your email address</p>
    <p>this code expire in 1 hour</p>`,
    };
    const saveotp = await EmailVerificationModel.create({
      userid: _id,
      OTP: otp,
      createdat: new Date(),
      expiresAt: new Date(new Date().getTime() + 60 * 60 * 1000),
    });
    res.status(200).json({
      message: "OTP sent successfully",
      otp: otp,
    });
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

// verify email

exports.VerifyEmail = async (req, res) => {
  const { otp, userid } = req.body;
  try {
    if (!otp || !userid) {
      return res.status(404).json({
        message: "Please provide OTP and UserID",
      });
    }
    const userOtprecords = await EmailVerificationModel.find({ userid });
    console.log(userOtprecords);
    if (userOtprecords.length <= 0) {
      return res.status(404).json({
        message: "User not found or OTP expired",
      });
    }
    const { expiresAt } = userOtprecords[0];
    const presentotp = userOtprecords[0].OTP;
    if (expiresAt < Date.now()) {
      await EmailVerificationModel.deleteMany({ userid });
      return res.status(404).json({
        message: "OTP expired",
      });
    }
    if (presentotp == otp) {
      await userModel.findByIdAndUpdate(userid, { emailVarifications: true });
      const user = await userModel.findById(userid);
      res.json({
        message: "Email verified successfully",
        user,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// login user

exports.LoginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    if (!user.emailVarifications) {
      return createotp(user, res);
    }

    res.json({ message: "Logged in successfully", user });
  } catch (error) {
    console.log(error);
  }
};
