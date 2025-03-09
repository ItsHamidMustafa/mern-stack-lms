const Class = require("../models/Class");
const Student = require("../models/Student");
const mongoose = require("mongoose");

const fetchClass = async (req, res) => {
  const { _id } = req.user;
  const { batch, className, semester } = await Student.findById(_id);
  const classRes = await Class.find({
    name: className,
    batch,
    semester,
  }).populate({
    path: "schedule.lectures.teacherId",
    model: "Teacher",
  });

  if (!classRes) {
    return res.status(301).json({ error: "No class was found!" });
  }

  return res.status(200).json(classRes);
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
