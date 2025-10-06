const express=require("express")
const {signup,login,getProfile,logoutUser, googleLogin}=require("../controller/usercontroller")
const {isLoggedIn}=require("../middleware/auth")

const router=express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/google-login",googleLogin)
router.get("/getProfile",isLoggedIn,getProfile)
router.post("/logout",logoutUser)

module.exports = router