const studentModel = require("../models/studentModel")


const num = /^[0-9.]+$/
const aplhaNumeric = (value) => {
    const streetRegex = /^[a-zA-Z0-9 ]+$/
    if(value === undefined) return false
    if (streetRegex.test(value)) return true
}

const addStudent = async function (req, res) {
    try {
        const data = req.body
        const decoded = req.decodedToken

        //validations
        if (!aplhaNumeric(data.uniqueId)) return res.status(400).send({ status: false, message: "uniqueId should be present and in correct form" })
        if (!aplhaNumeric(data.studentName)) return res.status(400).send({ status: false, message: "studentName should be present and in correct form" })
        if (!aplhaNumeric(data.subject)) return res.status(400).send({ status: false, message: "subject should be present and in correct form" })
        if (!num.test(data.marks)) return res.status(400).send({ status: false, message: "marks should be present and in correct form" })

        let studentDetails = await studentModel.findOne({ uniqueId: data.uniqueId, teacher: decoded.userId, isDeleted: false })

        // adding new students
        if (!studentDetails) {
            studentDetails = new studentModel({
                uniqueId: data.uniqueId,
                studentName: data.studentName,
                subjectMarks: [{
                    subject: data.subject,
                    marks: Math.round(data.marks)
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
                    sub.marks += Math.round(data.marks)
                    const studentAdded = await studentDetails.save()
                    const resData = await studentAdded.populate({
                        path: 'teacher', select: { _id: 0, 'teacherName': 1 }
                    })
                    return res.status(200).send({ status: true, message: "Marks updated successfully", data: resData })
                }
            }
            //pushing new subject
            const pushSub = await studentModel.findOneAndUpdate({ uniqueId: data.uniqueId, teacher: decoded.userId, isDeleted: false }, {
                $push: { "subjectMarks": { subject: data.subject, marks: Math.round(data.marks) } },
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
        const data = req.query

        const filters = { teacher: userId }

        if (data.subject) {
            if (!aplhaNumeric(data.subject)) return res.status(400).send({ status: false, message: "subject should be in correct form" })
            filters.subjectMarks = { $elemMatch: { subject: data.subject } }
        }
        if (data.studentName) {
            if (!aplhaNumeric(data.studentName)) return res.status(400).send({ status: false, message: "studentName should be in correct form" })
            filters.studentName = data.studentName
        } else if (!data.subject && !data.studentName && Object.keys(data).length > 0) {
            return res.status(400).send({ status: false, message: "filters should only be name or subject" })
        }

        const studentData = await studentModel.find(filters).populate({
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

const updateStudent = async function (req, res) {
    try {
        const usrerId = req.params.userId
        const data = req.body

        //validations
        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "please provide a field to update" })
        if (!aplhaNumeric(data.uniqueId)) return res.status(400).send({ status: false, message: "uniqueId should be present and in correct form" })

        if (data.studentName) {
            if (!aplhaNumeric(data.studentName)) return res.status(400).send({ status: false, message: "studentName should be in correct form" })
        }

        if (data.subject) {
            if (!aplhaNumeric(data.subject)) return res.status(400).send({ status: false, message: "subject should be in correct form" })
        }

        const student = await studentModel.findOneAndUpdate({ uniqueId: data.uniqueId, teacher: usrerId, isDeleted: false }, {
            $pull: { "subjectMarks": { subject: data.subject } },
            studentName: data.studentName,
        }, { new: true }).populate({
            path: 'teacher', select: { _id: 0, 'teacherName': 1 }
        })

        if (!student) return res.status(404).send({ status: false, message: "no student found" })

        return res.status(200).send({ status: true, message: "updated successfully", data: student })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

const deleteStudent = async function (req, res) {
    try {
        const userId = req.params.userId
        const data = req.query

        if (!aplhaNumeric(data.uniqueId)) return res.status(400).send({ status: false, message: "uniqueId should be present and in correct form" })
        if (!aplhaNumeric(data.studentName)) return res.status(400).send({ status: false, message: "studentName should be present and in correct form" })
        const deleteUser = await studentModel.findOneAndUpdate({ teacher: userId, isDeleted: false, studentName: data.studentName, uniqueId: data.uniqueId },
            { isDeleted: true }
        )

        if (!deleteUser) return res.status(404).send({ status: false, message: "no user found" })
        return res.status(200).send({ status: true, message: "deleted successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { addStudent, studentDetails, updateStudent, deleteStudent }