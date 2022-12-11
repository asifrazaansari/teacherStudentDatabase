const jwt = require("jsonwebtoken")
const teacherModel = require("../models/teacherModel")


const authenticaion = async (req, res, next) => {
    try {
        let token = req.headers.authorization
        if (!token) return res.status(400).send({ status: false, message: "token is not present" })

        token = token.substring(7)
        if (!token) return res.status(400).send({ status: false, message: "token is not present" })

        jwt.verify(token, "backend-task1", (error, decodedToken) => {
            if (error) return res.status(401).send({ status: false, message: "token is invalid" })
            else {
                req.decodedToken = decodedToken
                next()
            }
        })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}



const authorization = async (req, res, next) => {
    try {
        let decoded = req.decodedToken
        let paramsUserId = req.params.userId

        const userId = await teacherModel.findById(paramsUserId)
        if (!userId) return res.status(404).send({ status: false, message: "User not found" })

        if (paramsUserId !== decoded.userId) return res.status(403).send({ status: false, message: "Not authorised" })

        next()
    } catch (error) {
        return res.status(500).send({status: false, message: error.message})
    }

}




module.exports = { authenticaion, authorization }