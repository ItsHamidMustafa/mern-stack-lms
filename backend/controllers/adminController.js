const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Department = require('../models/Department');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const createToken = (_id, role) => {
    return jwt.sign({ _id, role }, process.env.SECRET, { expiresIn: "3d" });
};

const getUid = async (firstName, lastName) => {
    const lowerFirstName = firstName.toLowerCase().replace(/\s+/g, '');
    const lowerLastName = lastName.toLowerCase().replace(/\s+/g, '');
    return `${lowerFirstName}${lowerLastName}.admin`;
};

const getTeacherUid = async (firstName, lastName, departmentId) => {
    const lowerFirstName = firstName.toLowerCase().replace(/\s+/g, '');
    const lowerLastName = lastName.toLowerCase().replace(/\s+/g, '');
    const departmentDoc = await Department.findById(departmentId);
    if (!departmentDoc) {
        throw new Error(`Department with ID '${departmentId}' not found`);
    }
    const departmentSlug = departmentDoc.slug.toLowerCase();
    return `${lowerFirstName}${lowerLastName}.${departmentSlug}`;
};

// ------------ ADMIN CONTROLLERS
const loginAdmin = async (req, res) => {
    const { uid, password } = req.body;

    try {
        const admin = await Admin.login(uid, password);
        const token = createToken(admin._id, admin.role);
        res.status(200).json({
            _id: admin._id,
            firstName: admin.firstName,
            role: admin.role,
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const signupAdmin = async (req, res) => {
    try {
        const uid = await getUid(req.body.firstName, req.body.lastName);
        const admin = await Admin.signup({ ...req.body, role: "admin", uid });
        const token = createToken(admin._id, admin.role);
        res.status(200).json({ ...admin, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// ------------ TEACHER CONTROLLERS
const createTeacher = async (req, res) => {
    try {
        const uid = await getTeacherUid(req.body.firstName, req.body.lastName, req.body.department);
        const teacher = await Teacher.signup({ ...req.body, uid });
        res.status(200).json(teacher);
    } catch (err) {
        res.status(400).json({ msg: 'We got an error', err });
    }
}

const updateTeacher = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Teacher not found!" });
    }

    const updatedTeacher = {
        name: req.body.name,
        dob: req.body.dob,
        fatherName: req.body.fatherName,
        gender: req.body.gender
    }

    try {
        const teacher = await Teacher.findByIdAndUpdate(id, updatedTeacher, { new: true });
        res.status(200).json(teacher);
    } catch (error) {
        res.status(400).json(error);
    }
}

const deleteTeacher = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Teacher not found!" });
    }

    const exist = await Teacher.find({ id });
    if (exist) {
        try {
            await Teacher.findByIdAndDelete(id);
            res.status(200).json({ msg: "Teacher deleted successfully and associated courses updated!" });
        } catch (error) {
            res.status(400).json(error);
        }
    } else {
        return res.status(400).json({ error: "No such teacher exists!" });
    }

}

const fetchAllTeachers = async (req, res) => {
    const teachers = await Teacher.find().sort({ created_at: -1 });
    if (!teachers) {
        return res.status(200).json({ msg: "No teacher found!" });
    }

    return res.status(200).json(teachers);
}



// ---------------- STUDENT CONTROLLERS ------------------
const approveStudent = async (req, res) => {
    const { id } = req.params;

    try {
        const student = await Student.findByIdAndUpdate(
            id,
            { accountStatus: "active" },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.status(200).json({ message: "Student approved successfully", student });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    loginAdmin,
    signupAdmin,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    fetchAllTeachers,
    approveStudent
}