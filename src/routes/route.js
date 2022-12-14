const express = require("express")
const router = express.Router()

//=================== Controllers require ===================//
const {teacherRegister, login} = require("../controllers/teacherController")
const {addStudent, studentDetails, updateStudent, deleteStudent} = require("../controllers/studentController")


//=================== Middleware =============//
const {authenticaion, authorization} = require("../middlewares/auth")


//==================== Teacher routes =======================//
router.post("/register", teacherRegister)
router.post('/login', login)

//==================== Student routes =======================//
router.post("/addStudent", authenticaion, addStudent)
router.get("/studentDetails/:userId", authenticaion, authorization, studentDetails)
router.put("/updateStudent/:userId", authenticaion, authorization, updateStudent)
router.delete("/deleteStudent/:userId", authenticaion, authorization, deleteStudent)


router.all('/*', async function (req, res) {
    return res.status(400).send({ status: false, message: "Page not found" })
})

module.exports = router