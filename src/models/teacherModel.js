const mongoose = require("mongoose")

const teacherSchema = new mongoose.Schema({
    uniqueId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    teacherName: {
        type: String,
        required: true,
        trim: true
    },
    email :{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password :{
        type: String,
        required: true,
        minLen: 8,
        maxLen: 15,
        trim: true
    }
}, { timestamps: true })


module.exports = mongoose.model("teacherList", teacherSchema)