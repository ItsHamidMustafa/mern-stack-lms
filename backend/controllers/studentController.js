const Student = require("../models/Student");
const Program = require('../models/Program');
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const createToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.SECRET, { expiresIn: "3d" });
};

const getRegno = async () => {
  const instituteName = process.env.INST_NAME || "xyz";
  const instituteCode = instituteName.slice(0, 3).toLowerCase();
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth()

  let semesterLetter;
  if (month >= 0 && month <= 4) {
    semesterLetter = 's';
  } else if (month >= 7 && month <= 11) {
    semesterLetter = 'f';
  } else {
    semesterLetter = 'summer-session';
  }

  try {
    const lastStudent = await Student.findOne().sort({ _id: -1 });
    const lastRegNum = lastStudent
      ? parseInt(lastStudent.regno.split("-").pop())
      : 0;
    const newRegNum = lastRegNum + 1;
    const regno = `${year}${semesterLetter}-${instituteCode}-${newRegNum.toString().padStart(4, "0")}`;
    return regno;
  } catch (err) {
    return err;
  }
};

const loginStudent = async (req, res) => {
  const { regno, password } = req.body;

  try {
    const student = await Student.login(regno, password);
    const token = createToken(student._id, student.role);
    res.status(200).json({
      _id: student._id,
      firstName: student.firstName,
      role: student.role,
      token
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signupStudent = async (req, res) => {
  try {
    const regno = await getRegno();
    const program = await Program.findById(req.body.selectedProgram).populate('departmentId');
    console.log(req.body.selectedProgram)
    if (!program) {
      return res.status(404).json({ error: "Program not found." });
    }
    if (!program.departmentId) {
      return res.status(404).json({ error: "Associated department not found." });
    }
    const studentData = {
      ...req.body,
      regno,
      program: program._id,
      department: program.departmentId,
    };
    const student = await Student.signup(studentData);
    const token = createToken(student._id, student.role);
    res.status(200).json({
      _id: student._id,
      firstName: student.firstName,
      role: student.role,
      token,
    });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(400).json({ error: error.message });
  }
};


const fetchAll = async (req, res) => {
  const student = await Student.find().sort({ created_at: -1 });
  if (!student) {
    return res.status(200).json({ msg: "No student found!" });
  }

  return res.status(200).json(categories);
};

const fetchOneStudent = async (req, res) => {
  const student = await Student.find();
  if (!student) {
    return res.status(200).json({ msg: "No such student found!" });
  }

  return res.status(200).json(student);
};

const createStudent = async (req, res) => {
  const {
    cnic,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    nationality,
    contactNumber,
    email,
    address,
    password,
    currentStatus,
    gradeLevel,
    major,
    coursesEnrolled,
    advisor,
    gpa,
    attendance,
    grades,
    role,
    accountStatus,
    emergencyContact,
    photo,
    notes,
    scholarshipStatus,
  } = req.body;

  if (
    !cnic ||
    !firstName ||
    !lastName ||
    !dateOfBirth ||
    !gender ||
    !nationality ||
    !contactNumber ||
    !email ||
    !address ||
    !password
  ) {
    res.status(400).json({ error: "All required fields must be filled!" });
    return;
  }

  try {
    const regno = getRegno();

    if (!regno) {
      return res
        .status(301)
        .json({ error: "Internal error, please report to staff!" });
    }

    const studentData = {
      cnic,
      regno,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      nationality,
      contactNumber,
      email,
      address,
      password,
      currentStatus,
      gradeLevel,
      major,
      coursesEnrolled,
      advisor,
      gpa,
      attendance,
      grades,
      role,
      accountStatus,
      emergencyContact,
      photo,
      notes,
      scholarshipStatus,
    };

    const student = await Student.create(studentData);
    res.status(200).json(student);
  } catch (err) {
    res.status(400).json({ msg: "We got an error", err });
  }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Student not found!" });
  }

  const updatedStudent = {
    cnic: req.body.cnic,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dateOfBirth: req.body.dateOfBirth,
    gender: req.body.gender,
    nationality: req.body.nationality,
    contactNumber: req.body.contactNumber,
    email: req.body.email,
    address: req.body.address,
  };

  try {
    const student = await Student.findByIdAndUpdate(id, updatedStudent, {
      new: true,
    });
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Student not found!" });
  }

  const exist = await Product.find({ category: id });

  if (exist.length > 0) {
    await Product.updateMany({ category: id }, { $set: { category: null } });
  }

  try {
    await Student.findByIdAndDelete(id);
    res
      .status(200)
      .json({
        msg: "Student deleted successfully and associated teachers updated!",
      });
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = {
  fetchAll,
  fetchOneStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  loginStudent,
  signupStudent,
};
