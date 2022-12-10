const express = require("express")
const router = express.Router()

router.get("/test-me", async function(req, res){
    return res.send({message: "working"})
})

router.all('/*', async function (req, res) {
    return res.status(400).send({ status: false, message: "Page not found" })
})

module.exports = router