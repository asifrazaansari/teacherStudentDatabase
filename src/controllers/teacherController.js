const teacherModel = require("../models/teacherModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const teacherRegister = async (req, res) => {
    try {
        const data = req.body

        const encryptPass = await bcrypt.hash(data.password, 10)
        data.password = encryptPass

        const saveData = await teacherModel.create(data)
        return res.status(201).send({ status: true, message: "Teacher register successfully", data: saveData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}


const login = async (req, res) => {
    try {
        const data = req.body

        const { email, password } = data

        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Please enter field to login" })

        const loggedInUser = await teacherModel.findOne({ email: email })
        if (!loggedInUser) return res.status(401).send({ status: false, message: "Please provide correct email" })

        const isValidPass = await bcrypt.compare(password, loggedInUser.password)
        if (!isValidPass) return res.status(401).send({ status: false, message: "Password is not correct" })

        const token = jwt.sign({ userId: loggedInUser._id }, "backend-task1", { expiresIn: "24h" })
        return res.status(200).send({ status: true, message: "Logged in successfully", data: token })   
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}


module.exports = { teacherRegister, login }