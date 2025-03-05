const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
    unique: true,
  },
  subject: {
    type: String,
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  from: {
    type: Date,
    required: true,
  },
  to: {
    type: Date,
    required: true,
  },
  semester: {
    type: Number,
    required: false,
  },
  batch: {
    type: String,
    required: false,
  },
  notes: {
    type: String,
    required: false,
    enum: [
      "Scheduled Class",
      "Mids Practice Class",
      "Finals Practice Class",
      "Makeup Class",
      "Students' Reserved Class",
      "Staff's Reserved Class",
    ],
  },
});

module.exports = mongoose.model("Schedule", ScheduleSchema);
