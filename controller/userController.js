const asyncHandler = require("../middleWare/trycatch");
const EmailVerificationModel = require("../models/EmailVerificationModel");
const userModel = require("../models/userModel");
const nodemailer = require("nodemailer");
const ErrorHandler = require("../utils/ErrorHandler");
const createJwt = require("../utils/jwt")
const ethUtil = require('ethereumjs-util');
const { recoverPersonalSignature } = require("eth-sig-util");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_GMAIL, // Your Gmail address
    pass: process.env.NODEMAILER_PASSWORD, // Your Gmail password or app password
  },
});



// Create Nonce
exports.CreateNonce = asyncHandler(async (req, res, next) => {
  const nonce = Math.floor(Math.random() * 1000000).toString();
  const userid = req.body.userid;
  console.log(userid);
  const user = await userModel.findOne({ userid })
  if (!userid) {
    return next(new ErrorHandler("userid is needed", 401))
  }
  try {
    if (!user) {
      const user = await userModel.create({ userid, nonce: nonce });
      return res.status(200).json({
        user
      })
    } else {
      const existUser = await userModel.findOneAndUpdate({ nonce, new: true })
      const user = await userModel.findOne({ userid })
      return res.json({
        user
      })
    }
  } catch (error) {
    console.log(error);
  }

})

// Verify User 
exports.CheckUser = asyncHandler(async (req, res, next) => {
  const { nonce, signature, userid } = req.body

  console.log(req.body);

  try {

    const updatedUser = await userModel.findOne({ $and: [{ "nonce": nonce }, { "userid": userid },] })

    if (!updatedUser) {
      return next(new ErrorHandler("User not found", 401));
    }
    const msg = `Welcome to Cake\n\nThis request will not trigger a blockchain\ntransaction or cost any gas fees.\n\nYour authentication status will reset after 24 hours.\n\nWallet address:${updatedUser.userid}\nNonce:${updatedUser.nonce}`;
    const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'));
    const address = recoverPersonalSignature({
      data: msgBufferHex,
      sig: signature,
    });

    if (address.toLowerCase() === userid.toLowerCase()) {
      createJwt(res, updatedUser)
    } else {
      res.status(401).send({
        error: "Signature verification failed"
      })
      return null;
    }

    updatedUser.nonce = Math.floor(Math.random() * 1000000).toString();
    await updatedUser.save()

  } catch (error) {
    console.log(error);
  }

})

// Get User Profile
exports.Myprofile = asyncHandler(async (req, res, next) => {
  let user = req.user
  console.log(req.user);
  user = await userModel.findById(req.user.id)
  console.log(user);
  res.status(201).json({
    success: true,
    user
  })
})



// LogOut
exports.Userlogout = asyncHandler(async (req, res) => {
  res.clearCookie('token').json({
    success: true,
    message: "logout successfully",
  })
})



// User Details All
exports.AllUsers = asyncHandler(async (req, res) => {
  const alluser = await userModel.find({})
  return res.status(201).json({
    success: true,
    alluser
  })
});


// exports.UserDetails = async (req, res) => {
//   const { name, email, dateofbirth, phoneno } = req.body;
//   try {
//     const existUser = await userModel.findOne({ email: email });
//     if (existUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     const newUser = await userModel.create({
//       name: name,
//       email: email,
//       phoneno: phoneno,
//       dateofbirth: dateofbirth,
//     });
//     // createotp(newUser, res);
//   } catch (error) {
//     console.log(error);
//   }
// };

// User Details
exports.UserDetails = asyncHandler(async (req, res) => {

  const { name, email, dateofbirth, phoneno } = req.body;
  console.log(req.user.id);
  try {
    const existUser = await userModel.findOne({ email: email });
    const user = await userModel.findByIdAndUpdate(req.user.id, { name, email, dateofbirth, phoneno })
    return res.status(201).json({
      success: true,
      user
    })
  } catch (error) {
    console.log(error);
  }
});


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
