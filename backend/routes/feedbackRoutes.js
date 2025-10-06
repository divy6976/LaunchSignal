const express=require("express")
const {submitFeedback}=require("../controller/feedbackController")
const {isLoggedIn,isAdopter}=require("../middleware/auth")

const router=express.Router()

// Sirf logged-in adopter hi feedback de sakta hai
router.post('/', isLoggedIn, isAdopter, submitFeedback);

module.exports=router






