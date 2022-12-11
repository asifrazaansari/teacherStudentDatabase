const express = require("express")
const router = express.Router()

//=================== Controllers require ===================//
const {teacherRegister, login} = require("../controllers/teacherController")
const {addStudent, studentDetails} = require("../controllers/studentController")


//=================== Middlewares, validations =============//
const {authenticaion, authorization} = require("../middlewares/auth")
const {} = require("../validators/validation")


//==================== Teacher routes =======================//
router.post("/register", teacherRegister)
router.post('/login', login)

//==================== Student routes =======================//
router.post("/addStudent", authenticaion, addStudent)
router.get("/studentDetails/:userId", authenticaion, authorization, studentDetails)

router.all('/*', async function (req, res) {
    return res.status(400).send({ status: false, message: "Page not found" })
})

module.exports = router