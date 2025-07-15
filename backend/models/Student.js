// models/Student.js (Updated)
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./User');

const studentSchema = new mongoose.Schema({
  // Reference to User schema
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cnic: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: false,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: false
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: false,
  },
  className: {
    type: String,
    required: false,
  },
  dateOfBirth: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        const today = new Date();
        const providedDate = new Date(value);
        const age = today.getFullYear() - providedDate.getFullYear();
        const isBirthdayPassedThisYear =
          today.getMonth() > providedDate.getMonth() ||
          (today.getMonth() === providedDate.getMonth() &&
            today.getDate() >= providedDate.getDate());
        const adjustedAge = isBirthdayPassedThisYear ? age : age - 1;
        return adjustedAge >= 15;
      },
      message: "Student must be at least 15 years old",
    },
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  nationality: {
    type: String,
  },
  contactNumber: {
    type: String,
    match: /^[0-9]{10,15}$/,
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
  currentStatus: {
    type: String,
    enum: ["Active", "Inactive", "Graduated", "Suspended"],
    default: "Active",
  },
  gradeLevel: { type: String },
  major: { type: String },
  coursesEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  }],
  gpa: {
    type: Number,
    min: 0,
    max: 4,
  },
  attendance: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Attendance",
  }],
  grades: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Grade",
  }],
  accountStatus: {
    type: String,
    enum: ["active", "pending", "deactivated"],
    default: "pending",
  },
  emergencyContact: {
    name: { type: String },
    relation: { type: String },
    contactNumber: { type: String },
  },
  photo: { type: String },
  notes: { type: String },
  scholarshipStatus: { type: String },
}, { timestamps: true });

// Updated signup method
studentSchema.statics.signup = async function (studentData) {
  const { uid, email, password, ...otherData } = studentData;

  // Create user first
  const user = await User.createUser({
    uid,
    email,
    password,
    role: 'student'
  });

  // Create student profile
  const student = await this.create({
    user: user._id,
    ...otherData
  });

  return {
    user: {
      _id: user._id,
      uid: user.uid,
      email: user.email,
      role: user.role
    },
    profile: student
  };
};

// Remove the login method as it's now handled by User model

module.exports = mongoose.model("Student", studentSchema);