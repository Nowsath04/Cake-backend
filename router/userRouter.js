const express=require("express")
const { RegisterUser, VerifyEmail, LoginUser } = require("../controller/userController")

const router=express.Router()

router.post("/register",RegisterUser)
router.post("/verify-email",VerifyEmail)
router.post("/login",LoginUser)

module.exports=router