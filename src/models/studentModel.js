const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const studentSchema = new mongoose.Schema({
    uniqueId: {
        type: String,
        required: true,
        trim: true
    },
    studentName: {
        type: String,
        required: true,
        trim: true
    },
    subjectMarks: [
        {
            _id: false,
            subject: {
                type: String,
                required: true,
                trim: true
            },
            marks: {
                type: Number,
                require: true,
                trim: true
            },
        },
    ],
    teacher: {
        type: ObjectId,
        ref: "teacherList"
    }
}, { timestamps: true })

module.exports = mongoose.model("Student", studentSchema)