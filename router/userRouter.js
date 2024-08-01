const express = require("express")
const JwtVerification = require("../middleWare/JwtVerification");
const { RegisterUser, VerifyEmail, LoginUser, CreateNonce, CheckUser, Userlogout, Myprofile, UserDetails, AllUsers } = require("../controller/userController")

const router = express.Router()

router.get("/alluser", AllUsers)
router.post("/generate-nonce", CreateNonce)
router.post("/verify-login", CheckUser)
router.get("/myprofile", JwtVerification, Myprofile)
router.post("/user-details", JwtVerification, UserDetails)
router.get("/logout", Userlogout)
router.post("/register", RegisterUser)
router.post("/verify-email", VerifyEmail)
router.post("/login", LoginUser)

module.exports = router