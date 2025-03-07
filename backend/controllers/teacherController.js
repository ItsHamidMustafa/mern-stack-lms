const Teacher = require('../models/Teacher');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const getRegno = async (firstName, lastName, subject) => {
    const lowerFirstName = firstName.toLowerCase().replace(/\s+/g, '');
    const lowerLastName = lastName.toLowerCase().replace(/\s+/g, '');
    const lowerSubject = subject.toLowerCase().replace(/\s+/g, '');
    return `${lowerFirstName}${lowerLastName}.${lowerSubject.substring(0, 2)}`;
};

const fetchAll = async (req, res) => {
    const teacher = await Teacher.find().sort({ created_at: -1 });
    if (!teacher) {
        return res.status(200).json({ msg: "No teacher found!" });
    }

    return res.status(200).json(categories);
}

const fetchOne = async (req, res) => {
    const teacher = await Teacher.find(req.id);
    if (!teacher) {
        return res.status(200).json({ msg: "No such teacher found!" });
    }

    return res.status(200).json(teacher);
}

const loginTeacher = async (req, res) => {
    const { regno, password } = req.body;

    try {
        const teacher = await Teacher.login(regno, password);
        const token = createToken(teacher._id);
        res.status(200).json({ ...teacher._doc, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const signupTeacher = async (req, res) => {
    try {
        const regno = await getRegno(req.body.firstName, req.body.lastName, req.body.subject);
        const teacher = await Teacher.signup({ ...req.body, role: "teacher", regno });
        const token = createToken(teacher._id);
        res.status(200).json({ ...teacher, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const createTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.signup({ firstName, lastName, dob, fatherName, gender, subject, email, password, regno, cnic, contactNum });
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

    const exist = await Product.find({ category: id });

    if (exist.length > 0) {
        await Product.updateMany({ category: id }, { $set: { category: null } });
    }

    try {
        await Teacher.findByIdAndDelete(id);
        res.status(200).json({ msg: "Teacher deleted successfully and associated courses updated!" });
    } catch (error) {
        res.status(400).json(error);
    }
}

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
    fetchAll,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    fetchCurrentTeacher
};