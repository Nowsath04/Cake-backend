const asyncHandler = require("../middleWare/trycatch");
const adminModel = require("../models/adminModel");

exports.AdminLogin=asyncHandler(async(req,res)=>{
const {email,pasword,name}=req.body
//check if user exist
const user=await adminModel
})