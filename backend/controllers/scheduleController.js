const Schedule = require("../models/Schedule");
const mongoose = require("mongoose");

const fetchSchedule = async (req, res) => {
  const { semester, batch } = req.body;
  const schedule = await Schedule.find({ semester, batch });

  if (!schedule) {
    return res.status(301).json({ error: "No Schedule Found!" });
  }

  return res.status(200).json(schedule);
};

const createSchedule = async (req, res) => {
  const {
    classId,
    subject,
    roomId,
    day,
    from,
    to,
    semester,
    batch,
    teacherId,
    notes,
  } = req.body;

  try {
    if (
      mongoose.Types.ObjectId.isValid(roomId) ||
      mongoose.Types.ObjectId.isValid(classId) ||
      mongoose.Types.ObjectId.isValid(teacherId)
    ) {
      return res.status(400).json({ error: "Invalid ID(s) provided!" });
    }

    const schedule = await Schedule.create(req.body);
    res.json(schedule);
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  fetchSchedule,
  createSchedule,
};
