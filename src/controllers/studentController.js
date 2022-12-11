const studentModel = require("../models/studentModel")


const addStudent = async function (req, res) {
    try {
        const data = req.body
        const decoded = req.decodedToken

    
        let studentDetails = await studentModel.findOne({ uniqueId: data.uniqueId, teacher: decoded.userId })

        // adding new students
        if (!studentDetails) {
            studentDetails = new studentModel({
                uniqueId: data.uniqueId,
                studentName: data.studentName,
                subjectMarks: [{
                    subject: data.subject,
                    marks: data.marks
                }],
                teacher: decoded.userId,
            })

            const studentAdded = await studentDetails.save()
            const resData = await studentAdded.populate({
                path: 'teacher', select: { _id: 0, 'teacherName': 1 }
            })
            return res.status(201).send({ status: true, message: "Student added successfully", data: resData })
        } else {
            //updating marks
            for (let i = 0; i < studentDetails.subjectMarks.length; i++) {
                let sub = studentDetails.subjectMarks[i]
                if (sub.subject === data.subject) {
                    sub.marks += data.marks
                    const studentAdded = await studentDetails.save()
                    const resData = await studentAdded.populate({
                        path: 'teacher', select: { _id: 0, 'teacherName': 1 }
                    })
                    return res.status(200).send({ status: true, message: "Marks updated successfully", data: resData })
                }
            }
            //pushing new subject
            const pushSub = await studentModel.findOneAndUpdate({ uniqueId: data.uniqueId, teacher: decoded.userId }, {
                $push: { "subjectMarks": { subject: data.subject, marks: data.marks } },
            }, { new: true }).populate({
                path: 'teacher', select: { _id: 0, 'teacherName': 1 }
            })
            return res.status(200).send({ status: true, message: "subject added successfully", data: pushSub })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const studentDetails = async function (req, res) {
    try {
        const userId = req.params.userId

        const studentData = await studentModel.find({ teacher: userId }).populate({
            path: 'teacher', select: { _id: 0, 'teacherName': 1 }
        })

        if (studentData.length === 0) {
            return res.status(404).send({ status: false, message: "No student found" })
        }

        return res.status(200).send({ status: true, message: "students detail", count: studentData.length, data: studentData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
}

module.exports = { addStudent, studentDetails }