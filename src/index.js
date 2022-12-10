require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const route = require("./routes/route")
const app = express()


app.use(express.json())


const port = process.env.PORT
const mongodbUrl = process.env.MONGODB_URL

mongoose.connect(mongodbUrl)
    .then(() => console.log("MongoDB is connected"))
    .catch((err) => console.log(err))


app.use('/', route)

app.listen(port, () => console.log("Express is running on " + port))
