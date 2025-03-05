const Teacher = require('../models/Teacher');
const mongoose = require('mongoose');

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
    const { email, password } = req.body;

    try {
        const teacher = await Teacher.login(email, password);
        const token = createToken(teacher._id);
        res.status(200).json({ ...teacher._doc, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const signupTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.signup({ ...req.body, role: "teacher" });
        const token = createToken(teacher._id);
        res.status(200).json({ ...teacher, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const createTeacher = async (req, res) => {
    const { name, dob, fatherName, gender } = req.body;

    if (!name || !dob || !fatherName || !gender) {
        res.status(400).json({ error: 'All fields must be filled!' });
    }

    try {
        const teacher = await Teacher.create({ name, dob, fatherName, gender });
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

module.exports = {
    signupTeacher,
    loginTeacher,
    fetchOne,
    fetchAll,
    createTeacher,
    updateTeacher,
    deleteTeacher
};