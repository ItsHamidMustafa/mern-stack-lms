const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  schedule: [
    {
      day: {
        type: String,
        required: true,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
      lectures: [
        {
          subject: {
            type: String,
            required: true,
          },
          courseCode: {
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
          from: {
            type: Date,
            required: true,
          },
          to: {
            type: Date,
            required: true,
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
        },
      ],
    },
  ],
});

classSchema.virtual("students", {
  ref: "Student",
  localField: "_id",
  foreignField: "classId",
});

module.exports = mongoose.model("Class", classSchema);
