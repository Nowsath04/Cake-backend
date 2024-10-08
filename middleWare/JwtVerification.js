
const jwt = require("jsonwebtoken")
const trycatch = require("./trycatch")
const ErrorHandler = require("../utils/ErrorHandler")
const userModel = require("../models/userModel")


const JwtVerification = trycatch(async (req, res, next) => {
  const token = req.cookies.token
  if (!token) {
    return next(new ErrorHandler(" you are Unauthorized", 401))
  }
  jwt.verify(token, process.env.SECRET_key, async (err, decoded) => {
    if (err) {
      return next(new ErrorHandler("Invalied Token", 403))
    }
    req.user = await userModel.findById(decoded.userId)
    next()
  })
})

module.exports = JwtVerification