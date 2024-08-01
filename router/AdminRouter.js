const express =require("express")
const { AdminLogin, AdminRegister } = require("../controller/adminController")

const router=express.Router()

router.post("/register",AdminRegister)
router.post("/login",AdminLogin)

module.exports=router