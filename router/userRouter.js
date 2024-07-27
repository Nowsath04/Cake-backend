const express = require("express")
const { RegisterUser, VerifyEmail, LoginUser, CreateNonce } = require("../controller/userController")

const router = express.Router()

router.post("/generate-nonce", CreateNonce)
// router.post("/verify-login", CheckUser)
router.post("/register", RegisterUser)
router.post("/verify-email", VerifyEmail)
router.post("/login", LoginUser)

module.exports = router