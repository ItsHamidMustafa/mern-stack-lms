const Class = require("../models/Class");
const Student = require("../models/Student");
const mongoose = require("mongoose");

const fetchClass = async (req, res) => {
  try {
    const { _id } = req.user;

    const student = await Student.findById(_id).populate({
      path: "classId",
      populate: {
        path: "schedule.lectures.teacherId",
        model: "Teacher"
      }
    });

    if (!student || !student.classId) {
      return res.status(404).json({ error: "No class found for this student" });
    }

    return res.status(200).json(student.classId);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const createClass = async (req, res) => {
  const { name, semester, batch, schedule } = req.body;

  try {
    const classRes = await Class.create({ name, semester, batch, schedule });
    return res.status(200).json(classRes);
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  fetchClass,
  createClass,
};
