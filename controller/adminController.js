const asyncHandler = require("../middleWare/trycatch");
const adminModel = require("../models/adminModel");
const ErrorHandler = require("../utils/ErrorHandler");
const bcrypt = require("bcrypt");
const createJwt = require("../utils/jwt");

exports.AdminRegister = asyncHandler(async (req, res, next) => {
  const { email, password, name } = req.body;
  console.log(req.body);
  //check if user exist
  const user = await adminModel.findOne({ email: email });

  if (user) {
    return next(new ErrorHandler("User already exist", 400));
  }
  const hashPassword = await bcrypt.hash(password, 10);
  console.log(hashPassword);
  const newUser = await adminModel.create({
    email: email,
    password: hashPassword,
    name: name,
  });
  createJwt(res, newUser);
});

exports.AdminLogin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    //check if user exist
    const user = await adminModel.findOne({ email: email });
  
    if (!user) {
      return next(new ErrorHandler("User not exist", 400));
    }
    const hashPassword = await bcrypt.compare(password, user.password);
    if (!hashPassword) {
      return next(new ErrorHandler("Incorrect password", 401));
    } 
    createJwt(res, user);
  });
  

