const Teacher = require('../models/Teacher');
const jwt = require('jsonwebtoken');

const createToken = (_id, role) => {
    return jwt.sign({ _id, role }, process.env.SECRET, { expiresIn: "3d" });
};

const getRegno = async (firstName, lastName, subject) => {
    const lowerFirstName = firstName.toLowerCase().replace(/\s+/g, '');
    const lowerLastName = lastName.toLowerCase().replace(/\s+/g, '');
    const lowerSubject = subject.toLowerCase().replace(/\s+/g, '');
    return `${lowerFirstName}${lowerLastName}.${lowerSubject.substring(0, 2)}`;
};

const fetchOne = async (req, res) => {
    const { id } = req.params;

    try {
        const teacher = await Teacher.findById(id);
        if (!teacher) {
            return res.status(404).json({ msg: "No such teacher found!" });
        }

        return res.status(200).json(teacher);
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
};

const loginTeacher = async (req, res) => {
    const { regno, password } = req.body;

    try {
        const teacher = await Teacher.login(regno, password);
        const token = createToken(teacher._id, teacher.role);
        res.status(200).json({
            _id: teacher._id,
            firstName: teacher.firstName,
            role: teacher.role,
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const signupTeacher = async (req, res) => {
    try {
        const regno = await getRegno(req.body.firstName, req.body.lastName, req.body.subject);
        const teacher = await Teacher.signup({ ...req.body, role: "teacher", regno });
        const token = createToken(teacher._id, teacher.role);
        res.status(200).json({ ...teacher, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const fetchCurrentTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.teacher._id).select("-password");

        if (!teacher) {
            return res.status(404).json({ error: "Teacher not found!" });
        }

        return res.json(teacher);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve teacher!" });
    }
};

module.exports = {
    signupTeacher,
    loginTeacher,
    fetchOne,
    fetchCurrentTeacher
};